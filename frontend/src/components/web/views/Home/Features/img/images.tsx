import Image from 'next/image'

//About Images
// image 1
export default function AboutImage1() {
  return (
    <Image
      src="/img/web/home/handWithClock.jpg"
      width={500}
      height={0}
      alt="Picture of the author"
    />
  )
}

// image 2
export function AboutImage2() {
  return (
    <Image
      src="/img/web/home/genebra.jpg"
      width={500}
      height={0}
      alt="Picture of the author"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

// Main Images



export function MainImage() {
  return (
    <Image
      src="/img/web/home/mainClock.png"
      alt="Picture of the author"
      className="object-cover"
      fill 
      priority
    />
  );
}


