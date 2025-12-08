import CollectionBanner from "@/components/web/views/Collection/banner/banner";
import FiltersSection from "@/components/web/views/Collection/filter/filter";

export default function CollectionPage() {
  return (
    <section className="flex items-center flex-col justify-center h-auto">
      <CollectionBanner />
      <FiltersSection />
    </section>
 
  );
}