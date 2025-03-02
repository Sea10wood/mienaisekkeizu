import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Analyzer',
  description: 'Analyze website frameworks and show 3D representation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
