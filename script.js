const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

const userId =
  localStorage.getItem("nova_uid") ||
  (() => {
    const id = crypto.randomUUID();
    localStorage.setItem("nova_uid", id);
    return id;
  })();

function add(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

send.onclick = async () => {
  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  add("user", message);
  const aiDiv = add("ai", "");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, userId })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    aiDiv.textContent += decoder.decode(value);
    chat.scrollTop = chat.scrollHeight;
  }
};