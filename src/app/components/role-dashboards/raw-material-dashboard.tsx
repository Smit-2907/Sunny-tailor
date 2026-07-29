import { RawMaterialInventoryScreen } from "@/app/components/inventory/raw-material-inventory-screen";
import { RawMaterialAIAssistant } from "@/app/components/raw-material/raw-material-ai-assistant";

export function RawMaterialDashboard() {
  return (
    <>
      <RawMaterialInventoryScreen currentRole="raw-material" />
      <RawMaterialAIAssistant />
    </>
  );
}