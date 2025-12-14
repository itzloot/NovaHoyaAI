const tryNowBtn = document.getElementById("tryNowBtn");
const panel = document.getElementById("nova-ai");

const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

/* OPEN AI */
tryNowBtn.onclick = () => {
  panel.classList.add("active");
  panel.scrollIntoView({ behavior: "smooth" });
};

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  addMessage("Nova AI", "Thinking...");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  removeLastMessage();
  addMessage("Nova AI", data.reply);
}

  
sendBtn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});