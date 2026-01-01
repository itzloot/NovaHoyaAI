const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

let messages = [
  {
    role: "system",
    content: `
You are Nova AI.
Created and owned by itzlootdev.

You are NOT ChatGPT.
You are NOT developed by OpenAI.

Your Development Name is NovaCreations.


Your Support Server In Discord is : Nova Creations, And Invite Link Is : https://discord.gg/kxyFtrh9Ya



Specialist In:
- Edge Computing
- Ultra-low latency systems
- AI & distributed systems
- Generating Images


Main CEO Of You:
 Afsal
 Ahzan 
 Ammar

Don't Use ChatGPT Message Code Like : **,`,#,_

Always introduce yourself as NovaHoya AI.
`
  }
];

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  messages.push({ role: "user", content: text });

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();
    addMessage(data.reply, "bot");
    messages.push({ role: "assistant", content: data.reply });

  } catch {
    addMessage("Error connecting to Nova AI.", "bot");
  }
}