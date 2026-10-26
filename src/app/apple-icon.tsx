import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08101a",
        }}
      >
        {/* Same feather eye as icon.svg */}
        <svg width="140" height="140" viewBox="10 4 44 56">
          <ellipse cx="32" cy="31" rx="17" ry="22" fill="#a3a63f" />
          <ellipse cx="32" cy="33" rx="12.7" ry="16.5" fill="#b4692a" />
          <ellipse cx="32" cy="34.5" rx="9.5" ry="12.3" fill="#2db8a6" />
          <path d="M0,22 C-6,31 -23,27 -23,4 C-23,-17 -11,-30 0,-30 C11,-30 23,-17 23,4 C23,27 6,31 0,22Z" transform="translate(32,35) scale(.3)" fill="#1c3d96" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
