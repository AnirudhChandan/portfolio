// Facts mirror ~/assisstant/portfolio-in/FACTS.md and the résumé. Client names follow the
// portfolio rules: Max Estates is named (they agreed); the gate-pass institution is not.
// Keep it short: `short` is one plain sentence, `approach` and `outcome` at most three lines each.
export type CaseStudy = {
  slug: string; // /work/<slug>
  title: string;
  short: string;
  context: string;
  stats?: { n: string; l: string }[];
  image?: { src: string; alt: string; width: number; height: number; caption: string };
  problem: string;
  approach: string[];
  outcome: string[];
  architecture: string;
  tech: string[];
  github?: string;
};

export const featured: CaseStudy = {
  slug: "max-estates",
  title: "AI-CCTV security dashboard",
  short: "One screen that turns camera alerts into something a guard can act on at 3 am.",
  context: "Max Estates, Dehradun · live since Sep 2026",
  stats: [
    { n: "8 → 1", l: "cameras on one screen" },
    { n: "7", l: "alert types" },
    { n: "EN / HI", l: "voice alerts" },
  ],
  image: {
    src: "/work/max-estates-guard.jpg",
    alt: "Guard screen: alerts needing checking, each with one-tap 'real problem' or 'all fine' buttons",
    width: 1600,
    height: 1111,
    caption: "The guard screen. Demo data, not residents' records.",
  },
  problem:
    "An AI camera box could spot intrusions, falls, animals and empty posts, but nobody could act on those alerts. Guards needed one screen they could use half-asleep, and management needed to know whether the patrol route was actually walked.",
  approach: [
    "Made it for guards: one button to check an alert, six seconds to undo a mis-tap, and a wall-TV view that shows ALL CLEAR or how many alerts are waiting.",
    "Added patrol timers that notice when nobody has passed a camera, with Excel, CSV and PDF reports.",
    "Gave head office a view-only sign-in over the private network.",
  ],
  outcome: [
    "I installed it on the guard-room PC. The guard team has used it daily since September 2026.",
    "I support it remotely.",
  ],
  architecture:
    "AI box → HTTP callback → Node.js on the guard-room PC → SQLite → guard screen and reports. It installs from a desktop icon and starts on boot.",
  tech: ["Node.js", "SQLite", "HTTP callbacks"],
};

export const others: CaseStudy[] = [
  {
    slug: "document-workflow",
    title: "Document workflow platform",
    short: "Checks a shipment's paperwork against itself and sends only the doubtful cases to a person.",
    context: "Client work for a shipping-software company · 2026",
    stats: [
      { n: "412", l: "automated tests" },
      { n: "13", l: "document types" },
      { n: "0", l: "engine changes for a 2nd industry" },
    ],
    problem:
      "Customers receive shipping paperwork as PDFs, scans and spreadsheets, and someone has to check that the documents for one shipment agree with each other.",
    approach: [
      "Put the checking rules in a settings file the customer can edit, so a new rule needs no deployment.",
      "Kept each customer's data apart in the database itself, so a query that forgets to filter returns nothing.",
      "Made AI optional. It never decides alone, and every human override is recorded with a reason.",
    ],
    outcome: [
      "When the client changed direction after the demo, a whole second area (purchase orders, goods receipts and invoices) was added through settings alone.",
    ],
    architecture: "Ingest → classify → extract → validate → review only when needed → deliver.",
    tech: ["Python", "FastAPI", "PostgreSQL", "Celery", "Docker"],
  },
  {
    slug: "construction-erp",
    title: "Construction ERP modernisation",
    short: "Modernised a decade-old system used by about 20 companies. One slow page went from 15.6 s to 2.4 s.",
    context: "ProjAuto · contract technical lead",
    stats: [
      { n: "711 / 1,100", l: "commits written by me" },
      { n: "0 → 1,435", l: "automated tests" },
      { n: "15.6s → 2.4s", l: "one list page" },
    ],
    problem: "Pages took tens of seconds, companies could reach each other's data, and nobody could change the code safely.",
    approach: [
      "Checked all 53 list screens before changing anything, then fixed the worst first. The user list went from 30 s to 2.5 s.",
      "Closed the holes that let one company reach another's data, in eight services.",
      "Built automated deploys from nothing, and a phone app that turned a paper timesheet into a 30-second action.",
    ],
    outcome: ["The code went from 631k lines to 156k, with 1,435 automated tests where there were none.", "I mentor five developers on the team."],
    architecture: "Spring Boot 3 and React, one system shared by many companies, with guarded production deploys and a React Native field app.",
    tech: ["Java 17", "Spring Boot", "React", "React Native"],
  },
  {
    slug: "pydb",
    title: "PyDB: a database from scratch",
    short: "A small database I wrote to learn how they work. It survives being killed mid-write.",
    context: "Open source · my own project",
    problem: "I wanted to understand what a database does between a SQL statement and the disk, so instead of using one I built one.",
    approach: [
      "Stored data in fixed 8 KB pages, with B-Tree indexes for fast lookups.",
      "Saved every insert to a write-ahead log before counting it as done.",
      "Made checkpoints write a new file and swap it in, so the data file is never half-written.",
    ],
    outcome: [
      "Tests kill the writer mid-workload and mid-checkpoint, and no confirmed insert is lost.",
      "The first version failed that test and lost every committed write. The fix is on the blog.",
      "A TypeScript B+Tree built on the same ideas runs live in the Lab.",
    ],
    architecture: "Insert → log start → change pages in memory → log commit. On restart, redo every committed insert since the last checkpoint and drop the rest.",
    tech: ["Python", "B-Tree", "WAL", "pytest", "CI"],
    github: "https://github.com/AnirudhChandan/PyDB",
  },
];

// Linked in one line under the main list; each still has its own page.
export const also: CaseStudy[] = [
  {
    slug: "gate-pass",
    title: "QR gate-pass app",
    short: "Visit approvals and QR passes for a residential institution, made for low-end phones.",
    context: "Residential institution, Dehradun · in build, Oct 2026",
    problem: "QR readers and a boom barrier were installed a year earlier and never connected to anything, and visit approvals lived in email.",
    approach: [
      "A parent sees only their own child, verified once on first install against the institution's records.",
      "Approvals follow the institution's hierarchy, in the same app.",
      "Made for low-end Android phones and patchy data: one action per screen, Hindi first, and a pass that works offline.",
    ],
    outcome: ["The prototype is complete. I'm checking the connection to the existing gate terminals before anything that depends on it."],
    architecture: "Parent app → request → staff approval → QR pass on the phone → gate reader → barrier opens, logged. Data never leaves the campus.",
    tech: ["Expo / React Native", "FastAPI", "SQLite", "QR"],
  },
  {
    slug: "nexus-chat",
    title: "Nexus Chat",
    short: "A real-time chat backend that stays responsive when the database slows down.",
    context: "Open source · my own project",
    problem: "Real-time chat has to stay responsive when write volume spikes or the database slows down.",
    approach: [
      "A queue separates receiving messages from saving them.",
      "Read receipts collect in Redis and save in 10-second batches.",
      "Video calls use WebRTC, with the socket server only connecting the two people.",
    ],
    outcome: ["About 99% fewer read-receipt writes.", "The socket layer never waits on the database."],
    architecture: "Socket.IO gateway → BullMQ → worker → range-partitioned Postgres. Receipts → Redis → batched flush.",
    tech: ["Node.js", "Socket.IO", "PostgreSQL", "Redis", "BullMQ", "WebRTC"],
    github: "https://github.com/AnirudhChandan/nexus-chat",
  },
];

export const works = [featured, ...others, ...also];
