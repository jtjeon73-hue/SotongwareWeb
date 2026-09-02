import type { SiteDictionary, CapabilityDictionaryMap } from "../site-types";

export const enSite: SiteDictionary = {
  nav: {
    technology: "Technology",
    digitalVentures: "Digital Ventures",
    portfolio: "Portfolio",
    about: "About",
    contact: "Contact",
    contactCta: "Contact",
    contactCtaAria: "Consultation and inquiry",
    resources: "Resources",
    process: "How we build",
    guide: "Usage guide",
    homeAria: "SotongWare home",
    mainMenu: "Main menu",
    mobileMenu: "Mobile menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    viewService: "View service",
    viewAllServices: "All services",
    externalSite: "Dedicated site ↗",
    brandSubtitle: "Digital business platform",
    digitalVenturesBadge: "Core",
    digitalVenturesBlurb: "SotongWare's core growth businesses — apps, e-books, sites, content, education, and automation",
    digitalVenturesHubCta: "Product portfolio",
    technologyItems: [
      { label: "Industrial automation", slug: "industrial-automation" },
      { label: "Smart farm & ag automation", slug: "smart-farm" },
      { label: "AI software", slug: "ai-software" },
      { label: "Apps, web & remote control", slug: "multiplatform-control" },
    ],
    ventureItems: [
      { label: "Apps", href: "/apps" },
      { label: "E-books", href: "/ebooks" },
      { label: "Websites", href: "/marketing" },
      { label: "Content", href: "/contents" },
      { label: "Knowledge & education", href: "/knowledge" },
      { label: "Automation solutions", href: "/automation" },
    ],
  },
  footer: {
    tagline: "Digital business platform",
    description:
      "SotongWare builds and operates industrial automation, apps, e-books, learning, marketing, and content as digital products.",
    externalServices: "Service channels",
    guide: "Usage guide",
    company: "Company",
    legal: "Legal",
    rights: "All rights reserved.",
  },
  common: {
    home: "Home",
    backHome: "Back to home",
    learnMore: "Learn more",
    contactUs: "Contact us",
    launchPrep: "Launch prep",
    inValidation: "In validation",
    live: "Live",
    comingSoon: "Coming soon",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you requested does not exist or has moved.",
    notFoundCta: "Return home",
  },
  pages: {
    about: {
      meta: {
        title: "About SotongWare",
        description: "A technology company that starts on the plant floor and extends into digital products and services",
      },
      eyebrow: "About SotongWare",
      title: "We build technology—and keep shipping",
      description:
        "SotongWare starts in industrial environments and extends into software, automation, apps, web, knowledge, and content.",
      journeyTitle: "Our journey",
      blocks: [
        { title: "Industrial field", titleEn: "Industrial Field", description: "We start with real problems—PLCs, equipment, and production data on the plant floor." },
        { title: "Software engineering", titleEn: "Software Engineering", description: "We solve problems with code—web, apps, and automation software designed in-house." },
        { title: "AI utilization", titleEn: "AI Utilization", description: "We use AI as a practical tool to accelerate production and scale outcomes." },
        { title: "Digital products", titleEn: "Digital Product", description: "We productize into apps, web, e-books, and content—with deployment, not just prototypes." },
        { title: "Business connection", titleEn: "Business Connection", description: "We connect to distribution, marketing, and sales through dedicated channels and digital products." },
      ],
      servicesTitle: "Core business areas",
      servicesDescription: "SotongWare operates dedicated service lines in the following areas.",
      ctaContact: "Consultation & inquiry",
      ctaProducts: "View portfolio",
    },
    contact: {
      meta: { title: "Contact", description: "Production requests, quotes, and consultation for SotongWare" },
      title: "Consultation & inquiry",
      description:
        "Submit production requests, quotes, or general inquiries. If online intake is not yet live, we will guide you to the relevant dedicated site.",
      ctaGuide: "Usage guide",
    },
  },
};

