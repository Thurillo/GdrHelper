import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GdrHelper VTT',
  description: 'Virtual Tabletop for D&D 5e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
