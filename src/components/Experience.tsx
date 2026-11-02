// Short on purpose; the résumé (resume-src/resume_master.html) has the detail. Change both together.
const experiences = [
  {
    company: "Independent contract work",
    role: "Backend / Full-Stack Engineer",
    period: "Aug 2026 – Present",
    description: "Software for businesses in India and abroad: a document platform, a live CCTV dashboard and client websites.",
  },
  {
    company: "Docplix",
    role: "Software Engineer",
    period: "Nov 2025 – Present",
    description: "Backend for a healthcare records platform used by 2,300+ clinics, as one of four engineers.",
  },
  {
    company: "Genpact",
    role: "Software Engineer (promoted from intern)",
    period: "Feb 2024 – Oct 2025",
    description: "Data pipelines for tax software.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="max-w-4xl mx-auto w-full px-5 md:px-8 scroll-mt-28">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-50 tracking-tight mb-8">Experience</h2>
      <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {experiences.map((e) => (
          <li key={e.company} className="py-5 grid sm:grid-cols-[11rem_minmax(0,1fr)] gap-x-6 gap-y-1">
            <div className="text-sm text-slate-500 sm:pt-1">{e.period}</div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-100">
                {e.role}, {e.company}
              </h3>
              <p className="text-slate-400 leading-relaxed mt-1">{e.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <a href="/ANIRUDH_CHANDAN_RESUME_2026.pdf" target="_blank" className="inline-block mt-6 text-teal-400 hover:text-teal-300">
        Full details are in the résumé →
      </a>
    </section>
  );
}
