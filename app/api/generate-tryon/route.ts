import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyCdKfybaKbUCVYttUoSy1SS1my6wlfjVZs")

async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  return base64
}

export async function POST(request: NextRequest) {
  try {
    const { userPhotoUrl, shirtUrl, trouserUrl } = await request.json()

    if (!userPhotoUrl || !shirtUrl || !trouserUrl) {
      return NextResponse.json({ error: "Missing required images" }, { status: 400 })
    }

    // Convert image URLs to base64
    const [userPhotoBase64, shirtBase64, trouserBase64] = await Promise.all([
      imageUrlToBase64(userPhotoUrl),
      imageUrlToBase64(shirtUrl),
      imageUrlToBase64(trouserUrl),
    ])

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = [
      {
        text: "Create a realistic virtual try-on image showing the person wearing the provided shirt and trouser. The person should look natural wearing these clothes, maintaining their pose and appearance while seamlessly integrating the clothing items. Make it look like a professional fashion photo with good lighting and realistic fabric draping.",
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

    const result = await model.generateContent(prompt)
    const response = await result.response

    // Check if the response contains an image
    const parts = response.candidates?.[0]?.content?.parts || []

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data
        return NextResponse.json({
          success: true,
          imageData: `data:${part.inlineData.mimeType};base64,${imageData}`,
        })
      }
    }

    // If no image was generated, return an error
    return NextResponse.json(
      {
        error: "No image was generated. The AI model may not support image generation for this request.",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Error generating virtual try-on:", error)
    return NextResponse.json(
      {
        error: "Failed to generate virtual try-on image",
      },
      { status: 500 },
    )
  }
}
