import Image from "next/image";

export const Logo = () => (
  <div>
    <Image
      src="/img/global/light/verticalLogoLight.svg"
      width={250}
      height={250}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/global/dark/verticalLogoDark.svg"
      width={250}
      height={250}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);


