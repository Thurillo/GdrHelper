import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GdrHelper VTT',
  description: 'Virtual Tabletop for D&D 5e',
};

import NextAuthProvider from '@/components/NextAuthProvider';
import SocketProvider from '@/components/SocketProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
