/* =========================================================
   NEXUS ROLEPLAY — MAIN RUNTIME ENGINE (script.js)
   ========================================================= */

(() => {
"use strict";

const CFG = window.SERVER_CONFIG || {};
const I18N = window.NEXUS_I18N || { en: {} };
const LANGS = ["en", "af", "fr"];
const LANG_NAMES = { en: "English", af: "Afrikaans", fr: "Français" };
const LOCALES = { en: "en-ZA", af: "af-ZA", fr: "fr-FR" };
const REFRESH_SECONDS = 15;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// Storage can throw in private windows / sandboxed NUI — never let it break the page.
const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const session = {
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
};

/* ---------------------------------------------------------
   0. I18N HELPERS
--------------------------------------------------------- */
let lang = pickLanguage();

function pickLanguage() {
    const saved = store.get("nexus_lang");
    if (LANGS.includes(saved)) return saved;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return LANGS.includes(nav) ? nav : "en";
}

function fill(str, vars) {
    if (!vars || typeof str !== "string") return str;
    return str.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
}

// UI string from i18n.js
function t(key, vars) {
    const dict = I18N[lang] || {};
    const val = dict[key] ?? (I18N.en || {})[key] ?? key;
    return fill(val, vars);
}

// Config value: plain string or { en, af, fr }
function L(val, vars) {
    if (val == null) return "";
    const s = typeof val === "object" ? (val[lang] ?? val.en ?? "") : String(val);
    return fill(s, vars);
}

function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function highlight(text, q) {
    if (!q) return esc(text);
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    return String(text).split(re).map((part, i) => (i % 2 ? `<mark>${esc(part)}</mark>` : esc(part))).join("");
}

/* ---------------------------------------------------------
   1. ADDRESSES (IP only needs setting once, in config.js)
--------------------------------------------------------- */
const ADDR = (() => {
    const ip = `${CFG.serverIp}:${CFG.serverPort}`;
    const code = (CFG.cfxCode || "").trim();
    const display = code ? `cfx.re/join/${code}` : ip;
    return {
        ip,
        display,
        connectCmd: `connect ${display}`,
        // FiveM's registered protocol. The join code is preferred: this
        // server hides its IP behind Cfx, so a raw ip:port may not connect.
        fxLink: `fivem://connect/${display}`,
        webLink: code ? `https://cfx.re/join/${code}` : `fivem://connect/${ip}`
    };
})();

const vars = () => ({
    address: ADDR.display,
    connect: ADDR.connectCmd,
    n: REFRESH_SECONDS,
    staff: (CFG.staffMembers || []).length,
    max: status.max,
    year: new Date().getFullYear()
});

/* ---------------------------------------------------------
   2. BOOT
--------------------------------------------------------- */
let booted = false;

document.addEventListener("DOMContentLoaded", () => {
    fillStatic();
    applyI18n();
    renderAll();
    initGate();
    initNav();
    initSegments();
    initTheme();
    initCopy();
    initCommandPalette();
    initRulesUI();
    initLightbox();
    initTicketForm();
    initPlayerSearch();
    initPointerFx();
    initRotator();
    initReveal();
    initCounters();

    fetchServerStatus();
    startCountdown();
    booted = true;
});

function fillStatic() {
    $$("[data-addr]").forEach(el => (el.textContent = ADDR.display));
    $$("[data-connect-cmd]").forEach(el => (el.textContent = ADDR.connectCmd));
    $$("[data-connect-link]").forEach(el => (el.href = ADDR.fxLink));
    $$("[data-cfx-link]").forEach(el => (el.href = ADDR.webLink));
    $$("[data-discord-link]").forEach(el => (el.href = CFG.discordInvite || "#"));
    $$("[data-cfg]").forEach(el => (el.textContent = CFG[el.dataset.cfg] || "—"));
}

function applyI18n() {
    const v = vars();
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => {
        const s = t(el.dataset.i18n, v);
        if (typeof s === "string") el.textContent = s;
    });
    $$("[data-i18n-ph]").forEach(el => (el.placeholder = t(el.dataset.i18nPh)));
    $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    document.title = t("meta_title");
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta_desc"));
    $("#hero-team").textContent = t("hero_team", v);
}

function renderAll() {
    renderAnnouncement();
    renderMarquee();
    renderTeamStack();
    renderFeatures();
    renderRulesTabs();
    renderRules();
    renderMedia();
    renderUpdates();
    renderStaff();
    renderFaq();
    renderStatus();
    if ($("#cmdk").open) renderCommands();
}

function setLang(next) {
    if (!LANGS.includes(next) || next === lang) { syncSegments(); return; }
    lang = next;
    store.set("nexus_lang", lang);
    applyI18n();
    renderAll();
    revealInstantly();
    syncSegments();
    moveNavIndicator();
    resetRotator();
}

/* ---------------------------------------------------------
   3. ENTRY GATE
--------------------------------------------------------- */
function initGate() {
    const gate = $("#gate");
    const root = document.documentElement;
    if (!gate || root.classList.contains("no-gate")) {
        if (gate) gate.remove();
        startHero();
        return;
    }

    const enter = () => {
        if (gate.classList.contains("leaving")) return;
        gate.classList.add("leaving");
        root.classList.remove("gate-open");
        root.classList.add("gate-done");
        session.set("nx_entered", "1");
        document.removeEventListener("keydown", onKey);
        setTimeout(() => gate.remove(), 750);
        startHero();
    };
    const onKey = (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        if (e.target.closest && e.target.closest("[data-lang]")) return;
        e.preventDefault();
        enter();
    };

    gate.addEventListener("click", (e) => { if (!e.target.closest(".gate-lang")) enter(); });
    document.addEventListener("keydown", onKey);
    gate.focus({ preventScroll: true });
}

function startHero() {
    requestAnimationFrame(() => document.body.classList.add("hero-in"));
    syncSegments();
    moveNavIndicator();
}

/* ---------------------------------------------------------
   4. NAVBAR — glass on scroll, sliding active indicator,
      scroll progress, back-to-top, mobile sheet
--------------------------------------------------------- */
let activeNavLink = null;

function initNav() {
    const nav = $("#nav");
    const progress = $("#scroll-progress");
    const toTop = $("#to-top");
    const links = $$("#nav-links a");

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            nav.classList.toggle("scrolled", y > 8);
            progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            toTop.classList.toggle("show", y > 900);
            ticking = false;
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    // Hover moves the pill; leaving snaps it back to the active section.
    links.forEach(a => a.addEventListener("mouseenter", () => moveNavIndicator(a)));
    $("#nav-links").addEventListener("mouseleave", () => moveNavIndicator());

    const byId = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
    const sectionIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const link = byId.get(entry.target.id) || null;
            activeNavLink = link;
            links.forEach(a => a.classList.toggle("active", a === link));
            moveNavIndicator();
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section[id]").forEach(s => sectionIO.observe(s));

    window.addEventListener("resize", () => { moveNavIndicator(); syncSegments(); moveTabIndicator(); });

    // Mobile sheet
    const sheet = $("#sheet");
    const btn = $("#menu-btn");
    const setSheet = (open) => {
        sheet.classList.toggle("open", open);
        sheet.setAttribute("aria-hidden", String(!open));
        btn.setAttribute("aria-expanded", String(open));
        btn.innerHTML = `<i class="fa-solid ${open ? "fa-xmark" : "fa-bars"}"></i>`;
        if (open) requestAnimationFrame(syncSegments);
    };
    btn.addEventListener("click", () => setSheet(!sheet.classList.contains("open")));
    sheet.addEventListener("click", (e) => {
        if (e.target === sheet || e.target.closest("a")) setSheet(false);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setSheet(false); });
}

function moveNavIndicator(target) {
    const ind = $("#nav-indicator");
    if (!ind) return;
    const el = target || activeNavLink;
    if (!el || !el.offsetWidth) { ind.style.opacity = "0"; return; }
    ind.style.opacity = "1";
    ind.style.width = `${el.offsetWidth}px`;
    ind.style.transform = `translateX(${el.offsetLeft}px)`;
}

/* ---------------------------------------------------------
   5. LANGUAGE SEGMENTS + THEME
--------------------------------------------------------- */
function initSegments() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-lang]");
        if (!btn) return;
        e.stopPropagation();
        setLang(btn.dataset.lang);
    });
    syncSegments();
}