export const enCapabilities: CapabilityDictionaryMap = {
  "industrial-automation": {
    meta: {
      title: "Industrial automation software",
      description: "PLC, HMI, MES, vision inspection, and equipment monitoring—field-fit industrial software",
    },
    hero: {
      eyebrow: "Industrial Automation",
      title: "Industrial software that connects plant-floor data",
      subtitle:
        "Collect, analyze, and manage equipment, production, quality, and alarm data—linked to on-site PCs, servers, and mobile devices.",
      ctas: [
        { label: "Automation consultation", href: "/contact?topic=automation", variant: "primary" },
        { label: "View portfolio", href: "/products", variant: "outline" },
      ],
    },
    problems: {
      title: "Problems we address",
      items: [
        { title: "No real-time equipment visibility", description: "Line status and alarms are scattered, making it hard for operators to respond quickly." },
        { title: "Paper-based checks and records", description: "Inspection and quality data stay on the floor, blocking analysis and traceability." },
        { title: "Integrating legacy and new systems", description: "PLCs, HMIs, and upper systems use different protocols—phased integration is required." },
        { title: "Delayed alarm and defect response", description: "Time from alert to root cause and action increases losses." },
      ],
    },
    strengths: {
      title: "Core capabilities",
      items: [
        { title: "PLC, HMI & MES integration", description: "We design acquisition, history, and traceability using field protocols such as Modbus RTU/TCP." },
        { title: "Production, quality & uptime data", description: "Unified monitoring of output, defects, uptime, and alarm history by line." },
        { title: "Vision inspection & quality", description: "Connect inspection results, decisions, and history in software." },
        { title: "Multi-device access", description: "Same data on plant PCs, servers, tablets, and phones." },
      ],
    },
    flow: {
      title: "System & data flow",
      description: "How data moves from equipment to operations screens.",
      nodes: [
        { id: "field", label: "Field equipment", description: "PLC · sensors · inspection" },
        { id: "collect", label: "Acquisition", description: "Modbus · OPC · DB" },
        { id: "process", label: "Processing", description: "History · alarms · analytics" },
        { id: "view", label: "Monitoring", description: "HMI · web · mobile" },
        { id: "act", label: "Action", description: "Alerts · work orders · reports" },
      ],
    },
    applications: {
      title: "Application areas",
      applicable: [
        { title: "Manufacturing & assembly", description: "Production collection, uptime monitoring, alarms" },
        { title: "Electrical & facility inspection", description: "Checklists, records, field app integration" },
        { title: "Quality & inspection", description: "Inspection data, defect tracking" },
        { title: "Maintenance", description: "History, preventive alerts" },
      ],
      note: "Completed case studies are published with client approval. Items above are applicable areas.",
    },
    deliverables: {
      title: "What you receive",
      items: [
        "Custom monitoring and acquisition software",
        "HMI, web, and mobile operations UI",
        "Alarm, history, and reporting structure",
        "Development, validation, and deployment documentation",
        "Operations and maintenance scope by agreement",
      ],
    },
    process: {
      title: "Development process",
      steps: [
        { step: 1, title: "Requirements", description: "Understand equipment, protocols, and operations." },
        { step: 2, title: "Design", description: "Data model, screens, alarms, and history." },
        { step: 3, title: "Build", description: "Implement acquisition, processing, and UI." },
        { step: 4, title: "Validate", description: "Test and tune on-site." },
        { step: 5, title: "Deploy", description: "Install and integrate on plant systems." },
        { step: 6, title: "Operate", description: "Support monitoring, improvement, and maintenance." },
      ],
    },
    portfolio: { title: "Related portfolio", emptyNote: "Industrial automation solutions are published after validation.", statusLabel: "Launch prep" },
    faq: {
      title: "FAQ",
      items: [
        { q: "Can you integrate with our PLCs?", a: "We design within supported protocols such as Modbus RTU/TCP. A site survey is required." },
        { q: "How are timeline and cost determined?", a: "Quotes depend on scope, equipment count, and integration complexity. Fixed dates and prices follow consultation." },
        { q: "Is cloud required?", a: "We design for on-prem, in-house servers, or cloud as your environment requires." },
      ],
    },
    finalCta: {
      title: "Discuss your automation project",
      description: "Share your site conditions and goals—we will outline scope and next steps.",
      cta: "Request consultation",
      ctaHref: "/contact?topic=automation",
    },
  },
  "smart-farm": {
    meta: {
      title: "Smart farm & agricultural automation",
      description: "Climate, irrigation, ventilation, and energy data—with remote monitoring software",
    },
    hero: {
      eyebrow: "Smart Farm",
      title: "Smart-farm software that connects environment and operations",
      subtitle: "Acquire sensor, controller, and camera data—support alerts, history, and remote operations.",
      ctas: [
        { label: "Smart farm consultation", href: "/contact?topic=automation", variant: "primary" },
        { label: "Industrial capabilities", href: "/capabilities/industrial-automation", variant: "outline" },
      ],
    },
    problems: {
      title: "Problems we address",
      items: [
        { title: "Scattered environment data", description: "Temperature, humidity, CO₂, and irrigation status are split across devices." },
        { title: "Remote management burden", description: "Status checks and control without constant site visits." },
        { title: "Delayed alerts", description: "Immediate notification and logging when thresholds are exceeded." },
        { title: "Work and history tracking", description: "Structured records for irrigation, treatment, and harvest." },
      ],
    },
    strengths: {
      title: "Core capabilities",
      items: [
        { title: "Integrated environment & control", description: "Temperature, humidity, CO₂, irrigation, ventilation, lighting, and energy." },
        { title: "Sensors, controllers & cameras", description: "Phased integration with field equipment." },
        { title: "Alerts, history & analysis", description: "Threshold alarms, logs, and operational views." },
        { title: "Field, cloud & mobile roles", description: "Control on-site, monitoring remote—by design." },
      ],
    },
    flow: {
      title: "System & data flow",
      description: "From farm sensors to remote operations.",
      nodes: [
        { id: "sensor", label: "Sensors & control", description: "Climate · irrigation · ventilation" },
        { id: "edge", label: "Edge gateway", description: "Acquisition · local control" },
        { id: "store", label: "Storage & analytics", description: "History · alerts · reports" },
        { id: "remote", label: "Remote ops", description: "Web · mobile · notifications" },
        { id: "work", label: "Work logs", description: "Irrigation · treatment · harvest" },
      ],
    },
    applications: {
      title: "Application areas",
      applicable: [
        { title: "Greenhouses & controlled environments", description: "Climate control, irrigation schedules, alerts" },
        { title: "Open field & orchards", description: "Weather and soil sensors, irrigation monitoring" },
        { title: "Livestock & specialty crops", description: "Environment monitoring, work history" },
        { title: "Farm scale-up", description: "Expand zones, sensors, and controllers" },
      ],
      note: "We do not promise yield figures without evidence—outcomes depend on crop, facility, and operations.",
    },
    deliverables: {
      title: "What you receive",
      items: ["Environment and control monitoring software", "Alerts, history, and work logs", "Remote web and mobile ops", "Field integration, validation, deployment", "Operations guide and maintenance by agreement"],
    },
    process: {
      title: "Development process",
      steps: [
        { step: 1, title: "Site survey", description: "Crops, facilities, equipment, and operations." },
        { step: 2, title: "Design", description: "Sensors, control, alarms, and screens." },
        { step: 3, title: "Build", description: "Acquisition, control, and remote ops." },
        { step: 4, title: "Validate", description: "Trial runs and tuning on-site." },
        { step: 5, title: "Deploy", description: "Production installation." },
        { step: 6, title: "Operate", description: "Monitoring and improvement support." },
      ],
    },
    portfolio: { title: "Related portfolio", emptyNote: "Smart-farm outcomes are published after preparation and validation.", statusLabel: "Launch prep" },
    faq: {
      title: "FAQ",
      items: [
        { q: "Is this suitable for small farms?", a: "We design in phases matched to scale—from minimal viable setups to expandable architectures." },
        { q: "What about unreliable internet?", a: "We consider local control, buffering, and sync strategies for your site." },
        { q: "Can you work with existing controllers?", a: "Integration scope depends on equipment and protocol—we confirm during consultation." },
      ],
    },
    finalCta: {
      title: "Discuss smart-farm automation",
      description: "Tell us your facility scale and goals—we will outline applicable scope.",
      cta: "Request consultation",
      ctaHref: "/contact?topic=automation",
    },
  },
  "ai-software": {
    meta: {
      title: "AI software development & operations",
      description: "Requirements, AI production workflow, validation, and apps, content, and sites—with human oversight",
    },
    hero: {
      eyebrow: "AI Software",
      title: "AI as a practical tool—from build to validation and operations",
      subtitle: "From requirements through apps, e-books, sites, and content—with human review and safe operations.",
      ctas: [
        { label: "AI & production consultation", href: "/contact?topic=app", variant: "primary" },
        { label: "Production process", href: "/process", variant: "outline" },
      ],
    },
    problems: {
      title: "Problems we address",
      items: [
        { title: "Ideas without production capacity", description: "Planning, development, and content lack time and staff." },
        { title: "AI-only output lacks quality gates", description: "Automation alone may miss brand, policy, and operational standards." },
        { title: "No deployment or ops structure", description: "Shipping, monitoring, and iteration are required—not just builds." },
        { title: "Weak requirements documentation", description: "Unclear scope causes rework." },
      ],
    },
    strengths: {
      title: "Core capabilities",
      items: [
        { title: "Requirements & documentation", description: "Clear features, scope, and acceptance criteria." },
        { title: "AI workflow & validation", description: "Automation steps, quality gates, and human approval." },
        { title: "Multi-format production", description: "Apps, e-books, sites, and content in one pipeline." },
        { title: "Operations, logs & recovery", description: "Post-deploy monitoring and recovery considerations." },
      ],
    },
    flow: {
      title: "Build & validation flow",
      description: "Roles of AI and people from requirements to deployment.",
      nodes: [
        { id: "req", label: "Requirements", description: "Scope · criteria · docs" },
        { id: "build", label: "AI & build", description: "Design · code · content" },
        { id: "gate", label: "Quality gate", description: "Test · approve" },
        { id: "ship", label: "Deploy", description: "Store · web · channels" },
        { id: "ops", label: "Operate", description: "Logs · improve · recover" },
      ],
    },
    applications: {
      title: "Application areas",
      applicable: [
        { title: "Apps & web services", description: "Features, UI, deployment pipelines" },
        { title: "E-books & knowledge", description: "Planning, drafting support, publishing structure" },
        { title: "Marketing & content", description: "Video, documents, channel content" },
        { title: "Workflow automation", description: "Repetitive tasks, data processing, reports" },
      ],
      note: "We do not claim AI replaces all human work—review and accountable operations are assumed.",
    },
    deliverables: {
      title: "What you receive",
      items: ["Requirements and design documentation", "Software and content deliverables", "Validation and deployment artifacts", "Operations and monitoring guide", "Maintenance and iteration by agreement"],
    },
    process: {
      title: "Development process",
      steps: [
        { step: 1, title: "Requirements", description: "Goals, scope, and acceptance criteria." },
        { step: 2, title: "Design", description: "Architecture, AI touchpoints, quality gates." },
        { step: 3, title: "Build", description: "Development and content production." },
        { step: 4, title: "Validate", description: "Functional, quality, and policy review." },
        { step: 5, title: "Deploy", description: "Publish to channels and stores." },
        { step: 6, title: "Operate", description: "Feedback, improvement, and recovery." },
      ],
    },
    portfolio: { title: "Related portfolio", emptyNote: "AI-assisted outcomes are published after validation.", statusLabel: "In validation" },
    faq: {
      title: "FAQ",
      items: [
        { q: "Do you deliver apps with AI only?", a: "AI accelerates production. Humans own design, validation, deployment, and operations." },
        { q: "Copyright and AI disclosure?", a: "We apply review and labeling policies by content type—discussed in consultation." },
        { q: "Integration with existing systems?", a: "API and data integration scope is reviewed per project." },
      ],
    },
    finalCta: {
      title: "Discuss AI-assisted production",
      description: "Share what you want to build and your constraints—we will outline feasible scope.",
      cta: "Production consultation",
      ctaHref: "/contact?topic=app",
    },
  },
  "multiplatform-control": {
    meta: {
      title: "Apps, web, desktop & remote control",
      description: "Flutter, web, and Windows—multi-device roles, remote ops, and synchronization",
    },
    hero: {
      eyebrow: "Multi-Platform",
      title: "Multi-platform software linking field and office",
      subtitle: "Synchronize data, state, and alerts across mobile, PC, and web—with remote monitoring and approvals.",
      ctas: [
        { label: "App & web consultation", href: "/contact?topic=app", variant: "primary" },
        { label: "App portfolio", href: "/apps", variant: "outline" },
      ],
    },
    problems: {
      title: "Problems we address",
      items: [
        { title: "Field–office information gap", description: "Floor data does not reach office systems in real time." },
        { title: "Inconsistent device experiences", description: "Different UI and data on PC vs mobile causes confusion." },
        { title: "Hard to approve remotely", description: "Status checks and approvals without travel." },
        { title: "Offline and error UX", description: "Unstable networks threaten usability and data integrity." },
      ],
    },
    strengths: {
      title: "Core capabilities",
      items: [
        { title: "Flutter, web & Windows", description: "Multi-platform design within our proven stack." },
        { title: "Auth, alerts & sync", description: "Login, push notifications, and data synchronization." },
        { title: "Remote ops & workflows", description: "Monitoring, work orders, and result confirmation." },
        { title: "Responsive & accessible", description: "Layout, touch, keyboard, and contrast considered." },
      ],
    },
    flow: {
      title: "Platform & data flow",
      description: "Device roles and synchronization.",
      nodes: [
        { id: "field", label: "Field", description: "Mobile · tablet" },
        { id: "desk", label: "Office & control", description: "PC · dashboard" },
        { id: "web", label: "Web", description: "Browser · responsive" },
        { id: "sync", label: "Sync", description: "Auth · API · realtime" },
        { id: "notify", label: "Notify", description: "Alerts · approval · push" },
      ],
    },
    applications: {
      title: "Application areas",
      applicable: [
        { title: "Industrial monitoring", description: "Field inspection apps, control dashboards" },
        { title: "Smart-farm remote", description: "Environment checks, alarms, work logs" },
        { title: "Operations & collaboration", description: "Checklists, approvals, reporting" },
        { title: "Customer & marketing web", description: "Responsive sites, SEO, payment expansion" },
      ],
      note: "Platform and feature scope are confirmed per project during consultation.",
    },
    deliverables: {
      title: "What you receive",
      items: ["Android, web app, desktop (scope by agreement)", "Control and dashboard web", "Auth, API, and sync architecture", "Store and deployment support", "Operations and update process"],
    },
    process: {
      title: "Development process",
      steps: [
        { step: 1, title: "Requirements", description: "Users, devices, and sync needs." },
        { step: 2, title: "Design", description: "UI, API, offline and error UX." },
        { step: 3, title: "Build", description: "Per-platform implementation." },
        { step: 4, title: "Validate", description: "Test across devices and networks." },
        { step: 5, title: "Deploy", description: "Stores, web, and field rollout." },
        { step: 6, title: "Operate", description: "Monitoring and updates." },
      ],
    },
    portfolio: { title: "Related portfolio", emptyNote: "Apps and web outcomes are published by validation and release stage.", statusLabel: "In validation" },
    faq: {
      title: "FAQ",
      items: [
        { q: "Do you support iOS?", a: "Our focus is Android and web. iOS scope and timeline are discussed per project." },
        { q: "Offline support?", a: "Offline cache and sync are designed when required." },
        { q: "Existing server integration?", a: "REST APIs and databases require upfront review." },
      ],
    },
    finalCta: {
      title: "Discuss your multi-platform project",
      description: "Share usage scenarios and device environments—we will propose an architecture.",
      cta: "App & web consultation",
      ctaHref: "/contact?topic=app",
    },
  },
};
