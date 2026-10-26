import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = (title: string) => `${title} — Anirudh Chandan`;

// Shared social-card renderer for blog posts and case studies (rendered on the edge).
export function blogOgImage(title: string, tag: string, section = "Writing") {
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
          background: "radial-gradient(circle at 25% 0%, #1e1a44 0%, #0d0b1e 70%)",
          color: "#f2f0fa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#3cc4b4" }} />
          <div style={{ fontSize: "22px", letterSpacing: "6px", color: "#e2b65c", textTransform: "uppercase" }}>
            {`${section} · ${tag}`}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "68px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", maxWidth: "1000px" }}>
          {title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "24px", color: "#8c8a9a" }}>
          <span>Anirudh Chandan</span>
          <span style={{ color: "#eac989" }}>anirudhchandan.com</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
