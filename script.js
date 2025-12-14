const chat = document.getElementById("chat");
const sessionId = crypto.randomUUID();

function addMessage(sender, text, cls) {
  const div = document.createElement("div");
  div.className = "msg " + cls;
  div.innerHTML = `<b>${sender}:</b> <span></span>`;
  chat.appendChild(div);

  // --- TYPING ANIMATION (Feature 2 & 3)
  let i = 0;
  const span = div.querySelector("span");
  const interval = setInterval(() => {
    span.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
    chat.scrollTop = chat.scrollHeight;
  }, 20);
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const mode = document.getElementById("mode").value;
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("You", msg, "you");
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      sessionId,
      mode
    })
  });

  const data = await res.json();
  addMessage("Nova AI", data.reply, "ai");
}