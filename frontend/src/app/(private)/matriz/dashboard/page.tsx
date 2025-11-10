"use client"
import { ChartBarInteractive } from "@/components/private/views/dashboard/bar-chart"
import RankingCard from "@/components/private/views/dashboard/ranking-card"
import { StockDonutChart } from "@/components/private/views/dashboard/stockDunutChart"


export default function Dashboard() {
  return (
    <section className=" w-full flex flex-col gap-5">
      <ChartBarInteractive />
      <section className="w-full flex justify-center">
        <div className="w-full   flex flex-col lg:flex-row gap-5 items-stretch">
          <div className="w-full">
            <StockDonutChart />
          </div>
          <div className="w-full ">
            <RankingCard />
          </div>
        </div>
      </section>
    </section>
  )
}
