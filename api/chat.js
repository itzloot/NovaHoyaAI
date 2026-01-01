// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ reply: "No messages bro" });
  }

  const lastMessage = messages[messages.length - 1].content;
  const lowerMsg = lastMessage.toLowerCase();

  const isImageRequest = /generate|create|draw|image|picture|photo|logo|kingdom|city|futuristic|cyberpunk|dragon/i.test(lowerMsg);

  if (isImageRequest) {
    try {
      const falRes = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
          "Authorization": `Key ${process.env.FAL_API}`,  // your env var
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: {  // THIS IS THE KEY FIX — wrap in "input"
            prompt: lastMessage,
            num_inference_steps: 4,
            guidance_scale: 3.5,
            num_images: 1,
            image_size: "square_hd"
          }
        })
      });

      if (!falRes.ok) {
        const errText = await falRes.text();
        console.error("fal.ai error:", errText);
        return res.status(200).json({ reply: `Image gen failed: ${errText.substring(0, 200)} — check Vercel logs for full error!` });
      }

      const falData = await falRes.json();

      const imageUrl = falData.images?.[0]?.url;

      if (imageUrl) {
        return res.status(200).json({ reply: imageUrl });
      } else {
        return res.status(200).json({ reply: "No image URL returned — check logs!" });
      }

    } catch (error) {
      console.error("fal.ai exception:", error);
      return res.status(200).json({ reply: "Image generation crashed — check Vercel logs!" });
    }
  }

  // Normal chat
  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      return res.status(500).json({ reply: "Chat error — check OpenAI key!" });
    }

    const openaiData = await openaiRes.json();
    res.status(200).json({ reply: openaiData.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error bro" });
  }
}