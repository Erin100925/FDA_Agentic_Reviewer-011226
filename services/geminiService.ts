import { GoogleGenAI } from "@google/genai";
import { AgentProfile } from "../types";

// Helper to convert File to Base64
export const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateContent = async (
  agent: AgentProfile,
  prompt: string,
  file?: File | null
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct the full prompt including system instructions
    const fullPrompt = `${agent.system_prompt}\n\nUser Request: ${prompt}`;

    const parts: any[] = [{ text: fullPrompt }];

    if (file) {
      const filePart = await fileToPart(file);
      parts.push(filePart);
    }

    const response = await ai.models.generateContent({
      model: agent.model_name,
      contents: {
        parts: parts
      },
      config: {
        temperature: agent.temperature,
      }
    });

    return response.text || "No response generated.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`;
  }
};