function syncSegments() {
    $$("[data-lang]").forEach(b => {
        const on = b.dataset.lang === lang;
        b.classList.toggle("active", on);
        b.setAttribute("aria-checked", String(on));
    });
    $$(".seg").forEach(seg => {
        const pill = $(".seg-pill", seg);
        const active = $("button.active", seg);
        if (!pill || !active || !active.offsetWidth) return;
        pill.style.width = `${active.offsetWidth}px`;
        pill.style.transform = `translateX(${active.offsetLeft}px)`;
    });
}

function initTheme() {
    $$("[data-theme-toggle]").forEach(b => b.addEventListener("click", toggleTheme));
    updateThemeColor();
}

function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    store.set("nexus_theme", next);
    updateThemeColor();
}

function updateThemeColor() {
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
}

/* ---------------------------------------------------------
   6. CLIPBOARD + TOASTS
--------------------------------------------------------- */
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {
        // Fallback for NUI / non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand("copy"); } catch (err) {}
        ta.remove();
        return ok;
    }
}

// Opens FiveM via its protocol. Browsers can't report whether that
// worked, so always offer the cfx.re join page as a fallback.
function launchFiveM() {
    location.href = ADDR.fxLink;
    showLaunchHint();
}

function showLaunchHint() {
    toast(t("toast_launching"), "info", { href: ADDR.webLink, label: t("toast_launch_alt") });
}

function initCopy() {
    document.addEventListener("click", async (e) => {
        if (e.target.closest("[data-connect-link]")) {
            showLaunchHint();
            return;
        }
        const btn = e.target.closest("[data-copy-connect]");
        if (btn) {
            const ok = await copyText(ADDR.connectCmd);
            toast(ok ? `${t("toast_copied")} — ${ADDR.connectCmd}` : t("toast_copy_fail"), ok ? "success" : "error");
            if (ok) {
                btn.classList.add("copied");
                const icon = $(".connect-chip-icon i", btn);
                if (icon) icon.className = "fa-solid fa-check";
                setTimeout(() => {
                    btn.classList.remove("copied");
                    if (icon) icon.className = "fa-regular fa-copy";
                }, 1800);
            }
            return;
        }
        const d = e.target.closest("[data-copy-discord]");
        if (d) {
            const name = d.dataset.copyDiscord;
            const ok = await copyText(name);
            toast(ok ? t("toast_copied_discord", { name }) : t("toast_copy_fail"), ok ? "success" : "error");
        }
    });
}

