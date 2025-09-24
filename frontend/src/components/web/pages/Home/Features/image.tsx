import Image from 'next/image'

export default function FeatureImage1() {
  return (
      <Image
        src="/img/home/handWithClock.jpg"
        width={500}
        height={0}
        alt="Picture of the author"
      />
  )
}

export function FeatureImage2() {
  return (
      <Image
        src="/img/home/genebra.jpg"
        width={500}
        height={0}
        alt="Picture of the author"
        className="absolute inset-0 h-full w-full object-cover"
      />
  )
}