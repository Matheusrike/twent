"use client"

import FinancialBarChart from "@/components/private/views/financial/financial-BarChart";
import { FinancialPieChart } from "@/components/private/views/financial/financial-Piechart";
import { FinancialGraph } from "@/components/private/views/financial/financial-graphic";
import { FinancialHeader } from "@/components/private/views/financial/financial-header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function Financial() {
      const router = useRouter();
      const [authorized, setAuthorized] = useState<boolean | null>(null);
    
      useEffect(() => {
        const verifyRole = async () => {
          try {
            const res = await fetch("/response/api/user/me", {
              method: "GET",
              credentials: "include",
            });
    
            const data = await res.json().catch(() => null);
    
            const role = data?.data?.user_roles?.[0]?.role?.name ?? null;
    
            if (role !== "ADMIN") {
              router.replace("/private/pdv");
              return;
            }
    
            setAuthorized(true);
          } catch (err) {
            router.replace("/private/pdv");
          }
        };
    
        verifyRole();
      }, [router]);
    
      if (authorized === null) {
        <Loading />;
      }
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

        </section>
    )
}