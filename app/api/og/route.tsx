import { ImageResponse } from "next/og";
import { getGenerator } from "@/lib/generators/registry";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const g = searchParams.get("g") || "waveform";
    const s = searchParams.get("s") || "k3p9x2a7";
    const rawP = searchParams.get("p") || "0f172a-7c3aed-f59e0b";
    const title = searchParams.get("title") || "WallMyDevice Wallpaper";

    const colors = rawP
      .split(/[-_,]/)
      .map((c) => `#${c.replace(/^#/, "")}`)
      .filter((c) => /^#[0-9a-fA-F]{3,8}$/.test(c));

    const palette = colors.length > 0 ? colors : ["#0f172a", "#7c3aed", "#f59e0b"];

    const generator = getGenerator(g);
    const genLabel = generator ? generator.label : g.toUpperCase();
    const genCategory = generator?.category || "Procedural";

    const bgGradient =
      palette.length >= 3
        ? `radial-gradient(circle at 75% 25%, ${palette[1]} 0%, ${palette[2]} 50%, ${palette[0]} 100%)`
        : palette.length === 2
        ? `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`
        : `linear-gradient(135deg, ${palette[0]} 0%, #000000 100%)`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 60,
            background: bgGradient,
            fontFamily: "sans-serif",
            position: "relative",
            color: "#ffffff",
          }}
        >
          {/* Subtle overlay scrim for contrast */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {/* Top Row: Brand & Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 10,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "#f97316" }}>✦</span>
              <span>WallMyDevice</span>
              <span
                style={{
                  fontSize: 16,
                  fontFamily: "monospace",
                  background: "rgba(255,255,255,0.15)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  marginLeft: 8,
                }}
              >
                v2.0
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#fdba74",
              }}
            >
              <span>{genCategory}</span>
              <span>•</span>
              <span style={{ color: "#ffffff" }}>{genLabel}</span>
            </div>
          </div>

          {/* Middle: Title or Seed */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              zIndex: 10,
              marginTop: 40,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                maxWidth: 900,
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom Row: Seed Tag & Palette Swatches */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 10,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "monospace",
                fontSize: 18,
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: 10,
                color: "#e4e4e7",
              }}
            >
              <span style={{ color: "#a1a1aa" }}>SEED:</span>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>{s}</span>
            </div>

            {/* Palette Swatches */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,0,0,0.4)",
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {palette.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    backgroundColor: c,
                    border: "2px solid rgba(255,255,255,0.8)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
  } catch (e) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
