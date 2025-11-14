import CollectionBanner from "@/components/web/views/Collection/banner/banner";
import FiltersSection from "@/components/web/views/Collection/filter/filter";
import CollectionHero from "@/components/web/views/Collection/hero/hero";

export default function Collection() {
    return (
        <section className="w-full h-full flex flex-col justify-center items-center" >
            <CollectionBanner />
            <FiltersSection />
            <CollectionHero />
        </section>
    )
}