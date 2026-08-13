import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LRJ Properties | Laksar & Haridwar',
  description: 'Local property guidance for plots, homes and land around Laksar and Haridwar.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
