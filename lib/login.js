import { supabase } from "./supabase.js";

document.getElementById("login").onclick = async () => {
  const email = email.value;
  const password = password.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  location.href = "chat.html";
};

document.getElementById("signup").onclick = async () => {
  const email = email.value;
  const password = password.value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  alert("Account created. Login now.");
};