import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'LRJ Properties | Laksar & Haridwar',
  description: 'Local property guidance for plots, homes and land around Laksar and Haridwar.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
