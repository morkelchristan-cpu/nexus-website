/* =========================================================
   NEXUS ROLEPLAY — CONFIGURATION STORE (config.js)
   This is the ONLY file you should need to edit.

   🌐 TRANSLATIONS
   Any piece of text below can be either a plain string:
       title: "Legion Square"
   or a translated object (English / Afrikaans / French):
       title: { en: "Club", af: "Klub", fr: "Club" }
   Missing languages fall back to English automatically.
   ========================================================= */

window.SERVER_CONFIG = {

    /* ---------------------------------------------------------
       ⚙️ SERVER CONNECTION
       Drop in your server's IP and port (default 30120). Live
       status, player count and every connect button are built
       from these lines. cfxCode is optional but recommended.
    --------------------------------------------------------- */
    serverIp: "102.209.119.160",
    serverPort: "30120",
    cfxCode: "dgg63vq", // optional — leave as "" if you don't have one

    serverName: "Nexus RolePlay",
    maxPlayers: 10,
    discordInvite: "https://discord.gg/WsZfUBA5Jn",

    // Show the "Click anywhere to enter" welcome screen (once per visit).
    entryGate: true,

    /* ---------------------------------------------------------
       ⚙️ SUPPORT TICKETS
       Tickets are sent to /api/ticket (api/ticket.js), a Vercel
       function that forwards them to Discord. The webhook URL is
       kept SECRET on Vercel — never paste it into this file, as
       everything here is public to anyone visiting the site.

       Setup: Vercel → Project → Settings → Environment Variables
              Name: DISCORD_WEBHOOK_URL   Value: <your webhook URL>
       Then redeploy.

       When the site runs in-game (FiveM NUI) relative URLs don't
       reach Vercel, so use the full URL instead, e.g.
       "https://your-site.vercel.app/api/ticket".
       Leave blank to disable tickets (users are sent to Discord).
    --------------------------------------------------------- */
    ticketEndpoint: "/api/ticket",

    /* ---------------------------------------------------------
       Server card facts (hero section)
    --------------------------------------------------------- */
    framework: "QBOX / Custom V1",
    voice: "PMA-Voice 3D",

    /* ---------------------------------------------------------
       Scrolling highlight strip under the hero
    --------------------------------------------------------- */
    highlights: [
        "Qbox Framework",
        "PMA-Voice 3D",
        { en: "Advanced Banking", af: "Gevorderde bankwese", fr: "Banque avancée" },
        { en: "Store Robberies", af: "Winkelrooftogte", fr: "Braquages de magasins" },
        { en: "Police & EMS", af: "Polisie & nooddienste", fr: "Police & EMS" },
        { en: "Active Anti-Cheat", af: "Aktiewe anti-kul", fr: "Anti-cheat actif" },
        { en: "Hosted in Johannesburg", af: "Gehuisves in Johannesburg", fr: "Hébergé à Johannesburg" },
        { en: "Custom UI", af: "Pasgemaakte UI", fr: "Interface sur mesure" },
        "EN · AF · FR"
    ],

    /* ---------------------------------------------------------
       Feature grid. span: 2 makes a tile double-width.
       visual: "bank" | "voice" | "region" | "" (decorative art)
    --------------------------------------------------------- */
    features: [
        {
            icon: "fa-building-columns", span: 2, visual: "bank",
            title: { en: "A living economy", af: "'n Lewende ekonomie", fr: "Une économie vivante" },
            desc: {
                en: "Multi-account banking, credit limits, dynamic interest and full transaction history — money that actually means something.",
                af: "Bankwese met veelvuldige rekeninge, kredietlimiete, dinamiese rente en volledige transaksiegeskiedenis — geld wat regtig iets beteken.",
                fr: "Banque multi-comptes, limites de crédit, intérêts dynamiques et historique complet — de l'argent qui a vraiment de la valeur."
            }
        },
        {
            icon: "fa-shield-halved",
            title: { en: "Police & EMS", af: "Polisie & nooddienste", fr: "Police & EMS" },
            desc: {
                en: "Dedicated emergency services with dispatch, cuffing, jail and hospital systems built for real scenes.",
                af: "Toegewyde nooddienste met versending, boeie-, tronk- en hospitaalstelsels gebou vir egte tonele.",
                fr: "Des services d'urgence dédiés avec dispatch, menottes, prison et hôpital conçus pour de vraies scènes."
            }
        },
        {
            icon: "fa-mask",
            title: { en: "Robberies with stakes", af: "Rooftogte met gevolge", fr: "Des braquages à enjeux" },
            desc: {
                en: "Dynamic NPC store robberies with escalating police response — every job is a story.",
                af: "Dinamiese NPC-winkelrooftogte met toenemende polisiereaksie — elke job is 'n storie.",
                fr: "Braquages de magasins PNJ dynamiques avec une réponse policière croissante — chaque coup est une histoire."
            }
        },
        {
            icon: "fa-microphone-lines", span: 2, visual: "voice",
            title: { en: "3D proximity voice", af: "3D-nabyheidstem", fr: "Voix de proximité 3D" },
            desc: {
                en: "PMA-Voice with radio channels, so every conversation, negotiation and pursuit feels natural.",
                af: "PMA-Voice met radiokanale, sodat elke gesprek, onderhandeling en jaagtog natuurlik voel.",
                fr: "PMA-Voice avec canaux radio, pour des conversations, négociations et poursuites naturelles."
            }
        },
        {
            icon: "fa-user-shield",
            title: { en: "Fair & protected", af: "Regverdig & beskerm", fr: "Équitable & protégé" },
            desc: {
                en: "Active anti-cheat and a hands-on staff team keep the city fair for everyone.",
                af: "Aktiewe anti-kul en 'n betrokke personeelspan hou die stad regverdig vir almal.",
                fr: "Un anti-cheat actif et une équipe de staff impliquée garantissent l'équité pour tous."
            }
        },
        {
            icon: "fa-location-dot", span: 2, visual: "region",
            title: { en: "Hosted in Johannesburg", af: "Gehuisves in Johannesburg", fr: "Hébergé à Johannesburg" },
            desc: {
                en: "Our servers run in Johannesburg, so players across Mzansi get low ping, smooth driving and smooth shootouts.",
                af: "Ons bedieners is in Johannesburg, so spelers regoor Mzansi kry lae ping, gladde bestuur en gladde skietgevegte.",
                fr: "Nos serveurs sont à Johannesburg : ping faible, conduite et fusillades fluides pour les joueurs de tout le pays."
            }
        }
    ],

    /* ---------------------------------------------------------
       Staff directory
       tier: "owner" | "management" | "admin" | "support"
       (controls badge colour). Blank avatar = initial badge.
    --------------------------------------------------------- */
    staffMembers: [
        {
            name: "valid.designs", discord: "its.valid", tier: "owner",
            role: { en: "Owner & Lead Dev", af: "Eienaar & hoofontwikkelaar", fr: "Propriétaire & dév principal" },
            bio: { en: "Server administration & framework architecture.", af: "Bedieneradministrasie en raamwerkargitektuur.", fr: "Administration du serveur et architecture du framework." },
            avatar: "https://i.postimg.cc/kXqdFQt7/Gemini-Generated-Image-(2).jpg"
        },
        {
            name: "Thor", discord: "cpteam6373", tier: "owner",
            role: { en: "Owner of FR Discord", af: "Eienaar van FR-Discord", fr: "Propriétaire du Discord FR" },
            bio: { en: "FR Discord administration.", af: "Administrasie van die FR-Discord.", fr: "Administration du Discord FR." },
            avatar: "https://i.postimg.cc/QCBjLhhX/image-2026-09-12-231646788.png"
        },
        {
            name: "MazeRunnerGlade", discord: "mazerunnerglade", tier: "management",
            role: { en: "Staff Management", af: "Personeelbestuur", fr: "Gestion du staff" },
            bio: { en: "Staff oversight.", af: "Toesig oor personeel.", fr: "Supervision du staff." },
            avatar: "https://i.postimg.cc/3xZNFrR3/image-2026-09-12-231836031.png"
        },
        {
            name: "Liam Ross / Stefan Ross", discord: "liam_ross_69", tier: "management",
            role: { en: "Staff Coordinator", af: "Personeelkoördineerder", fr: "Coordinateur du staff" },
            bio: { en: "Coordinator for the staff team.", af: "Koördineer die personeelspan.", fr: "Coordonne l'équipe du staff." },
            avatar: "https://i.postimg.cc/50D226PS/image-2026-09-12-231911252.png"
        },
        {
            name: "MagnumClassic", discord: "magnumclassic1", tier: "admin",
            role: { en: "Administrator", af: "Administrateur", fr: "Administrateur" },
            bio: { en: "Administration of Nexus.", af: "Administrasie van Nexus.", fr: "Administration de Nexus." },
            avatar: "https://i.postimg.cc/YSZH1TQV/image-2026-09-12-232151302.png"
        },
        {
            name: "PEP", discord: "pep9853", tier: "admin",
            role: { en: "Administrator", af: "Administrateur", fr: "Administrateur" },
            bio: { en: "Administration of Nexus.", af: "Administrasie van Nexus.", fr: "Administration de Nexus." },
            avatar: "https://i.postimg.cc/vZGHTRvj/image-2026-09-12-231943390.png"
        },
        {
            name: "Barris_ZA", discord: "barris_za", tier: "support",
            role: { en: "Tester", af: "Toetser", fr: "Testeur" },
            bio: { en: "Official tester.", af: "Amptelike toetser.", fr: "Testeur officiel." },
            avatar: "https://i.postimg.cc/cHtd2dsn/image-2026-09-12-232010976.png"
        }
    ],

    /* ---------------------------------------------------------
       Development logs (newest first)
       date: "YYYY-MM" (shown as a localised month)
       type: "release" | "patch"
    --------------------------------------------------------- */
    devLogs: [
        {
            version: "V2.7", type: "release", date: "2026-10", latest: true,
            title: { en: "Rainmad Job Pack, Script Optimisation & New VPS", af: "Rainmad-werkpakket, skripoptimering en nuwe VPS", fr: "Pack de métiers Rainmad, optimisation des scripts et nouveau VPS" },
            desc: {
                en: "Added the job pack from Rainmad (check Rainmad for full job details), optimised our scripts for better performance, and migrated to a new VPS. We're almost ready for launch!",
                af: "Die werkpakket van Rainmad bygevoeg (kyk by Rainmad vir volledige werkbesonderhede), ons skrips vir beter werkverrigting geoptimeer en na 'n nuwe VPS geskuif. Ons is amper gereed vir bekendstelling!",
                fr: "Ajout du pack de métiers de Rainmad (consultez Rainmad pour tous les détails des métiers), optimisation de nos scripts pour de meilleures performances et migration vers un nouveau VPS. Le lancement approche !"
            }
        },
        {
            version: "V2.6", type: "release", date: "2026-09",
            title: { en: "Advanced Banking System & Dynamic NPC Robberies", af: "Gevorderde bankstelsel en dinamiese NPC-rooftogte", fr: "Système bancaire avancé et braquages PNJ dynamiques" },
            desc: {
                en: "Implemented a fully revamped banking system with multi-account management, credit limits, and automated transaction histories, alongside dynamic NPC store robberies with escalating police response triggers.",
                af: "'n Volledig hersiene bankstelsel met veelvuldige rekeninge, kredietlimiete en outomatiese transaksiegeskiedenis, saam met dinamiese NPC-winkelrooftogte met toenemende polisiereaksie.",
                fr: "Refonte complète du système bancaire avec gestion multi-comptes, limites de crédit et historique automatique des transactions, ainsi que des braquages de magasins PNJ dynamiques avec une réponse policière croissante."
            }
        },
        {
            version: "2.5.1", type: "patch", date: "2026-09",
            title: { en: "VPS Node Migration & Load Balancing", af: "VPS-nodusmigrasie en lasbalansering", fr: "Migration du nœud VPS et répartition de charge" },
            desc: {
                en: "Migrated infrastructure to a high-performance VPS setup with optimized network routing, lower latency endpoints, and seamless failover handling for heavy concurrency.",
                af: "Infrastruktuur na 'n hoëprestasie-VPS geskuif met geoptimaliseerde netwerkroetering, laer latensie en naatlose oorskakeling onder swaar las.",
                fr: "Migration de l'infrastructure vers un VPS haute performance avec un routage réseau optimisé, une latence réduite et une bascule transparente en cas de forte charge."
            }
        },
        {
            version: "V2.4", type: "release", date: "2026-08",
            title: { en: "Economy Overhaul & Supabase Sync", af: "Ekonomie-opknapping en Supabase-sinkronisasie", fr: "Refonte de l'économie et synchronisation Supabase" },
            desc: {
                en: "Deployed new database synchronization layers, reduced server-side tick overhead, and introduced dynamic banking interest rates.",
                af: "Nuwe databasis-sinkronisasielae ontplooi, bediener-oorhoofse las verminder en dinamiese bankrentekoerse bekendgestel.",
                fr: "Déploiement de nouvelles couches de synchronisation de base de données, réduction de la charge serveur et introduction de taux d'intérêt bancaires dynamiques."
            }
        },
        {
            version: "2.3.5", type: "patch", date: "2026-08",
            title: { en: "SQL Query Optimization & Deadlock Fixes", af: "SQL-navraagoptimering en deadlock-regstellings", fr: "Optimisation SQL et correction des deadlocks" },
            desc: {
                en: "Resolved high-concurrency database deadlocks by refactoring async queries and configuring connection pool limits on MariaDB.",
                af: "Databasis-deadlocks onder hoë gelyktydigheid opgelos deur asinchrone navrae te herstruktureer en verbindingspoel-limiete op MariaDB op te stel.",
                fr: "Résolution des deadlocks en forte concurrence grâce à la refonte des requêtes asynchrones et à la configuration des limites du pool de connexions MariaDB."
            }
        },
        {
            version: "2.3.2", type: "patch", date: "2026-08",
            title: { en: "Automated Discord Logging & Webhooks", af: "Outomatiese Discord-logging en webhooks", fr: "Journalisation Discord automatisée et webhooks" },
            desc: {
                en: "Integrated GitHub action webhooks and server event telemetry into dedicated development and audit channels.",
                af: "GitHub Action-webhooks en bediener-gebeurtenistelemetrie in toegewyde ontwikkelings- en ouditkanale geïntegreer.",
                fr: "Intégration des webhooks GitHub Actions et de la télémétrie serveur dans des salons dédiés au développement et à l'audit."
            }
        },
        {
            version: "V2.3", type: "release", date: "2026-08",
            title: { en: "VPS Migration & Network Security", af: "VPS-migrasie en netwerksekuriteit", fr: "Migration VPS et sécurité réseau" },
            desc: {
                en: "Migrated server assets to a dedicated Linux VPS on Azure, established secure SSH tunneling, and updated firewall routing rules.",
                af: "Bedienerbates na 'n toegewyde Linux-VPS op Azure geskuif, veilige SSH-tonnels opgestel en firewall-roeteringsreëls bygewerk.",
                fr: "Migration des ressources vers un VPS Linux dédié sur Azure, mise en place de tunnels SSH sécurisés et mise à jour des règles de pare-feu."
            }
        },
        {
            version: "2.2.1", type: "patch", date: "2026-07",
            title: { en: "Custom UI Components & React Integration", af: "Pasgemaakte UI-komponente en React-integrasie", fr: "Composants UI personnalisés et intégration React" },
            desc: {
                en: "Overhauled the core user interface with custom React components, smooth CSS animations, and improved responsive layouts.",
                af: "Die kerngebruikerskoppelvlak opgeknap met pasgemaakte React-komponente, gladde CSS-animasies en verbeterde responsiewe uitlegte.",
                fr: "Refonte de l'interface principale avec des composants React personnalisés, des animations CSS fluides et des mises en page responsives améliorées."
            }
        },
        {
            version: "V2.2", type: "release", date: "2026-07",
            title: { en: "Qbox Core Framework Refactor", af: "Qbox-kernraamwerk herstruktureer", fr: "Refonte du framework Qbox" },
            desc: {
                en: "Upgraded core player scripts, rewrote resource dependencies for Qbox compatibility, and streamlined persistent player data storage.",
                af: "Kernspelerskrifte opgegradeer, hulpbron-afhanklikhede vir Qbox-versoenbaarheid herskryf en die stoor van spelerdata vaartbelyn gemaak.",
                fr: "Mise à niveau des scripts joueurs, réécriture des dépendances pour la compatibilité Qbox et simplification du stockage persistant des données joueurs."
            }
        }
    ],

    /* ---------------------------------------------------------
       Media gallery — swap in real screenshots any time
       (Discord CDN / postimg links work great).
    --------------------------------------------------------- */
    media: [
        {
            tag: { en: "Screenshot", af: "Skermskoot", fr: "Capture" },
            title: "Legion Square",
            desc: { en: "Public area with a great atmosphere.", af: "Openbare area met 'n lekker atmosfeer.", fr: "Espace public à l'ambiance agréable." },
            image: "https://i.postimg.cc/rFGx3MMn/Whats-App-Image-2026-08-15-at-14-38-06-(2).jpg"
        },
        {
            tag: { en: "Screenshot", af: "Skermskoot", fr: "Capture" },
            title: "BurgerShot",
            desc: { en: "A great place to hang out and grab delicious food.", af: "'n Lekker plek om te kuier en heerlike kos te eet.", fr: "L'endroit idéal pour traîner et bien manger." },
            image: "https://i.postimg.cc/rsxx8LWX/Whats-App-Image-2026-08-15-at-14-38-06-(1).jpg"
        },
        {
            tag: { en: "Screenshot", af: "Skermskoot", fr: "Capture" },
            title: { en: "The Club", af: "Die Klub", fr: "Le Club" },
            desc: { en: "Where all the cool kids go.", af: "Waar al die cool kids heen gaan.", fr: "Là où vont tous les gens cool." },
            image: "https://i.postimg.cc/g2NRcsww/Whats-App-Image-2026-08-15-at-14-38-06-(4).jpg"
        }
    ],

    /* ---------------------------------------------------------
       FAQ — {connect} is replaced with your connect command.
    --------------------------------------------------------- */
    faq: [
        {
            q: { en: "How do I join the server?", af: "Hoe sluit ek by die bediener aan?", fr: "Comment rejoindre le serveur ?" },
            a: {
                en: "Install FiveM, join our Discord, then hit Play now on this page — or press F8 in FiveM and type: {connect}",
                af: "Installeer FiveM, sluit by ons Discord aan en klik dan Speel nou op hierdie blad — of druk F8 in FiveM en tik: {connect}",
                fr: "Installez FiveM, rejoignez notre Discord puis cliquez sur Jouer — ou appuyez sur F8 dans FiveM et tapez : {connect}"
            }
        },
        {
            q: { en: "Is it free to play?", af: "Is dit gratis om te speel?", fr: "Est-ce gratuit ?" },
            a: {
                en: "Yes. Nexus RolePlay and FiveM are free — you only need a legal PC copy of GTA V.",
                af: "Ja. Nexus RolePlay en FiveM is gratis — jy het net 'n wettige PC-kopie van GTA V nodig.",
                fr: "Oui. Nexus RolePlay et FiveM sont gratuits — il vous faut seulement une copie PC légale de GTA V."
            }
        },
        {
            q: { en: "Which languages are supported?", af: "Watter tale word ondersteun?", fr: "Quelles langues sont prises en charge ?" },
            a: {
                en: "This site is available in English, Afrikaans and French, and we run a dedicated French Discord community.",
                af: "Hierdie webwerf is beskikbaar in Engels, Afrikaans en Frans, en ons het 'n toegewyde Franse Discord-gemeenskap.",
                fr: "Ce site est disponible en anglais, afrikaans et français, et nous avons une communauté Discord francophone dédiée."
            }
        },
        {
            q: { en: "What framework does Nexus run on?", af: "Op watter raamwerk loop Nexus?", fr: "Sur quel framework tourne Nexus ?" },
            a: {
                en: "Nexus runs on Qbox with our own custom V1 scripts, PMA-Voice 3D and a custom-built UI.",
                af: "Nexus loop op Qbox met ons eie pasgemaakte V1-skrifte, PMA-Voice 3D en 'n pasgeboude UI.",
                fr: "Nexus tourne sur Qbox avec nos propres scripts V1, PMA-Voice 3D et une interface sur mesure."
            }
        },
        {
            q: { en: "How do I appeal a ban?", af: "Hoe appelleer ek 'n verbanning?", fr: "Comment contester un ban ?" },
            a: {
                en: "Open a support ticket below and choose Ban appeal, or reach out to staff on Discord. Be honest and include as much detail as you can.",
                af: "Open 'n ondersteuningskaartjie hieronder en kies Verbanningsappèl, of kontak personeel op Discord. Wees eerlik en gee soveel besonderhede as moontlik.",
                fr: "Ouvrez un ticket ci-dessous en choisissant Contestation de ban, ou contactez le staff sur Discord. Soyez honnête et donnez un maximum de détails."
            }
        },
        {
            q: { en: "I found a bug — what now?", af: "Ek het 'n fout gekry — wat nou?", fr: "J'ai trouvé un bug, que faire ?" },
            a: {
                en: "Report it with a Bug report ticket. Please don't exploit it — abusing bugs breaks rule 4.2.",
                af: "Rapporteer dit met 'n foutverslag-kaartjie. Moenie dit uitbuit nie — die misbruik van foute oortree reël 4.2.",
                fr: "Signalez-le via un ticket Rapport de bug. Ne l'exploitez pas — abuser d'un bug enfreint la règle 4.2."
            }
        }
    ],

    /* ---------------------------------------------------------
       Server rules
    --------------------------------------------------------- */
    rulesData: [
        {
            category: { en: "General Conduct", af: "Algemene gedrag", fr: "Conduite générale" },
            icon: "fa-shield",
            rules: [
                { id: "1.1", title: { en: "Conduct Standards", af: "Gedragstandaarde", fr: "Règles de conduite" }, desc: { en: "Treat all members with respect. Personal attacks, threats, harassment and targeted abuse are not permitted.", af: "Behandel alle lede met respek. Persoonlike aanvalle, dreigemente, teistering en geteikende misbruik word nie toegelaat nie.", fr: "Traitez tous les membres avec respect. Les attaques personnelles, menaces, harcèlement et abus ciblés ne sont pas tolérés." } },
                { id: "1.2", title: { en: "Sexual Harassment", af: "Seksuele teistering", fr: "Harcèlement sexuel" }, desc: { en: "Unwanted sexual remarks, advances or sexual harassment are strictly prohibited.", af: "Ongewenste seksuele opmerkings, toenadering of seksuele teistering is streng verbode.", fr: "Les remarques, avances ou le harcèlement à caractère sexuel non désirés sont strictement interdits." } },
                { id: "1.3", title: { en: "Hate Speech & Slurs", af: "Haatspraak en skeldwoorde", fr: "Discours haineux et insultes" }, desc: { en: "Hateful language or slurs used to attack another player or group are prohibited.", af: "Haatlike taal of skeldwoorde om 'n ander speler of groep aan te val, is verbode.", fr: "Les propos haineux ou insultes visant un autre joueur ou groupe sont interdits." } },
                { id: "1.4", title: { en: "Doxxing & Personal Information", af: "Doxxing en persoonlike inligting", fr: "Doxxing et informations personnelles" }, desc: { en: "Sharing, threatening to share or attempting to obtain another person's private information is strictly prohibited.", af: "Om 'n ander persoon se private inligting te deel, te dreig om dit te deel of te probeer bekom, is streng verbode.", fr: "Partager, menacer de partager ou tenter d'obtenir les informations privées d'une autre personne est strictement interdit." } },
                { id: "1.5", title: { en: "Impersonation", af: "Nabootsing", fr: "Usurpation d'identité" }, desc: { en: "Impersonating Nexus RolePlay staff, management or another member is prohibited.", af: "Om jou as Nexus RolePlay-personeel, bestuur of 'n ander lid voor te doen, is verbode.", fr: "Se faire passer pour un membre du staff, de la direction de Nexus RolePlay ou un autre membre est interdit." } }
            ]
        },
        {
            category: { en: "Roleplay Rules", af: "Rolspelreëls", fr: "Règles de roleplay" },
            icon: "fa-masks-theater",
            rules: [
                { id: "2.1", title: { en: "Roleplay First", af: "Rolspel eerste", fr: "Le roleplay avant tout" }, desc: { en: "Remain in character and do not intentionally interfere with another player's active RP.", af: "Bly in karakter en moenie doelbewus met 'n ander speler se aktiewe RP inmeng nie.", fr: "Restez dans votre personnage et n'interférez pas volontairement avec le RP actif d'un autre joueur." } },
                { id: "2.2", title: { en: "FailRP / Unrealistic RP", af: "FailRP / Onrealistiese RP", fr: "FailRP / RP irréaliste" }, desc: { en: "Maintain realistic and immersive roleplay. Deliberately unrealistic or disruptive RP is prohibited.", af: "Handhaaf realistiese en meesleurende rolspel. Doelbewus onrealistiese of ontwrigtende RP is verbode.", fr: "Maintenez un roleplay réaliste et immersif. Le RP volontairement irréaliste ou perturbateur est interdit." } },
                { id: "2.3", title: "Trolling / NITRP", desc: { en: "Players must join with the intention of participating in legitimate roleplay.", af: "Spelers moet aansluit met die bedoeling om aan egte rolspel deel te neem.", fr: "Les joueurs doivent rejoindre avec l'intention de participer à un roleplay sérieux." } },
                { id: "2.4", title: { en: "FearRP / Value Your Life", af: "FearRP / Waardeer jou lewe", fr: "FearRP / Valoriser sa vie" }, desc: { en: "Your character must value their life when realistically threatened.", af: "Jou karakter moet sy lewe waardeer wanneer dit realisties bedreig word.", fr: "Votre personnage doit tenir à sa vie lorsqu'il est menacé de façon réaliste." } },
                { id: "2.5", title: "Metagaming", desc: { en: "Using information your character could not realistically know to gain an advantage is prohibited.", af: "Om inligting te gebruik wat jou karakter nie realisties kan weet nie om 'n voordeel te kry, is verbode.", fr: "Utiliser des informations que votre personnage ne peut pas connaître de façon réaliste pour obtenir un avantage est interdit." } },
                { id: "2.6", title: { en: "Force RP", af: "Forseer RP", fr: "Forcer le RP" }, desc: { en: "Do not force actions or outcomes onto another player without giving them a reasonable opportunity to respond.", af: "Moenie aksies of uitkomste op 'n ander speler afdwing sonder om hulle 'n redelike kans te gee om te reageer nie.", fr: "N'imposez pas d'actions ou de résultats à un autre joueur sans lui laisser une occasion raisonnable de réagir." } },
                { id: "2.7", title: "Powergaming", desc: { en: "Using unrealistic abilities, knowledge, skills or mechanics to gain an advantage is prohibited.", af: "Om onrealistiese vermoëns, kennis, vaardighede of meganika te gebruik om 'n voordeel te kry, is verbode.", fr: "Utiliser des capacités, connaissances, compétences ou mécaniques irréalistes pour obtenir un avantage est interdit." } },
                { id: "2.8", title: "Stream Sniping", desc: { en: "Using livestreams or recordings to track players or gain an in-game advantage is prohibited.", af: "Om lewendige uitsendings of opnames te gebruik om spelers op te spoor of 'n voordeel in die spel te kry, is verbode.", fr: "Utiliser des diffusions en direct ou des enregistrements pour traquer des joueurs ou obtenir un avantage en jeu est interdit." } }
            ]
        },
        {
            category: { en: "RP Situations", af: "RP-situasies", fr: "Situations RP" },
            icon: "fa-car-burst",
            rules: [
                { id: "2.9", title: { en: "Character Separation", af: "Karakterskeiding", fr: "Séparation des personnages" }, desc: { en: "Do not transfer information, money, assets or knowledge between your own characters unless permitted.", af: "Moenie inligting, geld, bates of kennis tussen jou eie karakters oordra nie, tensy dit toegelaat word.", fr: "Ne transférez pas d'informations, d'argent, de biens ou de connaissances entre vos propres personnages sauf autorisation." } },
                { id: "2.10", title: "RDM", desc: { en: "Randomly killing or seriously attacking another player without sufficient RP interaction or justification is prohibited.", af: "Om 'n ander speler lukraak dood te maak of ernstig aan te val sonder voldoende RP-interaksie of regverdiging, is verbode.", fr: "Tuer ou attaquer gravement un autre joueur au hasard sans interaction RP suffisante ni justification est interdit." } },
                { id: "2.11", title: "VDM", desc: { en: "Intentionally using a vehicle to kill or seriously injure another player without legitimate RP is prohibited.", af: "Om doelbewus 'n voertuig te gebruik om 'n ander speler dood te maak of ernstig te beseer sonder egte RP, is verbode.", fr: "Utiliser volontairement un véhicule pour tuer ou blesser gravement un autre joueur sans RP légitime est interdit." } },
                { id: "2.12", title: { en: "New Life Rule", af: "Nuwe-lewe-reël", fr: "Règle de la nouvelle vie" }, desc: { en: "After your character dies, you may not return to the previous situation or use information from your previous life.", af: "Nadat jou karakter sterf, mag jy nie na die vorige situasie terugkeer of inligting uit jou vorige lewe gebruik nie.", fr: "Après la mort de votre personnage, vous ne pouvez ni retourner à la situation précédente ni utiliser les informations de votre vie antérieure." } },
                { id: "2.13", title: { en: "OOC Targeting", af: "OOC-teikening", fr: "Ciblage HRP" }, desc: { en: "Using OOC or real-world information to target, harass or interfere with another player is prohibited.", af: "Om OOC- of werklike inligting te gebruik om 'n ander speler te teiken, te teister of met hulle in te meng, is verbode.", fr: "Utiliser des informations HRP ou de la vie réelle pour cibler, harceler ou gêner un autre joueur est interdit." } },
                { id: "2.14", title: { en: "IC Conflict OOC", af: "IC-konflik OOC", fr: "Conflit RP en HRP" }, desc: { en: "Do not take in-character arguments or conflicts into OOC harassment or targeting.", af: "Moenie argumente of konflikte in karakter na OOC-teistering of -teikening neem nie.", fr: "Ne transformez pas les disputes ou conflits en jeu en harcèlement ou ciblage HRP." } },
                { id: "2.15", title: { en: "Prior Interaction", af: "Vorige interaksie", fr: "Interaction préalable" }, desc: { en: "Players must have genuine prior interaction before initiating certain hostile RP scenarios.", af: "Spelers moet egte vorige interaksie hê voordat sekere vyandige RP-scenario's begin word.", fr: "Les joueurs doivent avoir eu une véritable interaction préalable avant de lancer certains scénarios RP hostiles." } },
                { id: "2.16", title: { en: "Abuse of Actions", af: "Misbruik van aksies", fr: "Abus d'actions" }, desc: { en: "Do not abuse cuffing, searching, dragging, carrying, escorting, fingerprinting, hospital or jail actions.", af: "Moenie boeie, deursoek, sleep, dra, begelei, vingerafdrukke, hospitaal- of tronkaksies misbruik nie.", fr: "N'abusez pas des actions de menottage, fouille, traînage, portage, escorte, prise d'empreintes, hôpital ou prison." } }
            ]
        },
        {
            category: { en: "Gameplay & Radio", af: "Spel en radio", fr: "Gameplay et radio" },
            icon: "fa-walkie-talkie",
            rules: [
                { id: "3.1", title: { en: "Microphone Abuse", af: "Mikrofoonmisbruik", fr: "Abus de microphone" }, desc: { en: "Excessively loud microphones, microphone spam, clipping or intentionally harmful audio are prohibited.", af: "Oormatig harde mikrofone, mikrofoon-spam, knip of doelbewus skadelike klank is verbode.", fr: "Les micros excessivement forts, le spam micro, la saturation ou l'audio volontairement nuisible sont interdits." } },
                { id: "3.2", title: { en: "Offensive Usernames", af: "Aanstootlike gebruikersname", fr: "Pseudos offensants" }, desc: { en: "Usernames must be appropriate and may not be offensive, sexual or deliberately provocative.", af: "Gebruikersname moet gepas wees en mag nie aanstootlik, seksueel of doelbewus uitlokkend wees nie.", fr: "Les pseudos doivent être appropriés et ne peuvent pas être offensants, sexuels ou volontairement provocateurs." } },
                { id: "3.3", title: { en: "Chat Usage", af: "Kletsgebruik", fr: "Utilisation du chat" }, desc: { en: "Do not spam, disrupt in-game OOC communication or advertise other communities.", af: "Moenie spam nie, moenie OOC-kommunikasie in die spel ontwrig nie en moenie ander gemeenskappe adverteer nie.", fr: "Ne spammez pas, ne perturbez pas la communication HRP en jeu et ne faites pas la publicité d'autres communautés." } },
                { id: "3.4", title: { en: "Unrealistic Driving", af: "Onrealistiese bestuur", fr: "Conduite irréaliste" }, desc: { en: "Driving must remain reasonably realistic. Deliberately destroying RP through driving is prohibited.", af: "Bestuur moet redelik realisties bly. Om RP doelbewus deur jou bestuur te verwoes, is verbode.", fr: "La conduite doit rester raisonnablement réaliste. Détruire volontairement le RP par sa conduite est interdit." } },
                { id: "3.5", title: { en: "Character Models", af: "Karaktermodelle", fr: "Modèles de personnage" }, desc: { en: "Animal, indecent, exposed or otherwise unrealistic character models are prohibited unless approved.", af: "Dier-, onwelvoeglike, ontblote of andersins onrealistiese karaktermodelle is verbode tensy goedgekeur.", fr: "Les modèles animaux, indécents, dénudés ou autrement irréalistes sont interdits sauf approbation." } },
                { id: "3.6", title: { en: "Radio Traffic", af: "Radioverkeer", fr: "Trafic radio" }, desc: { en: "Keep radio traffic professional and reasonable. Radio spam and intentional disruption are prohibited.", af: "Hou radioverkeer professioneel en redelik. Radio-spam en doelbewuste ontwrigting is verbode.", fr: "Gardez les échanges radio professionnels et raisonnables. Le spam radio et les perturbations volontaires sont interdits." } },
                { id: "3.7", title: { en: "Spoken Hate Speech", af: "Gesproke haatspraak", fr: "Propos haineux à l'oral" }, desc: { en: "Slurs or hateful language over in-game voice or radio are prohibited.", af: "Skeldwoorde of haatlike taal oor stem of radio in die spel is verbode.", fr: "Les insultes ou propos haineux en vocal ou à la radio en jeu sont interdits." } }
            ]
        },
        {
            category: { en: "Security & Modifications", af: "Sekuriteit en modifikasies", fr: "Sécurité et modifications" },
            icon: "fa-lock",
            rules: [
                { id: "4.1", title: { en: "Cheating / Mod Menus", af: "Kul / Mod-kieslyste", fr: "Triche / Mod menus" }, desc: { en: "Cheats, mod menus, executors, spoofers, injectors or unauthorized software that provide an unfair advantage are strictly prohibited.", af: "Kullery, mod-kieslyste, executors, spoofers, injectors of ongemagtigde sagteware wat 'n onregverdige voordeel gee, is streng verbode.", fr: "Les cheats, mod menus, executors, spoofers, injecteurs ou logiciels non autorisés offrant un avantage déloyal sont strictement interdits." } },
                { id: "4.2", title: { en: "Exploit / Glitch Abuse", af: "Misbruik van foute", fr: "Abus de bugs" }, desc: { en: "Using bugs or unintended mechanics to gain an advantage is prohibited.", af: "Om foute of onbedoelde meganika te gebruik om 'n voordeel te kry, is verbode.", fr: "Utiliser des bugs ou des mécaniques non prévues pour obtenir un avantage est interdit." } },
                { id: "4.3", title: { en: "System Bypass", af: "Stelselomseiling", fr: "Contournement des systèmes" }, desc: { en: "Attempting to bypass Nexus RolePlay economy, vehicle, asset, permission, enforcement or security systems is prohibited.", af: "Pogings om Nexus RolePlay se ekonomie-, voertuig-, bate-, toestemming-, handhawing- of sekuriteitstelsels te omseil, is verbode.", fr: "Toute tentative de contourner les systèmes d'économie, de véhicules, de biens, de permissions, de sanctions ou de sécurité de Nexus RolePlay est interdite." } },
                { id: "4.4", title: { en: "Cheat Distribution", af: "Verspreiding van kulsagteware", fr: "Distribution de cheats" }, desc: { en: "Distributing, selling, promoting or providing cheats or malicious tools is prohibited.", af: "Om kulsagteware of kwaadwillige gereedskap te versprei, verkoop, bevorder of te verskaf, is verbode.", fr: "Distribuer, vendre, promouvoir ou fournir des cheats ou outils malveillants est interdit." } },
                { id: "4.5", title: { en: "Ban Evasion", af: "Omseiling van verbanning", fr: "Contournement de ban" }, desc: { en: "Using another account or method to evade a Nexus RolePlay punishment is prohibited.", af: "Om 'n ander rekening of metode te gebruik om 'n Nexus RolePlay-straf te ontduik, is verbode.", fr: "Utiliser un autre compte ou une autre méthode pour échapper à une sanction de Nexus RolePlay est interdit." } },
                { id: "5.1", title: { en: "Advantage-Giving Modifications", af: "Modifikasies wat voordeel gee", fr: "Modifications avantageuses" }, desc: { en: "Mods that provide an unfair competitive advantage are prohibited.", af: "Mods wat 'n onregverdige mededingende voordeel gee, is verbode.", fr: "Les mods offrant un avantage compétitif déloyal sont interdits." } },
                { id: "5.2", title: { en: "Combat Logging", af: "Combat logging", fr: "Déconnexion en combat" }, desc: { en: "Leaving during an active RP situation to avoid consequences is prohibited.", af: "Om tydens 'n aktiewe RP-situasie uit te teken om gevolge te vermy, is verbode.", fr: "Se déconnecter pendant une situation RP active pour éviter les conséquences est interdit." } }
            ]
        }
    ]
};
