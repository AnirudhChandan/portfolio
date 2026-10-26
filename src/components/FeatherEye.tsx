// The eye of a peacock feather: bronze, copper and teal rings around a blue heart.
// Colours come from the --feather-* tokens in globals.css, so it follows the theme.
export const EYE_CORE = "M0,22 C-6,31 -23,27 -23,4 C-23,-17 -11,-30 0,-30 C11,-30 23,-17 23,4 C23,27 6,31 0,22Z";

export function FeatherEye({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-12 -15 24 30" aria-hidden="true" className={`feather-eye shrink-0 ${className}`}>
      <ellipse className="r1" rx="11.5" ry="14.5" />
      <ellipse className="r2" rx="8.6" ry="11" cy="1.2" />
      <ellipse className="r3" rx="6.4" ry="8.3" cy="2" />
      <path className="core" d={EYE_CORE} transform="translate(0,2.6) scale(.2)" />
    </svg>
  );
}

// Hairline with an eye in the middle. The negative margin cancels the extra flex gap it adds.
export function FeatherDivider() {
  return (
    <div aria-hidden="true" className="-my-14 md:-my-[4.5rem] px-5 md:px-12 max-w-7xl mx-auto w-full flex items-center gap-4">
      <span className="h-px flex-1 bg-white/10" />
      <FeatherEye className="h-4 w-3.5" />
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}
