"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateTryOnImage(
  userPhotoBase64: string,
  shirtBase64: string,
  trouserBase64: string,
): Promise<{ success: boolean; imageData?: string; error?: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return {
        success: false,
        error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.",
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview",
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    })

    const contents = [
      {
        text: "Create a virtual try-on. Replace the person's shirt and trousers with the new clothes. Ensure a seamless and realistic fit, without altering the person, their pose, or any other elements in the photo. The colors and style of the new clothes must remain unchanged.",
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: userPhotoBase64,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: shirtBase64,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: trouserBase64,
        },
      },
    ]

    const response = await model.generateContentStream(contents)

    for await (const chunk of response.stream) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue
      }

      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData
        const imageData = inlineData.data
        const mimeType = inlineData.mimeType || "image/jpeg"
        return {
          success: true,
          imageData: `data:${mimeType};base64,${imageData}`,
        }
      }
    }

    return {
      success: false,
      error: "No image was generated. The AI model may not support image generation for this request.",
    }
  } catch (error) {
    console.error("Virtual try-on error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate virtual try-on. Please try again.",
    }
  }
}
