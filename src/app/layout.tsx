import './globals.css'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CacheProvider } from '@/utils/cache';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Psi Colab',
  description: 'Blog colaborativo de psicología',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <StackTheme />
      </head>
      <body className={`${inter.className} bg-white min-h-screen flex flex-col`}>
        <StackProvider app={stackServerApp}>
          <CacheProvider>
            <Header />
            <main className="flex-grow mt-20">
              {children}
            </main>
            <Footer />
          </CacheProvider>
        </StackProvider>
      </body>
    </html>
  )
}