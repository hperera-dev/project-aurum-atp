import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://project-aurum.netlify.app'),
  title: 'Project AURUM | Private Jewellery Vault & Showroom Gold Registry — Sri Lanka',
  description:
    'Lock exact 22K net gold weight, purity, and encrypted invoices into one private Sri Lankan family vault while keeping showroom records invisible to rivals.',
  alternates: {
    canonical: 'https://project-aurum.netlify.app/',
  },
  icons: {
    icon: '/images/theLogo.jpg',
    apple: '/images/theLogo.jpg',
  },
  openGraph: {
    type: 'website',
    url: 'https://project-aurum.netlify.app/',
    title: 'Project AURUM — Never Lose a Gram of Proof',
    description:
      'One private family vault for Sri Lankan 22K gold across every trusted showroom. Zero home addresses stored. Zero competitor leakage.',
    images: [
      {
        url: 'https://project-aurum.netlify.app/images/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Project AURUM Private Jewellery Ownership Vault and Showroom POS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project AURUM — Never Lose a Gram of Proof',
    description:
      'Private digital gold passports and 8-second showroom handover built for Sri Lankan families and retail jewellers.',
    images: ['https://project-aurum.netlify.app/images/og-preview.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#260409',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Project AURUM',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://project-aurum.netlify.app/',
  description:
    'Zero-knowledge fine jewellery ownership vault and isolated showroom registry engineered in Colombo, Sri Lanka.',
  author: {
    '@type': 'Organization',
    name: 'Project AURUM Engineering Team (Group SE-10)',
    email: 'aurumteam25@gmail.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-LK" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=sentient@400,500,700&f[]=switzer@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
