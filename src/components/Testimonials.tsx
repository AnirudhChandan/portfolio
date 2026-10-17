import Reveal from "./Reveal";

// Real quotes only, each given with permission to publish. Renders nothing until one exists.
// Shape: { quote, name, role, org, link? } — keep quotes short and specific.
type Testimonial = { quote: string; name: string; role: string; org: string; link?: string };
export const testimonials: Testimonial[] = [];

export default function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <div className="mt-16">
      <Reveal>
        <h3 className="font-display font-bold text-2xl text-slate-50 tracking-tight mb-6">What clients say</h3>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <Reveal key={t.name}>
            <figure className="h-full rounded-2xl border border-white/[0.07] bg-slate-900/50 p-6 md:p-7 flex flex-col">
              <blockquote className="text-slate-200 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto pt-5 text-sm">
                <span className="font-semibold text-slate-100">{t.name}</span>
                <span className="text-slate-500"> · {t.role}, {t.org}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
