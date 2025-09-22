import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import footerData from "./json/footerData.json";


const Footer = () => {
  return (
    <div className=" flex flex-col dark:bg-black bg-background">
      <div className="grow bg-background" />
      <footer className="">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2 flex justify-center items-center">
              {/* Logo */}
              <Image
                src="/img/global/light/horizontalLogoLight.svg"
                width={200}
                height={200}
                alt="Logo Twent"
                className="dark:hidden"
              />

              <Image
                src="/img/global/dark/horizontalLogodark.svg"
                width={200}
                height={200}
                alt="Logo Twent"
                className="hidden dark:flex"
              />

            </div>

            {footerData.map(({ title, links }) => (
              <div key={title} className="flex flex-col justify-center items-center">
                <h6 className="font-semibold text-black dark:text-gray-100 mx-2">{title}</h6>
                <ul className="mt-6 space-y-4 mx-0">
                  {links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-sm px-2 py-1 transition-colors"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                Todos os os direitos reservados
              </Link>
              . TWENT®
            </span>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href="#" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <DribbbleIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <TwitchIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
