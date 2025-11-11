import { BranchesHeader } from "@/components/private/views/matriz/branches/branches-header";
import { BranchesTable } from "@/components/private/views/matriz/branches/dataTable";

export default function Branches() {
  return (
    <section className=" gap-5">
      <BranchesHeader />
      <BranchesTable />
    </section>
  );
}
