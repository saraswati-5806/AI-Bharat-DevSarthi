import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

// Use the environment variables we set in Amplify
const client = new BedrockRuntimeClient({
  region: process.env.SATHI_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_SATHI_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SATHI_AWS_SECRET_ACCESS_KEY,
  },
});

export async function getAIResponse(userMessage, context = {}) {
  const systemPrompt = `
    You are DevSarthi AI, the specialized tutor for Mumbai University students.
    
    ⚠️ STICK TO THE USER'S LANGUAGE:
    1. If the user speaks Gujarati (e.g., "Kem che"), reply ONLY in Gujarati.
    2. If the user speaks Hindi, reply ONLY in Hindi.
    3. NO TRANSLATIONS: Do not explain what words mean in English. Just chat naturally.
    
    🚀 TECHNICAL RULES:
    - Current Workspace Mode: ${context.mode || 'Engineering'}
    - Always suggest Python code for the built-in 'CodeLab'.
    - Keep explanations concise and student-friendly.
  `;

  try {
    const command = new ConverseCommand({
      modelId: "amazon.nova-lite-v1:0", // Double check your specific Nova ID
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