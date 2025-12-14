import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { message } = req.body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [{ role: "user", content: message }]
  });

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked"
  });

  for await (const chunk of completion) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) res.write(token);
  }

  res.end();
}