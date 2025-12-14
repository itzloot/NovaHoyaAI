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

  (
  addMsg(`<b>You:</b> ${text}`, "user");
  input.value = "";

  const wait = document.createElement("div");
  wait.className = "msg bot";
  wait.textContent = "Nova AI is thinking…";
  chat.appendChild(wait);

  setTimeout(() => {
    wait.remove();
    addMsg(`<b>Nova AI:</b> ${think(text)}`, "bot");
  }, 400);
}

sendBtn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});