import type { Metadata } from 'next';
import '@/index.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Nunta360 - Plan Your Perfect Wedding Day',
  description: 'Modern wedding planning web app for Romanian couples. Plan every detail with ease.',
  authors: [{ name: 'Nunta360' }],
  openGraph: {
    title: 'Nunta360 - Plan Your Perfect Wedding Day',
    description: 'Modern wedding planning web app for Romanian couples. Plan every detail with ease.',
    type: 'website',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nunta360',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* GPT Engineer script - preserved from original */}
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module" />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 