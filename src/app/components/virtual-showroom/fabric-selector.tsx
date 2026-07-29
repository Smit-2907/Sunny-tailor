import { Card } from "@/app/components/ui/card";
import { Layers, Check, Info } from "lucide-react";

interface FabricSelectorProps {
  selectedGarment: "shirt" | "pant";
  shirtFabric: string;
  pantFabric: string;
  onShirtFabricChange: (fabric: string) => void;
  onPantFabricChange: (fabric: string) => void;
}

export function FabricSelector({
  selectedGarment,
  shirtFabric,
  pantFabric,
  onShirtFabricChange,
  onPantFabricChange,
}: FabricSelectorProps) {
  const fabrics = [
    {
      name: "Cotton",
      value: "cotton",
      description: "Breathable, soft, comfortable",
      texture: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px)",
      suitableFor: ["shirt", "pant"],
    },
    {
      name: "Polyester",
      value: "polyester",
      description: "Wrinkle-resistant, durable",
      texture: "radial-gradient(circle at 20% 50%, transparent 0%, rgba(255,255,255,.1) 100%)",
      suitableFor: ["shirt", "pant"],
    },
    {
      name: "Silk",
      value: "silk",
      description: "Luxurious, smooth finish",
      texture: "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.15) 75%)",
      suitableFor: ["shirt"],
    },
    {
      name: "Linen",
      value: "linen",
      description: "Cool, crisp, natural",
      texture: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,.03) 3px, rgba(0,0,0,.03) 6px)",
      suitableFor: ["shirt"],
    },
    {
      name: "Wool",
      value: "wool",
      description: "Warm, structured, formal",
      texture: "radial-gradient(ellipse at center, rgba(0,0,0,.05) 0%, transparent 50%)",
      suitableFor: ["pant"],
    },
    {
      name: "Denim",
      value: "denim",
      description: "Rugged, casual, sturdy",
      texture: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,.08) 1px, rgba(0,0,0,.08) 2px)",
      suitableFor: ["pant"],
    },
  ];

  const currentFabric = selectedGarment === "shirt" ? shirtFabric : pantFabric;
  const setCurrentFabric =
    selectedGarment === "shirt" ? onShirtFabricChange : onPantFabricChange;

  const availableFabrics = fabrics.filter((f) =>
    f.suitableFor.includes(selectedGarment)
  );

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-indigo-600" />
        Fabric Type
      </h3>

      <div className="space-y-2">
        {availableFabrics.map((fabric) => (
          <button
            key={fabric.value}
            onClick={() => setCurrentFabric(fabric.value)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${
              currentFabric === fabric.value
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Fabric Texture Preview */}
              <div
                className="w-12 h-12 rounded-lg border border-gray-300 flex-shrink-0"
                style={{
                  backgroundImage: fabric.texture,
                  backgroundColor: "#E5E7EB",
                }}
              />

              {/* Fabric Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{fabric.name}</span>
                  {currentFabric === fabric.value && (
                    <Check className="h-4 w-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  {fabric.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Fabric Properties */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-blue-900">
              {availableFabrics.find((f) => f.value === currentFabric)?.name ||
                "Select a fabric"}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {currentFabric === "cotton" &&
                "Perfect for everyday wear. Breathable and easy to maintain."}
              {currentFabric === "polyester" &&
                "Ideal for office wear. Stays crisp all day."}
              {currentFabric === "silk" &&
                "Premium luxury feel. Best for formal occasions."}
              {currentFabric === "linen" &&
                "Summer favorite. Naturally cooling and stylish."}
              {currentFabric === "wool" &&
                "Professional look. Maintains shape excellently."}
              {currentFabric === "denim" &&
                "Classic casual. Extremely durable and versatile."}
            </p>
          </div>
        </div>
      </div>

      {/* Care Instructions */}
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <div className="font-medium">Care Instructions:</div>
        <div className="pl-2">
          {currentFabric === "cotton" && "• Machine wash cold, tumble dry low"}
          {currentFabric === "polyester" && "• Machine wash warm, hang dry"}
          {currentFabric === "silk" && "• Dry clean only or hand wash cold"}
          {currentFabric === "linen" && "• Machine wash cold, air dry flat"}
          {currentFabric === "wool" && "• Dry clean recommended"}
          {currentFabric === "denim" && "• Machine wash cold, tumble dry medium"}
        </div>
      </div>
    </Card>
  );
}
