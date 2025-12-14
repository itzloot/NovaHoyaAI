const supabase = window.supabase.createClient(
  "https://ejjkgxkhmkofmxdocyfq.supabase.co",
  "sb_publishable_BZ5kf2GX6D5ESbQt86_tLQ_RcsvQgMA"
);

loginBtn.onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (error) return alert(error.message);
  location.href = "/chat.html";
};

signupBtn.onclick = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (error) return alert(error.message);
  alert("Check your email to verify");
};

googleBtn.onclick = async () => {
  await supabase.auth.signInWithOAuth({ provider: "google" });
};