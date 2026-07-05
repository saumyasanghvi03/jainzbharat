import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider } from '@clerk/nextjs';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ToastProvider } from '@/components/ui/toast';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: 'JainZBharat — Digital Civilization Platform', template: '%s | JainZBharat' },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: { title: 'JainZBharat', description: site.description, url: site.domain, siteName: 'JainZBharat', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'JainZBharat', description: site.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body>
          <ToastProvider>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </ToastProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
