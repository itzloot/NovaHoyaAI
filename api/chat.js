// pages/api/chat.js  or  app/api/chat/route.js (depending on your Next.js version)

import { NextResponse } from 'next/server';

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1].content.toLowerCase();

  // Detect if user wants an image
  const isImageRequest = lastMessage.includes("generate") ||
                         lastMessage.includes("genrate") ||
                         lastMessage.includes("create") ||
                         lastMessage.includes("draw") ||
                         lastMessage.includes("image") ||
                         lastMessage.includes("picture") ||
                         lastMessage.includes("photo") ||
                         lastMessage.includes("kingdom") ||
                         lastMessage.includes("futuristic");

  if (isImageRequest) {
    try {
      // Use Fal.ai + FLUX.1-schnell (fastest real FLUX, ~3-6 sec)
      const falResponse = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
          "Authorization": `Key ${process.env.FAL_KEY}`,  // Get free key at fal.ai
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: messages[messages.length - 1].content,
          image_size: "square_hd",  // 1024x1024
          num_inference_steps: 28,
          guidance_scale: 7.5,
          sync_mode: true  // Wait for result (fast model)
        })
      });

      const falData = await falResponse.json();

      if (falData.images && falData.images[0].url) {
        return NextResponse.json({
          reply: falData.images[0].url  // Direct real image URL
        });
      } else {
        return NextResponse.json({
          reply: "Sorry bro, image generation failed — try again!"
        });
      }

    } catch (error) {
      console.error(error);
      return NextResponse.json({
        reply: "Image gen error — check server logs bro 😅"
      });
    }
  }

  // Normal chat with GPT-4o-mini
  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7
      })
    });

    const openaiData = await openaiResponse.json();

    if (openaiData.choices && openaiData.choices[0]) {
      return NextResponse.json({
        reply: openaiData.choices[0].message.content
      });
    } else {
      return NextResponse.json({ reply: "No response from AI." });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "Chat error — try again!" });
  }
}

// For pages/api (old style) — add this if you're not using app router
// export default async function handler(req, res) { ... same code above but with res.json instead of NextResponse }