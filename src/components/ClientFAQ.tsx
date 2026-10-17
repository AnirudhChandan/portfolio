import Reveal from "./Reveal";

// The objections a business owner has before hiring a freelancer, answered before they have to ask.
export const faqs = [
  {
    q: "What will it cost?",
    a: "It depends on scope, so I don't publish a rate card. After a free call you get a fixed quote in writing, split into stages, and you pay stage by stage, so you never pay for work you haven't seen working.",
  },
  {
    q: "How long does it take?",
    a: "The written plan gives a date for every stage. As an example, a visitor-pass app with a multi-level approval chain was planned at 10–15 working days. If your deadline isn't realistic I'll say so on the first call, not in week three.",
  },
  {
    q: "What if you disappear halfway?",
    a: "You own the code, the data and the accounts from day one, in your name. Every stage ships with tests and plain-language notes, so any competent developer could pick it up.",
  },
  {
    q: "Who looks after it once it's live?",
    a: "I do, remotely, or on a monthly retainer if you want changes and monitoring. Or a clean handover to your own team, with documentation and tests that fail when the important logic breaks.",
  },
  {
    q: "Can you come on site, and train my staff in Hindi?",
    a: "Yes. I visit sites across Uttarakhand and Delhi NCR and work remotely everywhere else. Training is in Hindi or English, and I built a dashboard so a guard could use it at 3 am without help.",
  },
  {
    q: "Will you keep our business private?",
    a: "Yes. I sign an NDA if you want one, and I describe client work by sector, not name, unless you agree to be named.",
  },
];

export default function ClientFAQ() {
  return (
    <div className="mt-16">
      <Reveal>
        <h3 className="font-display font-bold text-2xl text-slate-50 tracking-tight mb-6">Questions clients ask first</h3>
      </Reveal>
      <Reveal>
        <div className="grid md:grid-cols-2 gap-x-10 border-t border-white/[0.07]">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-white/[0.07] py-4">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-display font-semibold text-slate-100">
                {f.q}
                <span className="text-teal-400 font-mono text-lg leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
