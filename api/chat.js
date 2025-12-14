let userSessions = {}; // simple in-memory memory + rate limit

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, sessionId, mode } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  // --- RATE LIMIT (Feature 5)
  const now = Date.now();
  const session = userSessions[sessionId] || { count: 0, last: now, history: [] };

  if (now - session.last < 2000 && session.count > 5) {
    return res.status(429).json({
      reply: "⚠️ Please slow down a bit."
    });
  }

  session.count++;
  session.last = now;

  // --- MEMORY (Feature 1)
  session.history.push({ role: "user", content: message });
  if (session.history.length > 10) session.history.shift();

  userSessions[sessionId] = session;

  // --- PERSONALITY (Feature 4)
  const personalities = {
    normal: "You are Nova AI, a smart and friendly assistant.",
    expert: "You are Nova AI, an expert AI engineer who explains deeply.",
    chill: "You are Nova AI, relaxed, friendly, and modern.",
    inferno: "You are Nova AI, ultra-smart, confident, elite-level AI."
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: personalities[mode] || personalities.normal },
          ...session.history
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    session.history.push({ role: "assistant", content: reply });

    res.status(200).json({ reply });

  } catch (e) {
    res.status(500).json({ reply: "AI error. Try again." });
  }
}