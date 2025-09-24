import Link from "next/link";
import { Button } from "@/components/web/Global/ui/button";
import FeatureImage1, { FeatureImage2 } from "./image";

// import json
import featuresData from './featuresData.json'

// import flag icon
import "flag-icons/css/flag-icons.min.css";


const Features: React.FC = () => {
  return (
    <div className="md:min-h-screen w-full flex justify-center items-center p-8 md:p-12 md:mt-20">
      <div className="container flex flex-col gap-12 items-center justify-center mx-auto">

        {/* info section*/}
        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-16 justify-between items-start lg:items-center">

          {/* Image */}
          <div className="w-full lg:w-1/3   rounded-xl relative overflow-hidden 
    bg-black shadow-[4.0px_8.0px_8.0px_rgba(220,_38,_38,_0.48)] border-none
    lg:shadow-[5px_5px_rgba(220,_38,_38,_0.4),_10px_10px_rgba(220,_38,_38,_0.3),_15px_15px_rgba(220,_38,_38,_0.2),_20px_20px_rgba(220,_38,_38,_0.1),_25px_25px_rgba(220,_38,_38,_0.05)]">
            <FeatureImage1 />
          </div>

          {/* Text Content */}
          {featuresData.info.map((data, i) => (
            <div
              key={i}
              className="w-full lg:w-2/3 flex flex-col items-start text-justify uppercase shrink-0 px-4 md:px-6 lg:px-8"
            >
              {/* text1 */}
              <span className="text-base md:text-base lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                {data.text1}
              </span>

              {/* text2 */}
              <p className="text-base md:text-base lg:text-md font-semibold md:font-bold text-muted-foreground dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                {data.text2}
              </p>

              {/* button */}
              <Button asChild size='standartButton' variant="standartButton">
                <Link href={data.href}>{data.button}</Link>
              </Button>
            </div>
          ))}
        </div>



        {/* about section */}
        <div className="mt-8 w-full flex flex-col space-y-20">
          {featuresData.about.map((data, i) => (
            <div
              key={i}
              className="flex flex-col lg:flex-row items-start gap-y-6 gap-x-15 w-full"
            >
              {/* Image */}
              <div className="lg:order-2 relative group overflow-hidden w-full md:basis-7/12 lg:basis-1/2 aspect-[4/2] 
        bg-muted md:bg-black rounded-xl md:mx-auto shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                <FeatureImage2 />

                {/* info image hover */}
                <div className="absolute bottom-4 left-4 flex gap-1 font-semibold md:font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm">
                  <span className="fi fi-ch"></span>
                  <h1>Genebra</h1>
                </div>
              </div>

              {/* Text Content */}
              <div className=" lg:order-1 flex flex-col w-full lg:basis-1/2 items-start text-justify md:text-left uppercase shrink-0 px-4 md:px-6 lg:px-8 mt-4 lg:mt-0">

                {/* text 1 */}
                <span className="text-base md:text-md lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {data.text1}
                </span>

                {/* text2 */}
                <p className="text-base md:text-md lg:text-md font-semibold md:font-bold text-muted-foreground dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {data.text2}
                </p>

                {/* button */}
                <Button asChild size='standartButton' variant='standartButton' className="self-end" >
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

export default Features;
