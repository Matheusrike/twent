"use client";

import InventoryTable from "@/components/private/views/inventory/tables/totalInventoryDataTable";
import InventoryCards from "@/components/private/views/inventory/inventory-graphs-cards";
import { InventoryTotal } from "@/components/private/views/inventory/headers/inventory-header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { InventoryTotalBranch } from "@/components/private/views/inventory/headers/inventory-branch-header";
import InventoryTableBranch from "@/components/private/views/inventory/tables/branchInventoryDataTable";

export default function Inventory() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const verifyRole = async () => {
      try {
        const res = await fetch("/response/api/user/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json().catch(() => null);
        const userRole = data?.data?.user_roles?.[0]?.role?.name ?? null;

        if (userRole === "EMPLOYEE_BRANCH") {
          router.replace("/private/pdv");
          return;
        }

        setRole(userRole);
      } catch (err) {
        router.replace("/private/pdv");
      }
    };

    verifyRole();
  }, [router]);

  if (role === null) {
    return <Loading />;
  }

  if (role === "MANAGER_BRANCH") {
    return (
      <section className="flex flex-col gap-5">
        <InventoryTotal />
        <InventoryTableBranch />
      </section>
    );
  }

  if (role === "ADMIN") {
    return (
      <section className="flex flex-col gap-5">
        <InventoryTotal />
        <InventoryTable />
        <InventoryTotalBranch />
        <InventoryCards />
      </section>
    );
  }

  return null;
}
