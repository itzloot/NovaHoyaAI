const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let messages = [
  { role: "system", content: "You are Nova AI, a helpful assistant." }
];

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  messages.push({ role: "user", content: userText });
  appendMessage("user", userText);
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  const data = await res.json();

  messages.push({ role: "assistant", content: data.reply });
  appendMessage("ai", data.reply);
}

function appendMessage(type, text) {
  const div = document.createElement("div");
  div.className = type;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}