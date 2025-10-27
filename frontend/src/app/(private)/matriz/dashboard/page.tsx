"use client"
import Data from "./data.json"
import { DataTable } from "@/components/private/global/tables/data-table"
import { ChartBarInteractive } from "@/components/private/views/dashboard/bar-chart"
import { ChartAreaInteractive } from "@/components/private/views/dashboard/chart-area-interactive"
import { ChartPieDonutText } from "@/components/private/views/dashboard/pie-chart"


export default function Dashboard() {
  return (
    <section className=" w-full flex flex-col gap-5">
      <ChartBarInteractive />
      <section className="w-full h-auto flex  gap-2">
        <ChartPieDonutText />
      

      </section>


      {/* <DataTable data={Data} /> */}
    </section>
  )
}
