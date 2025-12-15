let conversationMemory = [
  {
    role: "system",
    content: "You are NovaHoyaAI, a professional AI assistant created by itzlootdev."
  }
];
const chatArea = document.getElementById("chatArea");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");

sendBtn.onclick = sendMessage;
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `msg ${className}`;
  div.innerText = text;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  return div;
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = "";
  addMessage(text, "user");

  typingIndicator.classList.remove("hidden");

  // Fake AI delay (replace later with OpenAI streaming)
  setTimeout(() => {
    typingIndicator.classList.add("hidden");

    const reply = generateAIResponse(text);
    addMessage(reply, "bot");
  }, 1200);
}

function generateAIResponse(input) {
  return `I’m NovaHoyaAI 🧠  
I specialize in edge computing, ultra-low latency systems, and modern web AI.

You asked: "${input}"

Real AI streaming will be connected next 🚀`;
}