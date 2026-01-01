const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

// Sidebar for history
const sidebar = document.createElement('div');
sidebar.id = "sidebar";
sidebar.style.width = "300px";
sidebar.style.height = "100vh";
sidebar.style.position = "fixed";
sidebar.style.left = "-300px";
sidebar.style.top = "0";
sidebar.style.background = "#f8f9ff";
sidebar.style.borderRight = "1px solid #ddd";
sidebar.style.transition = "left 0.3s ease";
sidebar.style.zIndex = "999";
sidebar.style.padding = "20px";
sidebar.style.boxShadow = "2px 0 10px rgba(0,0,0,0.1)";
document.body.appendChild(sidebar);

// History button (top right in header)
const historyBtn = document.createElement('button');
historyBtn.innerHTML = "📜 History";
historyBtn.style.position = "absolute";
historyBtn.style.right = "20px";
historyBtn.style.top = "20px";
historyBtn.style.padding = "10px 20px";
historyBtn.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
historyBtn.style.color = "white";
historyBtn.style.border = "none";
historyBtn.style.borderRadius = "30px";
historyBtn.style.fontWeight = "bold";
historyBtn.style.cursor = "pointer";
historyBtn.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
historyBtn.onclick = () => {
  sidebar.style.left = sidebar.style.left === "0px" ? "-300px" : "0px";
};
document.querySelector('header').style.position = "relative";
document.querySelector('header').appendChild(historyBtn);

let currentUser = null;
let chats = [];
let currentChatId = null;
let isPro = false;

const MAX_IMAGES_FREE = 5;
const MAX_MESSAGES_FREE = 25;

// Firebase Auth state
firebase.auth().onAuthStateChanged((user) => {
  currentUser = user;

  const header = document.querySelector('header');
  let authDiv = document.getElementById('auth-container');
  if (!authDiv) {
    authDiv = document.createElement('div');
    authDiv.id = "auth-container";
    authDiv.style.textAlign = "center";
    authDiv.style.margin = "20px 0";
    header.appendChild(authDiv);
  }

  if (user) {
    // Signed in
    authDiv.innerHTML = `
      <p style="font-size: 18px; margin-bottom: 10px;">Welcome, <strong>${user.displayName || user.email}</strong> 👋</p>
      <button id="signOutBtn" style="padding: 10px 20px; background: #ff4444; color: white; border: none; border-radius: 12px; cursor: pointer;">
        Sign Out
      </button>
    `;
    document.getElementById('signOutBtn').onclick = () => firebase.auth().signOut();

    // Enable chat
    input.disabled = false;
    sendBtn.disabled = false;
    input.placeholder = "Ask NovaHoyaAI anything...";

    loadData(); // load chats after sign in
  } else {
    // Not signed in — block chat
    authDiv.innerHTML = `
      <p style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Sign in to use NovaHoyaAI 🚀</p>
      <button id="googleSignInBtn" style="
        padding: 16px 32px;
        background: linear-gradient(135deg, #4285F4, #34A853);
        color: white;
        border: none;
        border-radius: 20px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(66,133,244,0.4);
      ">
        Sign in with Google
      </button>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        Unlock chat, unlimited images, Pro giveaways & more!
      </p>
    `;

    document.getElementById('googleSignInBtn').onclick = () => {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    };

    // Disable chat
    input.disabled = true;
    sendBtn.disabled = true;
    input.placeholder = "Sign in to chat...";
    chatArea.innerHTML = `
      <div class="message bot" style="text-align: center; margin-top: 100px; padding: 30px;">
        <p style="font-size: 20px;">Please sign in with Google to start using NovaHoyaAI 🚀</p>
        <p style="margin-top: 20px; color: #666;">Chat, generate unlimited images, win Pro — all waiting for you!</p>
      </div>
    `;
    sidebar.style.left = "-300px";
  }
});

// Load chats from localStorage (per device, for now)
function loadData() {
  const saved = localStorage.getItem("novaHoyaAI_chats");
  if (saved) {
    chats = JSON.parse(saved);
    isPro = localStorage.getItem("novaHoyaAI_pro") === "true";
    if (chats.length > 0) {
      loadChat(chats[0].id);
    } else {
      newChat();
    }
  } else {
    newChat();
  }
  updateSidebar();
  updateProStatus();
}

// New chat
function newChat() {
  const id = Date.now();
  chats.unshift({
    id,
    topic: "New Chat",
    messages: [],
    imageCount: 0,
    messageCount: 0
  });
  loadChat(id);
  saveAll();
  updateSidebar();
}

// Load chat
function loadChat(id) {
  const chat = chats.find(c => c.id === id);
  if (!chat) return;
  currentChatId = id;
  chatArea.innerHTML = "";
  chat.messages.forEach(m => {
    const div = document.createElement("div");
    div.className = `message ${m.type}`;
    div.innerHTML = m.content;
    chatArea.appendChild(div);
  });
  chatArea.scrollTop = chatArea.scrollHeight;
  updateSidebar();
}

// Update sidebar
function updateSidebar() {
  sidebar.innerHTML = `
    <h2 style="color: #667eea; margin-bottom: 20px;">Your Chats</h2>
    <button id="newChatBtn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 12px; font-weight: bold; margin-bottom: 20px; cursor: pointer;">
      + New Chat
    </button>
    <div id="chatList"></div>
  `;

  const list = sidebar.querySelector('#chatList');
  chats.forEach(chat => {
    const item = document.createElement('div');
    item.textContent = chat.topic || "New Chat";
    item.style.padding = "12px";
    item.style.borderRadius = "10px";
    item.style.marginBottom = "8px";
    item.style.background = chat.id === currentChatId ? "#e3f2fd" : "#f0f0ff";
    item.style.cursor = "pointer";
    item.style.fontWeight = chat.id === currentChatId ? "bold" : "normal";
    item.onclick = () => loadChat(chat.id);
    list.appendChild(item);
  });

  document.getElementById('newChatBtn').onclick = newChat;
}

