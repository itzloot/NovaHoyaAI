import { supabase } from "./supabase.js";

const { data } = await supabase.auth.getSession();
if (!data.session) location.href = "login.html";

document.getElementById("logout").onclick = async () => {
  await supabase.auth.signOut();
  location.href = "login.html";
};