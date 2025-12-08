import Link from "next/link";
import { Button } from "@/components/web/Global/ui/button";
import AboutImage1, { AboutImage2 } from "./img/images";

// import json
import aboutContainerData from './json/aboutContainerData.json'

// import flag icon
import "flag-icons/css/flag-icons.min.css";


const AboutContainer: React.FC = () => {
  return (
    <div className="md:min-h-screen flex justify-center items-center p-8 md:p-12 mb-25 container">
      <div className="container flex flex-col gap-12 items-center justify-center mx-auto">

        {/* tittle */}
        <div className="max-w-4xl text-left flex flex-col items-start justify-start self-start">
          <h1 className="text-5xl md:text-6xl lg:text-6xl font-semibold text-primary">
            Conheça nossa história e paixão pelos relógios
          </h1>
     
         
        </div>



        {/* about section primary*/}
        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-16 justify-between items-start lg:items-center">
          {/* Image */}
          <div className="w-full lg:w-1/3 rounded-xl relative overflow-hidden md:flex md:items-center md:justify-center 
    bg-black shadow-[4.0px_8.0px_8.0px_rgba(220,_38,_38,_0.48)] border-none
    lg:shadow-[5px_5px_rgba(220,_38,_38,_0.4),_10px_10px_rgba(220,_38,_38,_0.3),_15px_15px_rgba(220,_38,_38,_0.2),_20px_20px_rgba(220,_38,_38,_0.1),_25px_25px_rgba(220,_38,_38,_0.05)]">
            <AboutImage1 />
          </div>

          {/* Text Content */}
          {aboutContainerData.info.map((data, i) => (
            <div
              key={i}
              className="w-full lg:w-2/3 flex flex-col items-start shrink-0 px-4 md:px-6 lg:px-8"
            >
              <span className="uppercase font-medium text-sm text-muted-foreground">
                {data.category}
              </span>

              <h4 className="my-3 text-2xl font-semibold tracking-tight  dark:text-white">
                {data.title}
              </h4>

              {/* text1 */}
              <p className="text-base md:text-base lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                {data.text1}
              </p>

              {/* text2 */}
              <p className="text-base md:text-base lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                {data.text2}
              </p>

              {/* button */}
              <Button asChild size="standartButton" variant="standartButton">
                <Link href={data.href}>{data.button}</Link>
              </Button>
            </div>
          ))}
        </div>




        {/* about section second */}
        <div className="mt-8 w-full flex flex-col space-y-20">
          {aboutContainerData.about.map((data, i) => (
            <div
              key={i}
              className="flex flex-col lg:flex-row items-center gap-y-6 gap-x-15 w-full lg:even:flex-row-reverse"
            >
              {/* Image */}
              <div
                className="md:order-2 relative group overflow-hidden w-full md:basis-7/12 lg:basis-1/2 aspect-[4/2] 
        bg-muted md:bg-black rounded-xl md:mx-auto 
        shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
              >
                <AboutImage2 />

                {/* info image hover */}
                <div className="absolute bottom-4 left-4 flex gap-1 font-semibold md:font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm">
                  <span className="fi fi-ch"></span>
                  <h1>Genebra</h1>
                </div>
              </div>

              {/* Text Content */}
              <div className="md:order-1  flex flex-col w-full lg:basis-1/2 items-start shrink-0 px-4 md:px-6 lg:px-8 mt-4 lg:mt-0">
                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {data.category}
                </span>

                <h4 className="my-3 text-2xl font-semibold tracking-tight dark:text-white">
                  {data.title}
                </h4>

                {/* text 1 */}
                <p className="text-base md:text-md lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {data.text1}
                </p>

                {/* text2 */}
                <p className="text-base md:text-md lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {data.text2}
                </p>

                {/* button */}
                <Button asChild size="standartButton" variant="standartButton" className="self-start">
                  <Link href={data.href}>{data.button}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  )

}

export default AboutContainer;
