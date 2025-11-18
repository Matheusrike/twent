import { Playfair_Display, Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/app/globals.css";
import SideBar from "@/components/private/global/sideBar/sideBarLayout";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/lib/auth";

export const metadata: Metadata = {
  title: "Portal Empresarial TWENT®",
  description: "",
  icons: {
    icon: "/img/global/dark/iconDark.svg",
  },
};

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAuthToken();

  console.log("TOKEN AUTENTICADO:", token);

  if (!token) {
    console.log("Nenhum token encontrado. Redirecionando…");
    redirect("/companies/login");
  }

  return (
    <html
      lang="pt-br"
      className={`${playfairDisplay.variable} ${inter.variable} bg-white`}
    >
      <body data-layout="manager">
        <SideBar>{children}</SideBar>
      </body>
    </html>
  );
}
