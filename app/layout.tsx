import type { Metadata } from 'next'
import './globals.css'
import SEO from '../components/seo'
import { Analytics } from '@vercel/analytics/react';
// ...existing imports

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <SEO />
        <script defer src="https://vercel.com/analytics/script.js"></script>
      </head>
      <body>{children}
        <Analytics/>
      </body>
    </html>
  )
}
