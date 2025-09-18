import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  
  title: "HookGenie - Your 12-Second Script Genie | AI-Powered Hook Generator",
  description: "Transform your scripts into viral hooks instantly. AI-powered content optimization for YouTube Shorts, TikTok, and Instagram Reels. Paste your script, genie does the rest.",
  keywords: "AI script generator, viral hooks, YouTube Shorts, TikTok, Instagram Reels, content creation, script optimization",
  authors: [{ name: "HookGenie" }],
  creator: "HookGenie",
  publisher: "HookGenie",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  verification: {
    google: '27i9wCnRNde9BD7M0E50KzJYri94-Bq7Ar0ba1l2H0k', // Replace with your actual code
  },
  metadataBase: new URL('https://hookgenie.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "HookGenie - Your 12-Second Script Genie",
    description: "Transform your scripts into viral hooks instantly with AI magic. Perfect for YouTube Shorts, TikTok, and Instagram Reels.",
    url: 'https://hookgenie.vercel.app',
    siteName: 'HookGenie',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HookGenie - AI-Powered Script Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HookGenie - Your 12-Second Script Genie",
    description: "Transform your scripts into viral hooks instantly with AI magic.",
    images: ['/og-image.png'],
    creator: '@hookgenie',
  },
  // icons: automatically detected from /app/icon.png
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
