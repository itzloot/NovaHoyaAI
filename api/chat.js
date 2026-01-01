// /api/chat.js  (or app/api/chat/route.js — see note at bottom)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ reply: "No messages bro" });
  }

  const lastMessage = messages[messages.length - 1].content.toLowerCase();

  const isImageRequest = /generate|genrate|create|draw|image|picture|photo|dragon|city|kingdom|futuristic|cyberpunk/i.test(lastMessage);

  if (isImageRequest) {
    try {
      // Call fal.ai FLUX.1 [schnell] — super fast & high quality
      const falRes = await fetch("https://queue.fal.ai/fal-ai/flux/schnell", {
        method: "POST",
        headers: {
          "Authorization": `Key ${process.env.FAL_KEY}`,  // your Vercel env var
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: messages[messages.length - 1].content,
          num_inference_steps: 4,     // fast mode (1-4 steps)
          guidance_scale: 3.5,
          num_images: 1,
          image_size: "square_hd",    // 1024x1024, or "landscape_16_9" etc.
          enable_safety_checker: true
        })
      });

      if (!falRes.ok) {
        const errText = await falRes.text();
        console.error("Fal error:", errText);
        return res.status(200).json({ reply: "Image gen failed — check fal credits or prompt!" });
      }

      const falData = await falRes.json();

      // fal returns { images: [{ url: "https://..." }] }
      const imageUrl = falData.images?.[0]?.url;

      if (imageUrl) {
        return res.status(200).json({ reply: imageUrl });  // direct real image URL
      } else {
        return res.status(200).json({ reply: "No image returned — try again bro!" });
      }

    } catch (error) {
      console.error("Fal exception:", error);
      return res.status(200).json({ reply: "Image generation error — try simpler prompt!" });
    }
  }

  // Normal text chat with GPT-4o-mini
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
      return res.status(500).json({ reply: "Chat error — check your OpenAI key!" });
    }

    const openaiData = await openaiRes.json();
    const reply = openaiData.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    console.error("OpenAI exception:", error);
    res.status(500).json({ reply: "Server error bro" });
  }
}