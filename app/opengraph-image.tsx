import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "WallMyDevice — generate custom wallpapers for any device";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          position: "relative",
        }}
      >
        <svg
          width="640"
          height="240"
          viewBox="0 0 640 240"
          style={{ position: "absolute", top: 60 }}
        >
          <path
            d="M20 150 C 90 60, 150 60, 220 150 C 290 240, 350 240, 420 150 C 490 60, 550 60, 620 150"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            marginTop: 260,
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#f4f4f5",
            letterSpacing: -1,
          }}
        >
          WallMyDevice
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            fontSize: 30,
            color: "#a1a1aa",
          }}
        >
          Generate custom wallpapers for any device
        </div>
      </div>
    ),
    { ...size }
  );
}
