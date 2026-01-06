import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soner Yılmaz | Bireysel Yatırımcı & Piyasa Gözlemcisi",
  description: "Profesyonel yatırımcı, blockchain ve finansal piyasalar uzmanı",
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://soneryilmaz.vercel.app',
    siteName: 'Soner Yılmaz | Bireysel Yatırımcı & Piyasa Gözlemcisi',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Soner Yılmaz | Bireysel Yatırımcı & Piyasa Gözlemcisi',
              url: 'https://soneryilmaz.vercel.app',
              description: 'Profesyonel yatırımcı, blockchain ve finansal piyasalar uzmanı',
              inLanguage: 'tr-TR',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://soneryilmaz.vercel.app/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