function toast(message, type = "success", action) {
    const host = $("#toaster");
    if (!host) return;
    const icons = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info" };
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><div class="toast-body"><span>${esc(message)}</span>${
        action ? `<a class="toast-action" href="${esc(action.href)}" target="_blank" rel="noopener">${esc(action.label)} →</a>` : ""
    }</div>`;
    host.appendChild(el);
    while (host.children.length > 3) host.firstElementChild.remove();
    setTimeout(() => {
        el.classList.add("leaving");
        setTimeout(() => el.remove(), 300);
    }, action ? 6000 : 3600);
}

/* ---------------------------------------------------------
   7. HERO — announcement, team stack, split + rotating text
--------------------------------------------------------- */
function renderAnnouncement() {
    const latest = (CFG.devLogs || []).find(l => l.latest) || (CFG.devLogs || [])[0];
    const a = $("#announce");
    if (!latest) { a.hidden = true; return; }
    $("#announce-text").textContent = `${latest.version ? latest.version + " · " : ""}${L(latest.title)}`;
}

function renderTeamStack() {
    const staff = (CFG.staffMembers || []).slice(0, 5);
    $("#team-stack").innerHTML = staff.map(s => s.avatar
        ? `<img src="${esc(s.avatar)}" alt="" loading="lazy" data-fallback="${esc(s.name.charAt(0))}">`
        : `<span>${esc(s.name.charAt(0))}</span>`).join("");
}

function splitHeroName() {
    const el = $("#hero-name");
    if (!el || el.dataset.split) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(" ");
    el.dataset.split = "1";
}

let rotIndex = 0;
let rotTimer = null;

function initRotator() {
    splitHeroName();
    showRotatorWord(true);
    rotTimer = setInterval(() => showRotatorWord(false), 3200);
}

function resetRotator() {
    rotIndex = 0;
    const el = $("#rotator");
    if (el) el.innerHTML = "";
    showRotatorWord(true);
}

function showRotatorWord(first) {
    const el = $("#rotator");
    if (!el) return;
    const words = [].concat(t("hero_rotate"));
    if (!first) rotIndex = (rotIndex + 1) % words.length;
    const phrase = words[rotIndex % words.length] || "";

    const next = document.createElement("span");
    next.className = "rot-word";
    if (first) next.style.setProperty("--rot-base", "450ms");
    let n = 0;
    next.innerHTML = phrase.split(" ").map(word =>
        `<span class="wg">${Array.from(word).map(ch => `<span class="rot-char" style="--cd:${(n++) * 24}ms">${esc(ch)}</span>`).join("")}</span>`
    ).join(" ");

    const old = $(".rot-word.current", el);
    if (old) {
        old.classList.remove("current");
        old.classList.add("out");
        setTimeout(() => old.remove(), 700);
    }
    el.appendChild(next);
    // Characters stay hidden until body.hero-in (see style.css), so the
    // first phrase animates in when the entry gate closes.
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add("current")));
}

function renderMarquee() {
    const items = (CFG.highlights || []).map(h => `<span class="marquee-item">${esc(L(h))}<i class="fa-solid fa-circle"></i></span>`).join("");
    // Duplicated so the -50% loop is seamless
    $("#marquee-track").innerHTML = items + items + items + items;
}

/* ---------------------------------------------------------
   8. FEATURES (bento)
--------------------------------------------------------- */
function featureVisual(kind) {
    if (kind === "bank") {
        const bars = [38, 52, 44, 66, 58, 74, 63, 88, 80, 100];
        return `<div class="feature-visual fv-bank" aria-hidden="true">
            <div class="fv-bank-head"><span>Nexus Bank</span><strong>$ 48,250</strong></div>
            <div class="fv-bars">${bars.map((h, i) => `<span style="height:${h}%;animation-delay:${i * -0.35}s"></span>`).join("")}</div>
        </div>`;
    }
    if (kind === "voice") {
        return `<div class="feature-visual fv-voice" aria-hidden="true">
            <span class="fv-voice-chip">RADIO · CH 1</span>
            ${Array.from({ length: 28 }, (_, i) => `<span style="--i:${(i * 7) % 13}"></span>`).join("")}
        </div>`;
    }
    if (kind === "region") {
        return `<div class="feature-visual fv-region" aria-hidden="true">
            <span class="pulse"></span><span class="pulse"></span><span class="pulse"></span>
            <svg class="flag"><use href="#flag-za"/></svg>
            <span class="fv-region-label">JHB · ZA</span>
        </div>`;
    }
    return "";
}

function renderFeatures() {
    $("#features-grid").innerHTML = (CFG.features || []).map((f, i) => `
        <article class="card feature spotlight ${f.span === 2 ? "span-2" : ""}" data-reveal style="--d:${(i % 3) * 80}ms">
            <div class="feature-body">
                <span class="feature-icon"><i class="fa-solid ${esc(f.icon)}"></i></span>
                <h3>${esc(L(f.title))}</h3>
                <p>${esc(L(f.desc))}</p>
            </div>
            ${f.span === 2 ? featureVisual(f.visual) : ""}
        </article>`).join("");
}

/* ---------------------------------------------------------
   9. LIVE SERVER STATUS
   Set serverIp / serverPort (and optionally cfxCode) in
   config.js and everything below resolves itself:
     1) If a cfxCode is set, ask the Cfx.re master list.
     2) Otherwise (or if that fails), query the server directly
        via the dynamic.json endpoint FiveM servers expose.
   If neither responds, the UI honestly shows offline rather
   than faking numbers. The master list only refreshes on the
   server's ~30-45s heartbeat, so 15s polling is the ceiling.
--------------------------------------------------------- */
const status = {
    state: "loading",
    players: 0,
    max: CFG.maxPlayers || 0,
    list: null,       // null = names not available
    history: []
};
let countdown = REFRESH_SECONDS;
let fetching = false;

function stripColors(s) {
    return String(s || "").replace(/\^\d/g, "").replace(/~[a-zA-Z]~/g, "").trim();
}

async function fetchServerStatus() {
    if (fetching) return;
    fetching = true;
    try {
        const result = await queryServer();
        Object.assign(status, result);
        if (result.state === "online") {
            status.history.push(result.players);
            if (status.history.length > 40) status.history.shift();
        }
    } finally {
        fetching = false;
        renderStatus();
    }
}

async function queryServer() {
    const offline = { state: "offline", players: 0, list: null };

    if (location.protocol === "file:") {
        console.warn("[Nexus Status] Opened via file:// — browsers block fetch() here. Serve over http(s) or FiveM NUI.");
        return offline;
    }

    const lookupKey = (CFG.cfxCode || "").trim() || ADDR.ip;
    try {
        const res = await fetch(`https://frontend.cfx-services.net/api/servers/single/${encodeURIComponent(lookupKey)}`, { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            const d = json && json.Data;
            if (d) {
                return {
                    state: "online",
                    players: d.clients ?? 0,
                    max: d.sv_maxclients ?? CFG.maxPlayers,
                    list: Array.isArray(d.players) && d.players.length ? d.players.map(p => ({ name: stripColors(p.name), ping: p.ping })) : (d.clients ? null : [])
                };
            }
            console.warn(`[Nexus Status] Cfx.re has no record for "${lookupKey}". Check cfxCode/serverIp in config.js.`);
        } else {
            console.warn(`[Nexus Status] Cfx.re master list returned HTTP ${res.status}.`);
        }
    } catch (e) {
        console.warn("[Nexus Status] Cfx.re master list request failed:", e);
    }

    // Direct query — works over plain HTTP or in-game NUI; blocked by
    // mixed-content rules on https pages, which is expected.
    try {
        const [dyn, players] = await Promise.all([
            fetch(`http://${ADDR.ip}/dynamic.json`, { cache: "no-store" }),
            fetch(`http://${ADDR.ip}/players.json`, { cache: "no-store" }).catch(() => null)
        ]);
        if (dyn.ok) {
            const json = await dyn.json();
            let list = null;
            if (players && players.ok) {
                const arr = await players.json().catch(() => null);
                if (Array.isArray(arr)) list = arr.map(p => ({ name: stripColors(p.name), ping: p.ping }));
            }
            return { state: "online", players: json.clients ?? 0, max: json.sv_maxclients ?? CFG.maxPlayers, list };
        }
    } catch (e) {
        console.warn(`[Nexus Status] Direct query to ${ADDR.ip} failed (often CORS / mixed content):`, e);
    }
    return offline;
}

