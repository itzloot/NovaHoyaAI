const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

// Create sidebar for history
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
      <p style="color: #666;">NovaHoyaAI Pro giveaways & unlimited features await!</p>
      <button id="signOutBtn" style="margin-top: 10px; padding: 10px 20px; background: #ff4444; color: white; border: none; border-radius: 12px; cursor: pointer;">
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
    // Not signed in — show big sign in screen
    authDiv.innerHTML = `
      <div style="padding: 40px;">
        <p style="font-size: 28px; font-weight: bold; margin-bottom: 30px; color: #333;">Welcome to NovaHoyaAI 🚀</p>
        <p style="font-size: 18px; margin-bottom: 40px; color: #666;">Sign in with Google to unlock:</p>
        <ul style="text-align: left; max-width: 400px; margin: 0 auto 40px; font-size: 16px; color: #555;">
          <li>Unlimited chat history</li>
          <li>Real FLUX image generation</li>
          <li>NovaHoyaAI Pro giveaways</li>
          <li>Exclusive features</li>
        </ul>
        <button id="googleSignInBtn" style="
          padding: 18px 40px;
          background: linear-gradient(135deg, #4285F4, #34A853);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 22px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(66,133,244,0.4);
        ">
          Sign in with Google 🚀
        </button>
        <p style="margin-top: 30px; color: #888; font-size: 14px;">
          Join the community: <a href="https://discord.gg/kxyFtrh9Ya" target="_blank">Discord Server</a>
        </p>
      </div>
    `;

    // Attach click event after innerHTML
    setTimeout(() => {
      const btn = document.getElementById('googleSignInBtn');
      if (btn) {
        btn.onclick = () => {
          firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .catch((error) => {
              addMessage("Sign in failed: " + error.message, "bot");
            });
        };
      }
    }, 100);

    // Disable chat
    input.disabled = true;
    sendBtn.disabled = true;
    input.placeholder = "Sign in to start chatting...";
    chatArea.innerHTML = "";
  }
});

// The rest of your code (loadData, newChat, addMessage, sendMessage, Pro system, etc.) stays the same as before

// Intro when signed in
function showIntroIfSignedIn() {
  if (currentUser && chats.length === 0) {
    newChat();
    addMessage("Hey! I'm NovaHoyaAI 🚀 Ready to chat and generate real FLUX images. Try 'generate a futuristic kingdom'!", "bot");
  }
}

// Call after auth check
firebase.auth().onAuthStateChanged((user) => {
  // ... your auth code above
  showIntroIfSignedIn();
});

input.focus();