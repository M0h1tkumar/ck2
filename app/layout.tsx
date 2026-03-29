import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "SOA & CHAKRAVYUH | Imperial Nexus",
  description: "CHAKRAVYUH 2K26 - Imperial nexus of SOA. A bastion of intellectual and physical excellence.",
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