function renderStatus() {
    const { state, players, max } = status;
    const online = state === "online";
    const stateClass = `is-${state}`;
    const pct = online && max ? Math.min(100, Math.round((players / max) * 100)) : 0;
    const pillText = online ? t("status_online") : state === "offline" ? t("status_offline") : t("status_checking");

    $$("[data-st-pill]").forEach(el => (el.className = `status-pill ${stateClass}`));
    $$("[data-st-pill-text]").forEach(el => (el.textContent = pillText));
    $$("[data-st-state]").forEach(el => (el.className = `stat-card-value ${stateClass}`));
    $$("[data-st-state-sub]").forEach(el => (el.textContent = online ? t("st_state_on") : state === "offline" ? t("st_state_off") : t("st_state_wait")));
    $$("[data-st-players]").forEach(el => {
        if (state === "loading") { el.textContent = "--"; return; }
        countUp(el, online ? players : 0, { duration: 900, fromCurrent: true });
    });
    $$("[data-st-max]").forEach(el => (el.textContent = state === "loading" ? "--" : (max || "--")));
    $$("[data-st-players-sub]").forEach(el => (el.textContent = t("st_players_sub", { max: max || "--" })));
    $$("[data-st-pct]").forEach(el => (el.textContent = `${pct}%`));
    $$("[data-st-bar]").forEach(el => (el.style.width = `${pct}%`));

    $$("[data-spark]").forEach(el => drawSpark(el, status.history, max, online));
    renderPlayerList();
}

function drawSpark(el, data, max, online) {
    const W = 300, H = 64, PAD = 6;
    const pts = data.length ? (data.length === 1 ? [data[0], data[0]] : data) : [0, 0];
    const top = Math.max(1, max || 0, ...pts);
    const step = W / (pts.length - 1);
    const coords = pts.map((v, i) => [i * step, H - PAD - (v / top) * (H - PAD * 2)]);
    const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    $(".spark-line", el).setAttribute("d", line);
    $(".spark-area", el).setAttribute("d", `${line} L${W} ${H} L0 ${H} Z`);
    const [lx, ly] = coords[coords.length - 1];
    const dot = $(".spark-dot", el);
    dot.style.left = `${(lx / W) * 100}%`;
    dot.style.top = `${(ly / H) * 100}%`;
    dot.style.display = online ? "" : "none";
    el.classList.toggle("is-offline-spark", status.state === "offline");
}

let playerQuery = "";

function initPlayerSearch() {
    $("#player-search").addEventListener("input", (e) => {
        playerQuery = e.target.value.trim();
        renderPlayerList();
    });
}

function renderPlayerList() {
    const host = $("#player-list");
    if (!host) return;
    const empty = (icon, msg) => `<li class="list-empty"><i class="fa-solid ${icon}"></i>${esc(msg)}</li>`;

    if (status.state === "loading") {
        host.innerHTML = Array.from({ length: 6 }, () => `<li class="skeleton"></li>`).join("");
        return;
    }
    if (status.state === "offline") { host.innerHTML = empty("fa-plug-circle-xmark", t("players_offline")); return; }
    if (status.list === null) { host.innerHTML = empty("fa-user-secret", t("players_hidden")); return; }
    if (!status.list.length) { host.innerHTML = empty("fa-moon", t("players_empty")); return; }

    const q = playerQuery.toLowerCase();
    const list = status.list
        .filter(p => !q || p.name.toLowerCase().includes(q))
        .sort((a, b) => a.name.localeCompare(b.name));
    if (!list.length) { host.innerHTML = empty("fa-magnifying-glass", t("players_nomatch", { q: playerQuery })); return; }

    host.innerHTML = list.map(p => {
        const ping = Number(p.ping) || 0;
        const tier = ping < 80 ? "good" : ping < 160 ? "mid" : "bad";
        return `<li class="player">
            <span class="player-av">${esc((p.name || "?").charAt(0).toUpperCase())}</span>
            <span class="player-name">${highlight(p.name || "—", playerQuery)}</span>
            ${ping ? `<span class="player-ping ${tier}">${ping}ms</span>` : ""}
        </li>`;
    }).join("");
}

