import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "SuiFL",
  description: "Federated learning built on SuiFL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} antialiased dark font-sans`}>
        <Providers>{children}</Providers> <Toaster />
      </body>
    </html>
  );
}
