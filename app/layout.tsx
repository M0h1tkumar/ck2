import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
