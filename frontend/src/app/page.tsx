import Hero from "@/components/web/pages/Home/hero/hero";
import TextContainer from "@/components/web/pages/Home/Features/textContainer";
import BusinessContainer from "@/components/web/pages/Home/Features/businessContainer";


export default function Home() {
  return (
    <>
      <div className=" flex flex-col h-auto justify-center items-center">
        <Hero />
        <TextContainer />
        <BusinessContainer/>
      </div>
    </>
  )
}