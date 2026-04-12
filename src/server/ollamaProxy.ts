import type { Plugin } from "vite";

export function ollamaCloudProxy(apiKey: string, model: string): Plugin {
  return {
    name: "ollama-cloud-proxy",
    configureServer(server) {
      console.log(
        `[ollama-cloud] key: ${apiKey ? apiKey.slice(0, 8) + "..." : "MISSING!"}`,
      );
      console.log(`[ollama-cloud] model: ${model}`);

      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end("Method not allowed");
          return;
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk as Buffer);
        }
        const body = JSON.parse(Buffer.concat(chunks).toString());
        body.model = model;
        body.stream = false;

        try {
          const upstream = await fetch("https://ollama.com/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
          });

          const text = await upstream.text();
          res.writeHead(upstream.status, {
            "Content-Type": "application/json",
          });
          res.end(text);
        } catch {
          res.writeHead(502);
          res.end(JSON.stringify({ error: "Failed to reach Ollama Cloud" }));
        }
      });
    },
  };
}
