import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Shuffle, ThumbsUp, Heart, Save, Sparkles } from "lucide-react";

interface MixMatchPanelProps {
  shirtColor: string;
  pantColor: string;
  shirtFabric: string;
  pantFabric: string;
  onShirtColorChange: (color: string) => void;
  onPantColorChange: (color: string) => void;
  onShirtFabricChange: (fabric: string) => void;
  onPantFabricChange: (fabric: string) => void;
}

export function MixMatchPanel({
  shirtColor,
  pantColor,
  shirtFabric,
  pantFabric,
  onShirtColorChange,
  onPantColorChange,
  onShirtFabricChange,
  onPantFabricChange,
}: MixMatchPanelProps) {
  const suggestedCombos = [
    {
      name: "Classic Formal",
      shirtColor: "#FFFFFF",
      pantColor: "#000000",
      shirtFabric: "cotton",
      pantFabric: "wool",
      rating: 5,
    },
    {
      name: "Navy Professional",
      shirtColor: "#DBEAFE",
      pantColor: "#1E3A8A",
      shirtFabric: "cotton",
      pantFabric: "polyester",
      rating: 5,
    },
    {
      name: "Business Casual",
      shirtColor: "#93C5FD",
      pantColor: "#6B7280",
      shirtFabric: "cotton",
      pantFabric: "cotton",
      rating: 4,
    },
    {
      name: "Smart Casual",
      shirtColor: "#E0E7FF",
      pantColor: "#92400E",
      shirtFabric: "linen",
      pantFabric: "cotton",
      rating: 4,
    },
    {
      name: "Executive Look",
      shirtColor: "#F3E8FF",
      pantColor: "#374151",
      shirtFabric: "silk",
      pantFabric: "wool",
      rating: 5,
    },
    {
      name: "Summer Fresh",
      shirtColor: "#DBEAFE",
      pantColor: "#D4A574",
      shirtFabric: "linen",
      pantFabric: "cotton",
      rating: 4,
    },
  ];

  const applyCombo = (combo: typeof suggestedCombos[0]) => {
    onShirtColorChange(combo.shirtColor);
    onPantColorChange(combo.pantColor);
    onShirtFabricChange(combo.shirtFabric);
    onPantFabricChange(combo.pantFabric);
  };

  const randomCombo = () => {
    const combo = suggestedCombos[Math.floor(Math.random() * suggestedCombos.length)];
    applyCombo(combo);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Mix & Match
        </h3>

        <Button onClick={randomCombo} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mb-4">
          <Shuffle className="h-4 w-4 mr-2" />
          Random Combo
        </Button>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {suggestedCombos.map((combo, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-3 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() => applyCombo(combo)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-sm">{combo.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <ThumbsUp
                        key={i}
                        className={`h-3 w-3 ${
                          i < combo.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Added to favorites!");
                  }}
                  className="p-1 hover:bg-red-50 rounded transition-colors"
                >
                  <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 hover:fill-red-500" />
                </button>
              </div>

              <div className="flex gap-2">
                {/* Shirt Preview */}
                <div className="flex-1">
                  <div
                    className="h-16 rounded border border-gray-300"
                    style={{ backgroundColor: combo.shirtColor }}
                  />
                  <div className="text-xs text-gray-600 mt-1 text-center">
                    {combo.shirtFabric}
                  </div>
                </div>

                <div className="flex items-center text-gray-400">+</div>

                {/* Pant Preview */}
                <div className="flex-1">
                  <div
                    className="h-16 rounded border border-gray-300"
                    style={{ backgroundColor: combo.pantColor }}
                  />
                  <div className="text-xs text-gray-600 mt-1 text-center">
                    {combo.pantFabric}
                  </div>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  applyCombo(combo);
                }}
                size="sm"
                variant="outline"
                className="w-full mt-2"
              >
                Apply Combo
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Current Combo */}
      <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-indigo-900">
          <Save className="h-4 w-4" />
          Current Design
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg border-2 border-white shadow-md"
              style={{ backgroundColor: shirtColor }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-indigo-900">Shirt</div>
              <div className="text-xs text-indigo-700">{shirtFabric}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg border-2 border-white shadow-md"
              style={{ backgroundColor: pantColor }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-indigo-900">Pant</div>
              <div className="text-xs text-indigo-700">{pantFabric}</div>
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => alert("Design saved to your library!")}
        >
          <Save className="h-4 w-4 mr-2" />
          Save to Library
        </Button>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h4 className="font-semibold text-sm text-green-900 mb-2">
          💡 Design Tips
        </h4>
        <ul className="text-xs text-green-800 space-y-1">
          <li>• Light shirt + Dark pant = Classic look</li>
          <li>• Match fabric weights for balance</li>
          <li>• Consider season & occasion</li>
          <li>• Logo placement: Left chest is standard</li>
        </ul>
      </Card>
    </div>
  );
}
