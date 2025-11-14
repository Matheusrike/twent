import Image from "next/image";

export const Logo = () => (
  <div>
    <Image
      src="/img/global/light/iconLight.svg"
      width={80}
      height={80}
      alt="Picture of the author"
      className="dark:hidden"
    />
    <Image
      src="/img/global/dark/iconDark.svg"
      width={80}
      height={80}
      alt="Picture of the author"
      className="dark:flex hidden"
    />
  </div>
);


