import StockCards from "@/components/private/views/stock/stock-cards";
import EstoqueHeader from "@/components/private/views/stock/stock-header";

export default function Estoque() {
    return (
        <section className="flex flex-col gap-5  ">
            <EstoqueHeader />
            <StockCards />
        </section>
        
    )
}