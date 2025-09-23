import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/web/Global/button";
import FeatureImage1 from "./image";
import { Logo, LogoMobile } from "./logo";


import featuresData from './featuresData.json'

const Features: React.FC = () => {
  return (
    <div className="min-h-auto md:min-h-screen w-full flex justify-center items-center p-8 md:p-12">
      <div className="container flex flex-col gap-12 items-center justify-center mx-auto">

        {/* Logo */}
        <div className="hidden md:flex pt-20">
          <Logo />
        </div>
        {/* Logo Mobile*/}

        <div className="flex md:hidden pt-10">
          <LogoMobile />
        </div>

        {/*  container and info section*/}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-16 w-full">

          {/* Image - desktop */}
          <div className="flex max-w-sm rounded-xl relative overflow-hidden 
            bg-neutral-100 shadow-[5px_5px_rgba(82,_82,_82,_0.4),_10px_10px_rgba(82,_82,_82,_0.3),_15px_15px_rgba(82,_82,_82,_0.2),_20px_20px_rgba(82,_82,_82,_0.1),_25px_25px_rgba(82,_82,_82,_0.05)]
            dark:shadow-[5px_5px_rgba(220,_38,_38,_0.4),_10px_10px_rgba(220,_38,_38,_0.3),_15px_15px_rgba(220,_38,_38,_0.2),_20px_20px_rgba(220,_38,_38,_0.1),_25px_25px_rgba(220,_38,_38,_0.05)]">
            <FeatureImage1 />
          </div>

          {/* Text */}
          {featuresData.info.map((data, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col text-left items-start pt-10 md:pt-0"
            >
              <span className="uppercase font-medium text-sm text-muted-foreground ">
                {data.text1}
              </span>

              <h4 className="my-3 text-2xl font-semibold tracking-tight dark:text-white">
                {data.text2}
              </h4>

              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full gap-3 self-start"
              >
                <Link href="/about">
                  {data.button}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* about section */}
        <div className="mt-8 w-full flex flex-col space-y-20">
          {featuresData.about.map((data, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center gap-y-6 gap-x-15 md:even:flex-row-reverse w-full "
            >
              {/* Image */}
              <div className="w-full md:basis-1/2 aspect-[4/2] bg-muted rounded-xl  shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]" >


              </div>

              {/* Text */}
              <div className="md:basis-1/2 flex flex-col items-start text-left shrink-0">


                <h4 className="my-3 text-2xl font-semibold tracking-tight dark:text-white">
                  {data.text1}
                </h4>

                <p className="text-muted-foreground">{data.text2}</p>

                <Button asChild size="lg" className="mt-6 rounded-full gap-3">
                  <Link href=''>
                   {data.button}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}

export default Features;
