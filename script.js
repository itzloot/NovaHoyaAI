const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerText = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    addMessage("I am Nova AI. Streaming & memory coming next.", "bot");
  }, 600);
};