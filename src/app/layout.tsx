import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CacheProvider } from '@/utils/cache';
import { Suspense } from 'react'
import IdentityRedirect from '@/components/IdentityRedirect'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Psi Colab',
  description: 'Blog colaborativo de psicología',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.png',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head></head>
      <body className={`${inter.className} bg-white min-h-screen flex flex-col`}>
          <IdentityRedirect />
          <Suspense fallback={<div className="h-16" />}>
            <Header />
          </Suspense>
          <CacheProvider>
            <main className="flex-grow mt-16">
              {children}
            </main>
          </CacheProvider>
          <Footer />
      </body>
    </html>
  )
}