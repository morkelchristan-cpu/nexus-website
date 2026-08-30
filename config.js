/* =========================================================
   NEXUS ROLEPLAY — CONFIGURATION STORE (config.js)
   This is the ONLY file you should need to edit.
   ========================================================= */

window.SERVER_CONFIG = {

    /* ---------------------------------------------------------
       ⚙️ SERVER CONNECTION — this is the only thing you need to set.
       Just drop in your server's IP and query port (default 30120).
       Everything on the page — live status, player count, the
       connect buttons — is generated from these two lines.
       Optional: if you have a cfx.re join code, add it too for a
       more reliable status lookup (recommended, but not required).
    --------------------------------------------------------- */
    serverIp: "102.37.220.9",
    serverPort: "30120",
    cfxCode: "dgg63vq", // optional — leave as "" if you don't have one

    serverName: "Nexus RolePlay",
    maxPlayers: 48,
    discordInvite: "https://discord.gg/WsZfUBA5Jn",

    /* ---------------------------------------------------------
       ⚙️ SUPPORT TICKET WEBHOOK
       Paste a Discord webhook URL here and every ticket submitted
       through the Support Center will post straight into that
       channel. Create one in Discord via:
       Channel Settings → Integrations → Webhooks → New Webhook → Copy URL
       Leave blank to disable (tickets will just show a local
       confirmation instead of sending anywhere).
    --------------------------------------------------------- */
    discordWebhookUrl: "https://discord.com/api/webhooks/1543560366074626149/zjHfciUQmHqLFQ5llymS3Km8Krcp_msKRcUmyC3c9ZDlY5MPRFTk6YNBgm2_1Gr75L8S",

    // Each staff member can have an "avatar" image URL. If you leave it
    // blank (or the image fails to load), the site automatically falls
    // back to a colored initial badge instead — so this is optional.
    // Swap these placeholder URLs for real Discord avatar links any time,
    // e.g. right-click a Discord profile picture → "Copy Image Address".
    staffMembers: [
        { name: "its.valid", role: "Owner & Lead Dev", discord: "its.valid", bio: "Server administration & framework architecture.", avatar: "https://i.postimg.cc/Xq47CMm6/images.jpg" },
        { name: "Alex R.", role: "Head Administrator", discord: "alex_rp", bio: "Staff management & ban appeals.", avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=AlexR&backgroundColor=0b0f17" },
        { name: "Sarah K.", role: "Community Moderator", discord: "sarahk", bio: "Discord oversight & in-game support.", avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=SarahK&backgroundColor=0b0f17" }
    ],

devLogs: [
    {
        date: "August 2026 • V2.4 Release",
        title: "Economy Overhaul & Supabase Sync",
        desc: "Deployed new database synchronization layers, reduced server-side tick overhead, and introduced dynamic banking interest rates.",
        latest: true
    },
    {
        date: "August 2026 • Patch 2.3.5",
        title: "SQL Query Optimization & Deadlock Fixes",
        desc: "Resolved high-concurrency database deadlocks by refactoring async queries and configuring connection pool limits on MariaDB.",
        latest: false
    },
    {
        date: "August 2026 • Patch 2.3.2",
        title: "Automated Discord Logging & Webhooks",
        desc: "Integrated GitHub action webhooks and server event telemetry into dedicated development and audit channels.",
        latest: false
    },
    {
        date: "August 2026 • V2.3 Release",
        title: "VPS Migration & Network Security",
        desc: "Migrated server assets to a dedicated Linux VPS on Azure, established secure SSH tunneling, and updated firewall routing rules.",
        latest: false
    },
    {
        date: "July 2026 • Patch 2.2.1",
        title: "Custom UI Components & React Integration",
        desc: "Overhauled the core user interface with custom React components, smooth CSS animations, and improved responsive layouts.",
        latest: false
    },
    {
        date: "July 2026 • V2.2 Release",
        title: "Qbox Core Framework Refactor",
        desc: "Upgraded core player scripts, rewritten resource dependencies for Qbox compatibility, and streamlined player data persistent storage.",
        latest: false
    }
],

    // Each media card can have an "image" URL (a screenshot or clip
    // thumbnail). These three are stand-in placeholder photos so the
    // gallery isn't empty — swap them for real server screenshots
    // whenever you're ready (Discord CDN links work great here too).
    // Leave "image" blank to fall back to the plain card style.
    media: [
        { tag: "Screenshot", title: "Legion Square", desc: "Public Area, nice environment.", image: "https://i.postimg.cc/rFGx3MMn/Whats-App-Image-2026-08-15-at-14-38-06-(2).jpg" },
        { tag: "Screenshot", title: "BurgerShot", desc: "A nice place to hang out, and eat delicious food.", image: "https://i.postimg.cc/rsxx8LWX/Whats-App-Image-2026-08-15-at-14-38-06-(1).jpg" },
        { tag: "Screenshot", title: "Club", desc: "Were all the cool kids go.", image: "https://i.postimg.cc/g2NRcsww/Whats-App-Image-2026-08-15-at-14-38-06-(4).jpg" }
    ],

    rulesData: [
        {
            category: "General Conduct",
            icon: "fa-shield",
            rules: [
                { id: "1.1", title: "Conduct Standards", desc: "Treat all members with respect. Personal attacks, threats, harassment and targeted abuse are not permitted." },
                { id: "1.2", title: "Sexual Harassment", desc: "Unwanted sexual remarks, advances or sexual harassment are strictly prohibited." },
                { id: "1.3", title: "Hate Speech & Slurs", desc: "Hateful language or slurs used to attack another player or group are prohibited." },
                { id: "1.4", title: "Doxxing & Personal Information", desc: "Sharing, threatening to share or attempting to obtain another person's private information is strictly prohibited." },
                { id: "1.5", title: "Impersonation", desc: "Impersonating Nexus RolePlay staff, management or another member is prohibited." }
            ]
        },
        {
            category: "Roleplay Rules",
            icon: "fa-masks-theater",
            rules: [
                { id: "2.1", title: "Roleplay First", desc: "Remain in character and do not intentionally interfere with another player's active RP." },
                { id: "2.2", title: "FailRP / Unrealistic RP", desc: "Maintain realistic and immersive roleplay. Deliberately unrealistic or disruptive RP is prohibited." },
                { id: "2.3", title: "Trolling / NITRP", desc: "Players must join with the intention of participating in legitimate roleplay." },
                { id: "2.4", title: "FearRP / Value Your Life", desc: "Your character must value their life when realistically threatened." },
                { id: "2.5", title: "Metagaming", desc: "Using information your character could not realistically know to gain an advantage is prohibited." },
                { id: "2.6", title: "Force RP", desc: "Do not force actions or outcomes onto another player without giving them a reasonable opportunity to respond." },
                { id: "2.7", title: "Powergaming", desc: "Using unrealistic abilities, knowledge, skills or mechanics to gain an advantage is prohibited." },
                { id: "2.8", title: "Stream Sniping", desc: "Using livestreams or recordings to track players or gain an in-game advantage is prohibited." }
            ]
        },
        {
            category: "RP Situations",
            icon: "fa-car-burst",
            rules: [
                { id: "2.9", title: "Character Separation", desc: "Do not transfer information, money, assets or knowledge between your own characters unless permitted." },
                { id: "2.10", title: "RDM", desc: "Randomly killing or seriously attacking another player without sufficient RP interaction or justification is prohibited." },
                { id: "2.11", title: "VDM", desc: "Intentionally using a vehicle to kill or seriously injure another player without legitimate RP is prohibited." },
                { id: "2.12", title: "New Life Rule", desc: "After your character dies, you may not return to the previous situation or use information from your previous life." },
                { id: "2.13", title: "OOC Targeting", desc: "Using OOC or real-world information to target, harass or interfere with another player is prohibited." },
                { id: "2.14", title: "IC Conflict OOC", desc: "Do not take in-character arguments or conflicts into OOC harassment or targeting." },
                { id: "2.15", title: "Prior Interaction", desc: "Players must have genuine prior interaction before initiating certain hostile RP scenarios." },
                { id: "2.16", title: "Abuse of Actions", desc: "Do not abuse cuffing, searching, dragging, carrying, escorting, fingerprinting, hospital or jail actions." }
            ]
        },
        {
            category: "Gameplay & Radio",
            icon: "fa-walkie-talkie",
            rules: [
                { id: "3.1", title: "Microphone Abuse", desc: "Excessively loud microphones, microphone spam, clipping or intentionally harmful audio are prohibited." },
                { id: "3.2", title: "Offensive Usernames", desc: "Usernames must be appropriate and may not be offensive, sexual or deliberately provocative." },
                { id: "3.3", title: "Chat Usage", desc: "Do not spam, disrupt in-game OOC communication or advertise other communities." },
                { id: "3.4", title: "Unrealistic Driving", desc: "Driving must remain reasonably realistic. Deliberately destroying RP through driving is prohibited." },
                { id: "3.5", title: "Character Models", desc: "Animal, indecent, exposed or otherwise unrealistic character models are prohibited unless approved." },
                { id: "3.6", title: "Radio Traffic", desc: "Keep radio traffic professional and reasonable. Radio spam and intentional disruption are prohibited." },
                { id: "3.7", title: "Spoken Hate Speech", desc: "Slurs or hateful language over in-game voice or radio are prohibited." }
            ]
        },
        {
            category: "Security & Modifications",
            icon: "fa-lock",
            rules: [
                { id: "4.1", title: "Cheating / Mod Menus", desc: "Cheats, mod menus, executors, spoofers, injectors or unauthorized software that provide an unfair advantage are strictly prohibited." },
                { id: "4.2", title: "Exploit / Glitch Abuse", desc: "Using bugs or unintended mechanics to gain an advantage is prohibited." },
                { id: "4.3", title: "System Bypass", desc: "Attempting to bypass Nexus RolePlay economy, vehicle, asset, permission, enforcement or security systems is prohibited." },
                { id: "4.4", title: "Cheat Distribution", desc: "Distributing, selling, promoting or providing cheats or malicious tools is prohibited." },
                { id: "4.5", title: "Ban Evasion", desc: "Using another account or method to evade a Nexus RolePlay punishment is prohibited." },
                { id: "5.1", title: "Advantage-Giving Modifications", desc: "Mods that provide an unfair competitive advantage are prohibited." },
                { id: "5.2", title: "Combat Logging", desc: "Leaving during an active RP situation to avoid consequences is prohibited." }
            ]
        }
    ]
};
