
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Descriptions based on the user's provided photos
const GF_DESC = "A beautiful young woman with long dark hair, a radiant smile, wearing a white tank top and a delicate heart-shaped choker necklace.";
// Updated BF_DESC to a more natural, classic "normal" pose
const BF_DESC = "A handsome young man with short dark hair, a neat beard, wearing glasses, a stylish brown textured polo shirt, and a silver chain, smiling warmly with a friendly and natural expression.";

export const generateDisneyAvatar = async (type: 'boyfriend' | 'girlfriend'): Promise<string | null> => {
  // Updated cache key version to force a one-time regeneration with the new "normal" pose
  const cacheKey = `vday_avatar_v3_${type}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const prompt = type === 'boyfriend' 
      ? `A high-quality 3D Disney/Pixar style animated character of a young man. ${BF_DESC} The style should be warm, magical, and highly detailed like modern Disney films. Gentle studio lighting, hero pose.`
      : `A high-quality 3D Disney/Pixar style animated character of a young woman. ${GF_DESC} The style should be warm, magical, and highly detailed like modern Disney films. Sweet and loving expression, soft lighting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64Data = `data:image/png;base64,${part.inlineData.data}`;
        // Store in cache so it's only ever generated once
        try {
            localStorage.setItem(cacheKey, base64Data);
        } catch (e) {
            console.warn("Storage quota exceeded, skipping cache");
        }
        return base64Data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating avatar:", error);
    return null;
  }
};