function startCountdown() {
    const ring = $("#ring-fg");
    const num = $("#countdown");
    const C = 100.53;
    const paint = () => {
        num.textContent = countdown;
        ring.style.strokeDashoffset = String(C - (countdown / REFRESH_SECONDS) * C);
    };
    paint();
    setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            countdown = REFRESH_SECONDS;
            fetchServerStatus();
        }
        paint();
    }, 1000);

    // Refresh the moment someone tabs back in rather than showing stale data.
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            countdown = REFRESH_SECONDS;
            fetchServerStatus();
            paint();
        }
    });

    $("#refresh-btn").addEventListener("click", () => {
        countdown = REFRESH_SECONDS;
        paint();
        const icon = $("#refresh-icon");
        icon.classList.remove("spin");
        void icon.offsetWidth;
        icon.classList.add("spin");
        fetchServerStatus();
    });
}

/* ---------------------------------------------------------
   10. COUNT UP (React Bits "CountUp")
--------------------------------------------------------- */
function countUp(el, to, { duration = 1400, fromCurrent = false } = {}) {
    const from = fromCurrent ? Number(el.dataset.value || 0) : 0;
    el.dataset.value = to;
    if (reduceMotion || from === to) { el.textContent = to; return; }
    const start = performance.now();
    const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function initCounters() {
    const values = {
        staff: (CFG.staffMembers || []).length,
        updates: (CFG.devLogs || []).length
    };
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            countUp(entry.target, values[entry.target.dataset.count] || 0);
            io.unobserve(entry.target);
        });
    }, { threshold: .6 });
    $$("[data-count]").forEach(el => io.observe(el));
}

/* ---------------------------------------------------------
   11. RULES — sliding tabs, search with highlight
--------------------------------------------------------- */
let rulesCat = "0"; // first category; "all" is one tab away
let rulesQuery = "";

function renderRulesTabs() {
    const host = $("#rules-tabs");
    const cats = CFG.rulesData || [];
    const total = cats.reduce((n, c) => n + c.rules.length, 0);
    const tabs = [{ key: "all", label: t("rules_all"), icon: "fa-layer-group", count: total }]
        .concat(cats.map((c, i) => ({ key: String(i), label: L(c.category), icon: c.icon, count: c.rules.length })));

    $$(".tab", host).forEach(el => el.remove());
    host.insertAdjacentHTML("beforeend", tabs.map(tab => `
        <button type="button" class="tab ${tab.key === rulesCat ? "active" : ""}" role="tab" aria-selected="${tab.key === rulesCat}" data-cat="${tab.key}">
            <i class="fa-solid ${esc(tab.icon)}"></i>${esc(tab.label)}<span class="tab-count">${tab.count}</span>
        </button>`).join(""));
    requestAnimationFrame(moveTabIndicator);
}

function moveTabIndicator() {
    const ind = $("#tab-indicator");
    const active = $("#rules-tabs .tab.active");
    if (!ind || !active || !active.offsetWidth) return;
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.transform = `translateX(${active.offsetLeft}px)`;
}

function renderRules(animate = false) {
    const grid = $("#rules-grid");
    const q = rulesQuery.toLowerCase();
    const cards = [];
    (CFG.rulesData || []).forEach((cat, ci) => {
        if (rulesCat !== "all" && String(ci) !== rulesCat) return;
        cat.rules.forEach(rule => {
            const title = L(rule.title);
            const desc = L(rule.desc);
            if (q && !`${rule.id} ${title} ${desc}`.toLowerCase().includes(q)) return;
            cards.push({ rule, title, desc, cat: L(cat.category), icon: cat.icon });
        });
    });

    if (!cards.length) {
        grid.innerHTML = `<div class="list-empty"><i class="fa-solid fa-magnifying-glass"></i>${esc(t("rules_none", { q: rulesQuery }))}</div>`;
        return;
    }
    grid.innerHTML = cards.map((c, i) => `
        <article class="card rule spotlight ${animate ? "rule-enter" : ""}" ${animate ? `style="--d:${Math.min(i, 12) * 30}ms"` : ""}>
            <div class="rule-head">
                <span class="rule-id">${highlight(c.rule.id, rulesQuery)}</span>
                <span class="rule-cat"><i class="fa-solid ${esc(c.icon)}"></i>${esc(c.cat)}</span>
            </div>
            <h3>${highlight(c.title, rulesQuery)}</h3>
            <p>${highlight(c.desc, rulesQuery)}</p>
        </article>`).join("");
}

function initRulesUI() {
    const tabs = $("#rules-tabs");
    tabs.addEventListener("click", (e) => {
        const tab = e.target.closest(".tab");
        if (!tab || tab.dataset.cat === rulesCat) return;
        rulesCat = tab.dataset.cat;
        $$(".tab", tabs).forEach(b => {
            const on = b === tab;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", String(on));
        });
        moveTabIndicator();
        tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
        renderRules(true);
    });
    tabs.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const all = $$(".tab", tabs);
        const i = all.findIndex(b => b.classList.contains("active"));
        const next = all[(i + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length];
        next.focus();
        next.click();
    });

    let timer;
    $("#rules-search").addEventListener("input", (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            rulesQuery = e.target.value.trim();
            // Searching always covers every category
            if (rulesQuery && rulesCat !== "all") {
                rulesCat = "all";
                $$(".tab", tabs).forEach(b => {
                    const on = b.dataset.cat === "all";
                    b.classList.toggle("active", on);
                    b.setAttribute("aria-selected", String(on));
                });
                moveTabIndicator();
            }
            renderRules(true);
        }, 120);
    });
}

