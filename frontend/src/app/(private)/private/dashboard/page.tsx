"use client";
import { ChartBarInteractive } from "@/components/private/views/dashboard/bar-chart";
import RankingCard from "@/components/private/views/dashboard/ranking-card";
import { StockDonutChart } from "@/components/private/views/dashboard/inventoryChart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function Dashboard() {
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
  );
}
