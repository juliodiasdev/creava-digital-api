import fetch from "node-fetch";

function allowOrigin(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async (req, res) => {
  allowOrigin(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método inválido" });

  try {
    const isString = typeof req.body === "string";
    const payload = isString ? JSON.parse(req.body || "{}") : (req.body || {});

    const required = ["user_id", "categoria", "cidade", "estado"];
    const missing = required.filter(k => !payload?.[k]);
    if (missing.length) {
      return res.status(400).json({ error: "Campos obrigatórios faltando", missing });
    }

    const webhook = process.env.MAKE_WEBHOOK_URL;
    if (!webhook) {
      return res.status(500).json({ error: "CONFIG_MISSING", detail: "MAKE_WEBHOOK_URL não configurada" });
    }

    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    let body;
    try { body = JSON.parse(text); } catch { body = { raw: text }; }

    if (!r.ok) return res.status(r.status).json({ error: "MAKE_ERROR", detail: body });
    return res.status(200).json({ ok: true, received: body });
  } catch (e) {
    return res.status(500).json({ error: "SERVER_ERROR", detail: e.message });
  }
};
