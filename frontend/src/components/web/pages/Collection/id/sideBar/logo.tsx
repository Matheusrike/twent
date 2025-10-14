import Image from "next/image";

export const Logo = () => (
  <div>
    <Image
      src="/img/web/global/light/iconLight.svg"
      width={28}
      height={28}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/web/global/dark/iconDark.svg"
      width={28}
      height={28}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);

export const LogoMenu = () => (
  <div>
    <Image
      src="/img/web/global/light/iconLight.svg"
      width={40}
      height={40}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/web/global/dark/iconDark.svg"
      width={40}
      height={40}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);