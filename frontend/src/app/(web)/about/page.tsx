import TextCards from "@/components/web/pages/About/textCards/textCards";
import Hero from "@/components/web/pages/About/Banner/banner";
import Features04Page from "@/components/web/pages/About/features-04/features-04";

export default function About() {
    return (
        <div className=" flex items-center flex-col justify-center h-auto">
            <Hero/>
            <Features04Page/>
            <TextCards/>
        </div>
    )
}