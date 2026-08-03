import type { Metadata } from "next";

const title = "WallMyDevice Studio — Custom Wallpaper Generator";
const description =
  "Design, customize, and generate high-resolution wallpapers for iPhone, Android, iPad, and Desktop with real-time procedural generators.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/api/og?g=waveform&s=k3p9x2a7&p=0f172a-7c3aed-f59e0b",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/api/og?g=waveform&s=k3p9x2a7&p=0f172a-7c3aed-f59e0b"],
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
