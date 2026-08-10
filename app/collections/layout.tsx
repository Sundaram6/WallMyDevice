import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore our collection of generative wallpapers, patterns, and creative styles.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
