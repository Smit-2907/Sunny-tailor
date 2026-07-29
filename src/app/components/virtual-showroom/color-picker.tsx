import { Card } from "@/app/components/ui/card";
import { Palette, Check } from "lucide-react";

interface ColorPickerProps {
  selectedGarment: "shirt" | "pant";
  shirtColor: string;
  pantColor: string;
  onShirtColorChange: (color: string) => void;
  onPantColorChange: (color: string) => void;
}

export function ColorPicker({
  selectedGarment,
  shirtColor,
  pantColor,
  onShirtColorChange,
  onPantColorChange,
}: ColorPickerProps) {
  const colors = [
    { name: "White", value: "#FFFFFF", category: "Basic" },
    { name: "Black", value: "#000000", category: "Basic" },
    { name: "Navy", value: "#1E3A8A", category: "Basic" },
    { name: "Gray", value: "#6B7280", category: "Basic" },
    { name: "Sky Blue", value: "#0EA5E9", category: "Blue" },
    { name: "Royal Blue", value: "#2563EB", category: "Blue" },
    { name: "Teal", value: "#14B8A6", category: "Blue" },
    { name: "Crimson", value: "#DC2626", category: "Red" },
    { name: "Maroon", value: "#991B1B", category: "Red" },
    { name: "Pink", value: "#EC4899", category: "Red" },
    { name: "Forest Green", value: "#16A34A", category: "Green" },
    { name: "Olive", value: "#84CC16", category: "Green" },
    { name: "Mint", value: "#6EE7B7", category: "Green" },
    { name: "Yellow", value: "#FBBF24", category: "Yellow" },
    { name: "Orange", value: "#F97316", category: "Yellow" },
    { name: "Beige", value: "#D4A574", category: "Brown" },
    { name: "Brown", value: "#92400E", category: "Brown" },
    { name: "Tan", value: "#C2A877", category: "Brown" },
    { name: "Purple", value: "#9333EA", category: "Purple" },
    { name: "Lavender", value: "#C084FC", category: "Purple" },
  ];

  const currentColor = selectedGarment === "shirt" ? shirtColor : pantColor;
  const setCurrentColor = selectedGarment === "shirt" ? onShirtColorChange : onPantColorChange;

  const categories = Array.from(new Set(colors.map((c) => c.category)));

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Palette className="h-4 w-4 text-indigo-600" />
        Color Options
      </h3>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <div className="text-xs font-medium text-gray-600 mb-2">{category}</div>
            <div className="grid grid-cols-5 gap-2">
              {colors
                .filter((c) => c.category === category)
                .map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setCurrentColor(color.value)}
                    className="group relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color.value,
                      borderColor: currentColor === color.value ? "#4F46E5" : "#E5E7EB",
                      boxShadow:
                        currentColor === color.value
                          ? "0 0 0 3px rgba(79, 70, 229, 0.1)"
                          : "none",
                    }}
                    title={color.name}
                  >
                    {currentColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className="h-5 w-5"
                          style={{
                            color: color.value === "#FFFFFF" ? "#333" : "#FFF",
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {color.name}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Color Input */}
      <div className="mt-4 pt-4 border-t">
        <label className="text-xs font-medium text-gray-600 block mb-2">
          Custom Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-12 h-10 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-medium text-gray-600 mb-2">
          Current {selectedGarment === "shirt" ? "Shirt" : "Pant"} Color
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: currentColor }}
          />
          <div>
            <div className="text-sm font-semibold">{currentColor}</div>
            <div className="text-xs text-gray-500">
              {colors.find((c) => c.value === currentColor)?.name || "Custom"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
