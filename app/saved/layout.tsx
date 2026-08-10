import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Wallpapers',
  description: 'View and manage your favorite saved wallpapers.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
