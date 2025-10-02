import Image from "next/image";

export  const Logo = () => (
    <div>
        <Image
            src="/img/web/global/light/horizontalLogolight.svg"
            width={250}
            height={250}
            alt="Picture of the author"
            className="dark:hidden p-2"
        />
        <Image
            src="/img/web/global/dark/horizontalLogoDark.svg"
            width={250}
            height={250}
            alt="Picture of the author"
            className="dark:flex hidden p-2"
        />
    </div>
);