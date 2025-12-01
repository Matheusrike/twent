"use client"


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

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
  return <></>;
}
