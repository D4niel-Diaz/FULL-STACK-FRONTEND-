import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/AppProvider";
import React, { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Library Management System',
  description: 'A modern library management system built with Next.js and Laravel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Toaster />
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </AppProvider>
      </body>
    </html>
  )
}
