import { Manrope, Sora } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${manrope.variable} bg-[var(--color-bg)] text-[var(--color-text-main)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
