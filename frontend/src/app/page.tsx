import Features from "@/components/web/pages/Home/Features/features";
import Hero from "@/components/web/pages/Home/hero/hero";

export default function Home() {
  return (
    <>
      <div className=" flex flex-col h-auto justify-center items-center">
        <Hero />
        <Features />
      </div>
    </>
  )
}