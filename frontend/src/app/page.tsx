import Hero from "@/components/web/Pages/Home/hero/hero";
import MainContainer from "@/components/web/Pages/Home/features/mainContainer";
import AboutContainer from "@/components/web/Pages/Home/features/aboutContainer";


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