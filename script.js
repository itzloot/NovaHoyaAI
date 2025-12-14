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

/* MEMORY */
let lastTopic = null;

/* KNOWLEDGE BASE */
const knowledge = [
  {
    topic: "Edge Computing",
    keys: ["edge"],
    info: [
      "Edge computing processes data near the source instead of a distant cloud.",
      "It reduces latency, bandwidth usage, and improves real-time decision making.",
      "Edge computing is widely used in IoT, smart cameras, and autonomous systems."
    ]
  },
  {
    topic: "Latency",
    keys: ["latency", "delay"],
    info: [
      "Latency is the time taken for data to travel from source to destination.",
      "Lower latency is critical for gaming, AI inference, and real-time systems."
    ]
  },
  {
    topic: "Privacy",
    keys: ["privacy", "secure", "security"],
    info: [
      "Edge AI improves privacy by keeping sensitive data on the device.",
      "This reduces risks associated with cloud data breaches."
    ]
  }
];

/* CHAT UI */
function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.innerHTML = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* SMART BRAIN */
function think(question) {
  const q = question.toLowerCase();

  /* IDENTITY */
  if (q.includes("who are you") || q.includes("who are u")) {
    return "I am <b>Nova AI</b>, a lightweight edge-focused artificial intelligence built to explain modern computing concepts.";
  }

  /* GREETINGS */
  if (q.includes("hi") || q.includes("hello")) {
    return "Hello 👋 How can I help you today?";
  }

  /* KNOWLEDGE MATCH */
  for (const k of knowledge) {
    if (k.keys.some(key => q.includes(key))) {
      lastTopic = k.topic;
      return k.info[Math.floor(Math.random() * k.info.length)];
    }
  }

  /* FOLLOW-UP */
  if (lastTopic) {
    return `We are currently discussing <b>${lastTopic}</b>.  
You can ask about its uses, benefits, or future applications.`;
  }

  /* SMART FALLBACK */
  return "I may not know that yet, but you can ask me about Edge Computing, AI, latency, or privacy.";
}

/* SEND */
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
    addMsg(`<b>Nova AI:</b> ${think(text)}`, "bot");
  }, 400);
}

sendBtn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});