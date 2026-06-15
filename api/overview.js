// Vercel Serverless Function — sales-board overview proxy
// 브라우저 직접 호출은 CORS로 막혀 있어, 서버에서 대신 호출해 전달한다.
// 프론트는 /api/overview?store_id=... 를 호출한다.

const API_BASE =
  process.env.OQ_API_BASE ||
  "https://oqrun-prod-agent-002-xwamqlvirq-du.a.run.app";

export default async function handler(req, res) {
  const storeId = (req.query.store_id || "").toString().trim();
  if (!storeId) {
    res.status(400).json({ error: "store_id_required" });
    return;
  }

  const target =
    API_BASE + "/v1/sales-board/" + encodeURIComponent(storeId) + "/overview";

  try {
    const upstream = await fetch(target, {
      headers: { accept: "application/json" },
    });
    const body = await upstream.text();
    res.setHeader("content-type", "application/json; charset=utf-8");
    // CDN 캐시 2분 + stale-while-revalidate로 과호출 방지
    res.setHeader("cache-control", "s-maxage=120, stale-while-revalidate=600");
    res.status(upstream.status).send(body);
  } catch (err) {
    res.status(502).json({ error: "upstream_failed", detail: String(err) });
  }
}
