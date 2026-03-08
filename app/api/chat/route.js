import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

const client = new BedrockRuntimeClient({
  region: process.env.SATHI_AWS_REGION || "us-east-1", 
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SATHI_AWS_ACCESS_KEY_ID?.trim() || "",
    secretAccessKey: process.env.NEXT_PUBLIC_SATHI_AWS_SECRET_ACCESS_KEY?.trim() || "",
  },
});

export async function POST(req) {
  try {
    const { messages, context, mode, lang = "en" } = await req.json();

    let apiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: [{ text: m.content }]
    }));

    while (apiMessages.length > 0 && apiMessages[0].role !== "user") {
      apiMessages.shift();
    }

    const finalMessages = apiMessages.filter((m, i) => {
      if (i === 0) return true;
      return m.role !== apiMessages[i - 1].role;
    });

    const systemText = `
  You are DevSathi, a Senior Academic Mentor for Mumbai University. You are wise, supportive, and highly technical.
  
  🎯 IDENTITY & ROLE:
  - Act as a senior student/mentor who knows exactly how to crack MU exams.
  - You support 22+ Indian languages (Hindi, Marathi, Gujarati, etc.).
  - DEFAULT LANGUAGE: English. Always start in English unless the user's first message is in another language.
  
  🌍 DYNAMIC LANGUAGE SWITCHING:
  - If the user says "Explain in Hindi", switch immediately to Hindi (or Hinglish).
  - If they later say "Now in Marathi", switch to Marathi script.
  - Mix languages naturally (Senior Mentor style) if the user uses mixed input.
  
  🚨 RESOURCE-FIRST RULE (CRITICAL):
  - ALWAYS prioritize the provided 'Syllabus Context'.
  - If the context is a Maths PDF, do NOT mention programming. If it's a Physics PDF, stay on Physics.
  - If the user asks something NOT in the PDF, say: "Bhai, ye notes mein nahi hai, par as a mentor main tujhe bata sakta hoon..."

  🚀 CODE LAB INTEGRATION:
  - When the user needs code, provide it in a clean markdown code block.
  - Ensure the code is relevant to the PDF content (e.g., if it's a Numerical Methods PDF, give Python code for those methods).
  
  🎤 ALCHEMY & AUDIO:
  - If the user asks for "audio", "lecture", or "sunao", you MUST start with the tag "[audio]".
  - Write the script in the language requested by the user.

  📖 SYLLABUS CONTEXT (PDF):
  ${context || 'No PDF uploaded yet. Use general MU Engineering knowledge.'}
  
  USER PREFERENCE: Language: ${lang}, Mode: ${mode}
`;

    const payload = {
      inferenceConfig: { max_new_tokens: 2000, temperature: 0.7, top_p: 0.9 },
      messages: finalMessages,
      system: [{ text: systemText }]
    };

    const command = new InvokeModelCommand({
      modelId: "amazon.nova-lite-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const responseText = result.output.message.content[0].text;
    
    return NextResponse.json({ text: responseText });

  } catch (error) {
    console.error("BEDROCK ERROR:", error);
    return NextResponse.json({ error: "Bedrock Connection Failed" }, { status: 500 });
  }
}