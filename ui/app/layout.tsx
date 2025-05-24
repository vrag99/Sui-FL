import type { Metadata } from "next";
import "./globals.css";
import "@suiet/wallet-kit/style.css";
import { DM_Sans, Libre_Baskerville, Lora } from "next/font/google";
import Providers from "./providers";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
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
      <body
        className={`${libreBaskerville.variable} ${dmSans.variable} ${lora.variable} antialiased dark font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
