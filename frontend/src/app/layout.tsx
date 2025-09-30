import { Noto_Sans_Adlam, Noto_Serif, Roboto_Mono } from "next/font/google";
import Navbar from "@/components/web/Global/Navbar/navbar";
import Footer from "@/components/web/Global/Footer/Footer";
import DarkModeProvider from "./themeProvider";
import type { Metadata } from "next";
import "./globals.css";


const notoSansAdlam = Noto_Sans_Adlam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});


const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});


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
      <body className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-900 "
      style={{ marginRight: "0px" }}>
        <Navbar />
        <DarkModeProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}
