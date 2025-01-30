import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { UserProvider } from '@auth0/nextjs-auth0/client'; //  IMPORTA UserProvider

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Psi Colab',
  description: 'Blog colaborativo de psicología',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <UserProvider> {/*  ENVOLVER el <body> con UserProvider */}
        <body className={`${inter.className} bg-white min-h-screen flex flex-col`}>
          <Header />
          <main className="flex-grow mt-20">
            {children}
          </main>
          <Footer />
        </body>
      </UserProvider> {/*  Cierre de UserProvider */}
    </html>
  )
}
