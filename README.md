# Creava API (Gateway) — Lovable ↔ Make ↔ Supabase

Este gateway publica 3 endpoints:
- `GET /api/health` — status
- `POST /api/lead` — recebe o formulário do Lovable e repassa ao Make
- `GET /api/export?user_id=UUID` — exporta CSV de leads do Supabase

## Deploy (Vercel)
1. Suba estes arquivos para um repositório (GitHub).
2. Na Vercel: **Add New Project** → importe o repo.
3. Em *Environment Variables*, crie:
   - `MAKE_WEBHOOK_URL` — ex: `https://hook.us2.make.com/<SEU_ID>`
   - `SUPABASE_URL` — ex: `https://<seu>.supabase.co`
   - `SUPABASE_ANON_KEY` — sua anon key do Supabase
   - `CORS_ORIGIN` — domínio do app Lovable (ex: `https://seuapp.lovable.app`)

   *(Opcional para operações server-side protegidas)*
   - `SUPABASE_SERVICE_KEY` — service_role key

4. Deploy. As URLs ficarão como:
   - `https://<app>.vercel.app/api/lead`
   - `https://<app>.vercel.app/api/export`
   - `https://<app>.vercel.app/api/health`

## Fluxo
Lovable (form POST) → **/api/lead** → Make (automação) → Supabase (dados).  
Export: Lovable (link) → **/api/export?user_id=...** → CSV baixado.

## Segurança
- Não exponha chaves no Lovable.
- Restrinja CORS via `CORS_ORIGIN`.
- Use `service_key` apenas no backend (se necessário).
