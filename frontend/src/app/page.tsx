import Hero from "@/components/web/pages/Home/hero/hero";
import MainContainer from "@/components/web/pages/Home/Features/mainContainer";
import AboutContainer from "@/components/web/pages/Home/Features/aboutContainer";


export default function Home() {
  return (
    <>
      <div className=" flex flex-col h-auto justify-center items-center">
        <Hero />
        <MainContainer />
        <AboutContainer />
      </div>
    </>
  )
}