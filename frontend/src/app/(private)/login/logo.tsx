import Image from "next/image";

export const Logo = () => (
  <div>
    <Image
      src="/img/global/light/horizontalLogoLight.svg"
      width={300}
      height={300}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/global/dark/horizontalLogoDark.svg"
      width={300}
      height={300}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);


