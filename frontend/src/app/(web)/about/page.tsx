import TextCards from "@/components/web/Pages/About/textCards/textCards";
import Hero from "@/components/web/Pages/About/banner/banner";

export default function About() {
    return (
        <div className=" flex items-center flex-col justify-center h-auto">
            <Hero/>
            <TextCards/>
        </div>
    )
}