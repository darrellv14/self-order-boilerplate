import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Self Order Template",
  description: "Boilerplate QR dine-in ordering for restaurant owners.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${display.variable} ${body.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
