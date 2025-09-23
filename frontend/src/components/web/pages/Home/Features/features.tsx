import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/web/Global/button";
import FeatureImage1 from "./image";
import { Logo, LogoMobile } from "./logo";


const featuresData = [
  {
    subTittle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis optio dolorum dolor corporis provident assumenda quas recusandae! Consequatur reiciendis delectus molestiae minima impedit consequuntur, deserunt qui, voluptatum perspiciatis nihil quas.',
    text1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis optio dolorum dolor corporis provident assumenda quas recusandae! Consequatur reiciendis delectus molestiae minima impedit consequuntur, deserunt qui, voluptatum perspiciatis nihil quas.',
    text2: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis optio dolorum dolor corporis provident assumenda quas recusandae! Consequatur reiciendis delectus molestiae minima impedit consequuntur, deserunt qui, voluptatum perspiciatis nihil quas.',
    button: 'Ver mais'
  }
]

const Features: React.FC = () => {
  return (
    <div className="min-h-auto md:min-h-screen w-full flex justify-center items-center p-6 md:p-12">
      <div className="container flex flex-col gap-12 items-center justify-center mx-auto">

        {/* Logo */}
        <div className="hidden md:flex">
          <Logo />
        </div>
        {/* Logo Mobile*/}

        <div className="flex md:hidden pt-10">
          <LogoMobile />
        </div>

        {/*  container */}
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-16 w-full">

          {/* Image - desktop */}
          <div className="flex max-w-sm rounded-xl relative overflow-hidden 
            bg-neutral-100 shadow-[5px_5px_rgba(82,_82,_82,_0.4),_10px_10px_rgba(82,_82,_82,_0.3),_15px_15px_rgba(82,_82,_82,_0.2),_20px_20px_rgba(82,_82,_82,_0.1),_25px_25px_rgba(82,_82,_82,_0.05)]
            dark:shadow-[5px_5px_rgba(220,_38,_38,_0.4),_10px_10px_rgba(220,_38,_38,_0.3),_15px_15px_rgba(220,_38,_38,_0.2),_20px_20px_rgba(220,_38,_38,_0.1),_25px_25px_rgba(220,_38,_38,_0.05)]">
            <FeatureImage1 />
          </div>

          {/* Text */}
          {featuresData.map((data, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col text-left items-start pt-10 md:pt-0"
            >
              <span className="uppercase font-medium text-sm text-muted-foreground ">
                {data.subTittle}
              </span>

              <h4 className="my-3 text-2xl font-semibold tracking-tight dark:text-white">
                {data.text1}
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

        {/* Second section */}
        <div className="mt-8 w-full flex flex-col space-y-20">
          {featuresData.map((data, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center gap-y-6 gap-x-15 md:even:flex-row-reverse w-full "
            >
              {/* Image */}
              <div className="w-full md:basis-1/2 aspect-[4/2] bg-muted rounded-xl border border-border/50" >


              </div>

              {/* Text */}
              <div className="md:basis-1/2 flex flex-col items-start text-left shrink-0">


                <h4 className="my-3 text-2xl font-semibold tracking-tight dark:text-white">
                  {data.text1}
                </h4>

                <p className="text-muted-foreground">{data.text2}</p>

                <Button asChild size="lg" className="mt-6 rounded-full gap-3">
                  <Link href=''>
                    Learn More
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
