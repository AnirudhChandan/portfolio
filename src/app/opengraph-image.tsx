import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Anirudh Chandan — Backend & Systems Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Auto-generated social preview image (rendered on the edge by next/og).
export default function OpengraphImage() {
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
          background: "radial-gradient(circle at 30% 0%, #0f172a 0%, #020617 70%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "9999px", background: "#2dd4bf" }} />
          <div style={{ fontSize: "22px", letterSpacing: "6px", color: "#2dd4bf", textTransform: "uppercase" }}>
            System Status: Online
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "92px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-3px" }}>
            Anirudh Chandan
          </div>
          <div style={{ fontSize: "40px", fontWeight: 600, color: "#cbd5e1", marginTop: "12px" }}>
            I build scalable backend systems.
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "24px", color: "#94a3b8" }}>
          {["PyDB · B-Tree Engine", "Distributed Systems", "API Design"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 20px",
                border: "1px solid rgba(45,212,191,0.3)",
                borderRadius: "10px",
                color: "#5eead4",
                background: "rgba(45,212,191,0.08)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