/* ---------------------------------------------------------
   12. MEDIA + LIGHTBOX
--------------------------------------------------------- */
let lbIndex = 0;

function renderMedia() {
    $("#media-grid").innerHTML = (CFG.media || []).map((m, i) => `
        <button type="button" class="media-card" data-reveal style="--d:${i * 90}ms" data-media="${i}" aria-label="${esc(L(m.title))}">
            ${m.image ? `<img src="${esc(m.image)}" alt="${esc(L(m.title))}" loading="lazy" data-hide-on-error>` : ""}
            <span class="media-tag">${esc(L(m.tag))}</span>
            <span class="media-zoom"><i class="fa-solid fa-expand"></i></span>
            <span class="media-info"><strong>${esc(L(m.title))}</strong><span>${esc(L(m.desc))}</span></span>
        </button>`).join("");
}

function initLightbox() {
    const dlg = $("#lightbox");
    const items = () => (CFG.media || []).filter(m => m.image);

    const show = (i) => {
        const list = items();
        if (!list.length) return;
        lbIndex = (i + list.length) % list.length;
        const m = list[lbIndex];
        const img = $("#lb-img");
        img.style.animation = "none";
        void img.offsetWidth;
        img.style.animation = "";
        img.src = m.image;
        img.alt = L(m.title);
        $("#lb-title").textContent = L(m.title);
        $("#lb-desc").textContent = L(m.desc);
        $("#lb-count").textContent = `${lbIndex + 1} / ${list.length}`;
        $$(".lb-nav", dlg).forEach(b => (b.hidden = list.length < 2));
    };

    $("#media-grid").addEventListener("click", (e) => {
        const card = e.target.closest("[data-media]");
        if (!card) return;
        const m = CFG.media[Number(card.dataset.media)];
        if (!m || !m.image) return;
        show(items().indexOf(m));
        openDialog(dlg);
    });
    dlg.addEventListener("click", (e) => {
        const act = e.target.closest("[data-lb]");
        if (act) {
            if (act.dataset.lb === "close") dlg.close();
            else show(lbIndex + (act.dataset.lb === "next" ? 1 : -1));
            return;
        }
        if (e.target === dlg || e.target.tagName === "FIGURE") dlg.close();
    });
    dlg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") show(lbIndex + 1);
        if (e.key === "ArrowLeft") show(lbIndex - 1);
    });
}

function openDialog(dlg) {
    if (dlg.open) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
}

/* ---------------------------------------------------------
   13. UPDATES TIMELINE
--------------------------------------------------------- */
let updatesExpanded = false;
const UPDATES_PREVIEW = 4;

