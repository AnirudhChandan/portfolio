// /now — what I'm working on. Update the date and entries when something changes.
export const NOW_UPDATED = "17 October 2026";

export const now: { when: string; kind: "Building" | "Shipped" | "Running" | "Learning" | "Open to"; text: string }[] = [
  { when: "Oct 2026", kind: "Building", text: "A visitor-pass app for a residential institution in Dehradun. The prototype is complete; next is connecting it to the gate terminals the institution already has." },
  { when: "Oct 2026", kind: "Building", text: "A website for a corporate law firm in Dehradun, with free tools a client can use before calling: a compliance calendar, a notice helper and a homestay registration check." },
  { when: "Oct 2026", kind: "Shipped", text: "This site: a proof-first redesign, a light theme, and pages for each kind of role and business." },
  { when: "Since Sep 2026", kind: "Running", text: "Supporting the Max Estates CCTV dashboard remotely; it runs every night on the guard-room PC." },
  { when: "Sep 2026", kind: "Shipped", text: "PyDB rebuilt as a package, with tests that kill a writer mid-workload and check nothing committed is lost, in CI." },
  { when: "Ongoing", kind: "Learning", text: "Evaluating LLM output properly: evals for document extraction and agent tools, before trusting either in production." },
  { when: "Now", kind: "Open to", text: "Remote backend, full-stack and applied-AI roles, and freelance projects." },
];
