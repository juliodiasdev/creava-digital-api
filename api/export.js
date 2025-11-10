import fetch from "node-fetch";

function allowOrigin(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async (req, res) => {
  allowOrigin(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Método inválido" });

  const { user_id } = req.query || {};
  if (!user_id) return res.status(400).json({ error: "user_id é obrigatório" });

  try {
    const base = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!base || !key) {
      return res.status(500).json({ error: "CONFIG_MISSING", detail: "SUPABASE_URL/ANON_KEY não configurados" });
    }

    const url = `${base}/rest/v1/leads_google?user_id=eq.${encodeURIComponent(user_id)}&select=nome,endereco,cidade,estado,telefone,website,categoria,rating,total_avaliacc,latitude,longitude,link_maps,analise,criado_em`;

    const r = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "text/csv"
      }
    });

    const text = await r.text();
    if (!r.ok) {
      return res.status(r.status).json({ error: "SUPABASE_EXPORT_ERROR", detail: text });
    }

    res.setHeader("Content-Disposition", `attachment; filename="creava-leads-${user_id}.csv"`);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).json({ error: "SERVER_ERROR", detail: e.message });
  }
};
