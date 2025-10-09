import Image from "next/image";

export const Logo = () => (
  <div>
    <Image
      src="/img/web/global/light/verticalLogoLight.svg"
      width={280}
      height={280}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/web/global/dark/verticalLogoDark.svg"
      width={280}
      height={280}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);

export const LogoMobile = () => (
  <div>
    <Image
      src="/img/web/global/light/horizontalLogoLight.svg"
      width={280}
      height={280}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/web/global/dark/horizontalLogoDark.svg"
      width={280}
      height={280}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);

