import Link from "next/link";
import { Button } from "@/components/web/Global/ui/button";
import AboutImage1 from "./img/images";
import { AboutImage2 } from "./img/images";
import aboutContainerData from "./json/aboutContainerData.json";
import "flag-icons/css/flag-icons.min.css";

const AboutContainer: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-3 text-primary font-semibold text-sm uppercase tracking-wider">
                <span className="w-12 h-0.5 bg-primary"></span>
                Nossa História
                <span className="w-12 h-0.5 bg-primary"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary">
                Onde a Paixão Começou
              </h2>
              <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Descubra a tradição e inovação ao longo de décadas
              </p>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center">
              <div className="w-full lg:w-1/3">
                <div className="relative overflow-hidden rounded-xl bg-black shadow-[4px_8px_8px_rgba(220,38,38,0.48)] lg:shadow-[5px_5px_rgba(220,38,38,0.4),10px_10px_rgba(220,38,38,0.3),15px_15px_rgba(220,38,38,0.2),20px_20px_rgba(220,38,38,0.1),25px_25px_rgba(220,38,38,0.05)]">
                  <AboutImage1 />
                </div>
              </div>

              <div className="w-full lg:w-2/3 space-y-6">
                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {aboutContainerData.info[0].category}
                </span>
                <h4 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {aboutContainerData.info[0].title}
                </h4>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {aboutContainerData.info[0].text1}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {aboutContainerData.info[0].text2}
                </p>
                <Button asChild size="lg" className="group mt-6">
                  <Link href={aboutContainerData.info[0].href} className="flex items-center gap-3">
                    {aboutContainerData.info[0].button}
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-24 w-full space-y-24">
              {aboutContainerData.about.map((item, i) => (
                <div
                  key={i}
                  className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
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

                  <div className="w-full lg:w-1/2 space-y-6">
                    <span className="uppercase font-medium text-sm text-muted-foreground">
                      {item.category}
                    </span>
                    <h4 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {item.text1}
                    </p>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {item.text2}
                    </p>
                    <Button asChild size="lg" className="group mt-6">
                      <Link href={item.href} className="flex items-center gap-3">
                        {item.button}
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContainer;