import Image from 'next/image'

export default function BannerImage() {
  return (
      <Image
        src="/img/global/dark/horizontalLogoDark.svg"
        width={500}
        height={0}
        alt="Picture of the author"
      />
  )
}
