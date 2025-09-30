import { CompanyPortal } from "@/components/web/Pages/Companies/companyPortal";


export default function Companies() {
    return (
        <div
 className="relative w-full min-h-screen flex flex-col items-center justify-center
  bg-gradient-to-br from-red-950 via-red-900 to-red-800"
        >
          
            <div className="w-full z-10">
                <CompanyPortal/>
            </div>
        </div>
    )
}