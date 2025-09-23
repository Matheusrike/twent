import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/web/Global/Navbar/button";
import rawfeaturesData from "./featuresData.json" assert { type: "json" };


interface Feature {
  category: string;
  title: string;
  details: string;
  image: string;        
  tutorialLink: string; 
}


const featuresData = rawfeaturesData as Feature[];

const Features: React.FC = () => {
  return (
    <div className="min-h-screen flex container p-12">
      <div className="w-full py-10 px-6 flex flex-col justify-between">
        <div className="mt-8 w-full mx-auto space-y-20 flex flex-col">
          {featuresData.map((feature: Feature, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center gap-x-15 gap-y-6 md:even:flex-row-reverse"
            >
              {/* Image */}
              <div className="w-full aspect-[4/3.5] bg-muted rounded-xl border border-border/50 basis-1/2 relative overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Text */}
              <div className="basis-1/2 shrink-0">
                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="my-3 text-2xl font-semibold tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">{feature.details}</p>

                {/* <Button asChild size="lg" className="mt-6 rounded-full gap-3">
                  <Link href={feature.tutorialLink}>
                    Learn More
                  </Link>
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
