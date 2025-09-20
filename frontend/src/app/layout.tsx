import { Noto_Sans_Adlam, Noto_Serif, Roboto_Mono } from "next/font/google";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import type { Metadata } from "next";
import "./globals.css";

// Fonte Principal (Sans) - Moderna e legível
const notoSansAdlam = Noto_Sans_Adlam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

// Fonte Serifada (Secundária) - Clássica e institucional
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

// Fonte Monoespaçada - Dados técnicos e tabelas
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Site Oficial TWENT®",
  description: "",
  icons:
  {
    icon: "/img/global/dark/iconDark.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${notoSansAdlam.variable} ${notoSerif.variable} ${robotoMono.variable} `}>
      <body className="font-sans " cz-shortcut-listen="true">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
