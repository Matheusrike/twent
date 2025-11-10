import InventoryCards from "@/components/private/views/inventory/inventory-graphs-cards";
import { InventoryTotal } from "@/components/private/views/inventory/inventoryTotal";

export default function Inventory() {
  return (
    <section className="flex flex-col gap-5  ">
      <InventoryTotal />
      <InventoryCards />
    </section>
  );
}
