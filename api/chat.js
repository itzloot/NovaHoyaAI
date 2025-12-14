import OpenAI from "openai";
import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");

  const { message, userId } = req.body;

  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(20);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      { role: "system", content: "You are Nova AI, a professional edge-computing expert." },
      ...(history || []),
      { role: "user", content: message }
    ]
  });

  await supabase.from("messages").insert([
    { user_id: userId, role: "user", content: message }
  ]);

  let fullReply = "";

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      fullReply += token;
      res.write(token);
    }
  }

  await supabase.from("messages").insert([
    { user_id: userId, role: "assistant", content: fullReply }
  ]);

  res.end();
}