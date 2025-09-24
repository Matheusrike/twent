import Link from "next/link";
import { Button } from "@/components/web/Global/button";
import FeatureImage1 from "./image";

// import json
import featuresData from './featuresData.json'

const Features: React.FC = () => {
  return (
    <div className="md:min-h-screen w-full flex justify-center items-center p-8 md:p-12 md:mt-20">
      <div className="container flex flex-col gap-12 items-center justify-center mx-auto">

        {/* info section*/}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-16 w-full">

          {/* Image  */}
          <div className="flex max-w-sm rounded-xl relative overflow-hidden 
            bg-neutral-100  shadow-[4.0px_8.0px_8.0px_rgba(220,_38,_38,_0.48)] border-none
            md:shadow-[5px_5px_rgba(220,_38,_38,_0.4),_10px_10px_rgba(220,_38,_38,_0.3),_15px_15px_rgba(220,_38,_38,_0.2),_20px_20px_rgba(220,_38,_38,_0.1),_25px_25px_rgba(220,_38,_38,_0.05)]">
            <FeatureImage1 />
          </div>

          {/* Text Content */}
          {featuresData.info.map((data, i) => (
            <div
              key={i}
              className="md:basis-1/2 flex flex-col items-start text-left shrink-0 md:order-1 px-4 md:px-6 lg:px-8"
            >
              {/* text1 */}
              <span className="text-black font-semibold md:font-bold 
               text-xs sm:text-sm md:text-base lg:text-md 
                dark:text-gray-300 
               uppercase tracking-wider md:tracking-widest 
               mb-2 md:mb-3 lg:mb-4
               opacity-80 hover:opacity-100 transition-opacity duration-200">
                {data.text1}
              </span>

              {/* text2 */}
              <h4 className="font-semibold md:font-bold 
               text-md sm:text-sm md:text-base lg:text-md 
               text-muted-foreground dark:text-gray-300 
               uppercase tracking-wider md:tracking-widest 
               mb-2 md:mb-3 lg:mb-4
               opacity-80 hover:opacity-100 transition-opacity duration-200">
                {data.text2}
              </h4>

              {/* button */}
              <Button
                asChild
                size='standartButton'
                variant="standartButton"
              >
                <Link href={data.href}>
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
              <div className="md:order-2 w-full md:basis-1/2 aspect-[4/2] bg-muted rounded-xl  shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]" >


              </div>

              {/* Text Content */}
              <div className="md:basis-1/2 flex flex-col items-start text-left shrink-0 md:order-1 px-4 md:px-6 lg:px-8">

                {/* text 1 */}
                <h4 className="text-black font-semibold md:font-bold 
               text-xs sm:text-sm md:text-base lg:text-md 
                dark:text-gray-300 
               uppercase tracking-wider md:tracking-widest 
               mb-2 md:mb-3 lg:mb-4
               opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {data.text1}
                </h4>

                {/* text2 */}
                <p className="font-semibold md:font-bold 
               text-md sm:text-sm md:text-base lg:text-md 
               text-muted-foreground dark:text-gray-300 
               uppercase tracking-wider md:tracking-widest 
               mb-2 md:mb-3 lg:mb-4
               opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {data.text2}
                </p>

                {/* button */}
                <Button asChild
                  size='standartButton'
                  variant='standartButton'
                >
                  <Link href={data.href}>
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
