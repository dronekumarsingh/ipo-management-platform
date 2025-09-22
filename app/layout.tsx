import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "IPO Central - Track Initial Public Offerings",
  description:
    "Track and analyze Initial Public Offerings (IPOs) with comprehensive data including price bands, listing gains, and performance metrics. Professional IPO tracking platform.",
  keywords: "IPO, Initial Public Offering, Stock Market, Investment, Share Market, Trading, Finance",
  authors: [{ name: "IPO Central" }],
  creator: "IPO Central",
  publisher: "IPO Central",
  robots: "index, follow",
  openGraph: {
    title: "IPO Central - Track Initial Public Offerings",
    description: "Comprehensive IPO tracking and analysis platform",
    type: "website",
    locale: "en_IN",
    siteName: "IPO Central",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO Central - Track Initial Public Offerings",
    description: "Comprehensive IPO tracking and analysis platform",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
