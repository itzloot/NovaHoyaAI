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