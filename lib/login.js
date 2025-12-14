// Supabase client
const SUPABASE_URL = "https://ejjkgxkhmkofmxdocyfq.supabase.co";
const SUPABASE_KEY = "sb_publishable_BZ5kf2GX6D5ESbQt86_tLQ_RcsvQgMA";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const email = document.getElementById('email');
const password = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('googleBtn');
const signup = document.getElementById('signup');

loginBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if(error) return alert(error.message);
  window.location.href = "/chat.html"; // redirect to AI chat
});

googleBtn.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
  if(error) return alert(error.message);
});

signup.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });
  if(error) return alert(error.message);
  alert('Check your email to verify your account!');
});