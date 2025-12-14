const messages = document.getElementById("messages");
const input = document.getElementById("input");
const send = document.getElementById("send");

send.onclick = async () => {
  const text = input.value;
  if (!text) return;
  input.value = "";

  add("You", text);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const reader = res.body.getReader();
  let ai = "";
  const div = add("Nova", "");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    ai += new TextDecoder().decode(value);
    div.textContent = "Nova: " + ai;
  }
};

function add(who, text) {
  const d = document.createElement("div");
  d.className = "msg " + (who === "You" ? "user" : "ai");
  d.textContent = `${who}: ${text}`;
  messages.appendChild(d);
  messages.scrollTop = messages.scrollHeight;
  return d;
}