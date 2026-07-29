import { Card } from "@/app/components/ui/card";
import { Maximize2, Grid3x3 } from "lucide-react";

interface GarmentViewerProps {
  viewMode: "single" | "combo" | "360";
  selectedGarment: "shirt" | "pant";
  shirtColor: string;
  pantColor: string;
  shirtFabric: string;
  pantFabric: string;
  rotation: number;
  logo: string | null;
  logoPosition: { x: number; y: number };
}

export function GarmentViewer({
  viewMode,
  selectedGarment,
  shirtColor,
  pantColor,
  rotation,
  logo,
  logoPosition,
}: GarmentViewerProps) {
  const getRotationTransform = () => {
    if (rotation === 0) return "rotateY(0deg)";
    if (rotation === 90) return "rotateY(15deg)";
    if (rotation === 180) return "rotateY(0deg) scaleX(-1)";
    if (rotation === 270) return "rotateY(-15deg)";
    return "rotateY(0deg)";
  };

  const renderShirt = (color: string, showLogo: boolean = true) => {
    return (
      <div className="relative inline-block">
        <svg width="200" height="240" viewBox="0 0 200 240" className="drop-shadow-xl">
          {/* Shirt body */}
          <path
            d="M 40 60 L 40 220 L 160 220 L 160 60 L 145 50 L 145 25 L 120 25 L 110 40 L 90 40 L 80 25 L 55 25 L 55 50 Z"
            fill={color}
            stroke="#2D3748"
            strokeWidth="2"
          />
          
          {/* Left sleeve */}
          <path
            d="M 40 60 L 15 90 L 22 130 L 40 115 Z"
            fill={color}
            stroke="#2D3748"
            strokeWidth="2"
            opacity="0.9"
          />
          
          {/* Right sleeve */}
          <path
            d="M 160 60 L 185 90 L 178 130 L 160 115 Z"
            fill={color}
            stroke="#2D3748"
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Collar */}
          <path
            d="M 80 25 L 90 40 L 100 30 L 110 40 L 120 25 Z"
            fill={color}
            stroke="#2D3748"
            strokeWidth="2"
          />

          {/* Buttons */}
          <circle cx="100" cy="80" r="3" fill="#2D3748" />
          <circle cx="100" cy="110" r="3" fill="#2D3748" />
          <circle cx="100" cy="140" r="3" fill="#2D3748" />
          <circle cx="100" cy="170" r="3" fill="#2D3748" />
          <circle cx="100" cy="200" r="3" fill="#2D3748" />

          {/* Pocket */}
          <rect
            x="60"
            y="90"
            width="30"
            height="35"
            fill="none"
            stroke="#2D3748"
            strokeWidth="1.5"
            rx="2"
          />
        </svg>

        {/* Logo overlay */}
        {logo && showLogo && (
          <div
            className="absolute"
            style={{
              left: `${logoPosition.x}%`,
              top: `${logoPosition.y}%`,
              transform: "translate(-50%, -50%)",
              width: "40px",
              height: "40px",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain opacity-80"
            />
          </div>
        )}
      </div>
    );
  };

  const renderPant = (color: string) => {
    return (
      <div className="relative inline-block">
        <svg width="180" height="280" viewBox="0 0 180 280" className="drop-shadow-xl">
          {/* Waistband */}
          <rect
            x="30"
            y="15"
            width="120"
            height="15"
            fill={color}
            stroke="#2D3748"
            strokeWidth="2"
            opacity="0.95"
          />

          {/* Left leg */}
          <path
            d="M 30 30 L 45 260 L 80 260 L 90 30 Z"
            fill={color}
            stroke="#2D3748"
            strokeWidth="2"
          />

          {/* Right leg */}
          <path
            d="M 90 30 L 100 260 L 135 260 L 150 30 Z"
            fill={color}
            stroke="#2D3748"
            strokeWidth="2"
          />

          {/* Center seam */}
          <line
            x1="90"
            y1="30"
            x2="90"
            y2="180"
            stroke="#2D3748"
            strokeWidth="1.5"
          />

          {/* Left pocket */}
          <path
            d="M 45 50 L 48 80 L 72 80 L 75 50"
            fill="none"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
          
          {/* Right pocket */}
          <path
            d="M 105 50 L 108 80 L 132 80 L 135 50"
            fill="none"
            stroke="#2D3748"
            strokeWidth="1.5"
          />

          {/* Belt loops */}
          <rect x="50" y="12" width="4" height="10" fill="#2D3748" />
          <rect x="88" y="12" width="4" height="10" fill="#2D3748" />
          <rect x="126" y="12" width="4" height="10" fill="#2D3748" />
        </svg>
      </div>
    );
  };

  const renderComboView = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-700">Complete Outfit Preview</h3>
        
        {/* Outfit Display */}
        <div
          className="relative"
          style={{
            transform: getRotationTransform(),
            transformStyle: "preserve-3d",
            transition: "transform 0.6s ease",
          }}
        >
          {/* Shirt on top */}
          <div className="relative z-10">
            {renderShirt(shirtColor, true)}
          </div>
          
          {/* Pant below, overlapping */}
          <div className="relative -mt-16">
            {renderPant(pantColor)}
          </div>
        </div>

        {/* Labels */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div
              className="w-10 h-10 rounded-full border-2 border-gray-300 mx-auto mb-2"
              style={{ backgroundColor: shirtColor }}
            />
            <p className="text-sm font-medium text-gray-700">Shirt</p>
          </div>
          <div className="text-2xl text-gray-400">+</div>
          <div className="text-center">
            <div
              className="w-10 h-10 rounded-full border-2 border-gray-300 mx-auto mb-2"
              style={{ backgroundColor: pantColor }}
            />
            <p className="text-sm font-medium text-gray-700">Pant</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSingleView = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          style={{
            transform: getRotationTransform(),
            transformStyle: "preserve-3d",
            transition: "transform 0.6s ease",
          }}
        >
          {selectedGarment === "shirt" 
            ? renderShirt(shirtColor, true) 
            : renderPant(pantColor)}
        </div>
      </div>
    );
  };

  const render360View = () => {
    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">360° View</h3>
        <div className="grid grid-cols-2 gap-6">
          {[
            { angle: 0, label: "Front View", transform: "rotateY(0deg)" },
            { angle: 90, label: "Right Side", transform: "rotateY(15deg)" },
            { angle: 180, label: "Back View", transform: "rotateY(0deg) scaleX(-1)" },
            { angle: 270, label: "Left Side", transform: "rotateY(-15deg)" },
          ].map((view) => (
            <div
              key={view.angle}
              className={`bg-gray-50 rounded-xl p-6 border-2 transition-all ${
                rotation === view.angle
                  ? "border-indigo-500 shadow-lg"
                  : "border-gray-200"
              }`}
            >
              <div
                className="flex justify-center"
                style={{
                  transform: view.transform,
                  transformStyle: "preserve-3d",
                }}
              >
                {selectedGarment === "shirt"
                  ? renderShirt(shirtColor, view.angle === 0)
                  : renderPant(pantColor)}
              </div>
              <p className="text-center mt-4 font-medium text-gray-700">
                {view.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="relative min-h-[600px] bg-gradient-to-br from-gray-50 via-white to-gray-50 border-2 border-gray-200 shadow-lg">
      {/* View Mode Label */}
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 border border-gray-200">
          <Grid3x3 className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {viewMode === "single" ? "Single View" : viewMode === "combo" ? "Combo View" : "360° View"}
          </span>
        </div>
        <button className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm hover:bg-white transition-colors border border-gray-200">
          <Maximize2 className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[600px]">
        {viewMode === "single" && renderSingleView()}
        {viewMode === "combo" && renderComboView()}
        {viewMode === "360" && render360View()}
      </div>

      {/* Subtle lighting effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-yellow-200/20 to-transparent rounded-full blur-3xl" />
      </div>
    </Card>
  );
}
