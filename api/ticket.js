/* =========================================================
   NEXUS ROLEPLAY — SUPPORT TICKET RELAY (Vercel function)
   Forwards tickets from the website to Discord so the webhook
   URL never ships to the browser.

   Setup: Vercel → Project → Settings → Environment Variables
          DISCORD_WEBHOOK_URL = https://discord.com/api/webhooks/...
   ========================================================= */

const CATEGORY_LABELS = {
    store: "Store / Donation Issue",
    ban: "Ban Appeal",
    bug: "Bug Report / Server Issue",
    streamer: "Streamer Application",
    other: "General Inquiry"
};
const LANG_LABELS = { en: "English", af: "Afrikaans", fr: "Français" };

// Best-effort rate limit (per warm instance): 3 tickets / 10 min / IP.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map();

function rateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(ts => now - ts < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
        hits.set(ip, recent);
        return true;
    }
    recent.push(now);
    hits.set(ip, recent);
    return false;
}

const clean = (v, max) => String(v ?? "").replace(/\s+$/g, "").trim().slice(0, max);

module.exports = async function handler(req, res) {
    // Allow the in-game NUI page (different origin) to post here too.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) return res.status(503).json({ error: "not_configured" });

    let body = req.body;
    if (typeof body === "string") {
        try { body = JSON.parse(body); } catch (e) { body = null; }
    }
    if (!body || typeof body !== "object") return res.status(400).json({ error: "invalid_body" });

    // Honeypot field — bots fill it, humans never see it.
    if (body.website) return res.status(200).json({ ok: true });

    const name = clean(body.name, 64);
    const discord = clean(body.discord, 64).replace(/^@/, "");
    const message = clean(body.message, 1500);
    const category = CATEGORY_LABELS[body.category] ? body.category : "other";
    const lang = LANG_LABELS[body.lang] ? body.lang : "en";

    if (!name || !discord || message.length < 10) {
        return res.status(400).json({ error: "invalid_fields" });
    }

    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) return res.status(429).json({ error: "rate_limited" });

    const payload = {
        // Never let user text ping @everyone / roles / users.
        allowed_mentions: { parse: [] },
        embeds: [{
            title: "🎫 New Support Ticket",
            color: 0x8fd0f8,
            description: message,
            fields: [
                { name: "Name", value: name, inline: true },
                { name: "Discord", value: `@${discord}`, inline: true },
                { name: "Category", value: CATEGORY_LABELS[category], inline: true },
                { name: "Language", value: LANG_LABELS[lang], inline: true }
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Nexus RolePlay — Support Center" }
        }]
    };

    try {
        const r = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!r.ok) return res.status(502).json({ error: "discord_error" });
        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(502).json({ error: "discord_unreachable" });
    }
};
