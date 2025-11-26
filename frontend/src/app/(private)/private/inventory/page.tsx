import { InventoryTable } from "@/components/private/views/inventory/dataTable";
import InventoryCards from "@/components/private/views/inventory/inventory-graphs-cards";
import { InventoryTotal } from "@/components/private/views/inventory/inventory-header";

export default function Inventory() {
  return (
    <section className="flex flex-col gap-5  ">
      <InventoryTotal />
      <InventoryTable />
      <InventoryCards />
    </section>
  );
}
