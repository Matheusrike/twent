import FiltersSection from "@/components/web/pages/Collection/filter/filter";
import CollectionHero from "@/components/web/pages/Collection/hero/hero";



export default function Collection() {
    return (
        <section className="w-full h-full flex flex-col justify-center items-center" >
            <FiltersSection />
            <CollectionHero />
        </section>
    )
}