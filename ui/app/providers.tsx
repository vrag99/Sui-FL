"use client";

import { WalletProvider } from '@suiet/wallet-kit'
import { ThemeProvider } from 'next-themes'
import React from 'react'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  )
}

export default Providers