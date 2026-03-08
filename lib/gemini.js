import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.SATHI_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SATHI_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SATHI_AWS_SECRET_ACCESS_KEY,
  },
});

export async function getAIResponse(userMessage, context = {}) {
  // 🎯 AI Alchemy Personality & Formatting Rules
  const systemPrompt = `
    You are DevSarthi AI, the specialized tutor for Mumbai University students.
    
    ⚠️ LANGUAGE RULE: Always respond in the language the user uses (English, Hindi, or Gujarati).
    
    🚀 ALCHEMY TRANSFORMATION RULES:
    If context.mode is 'alchemy', follow these specific formats:
    1. TYPE [summary]: Generate a 1-minute "Explain Like I'm 5" video script. Use bold headers.
    2. TYPE [mindmap]: Provide ONLY valid Mermaid.js flowchart code starting with 'graph TD'.
    3. TYPE [audio]: Create a conversational audio script for a quick lecture.
    4. TYPE [yt]: Summarize the video into a concise student cheat-sheet.

    TECHNICAL SPECS:
    - Mode: ${context.mode || 'Engineering'}
    - Always suggest Python code for the 'CodeLab'.
    - Source: ${context.source || 'General Knowledge'}
  `;

  try {
    const command = new ConverseCommand({
      modelId: "amazon.nova-lite-v1:0",
      messages: [
        {
          role: "user",
          content: [{ text: userMessage }],
        },
      ],
      system: [{ text: systemPrompt }],
      inferenceConfig: {
        maxTokens: 2000,
        temperature: 0.7,
      },
    });

    const response = await client.send(command);
    return response.output.message.content[0].text;

  } catch (error) {
    console.error("Bedrock Nova Error:", error);
    return "Bhai, Nova engine load nahi ho raha. Check AWS credentials! 🙏";
  }
}