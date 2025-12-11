"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppointmentsHeader } from "@/components/private/views/appointments/appointments-header";
import { AppointmentsTable } from "@/components/private/views/appointments/dataTable";
import Loading from "@/app/loading";

export default function Appointments() {
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

        // Permitir ADMIN e MANAGER_BRANCH
        if (role !== "ADMIN" && role !== "MANAGER_BRANCH") {
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
    return <Loading />;
  }

  return (
    <section className="flex flex-col gap-5">
      <AppointmentsHeader />
      <AppointmentsTable />
    </section>
  );
}

