import Link from "next/link";
import { Logo } from "./logo";
import footerData from "./json/footerData.json";

const Footer = () => {
  return (
    <footer className="bg-background text-gray-300 pt-12 pb-8">
      <div className="max-w-(--breakpoint-xl) mx-auto px-6 xl:px-0 flex flex-col items-center text-center">
        {/* Logo */}
        <Logo />

        {/* Menu links */}
        <nav className="mt-6 flex flex-wrap justify-center gap-6 font-semibold text-sm uppercase text-black dark:text-white ">
          {footerData.menu.map((item, i) => (
            <Link key={i} href={item.url} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Grid sections */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 w-full text-left text-black dark:text-white items-stretch h-auto">
          {footerData.sections.map((section, i) => (
            <div key={i} className="space-y-3 h-full flex flex-col">
              <h3 className="font-bold uppercase text-sm mb-4 ">{section.title}</h3>
              <div
                className={`flex-1 ${section.items.length >= 4 ? "lg:grid lg:grid-cols-2 lg:gap-0 gap-2" : "space-y-1"} font-semibold text-muted-foreground`}
              >
                {section.items.map((item, j) => (
                  <Link
                    key={j}
                    href={item.url}
                    target={item.url.startsWith("http") ? "_blank" : "_self"}
                    className="block text-sm hover:underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
