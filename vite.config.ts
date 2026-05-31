import { defineConfig, type Plugin, type Connect } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// ─── Persistent comments API (Figma-style) ───────────────────────────────────
// Threads are written to <project>/comments/comments.json so they survive
// any number of page refreshes / dev-server restarts.
function commentsApi(): Plugin {
  const dir = path.join(rootDir, "comments");
  const file = path.join(dir, "comments.json");

  const read = (): any[] => {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return [];
    }
  };
  const write = (data: unknown) => {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  };
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const readBody = (req: Connect.IncomingMessage): Promise<any> =>
    new Promise((resolve) => {
      let raw = "";
      req.on("data", (c: Buffer) => (raw += c));
      req.on("end", () => {
        try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
      });
    });

  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    const url = req.url || "";
    if (!url.startsWith("/api/comments")) return next();

    res.setHeader("Content-Type", "application/json");
    const parts = url.split("?")[0].split("/").filter(Boolean); // ["api","comments", id?, sub?]
    const id = parts[2];
    const sub = parts[3];

    try {
      let data = read();

      if (req.method === "GET") {
        res.end(JSON.stringify(data));
        return;
      }

      if (req.method === "POST" && !id) {
        const b = await readBody(req);
        const thread = {
          id: genId(),
          context: b.context || "",
          x: typeof b.x === "number" ? b.x : 0,
          y: typeof b.y === "number" ? b.y : 0,
          resolved: false,
          createdAt: Date.now(),
          messages: [{ id: genId(), author: b.author || "Reviewer", text: b.text || "", at: Date.now() }],
        };
        data.push(thread);
        write(data);
        res.end(JSON.stringify(thread));
        return;
      }

      if (req.method === "POST" && id && sub === "messages") {
        const b = await readBody(req);
        const thread = data.find((t: any) => t.id === id);
        if (!thread) { res.statusCode = 404; res.end("{}"); return; }
        const msg = { id: genId(), author: b.author || "Reviewer", text: b.text || "", at: Date.now() };
        thread.messages.push(msg);
        write(data);
        res.end(JSON.stringify(thread));
        return;
      }

      if (req.method === "PATCH" && id) {
        const b = await readBody(req);
        const thread = data.find((t: any) => t.id === id);
        if (!thread) { res.statusCode = 404; res.end("{}"); return; }
        if (typeof b.resolved === "boolean") thread.resolved = b.resolved;
        if (typeof b.x === "number") thread.x = b.x;
        if (typeof b.y === "number") thread.y = b.y;
        write(data);
        res.end(JSON.stringify(thread));
        return;
      }

      if (req.method === "DELETE" && id) {
        data = data.filter((t: any) => t.id !== id);
        write(data);
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      res.statusCode = 405;
      res.end("{}");
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: String(e) }));
    }
  };

  return {
    name: "eicore-comments-api",
    configureServer(server) { server.middlewares.use(handler); },
    configurePreviewServer(server) { server.middlewares.use(handler); },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), commentsApi()],
  server: {
    port: 5180,
    open: true,
  },
});
