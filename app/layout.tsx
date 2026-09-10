import type { Metadata } from 'next';
import { publicAsset } from '@/lib/public-asset';
import './globals.css';
import './fonts.css';
export const metadata: Metadata = {
  title: 'Chirag S — Event Horizon',
  description:
    'Software Engineer · AI & Data Science. Explore Chirag S’s work in intelligent software, full stack development, and physics-aware astronomy AI.',
  icons: { icon: publicAsset('/favicon.svg') },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
