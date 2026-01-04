import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soner Yılmaz - Yatırım Portfolyosu",
  description: "Profesyonel yatırımcı, blockchain ve finansal piyasalar uzmanı",
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://yeniweb.vercel.app',
    siteName: 'Soner Yılmaz',
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