function formatMonth(ym) {
    const [y, m] = String(ym || "").split("-").map(Number);
    if (!y || !m) return String(ym || "");
    try {
        return new Intl.DateTimeFormat(LOCALES[lang], { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
    } catch (e) {
        return ym;
    }
}

function renderUpdates() {
    const logs = CFG.devLogs || [];
    const shown = updatesExpanded ? logs : logs.slice(0, UPDATES_PREVIEW);
    $("#timeline").innerHTML = shown.map((log, i) => `
        <li class="tl-item ${log.latest ? "latest" : ""}" data-reveal style="--d:${Math.min(i, 4) * 70}ms">
            <span class="tl-dot"></span>
            <article class="card tl-card spotlight">
                <div class="tl-meta">
                    ${log.version ? `<span class="tl-ver">${esc(log.version)}</span>` : ""}
                    <span class="tl-type ${log.type === "release" ? "release" : ""}">${esc(t(log.type === "release" ? "updates_release" : "updates_patch"))}</span>
                    <time>${esc(formatMonth(log.date))}</time>
                    ${log.latest ? `<span class="tl-latest">${esc(t("updates_latest"))}</span>` : ""}
                </div>
                <h3>${esc(L(log.title))}</h3>
                <p>${esc(L(log.desc))}</p>
            </article>
        </li>`).join("");

    const toggle = $("#timeline-toggle");
    toggle.hidden = logs.length <= UPDATES_PREVIEW;
    toggle.innerHTML = `<i class="fa-solid ${updatesExpanded ? "fa-chevron-up" : "fa-chevron-down"}"></i><span>${esc(t(updatesExpanded ? "updates_less" : "updates_more"))}</span>`;
    if (!toggle.dataset.bound) {
        toggle.dataset.bound = "1";
        toggle.addEventListener("click", () => {
            updatesExpanded = !updatesExpanded;
            renderUpdates();
            observeReveal($("#timeline"));
            if (!updatesExpanded) $("#updates").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        });
    }
}

/* ---------------------------------------------------------
   14. STAFF (tilt + spotlight)
--------------------------------------------------------- */
function renderStaff() {
    const grid = $("#staff-grid");
    grid.innerHTML = (CFG.staffMembers || []).map((s, i) => `
        <article class="card staff spotlight tilt tier-${esc(s.tier || "admin")}" data-reveal style="--d:${(i % 4) * 70}ms">
            <div class="staff-top">
                <div class="staff-av">${s.avatar
                    ? `<img src="${esc(s.avatar)}" alt="${esc(s.name)}" loading="lazy" data-fallback="${esc(s.name.charAt(0))}">`
                    : esc(s.name.charAt(0))}</div>
                <div>
                    <h3 class="staff-name">${esc(s.name)}</h3>
                    <span class="badge">${esc(L(s.role))}</span>
                </div>
            </div>
            <p>${esc(L(s.bio))}</p>
            ${s.discord ? `<button type="button" class="staff-discord" data-copy-discord="${esc(s.discord)}" title="${esc(t("staff_copy"))}" aria-label="${esc(t("staff_copy"))}: ${esc(s.discord)}">
                <span><i class="fa-brands fa-discord"></i>@${esc(s.discord)}</span><i class="fa-regular fa-copy"></i>
            </button>` : ""}
        </article>`).join("");
    bindTilt(grid);
}

function bindTilt(root) {
    if (!finePointer || reduceMotion) return;
    $$(".tilt", root).forEach(card => {
        card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            card.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateZ(0)`;
        });
        card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
}

/* ---------------------------------------------------------
   15. FAQ ACCORDION
--------------------------------------------------------- */
function renderFaq() {
    const host = $("#faq-list");
    const openIdx = $$(".acc-item", host).findIndex(el => el.classList.contains("open"));
    const v = vars();
    host.innerHTML = (CFG.faq || []).map((f, i) => {
        const id = `faq-${i}`;
        const open = i === (openIdx === -1 ? 0 : openIdx);
        // Render the connect command as inline code
        const answer = esc(L(f.a, v)).replace(esc(ADDR.connectCmd), `<code>${esc(ADDR.connectCmd)}</code>`);
        return `<div class="acc-item ${open ? "open" : ""}">
            <button type="button" class="acc-trigger" aria-expanded="${open}" aria-controls="${id}">
                <span>${esc(L(f.q))}</span><i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="acc-panel" id="${id}" role="region"><div class="acc-inner"><p>${answer}</p></div></div>
        </div>`;
    }).join("");

    if (!host.dataset.bound) {
        host.dataset.bound = "1";
        host.addEventListener("click", (e) => {
            const trig = e.target.closest(".acc-trigger");
            if (!trig) return;
            const item = trig.parentElement;
            const willOpen = !item.classList.contains("open");
            $$(".acc-item", host).forEach(it => {
                it.classList.remove("open");
                $(".acc-trigger", it).setAttribute("aria-expanded", "false");
            });
            if (willOpen) {
                item.classList.add("open");
                trig.setAttribute("aria-expanded", "true");
            }
        });
    }
}

/* ---------------------------------------------------------
   16. SUPPORT TICKETS
   Posts to CFG.ticketEndpoint (api/ticket.js on Vercel), which
   forwards to Discord using a webhook kept secret server-side.
--------------------------------------------------------- */
function initTicketForm() {
    const form = $("#ticket-form");
    const msg = form.elements.message;
    const counter = $("#msg-counter");
    const max = Number(msg.getAttribute("maxlength")) || 1500;

    const updateCounter = () => {
        counter.textContent = `${msg.value.length} / ${max}`;
        counter.classList.toggle("warn", msg.value.length > max * .9);
    };
    msg.addEventListener("input", updateCounter);
    updateCounter();

    form.addEventListener("input", (e) => {
        const field = e.target.closest(".field");
        if (field) field.classList.remove("invalid");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            name: form.elements.name.value.trim(),
            discord: form.elements.discord.value.trim().replace(/^@/, ""),
            category: form.elements.category.value,
            message: msg.value.trim(),
            website: form.elements.website.value,
            lang
        };

        let firstBad = null;
        [["name", data.name.length > 0], ["discord", data.discord.length > 0], ["message", data.message.length >= 10]].forEach(([k, ok]) => {
            const field = form.elements[k].closest(".field");
            field.classList.toggle("invalid", !ok);
            if (!ok && !firstBad) firstBad = form.elements[k];
        });
        if (firstBad) {
            firstBad.focus();
            if (firstBad === msg && data.message.length) toast(t("form_min"), "error");
            return;
        }

        const discordAction = CFG.discordInvite ? { href: CFG.discordInvite, label: "Discord" } : null;
        if (!CFG.ticketEndpoint) {
            toast(t("toast_ticket_off"), "info", discordAction);
            return;
        }

        const btn = $("#ticket-submit");
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner"></span><span>${esc(t("form_sending"))}</span>`;

        try {
            const res = await fetch(CFG.ticketEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                toast(t("toast_ticket_ok"), "success");
                form.reset();
                updateCounter();
            } else if (res.status === 429) {
                toast(t("toast_ticket_rate"), "error");
            } else if (res.status === 503) {
                toast(t("toast_ticket_off"), "info", discordAction);
            } else {
                toast(t("toast_ticket_err"), "error", discordAction);
            }
        } catch (err) {
            toast(t("toast_ticket_err"), "error", discordAction);
        } finally {
            btn.disabled = false;
            btn.innerHTML = original;
            // Restore the label in the current language
            const label = $("[data-i18n]", btn);
            if (label) label.textContent = t(label.dataset.i18n);
        }
    });
}

/* ---------------------------------------------------------
   17. COMMAND PALETTE (Ctrl/⌘ + K)
--------------------------------------------------------- */
let cmdSel = 0;
let cmdItems = [];

function commandList() {
    const nav = [
        ["home", "nav_home", "fa-house"], ["features", "nav_features", "fa-star"], ["join", "nav_join", "fa-right-to-bracket"],
        ["status", "nav_status", "fa-signal"], ["rules", "nav_rules", "fa-scale-balanced"], ["media", "nav_media", "fa-images"],
        ["updates", "nav_updates", "fa-code-branch"], ["staff", "nav_staff", "fa-user-shield"], ["faq", "nav_faq", "fa-circle-question"],
        ["support", "nav_support", "fa-headset"]
    ].map(([id, key, icon]) => ({
        group: t("cmd_nav"), icon: `fa-solid ${icon}`, label: t(key),
        run: () => $(`#${id}`).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
    }));

    const actions = [
        { icon: "fa-solid fa-play", label: t("cmd_connect"), run: launchFiveM },
        { icon: "fa-regular fa-copy", label: t("cmd_copy"), hint: ADDR.display, run: async () => {
            const ok = await copyText(ADDR.connectCmd);
            toast(ok ? `${t("toast_copied")} — ${ADDR.connectCmd}` : t("toast_copy_fail"), ok ? "success" : "error");
        } },
        { icon: "fa-brands fa-discord", label: t("cmd_discord"), run: () => window.open(CFG.discordInvite, "_blank", "noopener") },
        { icon: "fa-solid fa-circle-half-stroke", label: t("cmd_theme"), run: toggleTheme }
    ].map(a => ({ group: t("cmd_actions"), ...a }));

    const langs = LANGS.map(l => ({
        group: t("cmd_lang"), icon: "fa-solid fa-language", label: LANG_NAMES[l],
        hint: l === lang ? "✓" : l.toUpperCase(), run: () => setLang(l)
    }));

    return nav.concat(actions, langs);
}

function renderCommands() {
    const list = $("#cmdk-list");
    const q = $("#cmdk-input").value.trim().toLowerCase();
    cmdItems = commandList().filter(c => !q || `${c.label} ${c.group} ${c.hint || ""}`.toLowerCase().includes(q));
    cmdSel = Math.min(cmdSel, Math.max(0, cmdItems.length - 1));

    if (!cmdItems.length) {
        list.innerHTML = `<div class="cmdk-empty">${esc(t("cmd_empty"))}</div>`;
        return;
    }
    let html = "";
    let group = "";
    cmdItems.forEach((c, i) => {
        if (c.group !== group) { group = c.group; html += `<div class="cmdk-group">${esc(group)}</div>`; }
        html += `<button type="button" class="cmdk-item ${i === cmdSel ? "selected" : ""}" role="option" aria-selected="${i === cmdSel}" data-i="${i}">
            <i class="${c.icon}"></i><span>${highlight(c.label, q)}</span>${c.hint ? `<span class="hint">${esc(c.hint)}</span>` : ""}
        </button>`;
    });
    list.innerHTML = html;
    const sel = $(".cmdk-item.selected", list);
    if (sel) sel.scrollIntoView({ block: "nearest" });
}

function initCommandPalette() {
    const dlg = $("#cmdk");
    const input = $("#cmdk-input");

    const open = () => {
        input.value = "";
        cmdSel = 0;
        renderCommands();
        openDialog(dlg);
        input.focus();
    };
    const run = (i) => {
        const c = cmdItems[i];
        if (!c) return;
        dlg.close();
        c.run();
    };

    $$("[data-open-cmdk]").forEach(b => b.addEventListener("click", () => {
        $("#sheet").classList.remove("open");
        open();
    }));
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            dlg.open ? dlg.close() : open();
        } else if (e.key === "/" && !dlg.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.documentElement.classList.contains("gate-open")) {
            e.preventDefault();
            open();
        }
    });
    input.addEventListener("input", () => { cmdSel = 0; renderCommands(); });
    input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); cmdSel = (cmdSel + 1) % Math.max(1, cmdItems.length); renderCommands(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); cmdSel = (cmdSel - 1 + cmdItems.length) % Math.max(1, cmdItems.length); renderCommands(); }
        else if (e.key === "Enter") { e.preventDefault(); run(cmdSel); }
    });
    $("#cmdk-list").addEventListener("click", (e) => {
        const item = e.target.closest(".cmdk-item");
        if (item) run(Number(item.dataset.i));
    });
    $("#cmdk-list").addEventListener("mousemove", (e) => {
        const item = e.target.closest(".cmdk-item");
        if (!item || Number(item.dataset.i) === cmdSel) return;
        cmdSel = Number(item.dataset.i);
        $$(".cmdk-item", dlg).forEach(b => b.classList.toggle("selected", b === item));
    });
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

