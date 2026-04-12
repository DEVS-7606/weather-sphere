import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OLLAMA_KEY;
  const model = process.env.OLLAMA_MODEL || "gemma3:4b";

  if (!apiKey) {
    return res.status(500).json({ error: "OLLAMA_KEY not configured" });
  }

  try {
    const body = req.body;
    body.model = model;
    body.stream = false;

    const upstream = await fetch("https://ollama.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.text();
    res
      .status(upstream.status)
      .setHeader("Content-Type", "application/json")
      .end(data);
  } catch {
    res.status(502).json({ error: "Failed to reach Ollama Cloud" });
  }
}
