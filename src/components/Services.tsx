import { industries } from "@/lib/industries";
import Testimonials from "./Testimonials";

const services = [
  { title: "Custom software and dashboards", desc: "Internal tools shaped around how your team actually works." },
  { title: "CCTV and gate systems", desc: "Cameras, gate readers and QR passes on one screen your staff can use." },
  { title: "Fixing slow or unreliable systems", desc: "I find what is wrong first, then fix the biggest problems first." },
  { title: "AI that a person checks", desc: "It reads your documents and a person confirms the result." },
];

// The reasons a client fears hiring a freelancer, removed one by one.
const promises = [
  "A written plan with stages and dates before you pay anything",
  "You pay stage by stage, after you've seen each stage working",
  "You own the code, the data and every account",
];

export default function Services() {
  return (
    <section id="services" className="max-w-4xl mx-auto w-full px-5 md:px-8 scroll-mt-28">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-50 tracking-tight mb-4">Services</h2>
      <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">
        I build the software a business runs on, and I build it to keep working after I hand it over. On site in
        Uttarakhand and Delhi NCR, remote anywhere.
      </p>

      <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
        {services.map((s) => (
          <div key={s.title}>
            <dt className="font-display font-bold text-lg text-slate-100">{s.title}</dt>
            <dd className="text-slate-400 leading-relaxed mt-1">{s.desc}</dd>
          </div>
        ))}
      </dl>

      <h3 className="font-display font-bold text-lg text-slate-100 mt-10 mb-3">What you can count on</h3>
      <ul className="space-y-2 text-slate-300 leading-relaxed list-disc pl-5 marker:text-teal-400">
        {promises.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <p className="text-slate-400 leading-relaxed mt-10">
        I&apos;ve also built websites for clients in India, Australia, the UK and Thailand, including{" "}
        <a href="https://korareach.com.au" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">korareach.com.au</a>{" "}
        and{" "}
        <a href="https://mvminfotech.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">mvminfotech.com</a>.
      </p>
      <p className="text-slate-400 leading-relaxed mt-3">
        Examples for{" "}
        {industries.map((ind, i) => (
          <span key={ind.slug}>
            <a href={`/for-business/${ind.slug}`} className="text-teal-400 hover:text-teal-300">{ind.short.toLowerCase()}</a>
            {i < industries.length - 2 ? ", " : i === industries.length - 2 ? " and " : "."}
          </span>
        ))}
      </p>

      <Testimonials />
    </section>
  );
}
