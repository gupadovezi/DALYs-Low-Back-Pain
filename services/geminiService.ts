
import { GoogleGenAI, Type } from "@google/genai";
import { PresentationData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePresentation = async (topic: string): Promise<PresentationData> => {
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `You are a world-class public health expert specializing in musculoskeletal disorders and Global Burden of Disease (GBD) methodology. 
  Your goal is to generate a comprehensive, academic, yet accessible presentation outline about DALYs (Disability-Adjusted Life Years) in Low Back Pain.
  Each slide must be detailed.
  Include slides for: 
  1. Title Slide.
  2. What are DALYs? (Definition of YLD + YLL).
  3. Low Back Pain: The Global Context.
  4. Why LBP is unique in DALY calculations (High YLD, Low YLL).
  5. Age-Standardized DALY Rates and Trends.
  6. Socio-economic Impact.
  7. Risk Factors (Occupational, Lifestyle).
  8. Prevention and Public Health Recommendations.
  
  For slides with charts, provide realistic mock data based on actual GBD 2019/2021 study trends. 
  Example chart data format: [{"name": "1990", "value": 450}, {"name": "2019", "value": 600}].`;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a 8-slide presentation about: ${topic}. Focus specifically on the burden of disease using DALYs.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                bulletPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                imagePrompt: { type: Type.STRING },
                chartType: { 
                  type: Type.STRING, 
                  description: "One of: 'bar', 'pie', 'line', 'none'" 
                },
                chartData: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.NUMBER },
                      secondary: { type: Type.NUMBER, description: "Optional secondary value" }
                    }
                  }
                },
                footer: { type: Type.STRING }
              },
              required: ["id", "title", "bulletPoints", "chartType"]
            }
          }
        },
        required: ["slides"]
      }
    }
  });

  try {
    return JSON.parse(response.text) as PresentationData;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Invalid response format from AI");
  }
};
