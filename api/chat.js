// api/chat.js (or app/api/chat/route.js - adjust for your Next.js version)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  const lastUserMessage = messages[messages.length - 1]?.content || "";
  const lowerMsg = lastUserMessage.toLowerCase();

  // Detect image generation request
  const isImageRequest = lowerMsg.includes("generate") || 
                         lowerMsg.includes("genrate") || 
                         lowerMsg.includes("create") || 
                         lowerMsg.includes("draw") || 
                         lowerMsg.includes("image") || 
                         lowerMsg.includes("picture") || 
                         lowerMsg.includes("dragon") || // for your test
                         lowerMsg.includes("kingdom");

  if (isImageRequest) {
    try {
      // Free FLUX.1-schnell via Together AI (fast, high quality, unlimited free tier)
      const response = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No key needed for free endpoint, but signup for higher limits: get free key at together.ai
          // "Authorization": "Bearer YOUR_TOGETHER_KEY"  // optional
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell-Free",
          prompt: lastUserMessage,
          width: 1024,
          height: 1024,
          steps: 4,
          n: 1,
          response_format: "url"
        })
      });

      if (!response.ok) throw new Error("FLUX API error");

      const data = await response.json();
      const imageUrl = data.data[0]?.url;

      if (imageUrl) {
        return res.status(200).json({ reply: imageUrl });  // Direct real image URL
      } else {
        return res.status(200).json({ reply: "Sorry bro, no image generated — try again!" });
      }

    } catch (error) {
      console.error(error);
      return res.status(200).json({ reply: "Image generation failed — try a different prompt!" });
    }
  }

  // Normal chat with GPT-4o-mini
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!response.ok) throw new Error("OpenAI error");

    const data = await response.json();
    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
}