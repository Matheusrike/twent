import { Prata, Work_Sans } from "next/font/google";
import Navbar from "@/components/web/Global/Navbar/navbar";
import Footer from "@/components/web/Global/Footer/Footer";
import DarkModeProvider from "../../utils/theme/themeProvider";
import type { Metadata } from "next";
import "@/app/globals.css";


const prata = Prata({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});


const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
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
    <html lang="pt-br" className={`${prata.variable} ${workSans.variable}`}>
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
