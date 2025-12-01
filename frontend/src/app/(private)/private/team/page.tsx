import { TeamTable } from "@/components/private/views/team/dataTable";
import { TeamHeader } from "@/components/private/views/team/team-header";

export default function Team() {
  return (
    <section className="gap-5">
      <TeamHeader />
      <TeamTable/>
    </section>
  );
}