// Save all
function saveAll() {
  localStorage.setItem("novaHoyaAI_chats", JSON.stringify(chats));
  localStorage.setItem("novaHoyaAI_pro", isPro);
}

// Pro status
function updateProStatus() {
  let header = document.querySelector('header');
  let proDiv = document.getElementById('pro-status');
  if (!proDiv) {
    proDiv = document.createElement('div');
    proDiv.id = "pro-status";
    proDiv.style.textAlign = "center";
    proDiv.style.marginTop = "10px";
    header.appendChild(proDiv);
  }

  if (isPro) {
    proDiv.innerHTML = `<span style="background: linear-gradient(135deg, #FFD700, #FFA500); color: black; padding: 8px 20px; border-radius: 30px; font-weight: bold; font-size: 18px;">NovaHoyaAI Pro 🔥 UNLIMITED</span>`;
  } else {
    const current = chats.find(c => c.id === currentChatId);
    const imgLeft = MAX_IMAGES_FREE - (current?.imageCount || 0);
    const msgLeft = MAX_MESSAGES_FREE - (current?.messageCount || 0);
    proDiv.innerHTML = `<p style="font-size: 14px; color: #666;">Free: ${imgLeft} images & ${msgLeft} messages left<br><strong>Win Pro in Discord!</strong></p>`;
  }
}

// Unlock Pro (secure)
async function unlockPro() {
  const code = prompt("Enter your NovaHoyaAI Pro giveaway code:");
  if (!code) return;

  try {
    const res = await fetch("/api/pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (data.valid) {
      isPro = true;
      updateProStatus();
      saveAll();
      addMessage("🎉 PRO UNLOCKED! Unlimited everything 🔥", "bot");
    } else {
      addMessage("Invalid code 😔 Real codes from Discord giveaways only!", "bot");
    }
  } catch {
    addMessage("Error — try again!", "bot");
  }
}

// Pro button
if (!isPro) {
  const header = document.querySelector('header');
  const btn = document.createElement('button');
  btn.textContent = "Win Pro 🎁";
  btn.style.margin = "15px auto";
  btn.style.display = "block";
  btn.style.padding = "14px 28px";
  btn.style.background = "linear-gradient(135deg, #FFD700, #FFA500)";
  btn.style.color = "black";
  btn.style.border = "none";
  btn.style.borderRadius = "30px";
  btn.style.fontWeight = "bold";
  btn.style.fontSize = "18px";
  btn.style.cursor = "pointer";
  btn.onclick = unlockPro;
  header.appendChild(btn);
}

function addMessage(content, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;

  if (content instanceof HTMLImageElement) {
    content.alt = "Generated by NovaHoyaAI" + (isPro ? " Pro 🔥" : "");
    content.loading = "lazy";
    content.style.maxWidth = "100%";
    content.style.borderRadius = "12px";
    content.style.marginTop = "10px";
    content.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
    div.appendChild(content);
  } else if (typeof content === "string") {
    if (content.startsWith("http") || content.startsWith("data:image")) {
      const img = document.createElement("img");
      img.src = content;
      img.alt = "Generated by NovaHoyaAI" + (isPro ? " Pro 🔥" : "");
      img.loading = "lazy";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "12px";
      img.style.marginTop = "10px";
      div.appendChild(img);
    } else {
      if (isPro && type === "bot" && Math.random() < 0.4) {
        content += " (NovaHoyaAI Pro 🔥)";
      }
      div.innerText = content;
    }
  }

  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;

  const current = chats.find(c => c.id === currentChatId);
  if (current) {
    current.messages.push({ content: div.innerHTML, type });
    if (current.messages.length === 2 && type === "user") {
      current.topic = content.substring(0, 40) + (content.length > 40 ? "..." : "");
      updateSidebar();
    }
    saveAll();
    updateProStatus();
  }
}

async function sendMessage() {
  if (!currentUser) return; // safety

  const text = input.value.trim();
  if (!text) return;

  const current = chats.find(c => c.id === currentChatId);
  if (!current) return;

  if (!isPro && current.messageCount >= MAX_MESSAGES_FREE) {
    addMessage(`Message limit reached. Win Pro in Discord!`, "bot");
    return;
  }

  addMessage(text, "user");
  input.value = "";
  current.messageCount++;

  const lowerText = text.toLowerCase();
  const isImageRequest = /generate|create|draw|image|picture|logo/i.test(lowerText);

  if (isImageRequest) {
    if (!isPro && current.imageCount >= MAX_IMAGES_FREE) {
      addMessage(`Image limit reached. Win Pro in Discord!`, "bot");
      return;
    }

    const loading = document.createElement("div");
    loading.className = "message bot";
    loading.innerText = "Generating image... 🔥";
    chatArea.appendChild(loading);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
      const img = await puter.ai.txt2img(text, { model: "black-forest-labs/FLUX.1-schnell" });
      chatArea.removeChild(loading);
      addMessage(img, "bot");
      current.imageCount++;
    } catch {
      chatArea.removeChild(loading);
      addMessage("Image failed — try again!", "bot");
    }
  } else {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.concat({ role: "user", content: text }) })
      });

      const data = await res.json();
      addMessage(data.reply, "bot");

    } catch {
      addMessage("Error connecting to NovaHoyaAI.", "bot");
    }
  }

  saveAll();
  updateProStatus();
}

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

input.focus();