import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulsee Panel — Discord bot dashboard',
  description:
    'Live monitoring panel for the Pulsee Discord music bot: status, now playing, queue and system stats.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
