// Footer vignette: a peacock on a sal branch with its train hanging down. A server component,
// so the train outline and eye spots are computed at build time and ship as plain SVG.

const rand = (() => {
  let s = 5; // fixed seed: identical output on every build
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
})();
const f = (v: number) => v.toFixed(1);
const p = (q: number[]) => `${f(q[0])},${f(q[1])}`;

// Train: a cubic centre line from the bird's back to the tip, widening as it falls.
const B = [[904, 214], [878, 282], [826, 372], [796, 478]];
const at = (t: number) => {
  const u = 1 - t;
  return [0, 1].map((j) => u * u * u * B[0][j] + 3 * u * u * t * B[1][j] + 3 * u * t * t * B[2][j] + t * t * t * B[3][j]);
};
const dir = (t: number) => {
  const a = at(Math.max(0, t - 0.01)), b = at(Math.min(1, t + 0.01));
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
};
const width = (t: number) => 10 + 95 * t ** 1.1;

const left: number[][] = [], right: number[][] = [];
for (let i = 0; i <= 30; i++) {
  const t = i / 30, c = at(t), d = dir(t), w = width(t) / 2;
  left.push([c[0] - d[1] * w, c[1] + d[0] * w]);
  right.push([c[0] + d[1] * w, c[1] - d[0] * w]);
}
const tip = at(1), td = dir(1);
const train = `M${left.map(p).join("L")}Q${p([tip[0] + td[0] * 30, tip[1] + td[1] * 30])} ${right.reverse().map(p).join("L")}Z`;

let strands = "";
for (let t = 0.06; t < 0.98; t += 0.022) {
  const c = at(t), d = dir(t), w = width(t) / 2, e = at(Math.min(1, t + 0.05));
  for (const s of [-1, 1]) strands += `M${p(c)}L${f(e[0] - d[1] * w * 0.9 * s)},${f(e[1] + d[0] * w * 0.9 * s)}`;
}

const spots: string[] = [];
for (let t = 0.12; t <= 0.97; t += 0.052) {
  const c = at(t), d = dir(t), w = width(t) / 2;
  const cols = Math.max(1, Math.round(width(t) / 24));
  const angle = (Math.atan2(d[1], d[0]) * 180) / Math.PI - 90;
  for (let j = 0; j < cols; j++) {
    const off = cols === 1 ? 0 : (j / (cols - 1) - 0.5) * w * 1.5 + (rand() - 0.5) * 5;
    const along = (rand() - 0.5) * 8, scale = 0.5 + t * 0.45 + rand() * 0.12;
    spots.push(`translate(${f(c[0] - d[1] * off + d[0] * along)},${f(c[1] + d[0] * off + d[1] * along)}) rotate(${f(angle)}) scale(${scale.toFixed(2)})`);
  }
}

const LEAF = "M0,0 C7,-10 24,-11 34,0 C24,11 7,10 0,0Z";
// [x, y, rotation, scale]: a cluster hides the cut end on the right, a few small ones at the tip.
const leaves = [
  [1150, 178, -35, 1.2], [1170, 196, 15, 1.25], [1140, 205, 70, 1.05], [1125, 176, -80, 1], [1185, 168, -15, 1.1],
  [1105, 208, 110, 0.9], [1195, 210, 40, 1.1], [1062, 176, -100, 0.8], [1066, 182, -140, 0.7],
  [852, 236, 195, 0.8], [860, 233, 150, 0.65],
];

export default function FooterPeacock() {
  return (
    <svg viewBox="730 95 485 400" aria-hidden="true" className="peacock w-44 md:w-56 h-auto">
      <path className="bark" d="M1062,203 C1066,192 1068,184 1064,176 L1067,175 C1072,184 1070,193 1066,203Z" />
      <path className="bark" d="M1215,168 C1150,176 1080,196 1010,206 C960,213 905,220 850,232 C842,234 838,240 846,242 C905,234 965,229 1015,224 C1090,216 1150,204 1215,200Z" />
      <path className="train" d={train} />
      <path className="strands" d={strands} />
      {spots.map((t) => (
        <g key={t} transform={t}>
          <ellipse className="r1" rx="5" ry="7" />
          <ellipse className="r3" rx="3.5" ry="5" cy=".8" />
          <ellipse className="core" rx="1.9" ry="2.8" cy="1.4" />
        </g>
      ))}
      <path className="bird" d="M904,212 C909,190 934,178 957,182 C972,185 979,196 975,206 C969,216 950,220 930,219 C917,218 907,217 904,212Z" />
      <path className="bird" d="M957,192 C966,177 962,160 966,146 C968,138 975,133 980,135 C985,138 983,147 978,157 C973,170 976,182 972,195Z" />
      <circle className="bird" cx="979" cy="134" r="7.5" />
      <path className="bird" d="M985,132 L996,135.5 L985,139Z" />
      <circle className="bird-eye" cx="981.5" cy="132.5" r="1.4" />
      <g className="crest">
        {[[968, 109], [972, 106], [977.5, 105], [983, 106], [987, 109]].map(([x, y]) => (
          <g key={x}>
            <line x1="978" y1="127" x2={x} y2={y} />
            <circle cx={x} cy={y} r="2.2" />
          </g>
        ))}
      </g>
      {leaves.map(([x, y, r, s]) => (
        <path key={`${x}-${y}`} className="leaf" d={LEAF} transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} />
      ))}
    </svg>
  );
}
