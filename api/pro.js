// api/pro.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ valid: false });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ valid: false });
  }

  const validCodes = process.env.PRO_CODES?.split(",") || [];

  const isValid = validCodes.includes(code.trim().toUpperCase());

  if (isValid) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(200).json({ valid: false });
  }
}