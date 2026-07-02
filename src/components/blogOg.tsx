import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = (title: string) => `${title} — Anirudh Chandan`;

// Shared social-card renderer for blog posts (rendered on the edge).
export function blogOgImage(title: string, tag: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "radial-gradient(circle at 25% 0%, #0f172a 0%, #020617 70%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#2dd4bf" }} />
          <div style={{ fontSize: "22px", letterSpacing: "6px", color: "#2dd4bf", textTransform: "uppercase" }}>
            {`Writing · ${tag}`}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "68px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", maxWidth: "1000px" }}>
          {title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "24px", color: "#94a3b8" }}>
          <span>Anirudh Chandan</span>
          <span style={{ color: "#5eead4" }}>anirudh-chandan.vercel.app</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
