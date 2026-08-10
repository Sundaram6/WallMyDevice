import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Archive',
  description: 'Browse the curated historical archive of past recipes and themed collections.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
