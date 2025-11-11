import { FinancialGraphic } from "@/components/private/views/matriz/financial/financial-graphic";
import { FinancialHeader } from "@/components/private/views/matriz/financial/financial-header";
import { FinancialTable } from "@/components/private/views/matriz/financial/financial-table";

export default function Financial(){
    return(
        <section className="gap-5 flex flex-col w-full">
        
        <FinancialHeader />
        <FinancialGraphic />
        <FinancialTable />
        </section>
    )
}