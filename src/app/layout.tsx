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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts for wedding theme */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
        {/* GPT Engineer script - preserved from original */}
        <script src="https://cdn.gpteng.co/gptengineer.js" type="module" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 