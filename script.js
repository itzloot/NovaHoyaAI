const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

let messages = [
  {
    role: "system",
    content:
      "You are Nova AI, an expert in edge computing, ultra-low latency systems, and modern AI technology. Answer professionally and clearly."
  }
];

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerText = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";

  messages.push({ role: "user", content: userText });

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();

    if (!data.reply) {
      addMessage("AI error. Try again.", "bot");
      return;
    }

    messages.push({ role: "assistant", content: data.reply });
    addMessage(data.reply, "bot");

  } catch (err) {
    addMessage("Connection error. Check deployment.", "bot");
  }
}