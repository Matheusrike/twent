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