/* =========================================================
   NEXUS ROLEPLAY — MAIN RUNTIME ENGINE (script.js)
   ========================================================= */

const CFG = window.SERVER_CONFIG;
import { SpeedInsights } from "@vercel/speed-insights/next"
/* ---------------------------------------------------------
   0. BOOT
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initGuardGate();
    initParticleField();
    initCursorGlow();
    initRevealObserver();
    initMagneticButtons();
    initStaffDirectory();
    initRulesList();
    initDevLogs();
    initMedia();
    initSupportCenter();
    initConnectLinks();

    fetchServerStatus();
    startCountdown();
});

/* ---------------------------------------------------------
   1. GUARD GATE (entry screen)
--------------------------------------------------------- */
function initGuardGate() {
    const gate = document.getElementById("guard-gate");
    if (!gate) return;
    gate.addEventListener("click", enterWebsite);
    gate.setAttribute("tabindex", "0");
    gate.setAttribute("role", "button");
    gate.setAttribute("aria-label", "Enter site");
    gate.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            enterWebsite();
        }
    });
}

function enterWebsite() {
    const gate = document.getElementById("guard-gate");
    if (!gate) return;
    gate.classList.add("gate-exit");
    document.documentElement.classList.remove("gate-locked");
    setTimeout(() => gate.remove(), 750);
}

function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: "smooth" });
}

/* ---------------------------------------------------------
   2. AMBIENT PARTICLE FIELD (canvas background)
--------------------------------------------------------- */
function initParticleField() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            a: Math.random() * 0.5 + 0.15
        });
    }

    function tick() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgba(59, 130, 246, 1)";
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.globalAlpha = p.a;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        // faint connecting lines between nearby particles
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = "rgba(59, 130, 246, 1)";
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        if (!prefersReducedMotion) requestAnimationFrame(tick);
    }
    tick();
}

/* ---------------------------------------------------------
   3. CURSOR GLOW FOLLOWER (desktop only)
--------------------------------------------------------- */
function initCursorGlow() {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;
    if (window.matchMedia("(pointer: coarse)").matches) { glow.remove(); return; }

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let gx = mx, gy = my;

    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

    function loop() {
        gx += (mx - gx) * 0.12;
        gy += (my - gy) * 0.12;
        glow.style.transform = `translate3d(${gx - 200}px, ${gy - 200}px, 0)`;
        requestAnimationFrame(loop);
    }
    loop();
}

/* ---------------------------------------------------------
   4. SCROLL REVEAL
--------------------------------------------------------- */
function initRevealObserver() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, groupIndex) => {
            if (entry.isIntersecting) {
                const delay = Number(entry.target.dataset.revealDelay || 0);
                setTimeout(() => entry.target.classList.add("is-visible"), delay);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach(el => io.observe(el));
}

/* ---------------------------------------------------------
   5. MAGNETIC BUTTONS
--------------------------------------------------------- */
function initMagneticButtons() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.querySelectorAll("[data-magnetic]").forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
        });
        btn.addEventListener("mouseleave", () => { btn.style.transform = "translate(0,0)"; });
    });
}

/* ---------------------------------------------------------
   6. CONNECT LINKS (built from config so IP only needs setting once)
--------------------------------------------------------- */
function initConnectLinks() {
    document.querySelectorAll("[data-connect-link]").forEach(el => {
        el.href = `fxserver://connect/${CFG.serverIp}:${CFG.serverPort}`;
    });
    document.querySelectorAll("[data-cfx-link]").forEach(el => {
        el.href = CFG.cfxCode ? `https://cfx.re/join/${CFG.cfxCode}` : `fxserver://connect/${CFG.serverIp}:${CFG.serverPort}`;
    });
    document.querySelectorAll("[data-server-address]").forEach(el => {
        el.textContent = CFG.cfxCode ? `cfx.re/join/${CFG.cfxCode}` : `${CFG.serverIp}:${CFG.serverPort}`;
    });
}

/* ---------------------------------------------------------
   7. LIVE SERVER STATUS
   Just set serverIp / serverPort (and optionally cfxCode) in
   config.js — everything below resolves itself:
     1) If a cfxCode is set, ask the Cfx.re master list (most reliable).
     2) Otherwise (or if that fails), query the server directly at
        its IP:PORT via the public dynamic.json/info.json endpoints
        FiveM servers expose.
   If neither responds, the UI honestly shows the server as
   unreachable rather than faking numbers.

   NOTE ON "REAL-TIME": the Cfx.re master list only refreshes when
   your server sends it a heartbeat (roughly every 30-45s), so
   polling much faster than that won't get you newer data — it'll
   just repeat the same snapshot. 15s here is close to the practical
   ceiling. What actually helps responsiveness is re-checking the
   instant someone looks back at the tab, which is handled below.
--------------------------------------------------------- */
let countdown = 15;
const REFRESH_SECONDS = 15;

