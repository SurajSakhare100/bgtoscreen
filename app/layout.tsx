import type { Metadata } from 'next'
import './globals.css'
import SEO from '../components/seo'
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'bgtoscreen',
  description: 'Easily upload, crop, and set backgrounds for your screens. Fast, simple, and beautiful.',
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
      </head>
      <body>{children}
        <Analytics/>
      </body>
    </html>
  )
}
