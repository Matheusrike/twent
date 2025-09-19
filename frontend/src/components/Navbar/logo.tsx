import Image from "next/image";

export const Logo = () => (
  <div>
    <Image
      src="/img/global/light/iconLight.svg"
      width={28}
      height={28}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/global/dark/iconDark.svg"
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
      src="/img/global/light/horizontalLogoLight.svg"
      width={220}
      height={220}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/global/dark/horizontalLogoDark.svg"
      width={220}
      height={220}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);