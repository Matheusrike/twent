import { AppSidebar } from "@/components/private/global/sideBar/app-sidebar"
import { ChartAreaInteractive } from "@/components/private/views/dashboard/chart-area-interactive"
import { DataTable } from "@/components/private/views/dashboard/data-table"
import { SectionCards } from "@/components/private/views/dashboard/section-cards"
import { SiteHeader } from "@/components/private/global/sideBar/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (

    // <SidebarInset>
    //   <SiteHeader />
    //   <div className="flex flex-1 flex-col">
    //     <div className="@container/main flex flex-1 flex-col gap-2">
    //       <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    //         <SectionCards />
    //         <div className="px-4 lg:px-6">
    //           <ChartAreaInteractive />
    //         </div>
    //         <DataTable data={data} />
    //       </div>
    //     </div>
    //   </div>
    // </SidebarInset>
    <section></section>

  )
}
