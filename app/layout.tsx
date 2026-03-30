import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "CHAKRAVYUH & GENESIS 2K26",
  description: "CHAKRAVYUH & GENESIS 2K26 - ITER, SOA Deemed to be University's Annual Fest",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${notoSerif.className}`}>
      <body>{children}</body>
    </html>
  );
}
