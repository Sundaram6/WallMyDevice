import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WallMyDevice',
  description: 'Generate custom wallpapers for any device.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
