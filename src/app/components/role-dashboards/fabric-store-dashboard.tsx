import { FabricInventoryScreen } from "@/app/components/inventory/fabric-inventory-screen";
import { FabricAIAssistant } from "@/app/components/fabric-store/fabric-ai-assistant";

export function FabricStoreDashboard({ openAddForm = false }: { openAddForm?: boolean }) {
  return (
    <>
      <FabricInventoryScreen currentRole="fabric-store" openAddForm={openAddForm} />
      <FabricAIAssistant />
    </>
  );
}