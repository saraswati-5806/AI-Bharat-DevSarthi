import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

// 🏆 Initialize client outside the handler for better performance
const client = new BedrockRuntimeClient({
  region: "us-east-1", 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ MUST BE A NAMED EXPORT 'POST' - NO 'export default'
export async function POST(req) {
  try {
    const { messages, context } = await req.json();

    // Clean sequence for Bedrock: User -> Assistant -> User
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

    const payload = {
      inferenceConfig: { 
        max_new_tokens: 1000, 
        temperature: 0.2,
        top_p: 0.9
      },
      messages: finalMessages,
      system: [{ text: `You are DevSathi, a Hinglish academic tutor. Context: ${context || "General"}` }]
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
    console.error("🚨 BEDROCK CRITICAL ERROR:", error);
    return NextResponse.json({ 
      error: "Bedrock Config Failed", 
      details: error.message 
    }, { status: 500 });
  }
}