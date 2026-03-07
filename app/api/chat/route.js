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

    // 1. Clean roles for Bedrock compatibility
    let formattedMessages = messages
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: [{ text: m.content }]
      }))
      .filter((m, i) => !(i === 0 && m.role === 'assistant'));

    const finalMessages = formattedMessages.filter((m, i) => {
      if (i === 0) return true;
      return m.role !== formattedMessages[i - 1].role;
    });

    // 🎯 DYNAMIC LANGUAGE PROTOCOL (Supports 22+ Languages)
  const systemText = `
      You are DevSathi, the flexible AI Tutor for Mumbai University. 
      
      ⚠️ CRITICAL LANGUAGE RULE:
      1. SENSE & SWITCH: Respond in the language of the User's VERY LAST message. 
      2. If the user writes in English, reply 100% in English. If Gujarati, reply in Gujarati.
      
      🚀 TERMINAL & CODE EXECUTION RULES:
      - DEFAULT: Always provide Python code as the primary example because our integrated 'CodeLab' terminal is a specialized Python 3.10 runtime.
      - MULTI-LANG: If the user explicitly asks for C++, Java, or SQL, provide the code, BUT you MUST add this brief disclaimer at the end: 
        "Note: My built-in terminal runs Python logic. For ${mode === 'code' ? 'this C++/Java code' : 'running this'}, please use an external compiler, but you can still 'INSERT' it into your editor to save your work."
      - TECHNICAL SPECS: Mode: ${mode}, Context: ${context || "Global Engineering Mode"}.
      
      Keep technical terms in English brackets, but the conversation MUST follow the user's current choice.
    `;

    const payload = {
      inferenceConfig: { max_new_tokens: 1000, temperature: 0.3, top_p: 0.9 },
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