"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { CollectionHeader } from "@/components/private/views/collection/header/collection-header";
import { CollectionProductsHeader } from "@/components/private/views/collection/header/products-header";
import CollectionProductsTable from "@/components/private/views/collection/tables/products-table";
import CollectionsTable from "@/components/private/views/collection/tables/collection-table";

export default function Colletion() {
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
    <section className="flex flex-col gap-5">
      <CollectionProductsHeader />
      <CollectionProductsTable/>
      <CollectionHeader />
      <CollectionsTable/>
    </section>
  );
}
