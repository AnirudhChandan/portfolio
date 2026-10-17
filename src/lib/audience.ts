// One home page, re-framed per role: /for/<role> swaps the headline, the role line and the
// résumé PDF (public/resume/, copied there by ~/assisstant/resume-src/build.py).
export type Audience = "default" | "backend" | "ai" | "fullstack" | "fde";

export const ROLES = ["backend", "ai", "fullstack", "fde"] as const;

type Framing = {
  headline: string;
  role: string; // shown in the recruiter card
  resume: string;
  receiptsFirst?: string; // claim of the receipt to show first
};

export const audiences: Record<Audience, Framing> = {
  default: {
    headline: "Backend engineer who ships systems people rely on.",
    role: "Backend / full-stack engineer",
    resume: "/ANIRUDH_CHANDAN_RESUME_2026.pdf",
  },
  backend: {
    headline: "Backend engineer: Node.js and Python on PostgreSQL, built to stay correct under load.",
    role: "Backend engineer (Node.js / TypeScript, Python)",
    resume: "/resume/anirudh-chandan-backend.pdf",
    receiptsFirst: "My database survives being killed mid-write",
  },
  ai: {
    headline: "Backend engineer for AI features that stay on a leash: pipelines, human review, audit trails.",
    role: "Applied-AI backend engineer (Python, FastAPI, PostgreSQL)",
    resume: "/resume/anirudh-chandan-ai.pdf",
    receiptsFirst: "A guard team uses my dashboard every night",
  },
  fullstack: {
    headline: "Full-stack engineer: TypeScript, React and Node on PostgreSQL, from schema to screen.",
    role: "Full-stack / product engineer (TypeScript, React, Node.js)",
    resume: "/resume/anirudh-chandan-fullstack.pdf",
    receiptsFirst: "Client websites you can open right now",
  },
  fde: {
    headline: "Forward-deployed engineer: I ship inside the client's environment and stay on call for it.",
    role: "Forward-deployed / client-facing engineer",
    resume: "/resume/anirudh-chandan-fde.pdf",
    receiptsFirst: "A guard team uses my dashboard every night",
  },
};
