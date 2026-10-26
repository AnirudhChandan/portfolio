import { EYE_CORE } from "./FeatherEye";

// Hero peacock feather. A server component: the path data below is computed once when the page
// is built, so the browser receives finished SVG and no JavaScript.
// Drawn straight along x=180, then bent so the base sits to the right of the eye.

const AX = 180;
const rand = (() => {
  let s = 11; // fixed seed: identical output on every build
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
})();
const pt = (x: number, y: number) => `${Math.round(x + 70 * (y / 715) ** 2)},${Math.round(y)}`;
const curve = (a: number[], c: number[], b: number[]) => `M${pt(a[0], a[1])}Q${pt(c[0], c[1])} ${pt(b[0], b[1])}`;

// Loose fringe below the eye: short and sparse at the base, longer and steeper higher up.
let fringe = "";
for (let y = 712; y > 250; y -= 4.2) {
  const k = (712 - y) / 462;
  for (const s of [-1, 1]) {
    if (k < 0.4 && rand() < 0.4) continue;
    const L = (18 + 96 * k ** 1.15) * (0.82 + 0.36 * rand());
    const a = ((38 - 14 * k + 6 * (rand() - 0.5)) * Math.PI) / 180;
    fringe += curve(
      [AX, y],
      [AX + s * L * 0.5 * Math.sin(a) + s * L * 0.14, y - L * 0.5 * Math.cos(a)],
      [AX + s * L * Math.sin(a), y - L * Math.cos(a)],
    );
  }
}

// Dense vane around the eye: each barb runs from the shaft up to the edge of an oval.
const CY = 112, RX = 88, RY = 122;
const halfWidth = (y: number) => {
  const u = (y - CY) / RY;
  return Math.abs(u) >= 1 ? 0 : RX * Math.sqrt(1 - u * u);
};
let vane = "";
for (let y = CY + RY - 4; y > CY - RY + 6; y -= 2.1) {
  let end = y;
  while (end > CY - RY && y - end < halfWidth(end) / 1.15) end -= 1;
  for (const s of [-1, 1]) {
    const w = halfWidth(end) * (0.97 + 0.06 * rand());
    vane += curve([AX, y], [AX + s * w * 0.45, (y + end) / 2 + 4], [AX + s * w, end]);
  }
}

const shaft: string[] = [];
for (let y = 715; y >= 150; y -= 25) shaft.push(pt(AX, y));

let fibres = "";
for (let t = 0; t < 360; t += 3.5) {
  const a = (t * Math.PI) / 180;
  fibres += `M182.5,150L${(182.5 + 55 * Math.cos(a)).toFixed(1)},${(128 + 71 * Math.sin(a)).toFixed(1)}`;
}

// Sits behind the hero photo (its parent): the eye peeks out above the top-left corner and the
// fringe shows below the photo. Positions are fractions of the photo box, so it scales with it.
export default function Feather() {
  return (
    <div
      aria-hidden="true"
      className="feather pointer-events-none hidden lg:block absolute left-[3.3%] top-[-46.4%] w-[92.4%] aspect-[330/750] -rotate-[20deg] origin-[63.6%_98.5%]"
    >
      <svg viewBox="40 -24 330 750">
        <path className="lo" d={fringe} />
        <path className="hi" d={vane} />
        <path className="shaft" d={`M${shaft.join("L")}`} />
        <ellipse className="r1" cx="182.5" cy="128" rx="56" ry="72" />
        <ellipse className="r2" cx="182.5" cy="135" rx="44" ry="57" />
        <ellipse className="r3" cx="182.5" cy="140" rx="34" ry="45" />
        <path className="core" transform="translate(182.5,146)" d={EYE_CORE} />
        <path className="fib" d={fibres} />
      </svg>
      {/* Separate layer so the shimmer is an opacity change the GPU handles, not an SVG repaint. */}
      <svg viewBox="40 -24 330 750" className="feather-shimmer">
        <path transform="translate(182.5,146)" d={EYE_CORE} />
      </svg>
    </div>
  );
}
