import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profiles | Shambu',
  description: 'View and manage profiles in your professional network.',
};

export default function ProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 