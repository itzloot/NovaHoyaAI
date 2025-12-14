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

/* MEMORY (LEVEL 3) */
let lastTopic = null;

const brain = [
  {
    keys: ["edge"],
    topic: "Edge Computing",
    reply:
      "Edge computing processes data close to the source, reducing latency and enabling real-time intelligence."
  },
  {
    keys: ["latency"],
    topic: "Ultra-Low Latency",
    reply:
      "Ultra-low latency is achieved by avoiding cloud round-trips and running inference locally."
  },
  {
    keys: ["iot"],
    topic: "IoT",
    reply:
      "Edge AI allows IoT devices to act instantly while saving bandwidth and protecting privacy."
  },
  {
    keys: ["privacy"],
    topic: "Privacy",
    reply:
      "Local inference ensures sensitive data never leaves the device."
  }
];

function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.innerHTML = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function respond(q) {
  q = q.toLowerCase();

  for (const b of brain) {
    if (b.keys.some(k => q.includes(k))) {
      lastTopic = b.topic;
      return b.reply;
    }
  }

  if (lastTopic) {
    return `We were discussing <b>${lastTopic}</b>. What would you like to know next?`;
  }

  return "Nova AI focuses on edge computing, local AI, and ultra-low latency systems.";
}

function send() {
  const text = input.value.trim();
  if (!text) return;

  addMsg(`<b>You:</b> ${text}`, "user");
  input.value = "";

  const wait = document.createElement("div");
  wait.className = "msg bot";
  wait.textContent = "Nova AI is thinking…";
  chat.appendChild(wait);

  setTimeout(() => {
    wait.remove();
    addMsg(`<b>Nova AI:</b> ${respond(text)}`, "bot");
  }, 500);
}

sendBtn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});