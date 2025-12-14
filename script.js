let user = null;

supabase.auth.onAuthStateChange((_, session) => {
  if (session) {
    user = session.user;
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("chat").classList.remove("hidden");
  }
});

async function login() {
  const email = email.value;
  const password = password.value;
  await supabase.auth.signInWithPassword({ email, password });
}

async function send() {
  const input = prompt.value;
  prompt.value = "";
  addMsg("You", input);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });

  const reader = res.body.getReader();
  let aiMsg = "";
  addMsg("Nova", "");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    aiMsg += new TextDecoder().decode(value);
    updateLast(aiMsg);
  }
}

function addMsg(who, text) {
  const div = document.createElement("div");
  div.className = `msg ${who === "You" ? "user" : "ai"}`;
  div.innerText = `${who}: ${text}`;
  messages.appendChild(div);
}

function updateLast(text) {
  messages.lastChild.innerText = "Nova: " + text;
}