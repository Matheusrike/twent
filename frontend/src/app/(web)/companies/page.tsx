import { CompanyPortal } from "@/components/web/pages/Companies/companyPortal"


export default function Companies() {
    return (
        <div
 className="relative w-full min-h-screen flex flex-col items-center justify-center
  "
        >
            <div className="w-full z-10">
                <CompanyPortal/>
            </div>
        </div>
    )
}