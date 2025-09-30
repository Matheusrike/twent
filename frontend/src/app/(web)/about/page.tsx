import TextCards from "@/components/web/pages/About/textCards/textCards";
import Hero from "@/components/web/pages/About/Banner/banner";
import ValuesCards from "@/components/web/pages/About/valuesCards/valuesCards";

export default function About() {
    return (
        <div className=" flex items-center flex-col justify-center h-auto">
            <Hero/>
            <ValuesCards/>
            <TextCards/>
        </div>
    )
}