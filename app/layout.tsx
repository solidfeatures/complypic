import type { Metadata } from 'next'
import { Instrument_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const googleSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-google-sans',
});

export const metadata: Metadata = {
  title: 'ComplyPic — Professional Image Compliance Tool',
  description:
    'Effortlessly transform images to meet strict technical specifications. Resize, adjust DPI, and enforce format or file size requirements for professional documents and passports.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={googleSans.variable}>
      <body className="font-sans antialiased selection:bg-primary/20">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
