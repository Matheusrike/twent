import TextCards from "@/components/web/views/About/textCards/textCards";
import Hero from "@/components/web/views/About/Banner/banner";
import ValuesCards from "@/components/web/views/About/valuesCards/valuesCards";

export default function About() {
    return (
        <div className=" flex items-center flex-col justify-center h-auto">
            <Hero/>
            <ValuesCards/>
            <TextCards/>
        </div>
    )
}