import { Noto_Sans_Adlam, Noto_Serif, Roboto_Mono } from "next/font/google";
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
  title: "Portal Empresarial TWENT®",
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
    <html lang="pt-br"  className={`${notoSansAdlam.variable} ${notoSerif.variable} ${robotoMono.variable}  bg-white`}>
      <body cz-shortcut-listen="true"  data-layout="manager">
        {children}
      </body>
    </html>
  );
}
