import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Cache a chosen model id to avoid listing models on every call
let _cachedModelId = null;

export async function getAIResponse(userMessage, context = {}) {
  // Ensure we pick a model that supports generation methods for this SDK/version.
  if (!_cachedModelId) {
    // First try SDK-provided listModels if available
    if (typeof genAI.listModels === 'function') {
      try {
        const listed = await genAI.listModels();
        const models = Array.isArray(listed) ? listed : (listed?.models || []);
        const preferred = models.find((m) => {
          const methods = m?.supportedMethods || m?.methods || [];
          const id = m?.name || m?.id || m?.model || m?.modelId;
          if (!id) return false;
          return methods.some((meth) => ['generateContent', 'generateText', 'generate'].includes(meth));
        });

        if (preferred) {
          _cachedModelId = preferred.name || preferred.id || preferred.model || preferred.modelId;
        } else if (models.length > 0) {
          const first = models[0];
          _cachedModelId = first.name || first.id || first.model || first.modelId;
        }
      } catch (listErr) {
        console.error('Error listing models from GenAI SDK:', listErr);
      }
    }

    // If SDK listing not available or failed, try REST list endpoint
    if (!_cachedModelId) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        const models = Array.isArray(data) ? data : (data?.models || []);
        if (models.length > 0) {
          const preferred = models.find((m) => {
            const id = m?.name || m?.model || m?.id;
            return id && /text|chat|bison|gemini/i.test(id);
          });
          const chosen = preferred || models[0];
          _cachedModelId = chosen.name || chosen.id || chosen.model || chosen.modelId;
        }
      } catch (restListErr) {
        console.error('Error listing models via REST:', restListErr);
      }
    }

    // Final fallback
    if (!_cachedModelId) _cachedModelId = 'models/text-bison-001';
  }

  const model = genAI.getGenerativeModel({ model: _cachedModelId });

  // Helper: attempt REST generation endpoints if SDK methods are missing
  async function restGenerateWithModel(modelId, promptText) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const normalized = modelId?.toString?.() || '';
      const modelPath = normalized.startsWith('models/') ? normalized : `models/${normalized}`;

      const tryEndpoints = [
        ':generateText',
        ':generate',
        ':generateContent'
      ];

      for (const ep of tryEndpoints) {
        const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}${ep}?key=${apiKey}`;
        const body = ep === ':generateText' ? { input: promptText } : { prompt: promptText };
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            // try next endpoint
            continue;
          }
          const json = await res.json();
          // Common response shapes
          if (typeof json === 'string') return json;
          if (json?.candidates?.[0]?.content) return json.candidates[0].content;
          if (json?.output?.[0]?.content) return json.output[0].content;
          if (json?.output?.content) return json.output.content;
          if (json?.text) return json.text;
          if (json?.result) return json.result;
          // If nothing matched, return stringified JSON as last resort
          return JSON.stringify(json);
        } catch (e) {
          continue;
        }
      }

      return null;
    } catch (err) {
      console.error('REST generate error:', err);
      return null;
    }
  }

  const userLanguage = context.language || 'Hinglish'

  const prompt = `
You are DevSarthi AI Tutor - a friendly coding tutor for Indian students.

IMPORTANT INSTRUCTIONS:
1. ALWAYS respond in ${userLanguage} (use that language for explanations). 
2. Keep code examples in proper English.
3. Be conversational and friendly.
4. Use simple explanations.
5. Give practical examples.

User's Context:
- Preferred language: ${userLanguage}
- Current code: ${context.code || 'None'}
- Video/Resource: ${context.resource || 'None'}

User asked: ${userMessage}

Provide a helpful response. If giving code examples, write code in English but explanations in ${userLanguage}.
Keep response concise (2-3 sentences explanation + code if needed).
`;

  try {
    // Try SDK method used in some versions
    if (typeof model.generateContent === 'function') {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }

    // Try alternative common SDK method
    if (typeof model.generateText === 'function') {
      const result = await model.generateText({ input: prompt });
      // Try several possible response shapes
      if (typeof result === 'string') return result;
      if (result?.content) return result.content;
      if (result?.candidates?.[0]?.content) return result.candidates[0].content;
      if (result?.candidates?.[0]?.output) return result.candidates[0].output;
    }

    // Generic fallback if SDK exposes a different method name
    if (typeof model.generate === 'function') {
      const result = await model.generate({ prompt });
      if (result?.output) return result.output;
      if (result?.text) return result.text;
    }

    // REST fallback: try calling the Generative Language REST endpoints
    try {
      const restResp = await restGenerateWithModel(_cachedModelId, prompt);
      if (restResp) return restResp;
    } catch (restErr) {
      console.error('REST fallback failed:', restErr);
    }

    console.error('Gemini API: no supported generate method found on model object', Object.keys(model));
    return "Sorry, main abhi response nahi de pa raha. Thodi der baad try karo! 🙏";
  } catch (error) {
    console.error('Gemini API error:', error);
    // If model not supported for generate, log list of available models (if possible)
    try {
      if (typeof genAI.listModels === 'function') {
        const models = await genAI.listModels();
        console.error('Available models:', models);
      }
    } catch (listErr) {
      console.error('Error listing models:', listErr);
    }
    return "Sorry, main abhi response nahi de pa raha. Thodi der baad try karo! 🙏";
  }
}