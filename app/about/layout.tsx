import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about WallMyDevice and the technology behind our wallpaper generators.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
