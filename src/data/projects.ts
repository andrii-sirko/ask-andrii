/**
 * Generated once from knowledge/CV_Andrii_Sirko.pdf and hand-checked.
 * This list is the single source of truth for the agent's `projectId` values —
 * the same slugs appear in the agent's system prompt (agent/agent_configs/).
 */
export type Project = {
  id: string;
  company: string;
  role: string;
  dates: string;
  summary: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    id: "about-you",
    company: "ABOUT YOU",
    role: "Senior Frontend Engineer · Contractor",
    dates: "Jun 2026 – Present",
    summary:
      "Customer-facing features in the React/TypeScript e-commerce monorepo (40M+ MAU): loyalty Status Program end-to-end, A/B testing infrastructure, add-to-basket rework.",
    stack: ["React", "TypeScript", "Linaria", "React Query", "Zustand", "gRPC", "Jest", "Cypress"],
  },
  {
    id: "selectcode",
    company: "SelectCode",
    role: "Fullstack Developer · Contractor",
    dates: "Dec 2025 – Jun 2026",
    summary:
      "Enterprise-grade, privacy-focused AI platform (meingpt.com) with RAG and multi-LLM support; shared AI assistants, TRPC/Prisma APIs, RBAC, Stripe subscriptions.",
    stack: ["TypeScript", "React", "NestJS", "TRPC", "Prisma", "PostgreSQL", "RAG", "OpenAI API"],
  },
  {
    id: "mehrwerk",
    company: "Mehrwerk",
    role: "Frontend Lead · Contractor",
    dates: "Sep 2021 – Dec 2025",
    summary:
      "Led a team of 5; architected a React app framework cutting client onboarding from 4 months to 30 minutes; UI editor serving 1M+ MAU; k6 load-testing suite; WCAG migration.",
    stack: ["TypeScript", "React", "Vue", "Ionic", "React Native", "Next.js", "GraphQL", "k6"],
  },
  {
    id: "ebay-adevinta",
    company: "eBay (Adevinta)",
    role: "Senior React Developer · Contractor",
    dates: "Feb 2022 – Dec 2022",
    summary:
      "Dealer retail team on Kijiji Autos — Canada's largest online auto platform; React features across the dealer-facing product surface.",
    stack: ["React", "TypeScript", "Jest", "TestCafe", "AWS"],
  },
  {
    id: "accenture-smart",
    company: "Accenture · smart / Daimler",
    role: "Senior React Developer · Contractor",
    dates: "May 2021 – Jan 2022",
    summary:
      "New smart IAA landing page with immersive, animated React components for the brand's future product reveal.",
    stack: ["React", "TypeScript", "Styled Components", "AEM", "Jest"],
  },
  {
    id: "lemon-markets",
    company: "lemon.markets",
    role: "Senior React Developer · Contractor",
    dates: "Jun 2021 – Sep 2021",
    summary: "Custom Prismic-powered slides for Blog and CMS pages in a fintech product.",
    stack: ["React", "Next.js", "TypeScript", "Prismic", "Jest"],
  },
  {
    id: "accenture-vw-audi",
    company: "Accenture · VW / Audi",
    role: "Senior React Developer · Contractor",
    dates: "Nov 2020 – May 2021",
    summary:
      "White Label Dealer Search app for VW, integrated into Audi via micro-frontends; supported Audi.de across 90+ markets.",
    stack: ["React", "TypeScript", "Styled Components", "Webpack", "Jest"],
  },
  {
    id: "factor-eleven",
    company: "Factor Eleven",
    role: "Senior React Developer · Contractor",
    dates: "Sep 2019 – May 2021",
    summary:
      "Architected a React-based AdManager application and a shared UI library used across multiple projects.",
    stack: ["React", "GraphQL", "Apollo", "Jest", "Cypress", "SASS"],
  },
  {
    id: "tooltime",
    company: "ToolTime",
    role: "Senior React Developer · Contractor",
    dates: "Feb 2020 – Mar 2020",
    summary: "React-based field service management application for tradespeople.",
    stack: ["TypeScript", "React", "GraphQL", "Apollo", "Cypress", "AWS"],
  },
  {
    id: "careem",
    company: "Careem",
    role: "Senior Software Developer · Full-time",
    dates: "Jun 2018 – Aug 2019",
    summary:
      "React components and architecture for the corporate customers department; shared Web UI library; LMD and CareemNow platforms; Scrum master for a team of 6.",
    stack: ["React", "React Native", "Redux", "TypeScript", "Jest", "Cypress", "AWS"],
  },
  {
    id: "circula",
    company: "Circula",
    role: "Frontend Developer · Full-time",
    dates: "Nov 2017 – May 2018",
    summary: "Expense management tools for accountants and supervisors.",
    stack: ["React", "Redux", "Ruby on Rails", "Docker"],
  },
  {
    id: "mesmo",
    company: "Mes.mo / Gastroguide",
    role: "Full Stack Developer · Full-time",
    dates: "Jan 2015 – Oct 2017",
    summary:
      "Web solutions for restaurants: reservation system, website constructor, advertising system, menu builder, and a REST API for mobile apps.",
    stack: ["React", "Redux", "Flux", "PHP", "MySQL", "AWS"],
  },
  {
    id: "ukeess",
    company: "UKEESS",
    role: "Full Stack Developer · Full-time",
    dates: "Apr 2014 – Dec 2014",
    summary: "Developed and maintained Magento plugins for e-commerce clients.",
    stack: ["Magento", "PHP"],
  },
];

export const contact = {
  email: "andrii.sirko@gmail.com",
  linkedin: "https://www.linkedin.com/in/andrii-sirko",
  portfolio: "https://andrii-sirko.github.io",
} as const;
