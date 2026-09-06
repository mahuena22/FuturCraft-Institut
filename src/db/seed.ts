import { db } from "./index";
import {
  users,
  formations,
  promotions,
  students,
  paymentSchedules,
  payments,
  receipts,
  notifications,
  studentProjects,
  companyOffers,
  events,
  blogArticles,
} from "./schema";
import { count } from "drizzle-orm";

export async function seedDatabase() {
  try {
    const formationCount = await db.select({ val: count() }).from(formations);
    if (Number(formationCount[0]?.val ?? 0) > 0) {
      console.log("Database already seeded, skipping.");
      return;
    }

    console.log("Seeding database for FuturCraft Institut...");

    // 1. Users
    const seededUsers = await db
      .insert(users)
      .values([
        {
          name: "Gauthier I. ORE",
          email: "direction@futurcraft.bj",
          phone: "+229 97 00 12 34",
          role: "super_admin",
          avatarUrl: "https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
        },
        {
          name: "Sarah Menou",
          email: "comptabilite@futurcraft.bj",
          phone: "+229 95 11 22 33",
          role: "financier",
          avatarUrl: "https://images.pexels.com/photos/8197509/pexels-photo-8197509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
        },
        {
          name: "Marcelle Agossou",
          email: "scolarite@futurcraft.bj",
          phone: "+229 96 44 55 66",
          role: "agent",
          avatarUrl: "https://images.pexels.com/photos/12662811/pexels-photo-12662811.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
        },
        {
          name: "Onesim Graça",
          email: "onesim.tokpo@etudiant.futurcraft.bj",
          phone: "+229 97 88 99 00",
          role: "etudiant",
          avatarUrl: "https://images.pexels.com/photos/9159001/pexels-photo-9159001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
        },
      ])
      .returning();

    // 2. Formations (all 12 from specification)
    const insertedFormations = await db
      .insert(formations)
      .values([
        {
          slug: "developpement-web-fullstack",
          title: "Développement Web Fullstack",
          category: "Développement & Code",
          shortDescription:
            "Devenez un développeur complet capable de concevoir, développer et déployer des applications web modernes et scalables.",
          fullDescription:
            "La formation Développement Web Fullstack de FuturCraft Institut forme des développeurs polyvalents et opérationnels dès leur sortie. Du frontend réactif avec React et Tailwind CSS au backend robuste avec Node.js, Express, PostgreSQL et Drizzle/Prisma, vous concevrez de bout en bout des solutions logicielles conformes aux normes internationales.",
          duration: "2 ans",
          level: "Débutant à Avancé (BAC ou équivalent)",
          price: 600000,
          registrationFee: 25000,
          installmentsCount: 6,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel & Hybride",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Maîtrise approfondie de JavaScript moderne (ES6+) et TypeScript",
            "Création d'interfaces réactives complexes avec React & Next.js",
            "Conception d'APIs RESTful et GraphQL avec Node.js et Express",
            "Modélisation de bases de données relationnelles PostgreSQL & Drizzle",
            "Déploiement continu CI/CD, Git, GitHub et Cloud (Vercel, Docker)",
            "Bonnes pratiques de sécurité web et architecture logicielle propre",
          ]),
          tools: JSON.stringify([
            "VS Code",
            "GitHub",
            "React",
            "Next.js",
            "Node.js",
            "PostgreSQL",
            "Tailwind CSS",
            "Docker",
            "Postman",
          ]),
          modules: JSON.stringify([
            {
              moduleNumber: "Module 01",
              title: "Fondamentaux du Web & Algorithmique",
              description: "Architecture du Web, logique algorithmique, HTML5 sémantique, CSS3 moderne et Flexbox/Grid.",
              duration: "4 semaines",
            },
            {
              moduleNumber: "Module 02",
              title: "JavaScript Moderne & DOM Interactif",
              description: "JavaScript ES6+, programmation asynchrone (Promises, Fetch), manipulation du DOM et gestion d'état locale.",
              duration: "5 semaines",
            },
            {
              moduleNumber: "Module 03",
              title: "Frontend Avancé avec React & Tailwind CSS",
              description: "Composants fonctionnels, hooks personnalisés, routing SPA, Tailwind CSS et intégration d'UI moderne.",
              duration: "6 semaines",
            },
            {
              moduleNumber: "Module 04",
              title: "Backend, APIs & Node.js / Express",
              description: "Création de serveurs HTTP, authentification JWT, middlewares, validation des données et sécurité.",
              duration: "5 semaines",
            },
            {
              moduleNumber: "Module 05",
              title: "Bases de Données Relationnelles & PostgreSQL",
              description: "Conception MCD/MLD, requêtes SQL complexes, ORMs modernes (Drizzle/Prisma) et migrations de données.",
              duration: "4 semaines",
            },
            {
              moduleNumber: "Module 06",
              title: "Projet Professionnel & Soutenance Finale",
              description: "Développement en équipe Agile d'une application SaaS réelle sous mentorat avec soutenance devant un jury d'entreprises.",
              duration: "6 semaines",
            },
          ]),
          jobs: JSON.stringify([
            "Développeur Web Fullstack",
            "Développeur Frontend React",
            "Développeur Backend Node.js",
            "Intégrateur Web & API",
            "Consultant Tech Junior",
          ]),
          imageUrl: "https://images.pexels.com/photos/33920044/pexels-photo-33920044.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "developpement-intelligence-artificielle",
          title: "Développement en Intelligence Artificielle",
          category: "Intelligence Artificielle",
          shortDescription:
            "Concevez des modèles de Machine Learning, d'apprentissage profond et intégrez des agents autonomes et LLMs dans vos logiciels.",
          fullDescription:
            "L'IA transforme tous les secteurs en Afrique et dans le monde. Ce cursus d'excellence aborde la Data Science avec Python, le Machine Learning, le Deep Learning (Vision par ordinateur, NLP) et le développement d'applications alimentées par les grands modèles de langage (LLMs, RAG, agents).",
          duration: "2 ans",
          level: "BAC Scientifique ou profil tech",
          price: 600000,
          registrationFee: 40000,
          installmentsCount: 6,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel & Hybride",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Programmation Python avancée pour la Data Science et l'IA",
            "Traitement et nettoyage de données volumineuses (Pandas, NumPy)",
            "Entraînement et déploiement de modèles Machine Learning (Scikit-Learn)",
            "Vision par ordinateur avec OpenCV et réseaux de neurones (PyTorch)",
            "Intégration d'APIs de modèles de fondation (OpenAI, Claude, Ollama)",
            "Développement de systèmes RAG (Retrieval Augmented Generation)",
          ]),
          tools: JSON.stringify([
            "Python",
            "PyTorch",
            "Scikit-Learn",
            "Pandas",
            "OpenCV",
            "LangChain",
            "Hugging Face",
            "Jupyter",
          ]),
          modules: JSON.stringify([
            {
              moduleNumber: "Module 01",
              title: "Python pour la Data Science & Statistiques",
              description: "Syntaxe Python, NumPy, Pandas, manipulation et visualisation des données réelles.",
              duration: "4 semaines",
            },
            {
              moduleNumber: "Module 02",
              title: "Machine Learning Fondamental",
              description: "Régression, classification, arbres de décision, clustering et validation croisée.",
              duration: "6 semaines",
            },
            {
              moduleNumber: "Module 03",
              title: "Deep Learning & Vision par Ordinateur",
              description: "Réseaux neuronaux denses, CNNs, détection d'objets et segmentation d'images.",
              duration: "6 semaines",
            },
            {
              moduleNumber: "Module 04",
              title: "NLP & Architectures LLM / RAG",
              description: "Traitement du langage naturel, embeddings, bases vectorielles et agents IA.",
              duration: "6 semaines",
            },
            {
              moduleNumber: "Module 05",
              title: "Projet Industriel IA",
              description: "Déploiement en production d'une solution d'intelligence artificielle sur mesure.",
              duration: "6 semaines",
            },
          ]),
          jobs: JSON.stringify([
            "Développeur IA & Data Scientist Junior",
            "Ingénieur Machine Learning",
            "Prompt Engineer & Spécialiste LLM",
            "Consultant Automatisation IA",
          ]),
          imageUrl: "https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "maitrise-outils-intelligence-artificielle",
          title: "Maîtrise des Outils d'Intelligence Artificielle",
          category: "Intelligence Artificielle",
          shortDescription:
            "Formation intensive accélérée de 3 mois pour booster sa productivité professionnelle grâce aux meilleurs outils d'IA du marché.",
          fullDescription:
            "Un condensé ultra-pratique pour entrepreneurs, cadres, freelances et créateurs de contenu. Apprenez à dompter ChatGPT, Claude, Midjourney, Perplexity, Cursor, Make et Canva IA pour automatiser vos tâches quotidiennes et multiplier par 5 votre efficacité. Frais de dossier comprenant l'inscription, la tenue, les documents et le badge.",
          duration: "1 mois intensif",
          level: "Tous niveaux (Professionnels & Étudiants)",
          price: 70000,
          registrationFee: 20000,
          installmentsCount: 1,
          campus: "Godomey (Cotonou) & En ligne",
          mode: "Hybride & En ligne",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Techniques de Prompting avancé (Few-shot, Chain-of-Thought)",
            "Génération d'images et de supports visuels avec Midjourney et Canva IA",
            "Automatisation de workflows métiers sans code (Make, Zapier, Airtable)",
            "Analyse documentaire et veille stratégique accélérée",
            "Rédaction de rapports, emails, présentations et stratégies en un clic",
          ]),
          tools: JSON.stringify([
            "ChatGPT Plus",
            "Claude 3.7",
            "Midjourney",
            "Perplexity AI",
            "Make.com",
            "Canva IA",
            "Notion AI",
          ]),
          modules: JSON.stringify([
            {
              moduleNumber: "Module 01",
              title: "L'art du Prompt Engineering",
              description: "Principes, formules de prompts professionnels, structuration des instructions et contextes.",
              duration: "3 semaines",
            },
            {
              moduleNumber: "Module 02",
              title: "Création Visuelle & Multimédia avec l'IA",
              description: "Génération de visuels publicitaires, retouche automatisée et vidéos synthétiques.",
              duration: "3 semaines",
            },
            {
              moduleNumber: "Module 03",
              title: "Automatisation de Processus avec Make & GPT",
              description: "Interconnecter ses outils (WhatsApp, Gmail, Sheets) avec un cerveau artificiel.",
              duration: "3 semaines",
            },
            {
              moduleNumber: "Module 04",
              title: "Cas d'usage Métier & Projet Personnalisé",
              description: "Création d'un assistant IA personnalisé pour votre activité spécifique.",
              duration: "3 semaines",
            },
          ]),
          jobs: JSON.stringify([
            "Manager augmenté",
            "Créateur de contenu digital assisté par IA",
            "Spécialiste de la productivité opérationnelle",
            "Freelance multi-compétences",
          ]),
          imageUrl: "https://images.pexels.com/photos/8199137/pexels-photo-8199137.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "web-design-ui-ux",
          title: "Web Design (UI/UX Design)",
          category: "Design & Multimédia",
          shortDescription:
            "Concevez des interfaces centrées utilisateur élégantes, ergonomiques et performantes pour le web et le mobile.",
          fullDescription:
            "Devenez un designer d'expérience convoité. ì travers une démarche human-centered design, apprenez la recherche utilisateur, l'architecture de l'information, le wireframing, le prototypage interactif avancé sur Figma et la création de design systems cohérents.",
          duration: "9 mois",
          level: "Tous niveaux (BEPC / BAC)",
          price: 250000,
          registrationFee: 25000,
          installmentsCount: 4,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel & Hybride",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Recherche utilisateur (interviews, personas, parcours client)",
            "Architecture de l'information et conception de wireframes",
            "Maîtrise experte de Figma (Auto Layout, Components, Variants)",
            "Création de prototypes interactifs haute fidélité",
            "Mise en place de Design Systems évolutifs",
            "Tests d'utilisabilité et accessibilité numérique (WCAG)",
          ]),
          tools: JSON.stringify(["Figma", "FigJam", "Adobe XD", "Miro", "Notion", "Whimsical", "Maze"]),
          modules: JSON.stringify([
            {
              moduleNumber: "Module 01",
              title: "Fondamentaux de l'UX & Recherche Utilisateur",
              description: "Psychologie cognitive, ergonomie, analyse des besoins et personas.",
              duration: "4 semaines",
            },
            {
              moduleNumber: "Module 02",
              title: "UI Design & Maîtrise Figma",
              description: "Grilles, typographie, théorie des couleurs, auto-layout et composants.",
              duration: "6 semaines",
            },
            {
              moduleNumber: "Module 03",
              title: "Design Systems & Prototypage Avancé",
              description: "Variables, tokens, micro-interactions animées et collaboration dev.",
              duration: "6 semaines",
            },
            {
              moduleNumber: "Module 04",
              title: "Portfolio & Projet Client Réel",
              description: "Refonte d'une application existante ou création from scratch d'un produit.",
              duration: "6 semaines",
            },
          ]),
          jobs: JSON.stringify(["UI/UX Designer", "Product Designer Junior", "Designer Web & Mobile", "Consultant Ergonomie Digitale"]),
          imageUrl: "https://images.pexels.com/photos/7014919/pexels-photo-7014919.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "webmaster",
          title: "Webmaster & Gestionnaire de Sites",
          category: "Développement & Code",
          shortDescription:
            "Créez, gérez, sécurisez et optimisez des sites web avec WordPress, Shopify et technologies web modernes.",
          fullDescription:
            "Le webmaster est le chef d'orchestre digital des entreprises. Vous apprendrez à déployer des sites vitrines et e-commerce sans code et low-code, à gérer l'hébergement, le SEO technique, la maintenance et les sauvegardes régulières.",
          duration: "1 an",
          level: "BEPC ou BAC",
          price: 300000,
          registrationFee: 20000,
          installmentsCount: 4,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel",
          isPopular: false,
          isActive: true,
          competencies: JSON.stringify([
            "Installation et personnalisation avancée de CMS (WordPress, WooCommerce)",
            "Gestion des noms de domaine, DNS, hébergements cPanel et certificats SSL",
            "Optimisation de la vitesse de chargement et du SEO technique",
            "Sécurité de sites web, pare-feu et stratégies de sauvegarde automatique",
          ]),
          tools: JSON.stringify(["WordPress", "Elementor Pro", "WooCommerce", "cPanel", "FileZilla", "Google Search Console"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Infrastructures Web & Hébergement", description: "Nom de domaine, serveurs, protocoles FTP et SSL.", duration: "3 semaines" },
            { moduleNumber: "Module 02", title: "WordPress Avancé & Builders", description: "Thèmes sur mesure, builders dynamiques et extensions indispensables.", duration: "5 semaines" },
            { moduleNumber: "Module 03", title: "Sécurité, SEO & Maintenance Pro", description: "Audit de sécurité, sauvegardes cloud et optimisation des performances.", duration: "4 semaines" },
          ]),
          jobs: JSON.stringify(["Webmaster", "Gestionnaire de site internet", "Intégrateur CMS WordPress", "Technicien Web Support"]),
          imageUrl: "https://images.pexels.com/photos/8197499/pexels-photo-8197499.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "graphisme-et-serigraphie",
          title: "Graphisme et Sérigraphie",
          category: "Design & Multimédia",
          shortDescription:
            "Maîtrisez la suite Adobe, concevez des identités visuelles percutantes et réalisez l'impression textile et sérigraphique.",
          fullDescription:
            "Une formation hybride unique qui allie la création graphique numérique de haut niveau sur Photoshop, Illustrator et InDesign à la pratique concrète de l'atelier de sérigraphie (impression sur t-shirts, sacs, supports événementiels).",
          duration: "9 mois",
          level: "Tous niveaux",
          price: 250000,
          registrationFee: 25000,
          installmentsCount: 4,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel (Atelier pratique)",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Création de logos et chartes graphiques professionnelles",
            "Mise en page éditoriale et supports publicitaires grand format",
            "Techniques d'insolation, préparation d'encres et tirage sérigraphique textile",
            "Gestion pré-presse et préparation des fichiers d'impression",
          ]),
          tools: JSON.stringify(["Photoshop", "Illustrator", "InDesign", "Table d'insolation", "Carrousel sérigraphie"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Identité Visuelle & Illustrator", description: "Typographie, dessin vectoriel et création de logos.", duration: "5 semaines" },
            { moduleNumber: "Module 02", title: "Retouche & Composition Photoshop", description: "Affiches publicitaires, photomontage et mockups réalistes.", duration: "5 semaines" },
            { moduleNumber: "Module 03", title: "Atelier Pratique de Sérigraphie", description: "Typons, insolation des cadres, dosage des encres et tirage en série.", duration: "8 semaines" },
          ]),
          jobs: JSON.stringify(["Graphiste Designer", "Sérigraphe d'Atelier", "Responsable Pré-Presse", "Créateur de Marque Textile"]),
          imageUrl: "https://images.pexels.com/photos/7172650/pexels-photo-7172650.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "marketing-digital",
          title: "Marketing Digital & Growth",
          category: "Marketing & Vente",
          shortDescription:
            "Acquisition client, Community Management, publicités Meta Ads & Google Ads, stratégie d'influence et funnel de conversion.",
          fullDescription:
            "Apprenez à faire décoller la visibilité et les ventes de n'importe quelle marque sur les réseaux sociaux. De la stratégie de contenu au ciblage publicitaire Meta/TikTok en passant par le SEO et l'email marketing automatisé.",
          duration: "3 mois",
          level: "BEPC / BAC",
          price: 150000,
          registrationFee: 20000,
          installmentsCount: 3,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel & Hybride",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Élaboration d'une stratégie de communication digitale à 360°",
            "Gestion professionnelle des communautés (Facebook, Instagram, LinkedIn, TikTok)",
            "Pilotage de campagnes publicitaires sponsorisées rentables (Meta Ads Manager)",
            "Création de funnels de vente et email marketing automatisé",
            "Analyse du ROI et pilotage avec tableaux de bord analytiques",
          ]),
          tools: JSON.stringify(["Meta Business Suite", "Google Ads", "TikTok Ads", "Canva Pro", "Mailchimp", "Google Analytics 4"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Stratégie de Contenu & Community Management", description: "Ligne éditoriale, storytelling, planification et engagement d'audience.", duration: "4 semaines" },
            { moduleNumber: "Module 02", title: "Publicité Digitale Payante (Meta & Google)", description: "Pixel Facebook, ciblage d'audience locale, tests A/B et optimisation CPA.", duration: "6 semaines" },
            { moduleNumber: "Module 03", title: "Inbound Marketing & Conversion", description: "Landing pages persuasives, capture de leads et nurturing par email.", duration: "4 semaines" },
            { moduleNumber: "Module 04", title: "Campagne Réelle pour une Entreprise Partenaire", description: "Mise en œuvre d'un budget réel avec objectifs de vente mesurables.", duration: "4 semaines" },
          ]),
          jobs: JSON.stringify(["Traffic Manager", "Community Manager", "Responsable Marketing Digital", "Growth Marketer"]),
          imageUrl: "https://images.pexels.com/photos/12662811/pexels-photo-12662811.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "maintenance-informatique-et-reseau",
          title: "Maintenance Informatique et Réseau",
          category: "Infrastructure & Réseau",
          shortDescription:
            "Diagnostic matériel, dépannage de parcs informatiques, installation de réseaux d'entreprise et cybersécurité de base.",
          fullDescription:
            "Assurez le bon fonctionnement des systèmes informatiques des entreprises. Vous serez formé au démontage, diagnostic, remplacement de composants, installation de systèmes d'exploitation, câblage RJ45, configuration de routeurs, switchs et protection antivirus.",
          duration: "6 mois",
          level: "BEPC ou BAC",
          price: 250000,
          registrationFee: 20000,
          installmentsCount: 4,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel (Laboratoire matériel)",
          isPopular: false,
          isActive: true,
          competencies: JSON.stringify([
            "Diagnostic et réparation de pannes matérielles (ordinateurs portables, tours)",
            "Installation, partitionnement et sécurisation d'environnements Windows & Linux",
            "Câblage structuré, brassage de baie et test de réseaux locaux LAN",
            "Configuration de routeurs d'entreprise (MikroTik, Cisco de base) et Wi-Fi sécurisé",
            "Mise en place de solutions de sauvegarde et sécurisation des postes de travail",
          ]),
          tools: JSON.stringify(["Testeur de câble RJ45", "Multimètre", "MikroTik RouterOS", "VirtualBox", "Wireshark", "Acronis"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Architecture Matérielle & Diagnostic Hardware", description: "Composants internes, assemblage, dépannage de cartes mères et alimentations.", duration: "5 semaines" },
            { moduleNumber: "Module 02", title: "Systèmes d'Exploitation & Maintenance Logicielle", description: "Installation OS, déploiement d'images, pilotes, élimination de malwares.", duration: "5 semaines" },
            { moduleNumber: "Module 03", title: "Réseaux d'Entreprise & Routage", description: "Adressage IP, sous-réseaux, DHCP, VLANs, Wi-Fi d'entreprise et firewall.", duration: "8 semaines" },
          ]),
          jobs: JSON.stringify(["Technicien de Maintenance Informatique", "Administrateur Réseau Junior", "Gestionnaire de Parc IT", "Support Technique N1/N2"]),
          imageUrl: "https://images.pexels.com/photos/1181571/pexels-photo-1181571.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "photographie-cadrage-et-montage-video",
          title: "Photographie, Cadrage et Montage Vidéo",
          category: "Audiovisuel & Drones",
          shortDescription:
            "Maîtrisez les caméras professionnelles, l'éclairage studio, la prise de son, et le montage cinématographique sur Premiere Pro.",
          fullDescription:
            "De la captation à la post-production, développez un œil cinématographique. Vous apprendrez à régler les boîtiers reflex et hybrides (Sony, Canon), composer la lumière en studio ou en extérieur, enregistrer un son propre et monter des vidéos dynamiques pour YouTube, TikTok et les spots publicitaires.",
          duration: "1 an",
          level: "Tous niveaux",
          price: 300000,
          registrationFee: 25000,
          installmentsCount: 4,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Paramétrage manuel des caméras professionnelles (ISO, ouverture, vitesse, profils LOG)",
            "Composition de lumière studio (système 3 points, projecteurs LED, softboxes)",
            "Prise de son avec micros cravates HF, micros canons et enregistreurs externes",
            "Montage dynamique et narration visuelle sur Adobe Premiere Pro",
            "Étalonnage colorimétrique et mixage audio de post-production",
          ]),
          tools: JSON.stringify(["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Sony Alpha", "Gimbal Ronin", "Rode Wireless"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Prise de Vue & Photographie Studio", description: "Triangle d'exposition, objectifs, cadrage et portrait professionnel.", duration: "5 semaines" },
            { moduleNumber: "Module 02", title: "Captation Vidéo & Prise de Son", description: "Mouvements de caméra, stabilisation avec stabilisateur, prise de son interview.", duration: "5 semaines" },
            { moduleNumber: "Module 03", title: "Montage & Post-Production Vidéo", description: "Dérushage, rythme, sound design, transitions percutantes et sous-titrage.", duration: "8 semaines" },
          ]),
          jobs: JSON.stringify(["Vidéaste / Cadreur", "Monteur Vidéo Professionnel", "Photographe Commercial", "Créateur de Contenu Audiovisuel"]),
          imageUrl: "https://images.pexels.com/photos/8100067/pexels-photo-8100067.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "copywriting",
          title: "Copywriting & Storytelling Digital",
          category: "Marketing & Vente",
          shortDescription:
            "Apprenez l'art d'écrire des mots qui captivent, persuadent et vendent pour le web, les emails et les publicités.",
          fullDescription:
            "Le copywriting est la compétence la plus rentable de l'ère digitale. Vous apprendrez les structures psychologiques de persuasion (AIDA, PAS, BAB), l'écriture d'accroches irrésistibles, la rédaction de pages de capture à fort taux de conversion, et la création de newsletters lues et partagées.",
          duration: "2 mois",
          level: "Tous niveaux (Aisance rédactionnelle)",
          price: 150000,
          registrationFee: 20000,
          installmentsCount: 2,
          campus: "Godomey (Cotonou) & En ligne",
          mode: "Hybride & Présentiel",
          isPopular: false,
          isActive: true,
          competencies: JSON.stringify([
            "Maîtrise des formules éprouvées de persuasion (AIDA, PAS, PASTOR)",
            "Rédaction de pages de vente à forte conversion et fiches produits",
            "Création de séquences d'emails promotionnels et relationnels",
            "Écriture de scripts percutants pour publicités vidéo (TikTok, Reels, YouTube)",
          ]),
          tools: JSON.stringify(["Google Docs", "Notion", "Grammarly", "ChatGPT (co-écriture)", "Hemingway App"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Psychologie d'Achat & Anatomie d'une Offre", description: "Biais cognitifs, désirs profonds des prospects et proposition de valeur unique.", duration: "3 semaines" },
            { moduleNumber: "Module 02", title: "Titres, Accroches & Pages de Vente", description: "La science du premier mot, storytelling captivant et appels à l'action.", duration: "4 semaines" },
            { moduleNumber: "Module 03", title: "Emailing, Scripts Publicitaires & Portfolio", description: "Création de séquences réelles et construction de votre book client.", duration: "4 semaines" },
          ]),
          jobs: JSON.stringify(["Copywriter Freelance", "Concepteur Rédacteur Publicitaire", "Email Marketer", "Créateur de Contenu Vendeur"]),
          imageUrl: "https://images.pexels.com/photos/8197509/pexels-photo-8197509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "e-commerce",
          title: "E-commerce & Vente en Ligne",
          category: "Marketing & Vente",
          shortDescription:
            "Lancez et gérez une boutique en ligne rentable adaptée au marché béninois et international avec paiements Mobile Money.",
          fullDescription:
            "Du sourcing de produits locaux ou d'importation à la gestion de la logistique de livraison à Cotonou et Calavi, maîtrisez toute la chaîne du commerce électronique. Configurez votre boutique avec intégration Mobile Money (MTN, Moov, Wave) et maximisez votre retour sur investissement.",
          duration: "2 mois",
          level: "BEPC / BAC",
          price: 150000,
          registrationFee: 20000,
          installmentsCount: 2,
          campus: "Godomey (Cotonou)",
          mode: "Présentiel & Hybride",
          isPopular: false,
          isActive: true,
          competencies: JSON.stringify([
            "Création et paramétrage de boutiques Shopify et WooCommerce",
            "Intégration technique des passerelles Mobile Money (FedaPay, KKiaPay)",
            "Stratégie de sourcing de produits et fixation des marges bénéficiaires",
            "Gestion des commandes, livraisons locales et service client WhatsApp Business",
          ]),
          tools: JSON.stringify(["Shopify", "WooCommerce", "FedaPay", "KKiaPay", "WhatsApp Business API", "Meta Ads"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Création de la Boutique & Passerelles Bénin", description: "Catalogue produit, paniers d'achat, passerelles MTN et Moov Money.", duration: "4 semaines" },
            { moduleNumber: "Module 02", title: "Acquisition de Trafic & Stratégie WhatsApp", description: "Publicités ciblées vers WhatsApp et automatisation du support client.", duration: "4 semaines" },
            { moduleNumber: "Module 03", title: "Logistique Locale & Gestion Financière", description: "Partenariats livreurs, gestion des stocks et calcul de la rentabilité nette.", duration: "4 semaines" },
          ]),
          jobs: JSON.stringify(["E-commerçant indépendant", "Responsable E-commerce d'entreprise", "Consultant en Vente en Ligne", "Gestionnaire de Boutique Digitale"]),
          imageUrl: "https://images.pexels.com/photos/12662811/pexels-photo-12662811.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
        {
          slug: "pilotage-de-drone",
          title: "Pilotage Professionnel de Drone",
          category: "Audiovisuel & Drones",
          shortDescription:
            "Apprenez le pilotage certifié de drones civils pour la cartographie, l'inspection technique, la production audiovisuelle et l'agriculture.",
          fullDescription:
            "Une formation de pointe alliant théorie aéronautique, réglementation aérienne de l'ANAC Bénin et heures de vol intensives en extérieur. Apprenez à réaliser des prises de vue cinématiques spectaculaires, des relevés topographiques et des inspections d'ouvrages industriels.",
          duration: "1 mois (Théorie + Pratique terrain)",
          level: "Tous niveaux (à partir de 18 ans)",
          price: 100000,
          registrationFee: 25000,
          installmentsCount: 1,
          campus: "Godomey (Cotonou) & Terrain extérieur",
          mode: "Présentiel (Pratique sur simulateur et vol réel)",
          isPopular: true,
          isActive: true,
          competencies: JSON.stringify([
            "Maîtrise du pilotage manuel et assisté sur drones DJI professionnels",
            "Connaissance de la réglementation aérienne civile et sécurité des vols",
            "Captation d'images aériennes 4K fluides pour cinéma et télévision",
            "Missions de cartographie 3D, photogrammétrie et agriculture de précision",
            "Maintenance de base et gestion de l'électronique de bord",
          ]),
          tools: JSON.stringify(["DJI Mavic 3 Pro", "DJI Air 3", "DJI Fly", "DroneDeploy", "Pix4D", "Simulateur RealFlight"]),
          modules: JSON.stringify([
            { moduleNumber: "Module 01", title: "Réglementation, Sécurité & Météorologie", description: "Règles de l'air, zones interdites, météo, check-lists avant vol.", duration: "3 semaines" },
            { moduleNumber: "Module 02", title: "Pilotage Pratique & Manœuvres de Précision", description: "Vol stationnaire, figures de vol, gestion des urgences et perte de signal.", duration: "4 semaines" },
            { moduleNumber: "Module 03", title: "Prise de Vue Cinématique & Photogrammétrie", description: "Mouvements de caméra complexes, plans de vol automatisés et traitement d'images.", duration: "4 semaines" },
          ]),
          jobs: JSON.stringify(["Télépilote Professionnel de Drone", "Opérateur Aérien Audiovisuel", "Technicien en Photogrammétrie & Inspection", "Consultant Drone BTP & Agriculture"]),
          imageUrl: "https://images.pexels.com/photos/14484029/pexels-photo-14484029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        },
      ])
      .returning();

    // 3. Promotions for Web Fullstack and others
    const fullstack = insertedFormations.find((f) => f.slug === "developpement-web-fullstack")!;
    const iaDev = insertedFormations.find((f) => f.slug === "developpement-intelligence-artificielle")!;
    const drone = insertedFormations.find((f) => f.slug === "pilotage-de-drone")!;
    const uiux = insertedFormations.find((f) => f.slug === "web-design-ui-ux")!;

    const insertedPromotions = await db
      .insert(promotions)
      .values([
        {
          formationId: fullstack.id,
          name: "Promotion TechCraft 04 (Session Janvier 2025)",
          campus: "Godomey (Cotonou)",
          startDate: "15 Janvier 2025",
          endDate: "15 Octobre 2025",
          status: "en_cours",
        },
        {
          formationId: fullstack.id,
          name: "Promotion Mars 2025 (Cotonou)",
          campus: "Godomey (Cotonou)",
          startDate: "20 Mars 2025",
          endDate: "20 Décembre 2025",
          status: "ouverte",
        },
        {
          formationId: fullstack.id,
          name: "Promotion Calavi 2025 (Abomey-Calavi)",
          campus: "Godomey (Cotonou)",
          startDate: "05 Avril 2025",
          endDate: "05 Janvier 2026",
          status: "ouverte",
        },
        {
          formationId: iaDev.id,
          name: "Promotion DeepAfrica 02 (Session Février 2025)",
          campus: "Godomey (Cotonou)",
          startDate: "10 Février 2025",
          endDate: "10 Octobre 2025",
          status: "en_cours",
        },
        {
          formationId: drone.id,
          name: "Session SkyCraft Mars 2025",
          campus: "Godomey (Cotonou) & Terrains extérieurs",
          startDate: "01 Mars 2025",
          endDate: "30 Mai 2025",
          status: "ouverte",
        },
        {
          formationId: uiux.id,
          name: "Promotion DesignCraft 03",
          campus: "Godomey (Cotonou)",
          startDate: "15 Février 2025",
          endDate: "15 Août 2025",
          status: "en_cours",
        },
      ])
      .returning();

    // 4. Students
    // Onesim Tokpo (as specified in the Cahier des Charges: total 300 000 FCFA, paid 240 000 FCFA, remaining 60 000 FCFA, Fullstack)
    const promoFullstackActive = insertedPromotions[0];
    const onesimUser = seededUsers.find((u) => u.email === "onesim.tokpo@etudiant.futurcraft.bj");

    const insertedStudents = await db
      .insert(students)
      .values([
        {
          studentNumber: "FC-2025-0142",
          userId: onesimUser?.id,
          firstName: "Onesim",
          lastName: "Graça",
          gender: "M",
          birthDate: "2002-04-14",
          birthPlace: "Cotonou",
          nationality: "Béninoise",
          residenceCountry: "Bénin",
          city: "Cotonou",
          address: "Haie Vive, Rue 412",
          phone: "+229 97 88 99 00",
          whatsapp: "+229 97 88 99 00",
          email: "onesim.tokpo@etudiant.futurcraft.bj",
          avatarUrl: "https://images.pexels.com/photos/9159001/pexels-photo-9159001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
          previousDiploma: "Baccalauréat Série C",
          studyLevel: "BAC+2 (Licence 2 en Informatique)",
          previousSchool: "UAC - Université d'Abomey-Calavi",
          studyField: "Sciences Mathématiques et Informatique",
          previousExperience: "Stage découverte développeur web chez WebSolutions Bénin",
          guardianName: "M. Paul TOKPO",
          guardianRelation: "Père",
          guardianPhone: "+229 95 33 22 11",
          guardianEmail: "p.tokpo@gmail.com",
          formationId: fullstack.id,
          promotionId: promoFullstackActive.id,
          status: "actif",
          totalAmount: 300000,
          paidAmount: 240000,
          remainingAmount: 60000,
        },
        {
          studentNumber: "FC-2025-0089",
          firstName: "Amina",
          lastName: "SOSSOU",
          gender: "F",
          birthDate: "2003-08-22",
          birthPlace: "Porto-Novo",
          nationality: "Béninoise",
          residenceCountry: "Bénin",
          city: "Porto-Novo",
          address: "Quartier Ouando",
          phone: "+229 96 12 34 56",
          whatsapp: "+229 96 12 34 56",
          email: "amina.sossou@gmail.com",
          avatarUrl: "https://images.pexels.com/photos/8197509/pexels-photo-8197509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
          previousDiploma: "Baccalauréat Série D",
          studyLevel: "BAC",
          previousSchool: "Lycée Béhanzin",
          studyField: "Sciences de la Vie",
          previousExperience: "Passionnée de graphisme et création de logos",
          guardianName: "Mme Claire SOSSOU",
          guardianRelation: "Mère",
          guardianPhone: "+229 97 10 20 30",
          guardianEmail: "claire.sossou@yahoo.fr",
          formationId: uiux.id,
          promotionId: insertedPromotions.find((p) => p.formationId === uiux.id)?.id,
          status: "actif",
          totalAmount: 240000,
          paidAmount: 180000,
          remainingAmount: 60000,
        },
        {
          studentNumber: "FC-2025-0204",
          firstName: "Koffi",
          lastName: "MENSAH",
          gender: "M",
          birthDate: "2001-11-05",
          birthPlace: "Parakou",
          nationality: "Béninoise",
          residenceCountry: "Bénin",
          city: "Cotonou",
          address: "Agla Les Pylônes",
          phone: "+229 94 44 88 12",
          whatsapp: "+229 94 44 88 12",
          email: "koffi.mensah@gmail.com",
          avatarUrl: "https://images.pexels.com/photos/33955752/pexels-photo-33955752.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
          previousDiploma: "Licence en Géographie",
          studyLevel: "BAC+3",
          previousSchool: "Université de Parakou",
          studyField: "Aménagement du territoire",
          previousExperience: "Relevés de terrain pour projets agricoles",
          guardianName: "M. Daniel MENSAH",
          guardianRelation: "Oncle",
          guardianPhone: "+229 95 77 66 55",
          guardianEmail: "d.mensah@yahoo.fr",
          formationId: drone.id,
          promotionId: insertedPromotions.find((p) => p.formationId === drone.id)?.id,
          status: "inscrit",
          totalAmount: 280000,
          paidAmount: 100000,
          remainingAmount: 180000,
        },
        {
          studentNumber: "FC-2025-0310",
          firstName: "Bérénice",
          lastName: "DOSSOU",
          gender: "F",
          birthDate: "2004-02-18",
          birthPlace: "Abomey-Calavi",
          nationality: "Béninoise",
          residenceCountry: "Bénin",
          city: "Abomey-Calavi",
          address: "Godomey",
          phone: "+229 61 22 33 44",
          whatsapp: "+229 61 22 33 44",
          email: "berenice.dossou@gmail.com",
          avatarUrl: "https://images.pexels.com/photos/12662811/pexels-photo-12662811.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
          previousDiploma: "Baccalauréat Série C",
          studyLevel: "BAC+1",
          previousSchool: "UAC",
          studyField: "Informatique Fondamentale",
          previousExperience: "Débutante motivée pour l'IA",
          formationId: iaDev.id,
          promotionId: insertedPromotions.find((p) => p.formationId === iaDev.id)?.id,
          status: "actif",
          totalAmount: 350000,
          paidAmount: 200000,
          remainingAmount: 150000,
        },
        {
          studentNumber: "FC-2025-0451",
          firstName: "Landry",
          lastName: "HOUNGBO",
          gender: "M",
          birthDate: "2000-09-12",
          birthPlace: "Cotonou",
          nationality: "Béninoise",
          residenceCountry: "Bénin",
          city: "Cotonou",
          address: "Fidjrossè Calvaire",
          phone: "+229 97 15 26 37",
          whatsapp: "+229 97 15 26 37",
          email: "landry.houngbo@gmail.com",
          avatarUrl: "https://images.pexels.com/photos/8197499/pexels-photo-8197499.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300",
          previousDiploma: "BEPC & CAP Electricité",
          studyLevel: "BEPC",
          previousSchool: "Lycée Technique de Coulibaly",
          studyField: "Électricité Bâtiment",
          previousExperience: "Dépannage d'ordinateurs dans un cybercafé",
          formationId: fullstack.id,
          status: "preinscrit",
          totalAmount: 300000,
          paidAmount: 0,
          remainingAmount: 300000,
        },
      ])
      .returning();

    const onesim = insertedStudents.find((s) => s.studentNumber === "FC-2025-0142")!;

    // 5. Payment Schedules for Onesim matching specification:
    // Inscription: 25 000 FCFA - Payé (10 septembre)
    // Mensualité 1: 50 000 FCFA - Payé (05 octobre)
    // Mensualité 2: 50 000 FCFA - Payé (05 novembre)
    // Mensualité 3: 50 000 FCFA - Payé (05 décembre)
    // Mensualité 4: 65 000 FCFA - Payé (05 janvier) -> Total payé = 240 000 FCFA
    // Mensualité 5: 60 000 FCFA - En attente (05 avril 2025) -> Reste = 60 000 FCFA
    const onesimSchedules = await db
      .insert(paymentSchedules)
      .values([
        {
          studentId: onesim.id,
          title: "Frais d'inscription & dossier",
          amount: 25000,
          dueDate: "10 Septembre 2024",
          status: "paye",
          paidAt: "08 Septembre 2024",
          transactionRef: "MTN-BJ-240908-1142",
        },
        {
          studentId: onesim.id,
          title: "Mensualité 1 — Démarrage formation",
          amount: 50000,
          dueDate: "05 Octobre 2024",
          status: "paye",
          paidAt: "04 Octobre 2024",
          transactionRef: "MTN-BJ-241004-9021",
        },
        {
          studentId: onesim.id,
          title: "Mensualité 2 — Frontend & React",
          amount: 50000,
          dueDate: "05 Novembre 2024",
          status: "paye",
          paidAt: "05 Novembre 2024",
          transactionRef: "CAISSE-COT-241105-03",
        },
        {
          studentId: onesim.id,
          title: "Mensualité 3 — Backend & APIs Node",
          amount: 50000,
          dueDate: "05 Décembre 2024",
          status: "paye",
          paidAt: "03 Décembre 2024",
          transactionRef: "MOOV-BJ-241203-7714",
        },
        {
          studentId: onesim.id,
          title: "Mensualité 4 — Bases de données & Projets",
          amount: 65000,
          dueDate: "05 Février 2025",
          status: "paye",
          paidAt: "04 Février 2025",
          transactionRef: "MTN-BJ-250204-5582",
        },
        {
          studentId: onesim.id,
          title: "Mensualité 5 (Solde final) — Soutenance & Stage",
          amount: 60000,
          dueDate: "05 Avril 2025",
          status: "en_attente",
          paidAt: null,
          transactionRef: null,
        },
      ])
      .returning();

    // 6. Payments and Receipts for Onesim
    const paidSchedules = onesimSchedules.filter((s) => s.status === "paye");
    const paymentMethods = [
      "MTN Mobile Money",
      "MTN Mobile Money",
      "Caisse / Espèces",
      "Moov Money",
      "MTN Mobile Money",
    ];

    for (let i = 0; i < paidSchedules.length; i++) {
      const schedule = paidSchedules[i];
      const recNum = `REC-2025-${String(1420 + i).padStart(5, "0")}`;
      const vCode = `FC-SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      const [paymentRecord] = await db
        .insert(payments)
        .values({
          receiptNumber: recNum,
          studentId: onesim.id,
          scheduleId: schedule.id,
          amount: schedule.amount,
          paymentMethod: paymentMethods[i] || "MTN Mobile Money",
          transactionRef: schedule.transactionRef || `TRX-${Date.now()}`,
          status: "valide",
          notes: `Règlement validé pour: ${schedule.title}`,
          recordedBy: i === 2 ? "Sarah Menou (Caisse Cotonou)" : "Passerelle Automatique Mobile Money",
          paidAt: schedule.paidAt || "2025-01-10",
        })
        .returning();

      await db.insert(receipts).values({
        receiptNumber: recNum,
        paymentId: paymentRecord.id,
        studentId: onesim.id,
        verificationCode: vCode,
        qrData: `https://futurcraft.bj/recu/${recNum}?code=${vCode}&etudiant=FC-2025-0142`,
        issuedAt: schedule.paidAt || "2025-01-10",
      });
    }

    // 7. Notifications for Onesim
    await db.insert(notifications).values([
      {
        studentId: onesim.id,
        title: "Paiement validé avec succès",
        message: "Votre versement de 65 000 FCFA (Mensualité 4) a été validé. Votre reçu REC-2025-01424 est disponible au téléchargement.",
        type: "payment",
        isRead: true,
      },
      {
        studentId: onesim.id,
        title: "Prochaine échéance de scolarité",
        message: "Rappel : la mensualité finale de 60 000 FCFA arrive à échéance le 05 Avril 2025.",
        type: "payment",
        isRead: false,
      },
      {
        studentId: onesim.id,
        title: "Hackathon FuturTech 2025 annoncé !",
        message: "Les inscriptions pour le grand Hackathon annuel de FuturCraft sont ouvertes. 1 500 000 FCFA de prix à gagner.",
        type: "event",
        isRead: false,
      },
      {
        studentId: onesim.id,
        title: "Attestation d'inscription disponible",
        message: "Votre attestation officielle d'inscription pour l'année académique 2024-2025 est téléchargeable dans 'Mes documents'.",
        type: "document",
        isRead: true,
      },
    ]);

    // 8. Student Projects (matching Cahier des charges: GEN3RVTO + others)
    await db.insert(studentProjects).values([
      {
        slug: "gen3rvto-rh",
        title: "GEN3RVTO",
        tagline: "Plateforme intelligente de gestion des ressources humaines et des talents pour PME africaines",
        description:
          "Conçue par des étudiants en Développement Fullstack, GEN3RVTO automatise la gestion des congés, la paie instantanée avec intégration Mobile Money et le suivi des performances avec des analytics en temps réel.",
        coverImage: "/images/GEN3RVTO.png",
        formationTitle: "Développement Web Fullstack",
        technologies: JSON.stringify(["React", "NestJS", "PostgreSQL", "Prisma", "Tailwind CSS"]),
        teamMembers: JSON.stringify([
          { name: "Onesim Graça", role: "Lead Frontend & Architecture" },
          { name: "Boris KPADONOU", role: "Backend & API NestJS" },
          { name: "Amina SOSSOU", role: "UI/UX Design & Prototypage" },
        ]),
        projectUrl: "https://gen3rvto.vercel.app/",
        githubUrl: "https://github.com/futurcraft-students/gen3rvto-rh",
        isFeatured: true,
      },
      {
        slug: "ayiha-boost",
        title: "AYIHA-Boost",
        tagline: "Application de accompagnement et de boost de la réussite scolaire",
        description:
          "Projet étudiant conçu pour accompagner et dynamiser le parcours scolaire : suivi personnalisé, motivation et outils d'apprentissage destinés aux lycéens et étudiants.",
        coverImage: "/images/AYIHA-Boost.webp",
        formationTitle: "Développement Web Fullstack",
        technologies: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS"]),
        teamMembers: JSON.stringify([
          { name: "Loïc Assogba", role: "Développeur Fullstack" },
        ]),
        projectUrl: "https://ayiha-psi.vercel.app/",
        githubUrl: "",
        isFeatured: true,
      },
      {
        slug: "agroconnect-benin",
        title: "AgroConnect Bénin",
        tagline: "Marketplace agricole intelligente connectant producteurs locaux et distributeurs urbains",
        description:
          "Plateforme web et mobile facilitant l'achat direct de produits vivriers béninois (ananas pain de sucre, maïs, manioc) sans intermédiaires abusifs, avec géolocalisation et paiement sécurisé.",
        coverImage: "https://images.pexels.com/photos/9159001/pexels-photo-9159001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        formationTitle: "E-commerce & Web Fullstack",
        technologies: JSON.stringify(["Next.js", "Node.js", "PostgreSQL", "FedaPay", "Tailwind CSS"]),
        teamMembers: JSON.stringify([
          { name: "Sylvain DOHOU", role: "Fullstack Developer" },
          { name: "Marielle AKPO", role: "E-commerce & Growth" },
        ]),
        projectUrl: "https://agroconnect.demo.futurcraft.bj",
        githubUrl: "https://github.com/futurcraft-students/agroconnect-bj",
        isFeatured: true,
      },
      {
        slug: "skyfarm-drone-ai",
        title: "SkyFarm Drone Vision",
        tagline: "Système de télédétection par drone et IA pour la détection précoce des maladies des cultures",
        description:
          "Fusionnant le pilotage de drone et la vision par ordinateur avec PyTorch, ce projet permet de survoler les champs et cartographier les foyers d'infestation avec une précision centimétrique.",
        coverImage: "https://images.pexels.com/photos/14484029/pexels-photo-14484029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        formationTitle: "Pilotage de Drone & Intelligence Artificielle",
        technologies: JSON.stringify(["Python", "PyTorch", "DJI SDK", "OpenCV", "FastAPI", "React"]),
        teamMembers: JSON.stringify([
          { name: "Koffi MENSAH", role: "Télépilote & Cartographie" },
          { name: "Bérénice DOSSOU", role: "Modélisation IA & Vision" },
        ]),
        projectUrl: "https://skyfarm.demo.futurcraft.bj",
        githubUrl: "https://github.com/futurcraft-students/skyfarm-vision",
        isFeatured: true,
      },
      {
        slug: "djidjo-esante",
        title: "DjiDjo Santé",
        tagline: "Dossier médical patient numérique et télé-orientation pour cliniques béninoises",
        description:
          "Interface fluide pensée pour les centres de santé en zone péri-urbaine, facilitant les rendez-vous, les prescriptions sécurisées et l'historique vaccinal.",
        coverImage: "https://images.pexels.com/photos/7014919/pexels-photo-7014919.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        formationTitle: "Web Design (UI/UX) & Fullstack",
        technologies: JSON.stringify(["Figma", "React", "TypeScript", "Tailwind CSS"]),
        teamMembers: JSON.stringify([
          { name: "Amina SOSSOU", role: "Lead UI/UX Designer" },
          { name: "Félicien ZANNOU", role: "Développeur Frontend" },
        ]),
        projectUrl: "https://djidjo.demo.futurcraft.bj",
        githubUrl: "https://github.com/futurcraft-students/djidjo-esante",
        isFeatured: true,
      },
    ]);

    // 9. Company Offers
    await db.insert(companyOffers).values([
      {
        companyName: "InnovTech Bénin",
        contactPerson: "Fabrice Gomez",
        email: "recrutement@innovtech.bj",
        phone: "+229 97 22 44 88",
        offerType: "stage",
        title: "Stage Développeur Frontend React / Next.js (3 à 6 mois)",
        location: "Godomey (Cotonou) / Hybride",
        description:
          "Nous recherchons 2 stagiaires talentueux issus de FuturCraft Institut pour intégrer notre équipe produit sur la refonte de notre plateforme fintech.",
        skillsRequired: "React, Next.js, Tailwind CSS, Git, intégration d'APIs REST",
        deadline: "2025-04-30",
        status: "publie",
      },
      {
        companyName: "AfriDigital Agency",
        contactPerson: "Nathalie Houndégla",
        email: "talents@afridigital.bj",
        phone: "+229 96 55 11 00",
        offerType: "emploi",
        title: "UI/UX Designer Junior (CDI)",
        location: "Godomey (Cotonou)",
        description:
          "Pour accompagner notre croissance en Afrique de l'Ouest, nous recrutons un(e) UI/UX Designer passionné(e) par la création d'expériences mobiles mémorables.",
        skillsRequired: "Figma expert, prototypage, design system, tests utilisateurs",
        deadline: "2025-05-15",
        status: "publie",
      },
      {
        companyName: "Bénin Drone Solutions",
        contactPerson: "Arnaud Vodounou",
        email: "contact@benindrone.com",
        phone: "+229 95 88 44 11",
        offerType: "freelance",
        title: "Télépilote de Drone pour Missions Topographiques",
        location: "Godomey (Cotonou)",
        description:
          "Mission freelance régulière pour missions de captation et photogrammétrie sur des chantiers d'aménagement urbain.",
        skillsRequired: "Certification télépilote, DJI Mavic 3 / Phantom, Pix4D",
        deadline: "2025-04-15",
        status: "publie",
      },
    ]);

    // 10. Events
    await db.insert(events).values([
      {
        title: "Hackathon FuturTech 2025 : L'IA au service de l'Afrique",
        date: "25 - 27 Avril 2025",
        location: "Campus Godomey (Cotonou) & En ligne",
        category: "Hackathon",
        description:
          "48 heures de code non-stop pour concevoir des solutions IA concrètes répondant aux défis de l'agriculture, de la santé et de l'éducation en Afrique.",
        imageUrl: "https://images.pexels.com/photos/33920044/pexels-photo-33920044.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        attendeesCount: 150,
      },
      {
        title: "Masterclass Drone & Cartographie Numérique",
        date: "12 Mai 2025",
        location: "Amphithéâtre FuturCraft & Espace Vol",
        category: "Masterclass",
        description:
          "Démonstration en direct d'acquisition photogrammétrique par drone et reconstruction de nuages de points 3D pour le génie civil.",
        imageUrl: "https://images.pexels.com/photos/14484029/pexels-photo-14484029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        attendeesCount: 85,
      },
      {
        title: "Journée Portes Ouvertes & Job Dating Tech",
        date: "07 Juin 2025",
        location: "Campus Godomey",
        category: "Portes Ouvertes",
        description:
          "Venez découvrir nos campus, échanger avec nos formateurs et rencontrer les entreprises partenaires qui recrutent nos étudiants.",
        imageUrl: "https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        attendeesCount: 220,
      },
    ]);

    // 11. Blog Articles / Actualités
    await db.insert(blogArticles).values([
      {
        slug: "pourquoi-se-former-au-numerique-au-benin-en-2025",
        title: "Pourquoi se former aux métiers du numérique au Bénin en 2025 ?",
        excerpt:
          "Le numérique explose en Afrique de l'Ouest. Découvrez les compétences les plus recherchées par les recruteurs et comment FuturCraft prépare les talents.",
        content: `Le continent africain vit une révolution technologique sans précédent. Au Bénin, l'essor de la digitalisation des services publics, l'arrivée de la fibre optique et la création d'écosystèmes d'innovation comme Sèmè City démontrent l'urgence d'une main-d'œuvre hautement qualifiée.

ì FuturCraft Institut, nous avons fait le choix radical de la pratique : 80% de nos cours se font face à un projet réel, avec un mentorat continu et des technologies utilisées au quotidien dans les entreprises de premier plan.

Qu'il s'agisse de développement Fullstack, de modélisation en intelligence artificielle, d'audiovisuel ou de pilotage de drones, notre mission est de transformer la curiosité en expertise professionnelle rentable.`,
        coverImage: "https://images.pexels.com/photos/33920044/pexels-photo-33920044.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        author: "Gauthier I. ORE, Co-Fondateur",
        readTime: "4 min",
        category: "Orientation & Carrière",
        publishedAt: "10 Février 2025",
      },
      {
        slug: "les-etudiants-de-futurcraft-devoilent-leurs-projets-de-fin-de-cohorte",
        title: "Les étudiants de FuturCraft dévoilent leurs projets de fin de cohorte devant un jury d'entreprises",
        excerpt:
          "De la gestion intelligente des RH à la cartographie agricole par drone, retour sur une journée de pitchs impressionnants au campus de Godomey.",
        content: `Ce samedi s'est tenue la soutenance officielle de la cohorte TechCraft. Devant un jury composé de directeurs techniques, de fondateurs de startups et de directeurs d'agences digitales de Cotonou, 15 équipes ont défendu leurs applications en conditions réelles.

Les projets présentés ont démontré une maturité technique remarquable : architectures réactives, APIs résilientes, interfaces soignées et respect rigoureux des contraintes de performance. Plusieurs étudiants ont reçu des offres de stage et d'embauche immédiates à l'issue de la journée.`,
        coverImage: "https://images.pexels.com/photos/9159042/pexels-photo-9159042.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        author: "Équipe Pédagogique FuturCraft",
        readTime: "3 min",
        category: "Vie à FuturCraft",
        publishedAt: "28 Janvier 2025",
      },
      {
        slug: "comment-l-ia-transforme-le-travail-des-creatifs-et-marketeurs",
        title: "Comment l'IA transforme le travail des créatifs et marketeurs en Afrique",
        excerpt:
          "Loin de remplacer les humains, les outils d'IA augmentent la productivité de ceux qui savent les maîtriser. Analyse et conseils pratiques.",
        content: `L'intelligence artificielle n'est pas une menace pour les créatifs, c'est un amplificateur de talent. Les marketeurs et designers qui adoptent des workflows intégrant Midjourney, Claude et ChatGPT produisent cinq fois plus vite des maquettes, du copywriting percutant et des analyses de marché précises.

Dans notre formation intensive 'Maîtrise des outils d'IA', nous guidons les professionnels pour passer du statut de spectateur à celui d'artisan augmenté.`,
        coverImage: "https://images.pexels.com/photos/8199137/pexels-photo-8199137.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        author: "Marcelle Agossou",
        readTime: "5 min",
        category: "Intelligence Artificielle",
        publishedAt: "15 Janvier 2025",
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
