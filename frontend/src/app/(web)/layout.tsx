import { Noto_Sans_Adlam, Noto_Serif, Roboto_Mono } from "next/font/google";
import Navbar from "@/components/web/Global/Navbar/navbar";
import Footer from "@/components/web/Global/Footer/Footer";
import DarkModeProvider from "../../utils/theme/themeProvider";
import type { Metadata } from "next";
import "@/app/globals.css";


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
    <html lang="pt-br"  className={`${notoSansAdlam.variable} ${notoSerif.variable} ${robotoMono.variable} `}>
      <body cz-shortcut-listen="true" 
      style={{ marginRight: "0px" }}>
        <Navbar />
        <DarkModeProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}
