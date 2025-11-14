
import FinancialBarChart from "@/components/private/views/matriz/financial/financial-BarChart";
import { FinancialPieChart } from "@/components/private/views/matriz/financial/financial-Piechart";
import { FinancialGraph } from "@/components/private/views/matriz/financial/financial-graphic";
import { FinancialHeader } from "@/components/private/views/matriz/financial/financial-header";
import { FinancialTable } from "@/components/private/views/matriz/financial/financial-table";

export default function Financial() {
    return (
        <section className="gap-5 flex flex-col w-full">

            <FinancialHeader />

            <div>
                <FinancialGraph />
            </div>

            <div className="flex flex-col lg:flex-row gap-5 w-full">
                <FinancialPieChart />
                <FinancialBarChart />
            </div>

            <div>
            <FinancialTable />
            </div>

        </section>
    )
}