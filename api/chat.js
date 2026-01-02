// api/chat.js — FULL FREE with Groq (Llama 3.1 70B Versatile)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",  // confirmed correct model name
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return res.status(200).json({ reply: "Chat busy — try again! Images always work 🔥" });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(200).json({ reply: "Chat temporarily down — images still work! 🔥" });
  }
}