function startCountdown() {
    setInterval(() => {
        const el = document.getElementById("countdown-timer");
        countdown--;
        if (countdown <= 0) {
            countdown = REFRESH_SECONDS;
            fetchServerStatus();
        }
        if (el) el.innerText = `${countdown}s`;
    }, 1000);

    // Instantly refresh the moment someone tabs back in, instead of
    // making them wait out a stale countdown from before they left.
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            countdown = REFRESH_SECONDS;
            fetchServerStatus();
        }
    });
}

function manualRefreshStatus() {
    countdown = REFRESH_SECONDS;
    const icon = document.getElementById("refresh-icon");
    if (icon) {
        icon.classList.add("fa-spin");
        setTimeout(() => icon.classList.remove("fa-spin"), 800);
    }
    fetchServerStatus();
}

async function fetchServerStatus() {
    const address = `${CFG.serverIp}:${CFG.serverPort}`;

    // Opening index.html straight from disk (file://) blocks nearly every
    // fetch() call below under browser security rules — this isn't
    // something the code can work around. Flag it loudly so it isn't
    // mistaken for the server being down.
    if (location.protocol === "file:") {
        console.warn(
            "[Nexus Status] This page is open via file:// — browsers block " +
            "fetch() requests from local files, so the live status check " +
            "can never succeed here. Serve the site over http(s):// " +
            "(a local dev server, GitHub Pages, your host, or FiveM's NUI) " +
            "and the status check will work normally."
        );
        renderStatus({ online: false });
        return;
    }

    // Attempt 1: Cfx.re master list — works for any public server and
    // avoids browser CORS issues. Accepts either a join code or ip:port.
    // NOTE: Cfx.re retired the old servers-frontend.fivem.net domain (it
    // now just 404s with a plain "not found" page) in favor of
    // frontend.cfx-services.net — same API shape, new host.
    const lookupKey = CFG.cfxCode && CFG.cfxCode.trim() ? CFG.cfxCode.trim() : address;
    try {
        const res = await fetch(`https://frontend.cfx-services.net/api/servers/single/${lookupKey}`, { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            if (json && json.Data) {
                renderStatus({
                    online: true,
                    players: json.Data.clients ?? 0,
                    maxPlayers: json.Data.sv_maxclients ?? CFG.maxPlayers,
                    hostname: json.Data.hostname
                });
                return;
            }
            // The API responds but recognizes no such server — almost
            // always means the cfxCode is wrong/stale, or the server has
            // never sent a heartbeat to the Cfx.re master list.
            console.warn(
                `[Nexus Status] Cfx.re master list has no record for "${lookupKey}". ` +
                `Double-check serverIp/cfxCode in config.js match your actual ` +
                `cfx.re/join/ link, and confirm the server is currently online ` +
                `(this only reflects servers registered with Cfx.re, not raw IPs).`,
                json
            );
        } else {
            console.warn(`[Nexus Status] Cfx.re master list request failed with HTTP ${res.status}.`);
        }
    } catch (e) {
        console.warn("[Nexus Status] Cfx.re master list request errored:", e);
    }

    // Attempt 2: query the server directly (works when this page is
    // served over plain HTTP, or embedded in-game via NUI). This will
    // reliably fail with a CORS or mixed-content error on an https:// site
    // pointed at a plain http:// IP — that's expected browser behavior,
    // not a bug, which is why Attempt 1 above is the primary path.
    try {
        const res = await fetch(`http://${address}/dynamic.json`, { cache: "no-store", mode: "cors" });
        if (res.ok) {
            const json = await res.json();
            renderStatus({
                online: true,
                players: json.clients ?? 0,
                maxPlayers: json.sv_maxclients ?? CFG.maxPlayers,
                hostname: json.hostname
            });
            return;
        }
        console.warn(`[Nexus Status] Direct query to ${address}/dynamic.json failed with HTTP ${res.status}.`);
    } catch (e) {
        console.warn(
            `[Nexus Status] Direct query to ${address}/dynamic.json errored ` +
            `(commonly CORS or mixed-content blocking on http:// from an https:// page):`, e
        );
    }

    // Both lookups failed — be honest about it instead of showing fake data.
    renderStatus({ online: false });
}

function renderStatus({ online, players, maxPlayers, hostname }) {
    const heroStatus = document.getElementById("hero-live-status-text");
    const heroPlayers = document.getElementById("hero-live-players");
    const badge = document.getElementById("status-card-badge");
    const subtext = document.getElementById("status-subtext");
    const cardPlayers = document.getElementById("status-card-players");
    const cardUptime = document.getElementById("status-card-uptime");
    const cardUptimeSub = document.getElementById("status-card-uptime-sub");
    const quickBadge = document.getElementById("quickcard-badge");

    if (online) {
        const max = maxPlayers || CFG.maxPlayers;
        if (heroStatus) heroStatus.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online`;
        if (heroStatus) heroStatus.className = "text-xs font-bold text-emerald-400 flex items-center gap-1.5";
        if (heroPlayers) heroPlayers.innerText = `${players} / ${max}`;
        if (badge) badge.innerHTML = `<span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE`;
        if (badge) badge.className = "text-2xl font-bold text-emerald-400 mb-2 flex items-center gap-2";
        if (subtext) { subtext.innerText = "Node responding normally"; subtext.className = "text-[11px] text-emerald-400 font-medium"; }
        if (cardPlayers) cardPlayers.innerText = `${players} / ${max}`;
        if (cardUptime) cardUptime.innerText = "Live";
        if (cardUptimeSub) { cardUptimeSub.innerText = "Responding to queries"; cardUptimeSub.className = "text-[11px] text-emerald-400 font-medium"; }
        if (quickBadge) { quickBadge.innerText = "Live"; quickBadge.className = "px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase"; }
        drawPulseBar(true);
    } else {
        if (heroStatus) heroStatus.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500"></span> Offline`;
        if (heroStatus) heroStatus.className = "text-xs font-bold text-red-400 flex items-center gap-1.5";
        if (heroPlayers) heroPlayers.innerText = `-- / ${CFG.maxPlayers}`;
        if (badge) badge.innerHTML = `<span class="w-3 h-3 rounded-full bg-red-500"></span> UNREACHABLE`;
        if (badge) badge.className = "text-2xl font-bold text-red-400 mb-2 flex items-center gap-2";
        if (subtext) { subtext.innerText = "No response from server address"; subtext.className = "text-[11px] text-red-400 font-medium"; }
        if (cardPlayers) cardPlayers.innerText = "-- / --";
        if (cardUptime) cardUptime.innerText = "--";
        if (cardUptimeSub) { cardUptimeSub.innerText = "See browser console (F12) for why"; cardUptimeSub.className = "text-[11px] text-red-400 font-medium"; }
        if (quickBadge) { quickBadge.innerText = "Offline"; quickBadge.className = "px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase"; }
        drawPulseBar(false);
    }
}

// Small animated "vitals" sparkline in the quick-connect card —
// ticks along while online, flatlines when the server is unreachable.
let pulseHistory = [];
function drawPulseBar(online) {
    const el = document.getElementById("pulse-line");
    if (!el) return;
    if (online) {
        pulseHistory.push(4 + Math.random() * 22);
    } else {
        pulseHistory.push(2);
    }
    if (pulseHistory.length > 24) pulseHistory.shift();

    el.innerHTML = pulseHistory.map(v =>
        `<span style="height:${v}px" class="w-[3px] rounded-full ${online ? 'bg-nexusPrimary' : 'bg-red-500/60'} inline-block mx-[1.5px] transition-all duration-500"></span>`
    ).join('');
}

/* ---------------------------------------------------------
   8. TOASTS (replaces alert())
--------------------------------------------------------- */
function showToast(message, type = "success") {
    const host = document.getElementById("toast-host");
    if (!host) { alert(message); return; }

    const icon = type === "success" ? "fa-circle-check" : "fa-circle-exclamation";
    const color = type === "success" ? "border-emerald-500/40 text-emerald-400" : "border-red-500/40 text-red-400";

    const toast = document.createElement("div");
    toast.className = `toast-in flex items-center gap-3 bg-nexusCard border ${color} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl backdrop-blur`;
    toast.innerHTML = `<i class="fa-solid ${icon} ${color.split(' ')[1]}"></i><span>${message}</span>`;
    host.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-out");
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

/* ---------------------------------------------------------
   9. STAFF DIRECTORY
--------------------------------------------------------- */
function initStaffDirectory() {
    const container = document.getElementById("staff-container");
    if (!container) return;
    container.innerHTML = CFG.staffMembers.map((staff, i) => `
        <div data-reveal data-reveal-delay="${i * 80}" class="reveal bg-nexusCard border border-nexusBorder rounded-2xl p-6 shadow-xl space-y-4 hover:border-nexusPrimary/40 hover:-translate-y-1 transition-all duration-300">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-nexusPrimary/10 border border-nexusPrimary/30 flex items-center justify-center font-extrabold text-nexusPrimary text-lg overflow-hidden">
                    ${staff.avatar
                        ? `<img src="${staff.avatar}" alt="${staff.name}" class="w-full h-full object-cover" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${staff.name.charAt(0)}'}))">`
                        : staff.name.charAt(0)}
                </div>
                <div>
                    <h4 class="font-bold text-white text-sm">${staff.name}</h4>
                    <span class="text-[10px] text-nexusPrimary font-semibold uppercase tracking-wider">${staff.role}</span>
                </div>
            </div>
            <p class="text-xs text-nexusMuted">${staff.bio}</p>
            <div class="pt-2 border-t border-nexusBorder/40 flex items-center justify-between text-[11px]">
                <span class="text-nexusMuted font-mono">@${staff.discord}</span>
                <span class="text-emerald-400 font-semibold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active</span>
            </div>
        </div>
    `).join('');
    initRevealObserver();
}

/* ---------------------------------------------------------
   10. RULES
--------------------------------------------------------- */
function initRulesList() {
    const container = document.getElementById("server-rules-container");
    if (!container) return;
    container.innerHTML = CFG.rulesData.map((section, i) => `
        <div data-reveal data-reveal-delay="${i * 70}" class="reveal bg-nexusCard border border-nexusBorder rounded-2xl p-6 shadow-xl space-y-4">
            <h3 class="text-lg font-bold text-nexusPrimary border-b border-nexusBorder pb-3 flex items-center gap-2">
                <i class="fa-solid ${section.icon}"></i> ${section.category}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                ${section.rules.map(rule => `
                    <div class="p-3 bg-nexusBg rounded-xl border border-nexusBorder/60 space-y-1 hover:border-nexusPrimary/40 transition-colors duration-200">
                        <span class="font-bold text-white block">${rule.id} ${rule.title}</span>
                        <p class="text-nexusMuted leading-relaxed">${rule.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    initRevealObserver();
}

/* ---------------------------------------------------------
   11. DEV LOGS
--------------------------------------------------------- */
function initDevLogs() {
    const container = document.getElementById("devlogs-container");
    if (!container) return;
    container.innerHTML = CFG.devLogs.map(log => `
        <div class="border-l-2 ${log.latest ? 'border-nexusPrimary' : 'border-nexusBorder'} pl-4 space-y-1">
            <span class="text-[10px] ${log.latest ? 'text-nexusPrimary' : 'text-nexusMuted'} font-bold uppercase tracking-wider">${log.date}</span>
            <h4 class="font-bold text-sm text-white">${log.title}</h4>
            <p class="text-xs text-nexusMuted leading-relaxed">${log.desc}</p>
        </div>
    `).join('');
}

/* ---------------------------------------------------------
   12. MEDIA
--------------------------------------------------------- */
function initMedia() {
    const container = document.getElementById("media-container");
    if (!container) return;
    container.innerHTML = CFG.media.map((m, i) => `
        <div data-reveal data-reveal-delay="${i * 90}" class="reveal aspect-video bg-nexusCard border border-nexusBorder rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-nexusPrimary/40 transition-all duration-300">
            ${m.image ? `<img src="${m.image}" alt="${m.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.remove()">` : ''}
            <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80"></div>
            <div class="absolute inset-0 bg-nexusPrimary/0 group-hover:bg-nexusPrimary/5 transition-colors duration-300"></div>
            <div class="relative z-10 flex justify-between items-center"><span class="text-[10px] bg-nexusPrimary/20 text-nexusPrimary px-2.5 py-1 rounded-full font-bold">${m.tag}</span></div>
            <div class="relative z-10">
                <h4 class="font-bold text-white text-sm">${m.title}</h4>
                <p class="text-xs text-nexusMuted">${m.desc}</p>
            </div>
        </div>
    `).join('');
    initRevealObserver();
}

/* ---------------------------------------------------------
   13. SUPPORT CENTER & DISCORD WEBHOOK
--------------------------------------------------------- */
function initSupportCenter() {
    const container = document.getElementById("contact-page-container");
    if (!container) return;
    container.innerHTML = `
        <div class="bg-nexusCard border border-nexusBorder rounded-2xl p-8 shadow-xl max-w-2xl mx-auto space-y-6">
            <div class="space-y-1">
                <h3 class="font-bold text-white text-base">Open a Support Ticket</h3>
                <p class="text-xs text-nexusMuted">Fill out the form below and our staff team will get back to you via Discord or email within 24 hours.</p>
            </div>
            <form onsubmit="submitTicket(event)" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-[11px] font-bold text-nexusMuted uppercase">Your Name</label>
                        <input type="text" id="ticket-name" required placeholder="e.g. John Doe" class="w-full bg-nexusBg border border-nexusBorder rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-nexusPrimary transition-colors">
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[11px] font-bold text-nexusMuted uppercase">Discord Tag</label>
                        <input type="text" id="ticket-discord" required placeholder="e.g. username" class="w-full bg-nexusBg border border-nexusBorder rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-nexusPrimary transition-colors">
                    </div>
                </div>
                <div class="space-y-1.5">
                    <label class="text-[11px] font-bold text-nexusMuted uppercase">Inquiry Type</label>
                    <select id="ticket-category" class="w-full bg-nexusBg border border-nexusBorder rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-nexusPrimary transition-colors">
                        <option value="store">Store / Donation Issue</option>
                        <option value="ban">Ban Appeal</option>
                        <option value="bug">Bug Report / Server Issue</option>
                        <option value="other">General Inquiry</option>
                    </select>
                </div>
                <div class="space-y-1.5">
                    <label class="text-[11px] font-bold text-nexusMuted uppercase">Message Description</label>
                    <textarea id="ticket-message" rows="4" required placeholder="Provide clear details regarding your request..." class="w-full bg-nexusBg border border-nexusBorder rounded-xl p-4 text-xs text-white focus:outline-none focus:border-nexusPrimary resize-none transition-colors"></textarea>
                </div>
                <button type="submit" id="ticket-submit-btn" data-magnetic class="w-full py-3.5 bg-nexusPrimary hover:bg-nexusHover disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>Submit Support Ticket</span>
                </button>
            </form>
        </div>
    `;
    initMagneticButtons();
}

// Sends the ticket to Discord via a webhook (set discordWebhookUrl in
// config.js). If no webhook is configured, the ticket still confirms
// locally so the form never dead-ends on the user.
async function submitTicket(e) {
    e.preventDefault();

    const name = document.getElementById("ticket-name").value.trim();
    const discordTag = document.getElementById("ticket-discord").value.trim();
    const category = document.getElementById("ticket-category").value;
    const message = document.getElementById("ticket-message").value.trim();

    const categoryLabels = {
        store: "Store / Donation Issue",
        ban: "Ban Appeal",
        bug: "Bug Report / Server Issue",
        other: "General Inquiry"
    };

    const btn = document.getElementById("ticket-submit-btn");
    if (btn) { btn.disabled = true; btn.querySelector("span").innerText = "Sending…"; }

    if (!CFG.discordWebhookUrl) {
        // No webhook configured — confirm locally rather than failing silently.
        showToast("Ticket received — (add a webhook URL in config.js to forward these to Discord)", "success");
        e.target.reset();
        if (btn) { btn.disabled = false; btn.querySelector("span").innerText = "Submit Support Ticket"; }
        return;
    }

    const payload = {
        embeds: [{
            title: "🎫 New Support Ticket",
            color: 3447003,
            fields: [
                { name: "Name", value: name || "—", inline: true },
                { name: "Discord", value: discordTag ? `@${discordTag.replace(/^@/, "")}` : "—", inline: true },
                { name: "Category", value: categoryLabels[category] || category, inline: true },
                { name: "Message", value: message || "—" }
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Nexus RolePlay — Support Center" }
        }]
    };

    try {
        const res = await fetch(CFG.discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok || res.status === 204) {
            showToast("Support ticket submitted — we'll be in touch shortly", "success");
            e.target.reset();
        } else {
            showToast("Couldn't reach Discord — please try again or use our Discord server directly", "error");
        }
    } catch (err) {
        showToast("Couldn't reach Discord — please try again or use our Discord server directly", "error");
    } finally {
        if (btn) { btn.disabled = false; btn.querySelector("span").innerText = "Submit Support Ticket"; }
    }
}