/* ---------------------------------------------------------
   18. POINTER FX — spotlight cards, magnetic buttons,
       image fallbacks
--------------------------------------------------------- */
function initPointerFx() {
    // Spotlight: one delegated listener for every .spotlight card
    if (finePointer) {
        document.addEventListener("pointermove", (e) => {
            const card = e.target.closest && e.target.closest(".spotlight");
            if (!card) return;
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - r.left}px`);
            card.style.setProperty("--my", `${e.clientY - r.top}px`);
        }, { passive: true });
    }

    // Magnetic buttons
    if (finePointer && !reduceMotion) {
        $$("[data-magnetic]").forEach(btn => {
            btn.addEventListener("pointermove", (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * .15}px, ${y * .25}px)`;
            });
            btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
        });
    }

    // Broken image → initial badge (avatars) or hidden (media)
    document.addEventListener("error", (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement)) return;
        if (img.hasAttribute("data-fallback")) {
            const span = document.createElement("span");
            span.textContent = img.dataset.fallback;
            img.replaceWith(span);
        } else if (img.hasAttribute("data-hide-on-error")) {
            img.remove();
        }
    }, true);
}

/* ---------------------------------------------------------
   19. SCROLL REVEAL (blur-fade)
--------------------------------------------------------- */
let revealIO = null;

function initReveal() {
    if (!("IntersectionObserver" in window) || reduceMotion) {
        $$("[data-reveal]").forEach(el => el.classList.add("in"));
        return;
    }
    revealIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            revealIO.unobserve(entry.target);
        });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    observeReveal(document);
}

function observeReveal(root) {
    if (!revealIO) { $$("[data-reveal]", root).forEach(el => el.classList.add("in")); return; }
    $$("[data-reveal]:not(.in)", root).forEach(el => revealIO.observe(el));
}

// After a language switch, re-rendered content shouldn't fade in again.
function revealInstantly() {
    if (!booted) return;
    $$("[data-reveal]:not(.in)").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) {
            el.style.transition = "none";
            el.classList.add("in");
            requestAnimationFrame(() => (el.style.transition = ""));
        } else if (revealIO) {
            revealIO.observe(el);
        }
    });
}

})();
