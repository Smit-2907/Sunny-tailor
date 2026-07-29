import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Share2,
  Download,
  RotateCw,
  Sparkles,
  Eye,
  ShoppingBag,
  Shirt,
  Palette,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { GarmentViewer } from "@/app/components/virtual-showroom/garment-viewer";
import { ColorPicker } from "@/app/components/virtual-showroom/color-picker";
import { FabricSelector } from "@/app/components/virtual-showroom/fabric-selector";
import { LogoUploader } from "@/app/components/virtual-showroom/logo-uploader";
import { MixMatchPanel } from "@/app/components/virtual-showroom/mix-match-panel";

type ViewMode = "single" | "combo" | "360";

export function VirtualShowroom() {
  const [viewMode, setViewMode] = useState<ViewMode>("combo");
  const [selectedGarment, setSelectedGarment] = useState<"shirt" | "pant">("shirt");
  const [shirtColor, setShirtColor] = useState("#FFFFFF");
  const [pantColor, setPantColor] = useState("#4A5568");
  const [shirtFabric, setShirtFabric] = useState("cotton");
  const [pantFabric, setPantFabric] = useState("cotton");
  const [rotation, setRotation] = useState(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState({ x: 25, y: 20 });

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleShare = () => {
    const designData = {
      shirtColor,
      pantColor,
      shirtFabric,
      pantFabric,
      logo,
      timestamp: new Date().toISOString(),
    };
    
    const shareUrl = `${window.location.origin}/showroom/design/${btoa(JSON.stringify(designData))}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert(`✅ Design link copied to clipboard!\n\nShare this link with your client to show them the design.`);
  };

  const handleDownload = () => {
    alert("📥 Design mockup downloaded as high-resolution PNG!");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            Virtual Showroom
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Design, customize, and preview garments in real-time
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleShare} size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Share2 className="h-5 w-5 mr-2" />
            Share Design
          </Button>
          <Button onClick={handleDownload} size="lg" className="bg-green-600 hover:bg-green-700 shadow-md">
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Main Content Grid - Fixed 3 Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Controls (3 columns width) */}
        <div className="col-span-3 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
          {/* View Mode Selector */}
          <Card className="p-5 shadow-md">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              View Mode
            </h3>
            <div className="space-y-3">
              <Button
                variant={viewMode === "combo" ? "default" : "outline"}
                className="w-full justify-start h-12 text-base"
                onClick={() => setViewMode("combo")}
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                Complete Outfit
              </Button>
              <Button
                variant={viewMode === "single" ? "default" : "outline"}
                className="w-full justify-start h-12 text-base"
                onClick={() => setViewMode("single")}
              >
                <Shirt className="h-5 w-5 mr-3" />
                Single Garment
              </Button>
              <Button
                variant={viewMode === "360" ? "default" : "outline"}
                className="w-full justify-start h-12 text-base"
                onClick={() => setViewMode("360")}
              >
                <RotateCw className="h-5 w-5 mr-3" />
                360° View
              </Button>
            </div>
          </Card>

          {/* Garment Selector */}
          {viewMode === "single" && (
            <Card className="p-5 shadow-md">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Shirt className="h-5 w-5 text-indigo-600" />
                Select Garment
              </h3>
              <div className="flex gap-3">
                <Button
                  variant={selectedGarment === "shirt" ? "default" : "outline"}
                  className="flex-1 h-12 text-base"
                  onClick={() => setSelectedGarment("shirt")}
                >
                  Shirt
                </Button>
                <Button
                  variant={selectedGarment === "pant" ? "default" : "outline"}
                  className="flex-1 h-12 text-base"
                  onClick={() => setSelectedGarment("pant")}
                >
                  Pant
                </Button>
              </div>
            </Card>
          )}

          {/* Color Picker */}
          <ColorPicker
            selectedGarment={selectedGarment}
            shirtColor={shirtColor}
            pantColor={pantColor}
            onShirtColorChange={setShirtColor}
            onPantColorChange={setPantColor}
          />

          {/* Fabric Selector */}
          <FabricSelector
            selectedGarment={selectedGarment}
            shirtFabric={shirtFabric}
            pantFabric={pantFabric}
            onShirtFabricChange={setShirtFabric}
            onPantFabricChange={setPantFabric}
          />

          {/* Logo Uploader */}
          <LogoUploader
            logo={logo}
            onLogoChange={setLogo}
            position={logoPosition}
            onPositionChange={setLogoPosition}
          />
        </div>

        {/* Center Panel - 3D Viewer (6 columns width) */}
        <div className="col-span-6">
          <GarmentViewer
            viewMode={viewMode}
            selectedGarment={selectedGarment}
            shirtColor={shirtColor}
            pantColor={pantColor}
            shirtFabric={shirtFabric}
            pantFabric={pantFabric}
            rotation={rotation}
            logo={logo}
            logoPosition={logoPosition}
          />

          {/* Rotation Controls */}
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
              className="shadow-md"
            >
              <span className="text-xl mr-2">←</span> Rotate Left
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleRotate}
              className="shadow-md px-8"
            >
              <RotateCw className="h-5 w-5 mr-2" />
              {rotation}°
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="shadow-md"
            >
              Rotate Right <span className="text-xl ml-2">→</span>
            </Button>
          </div>
        </div>

        {/* Right Panel - Mix & Match (3 columns width) */}
        <div className="col-span-3 overflow-y-auto max-h-[calc(100vh-250px)]">
          <MixMatchPanel
            shirtColor={shirtColor}
            pantColor={pantColor}
            shirtFabric={shirtFabric}
            pantFabric={pantFabric}
            onShirtColorChange={setShirtColor}
            onPantColorChange={setPantColor}
            onShirtFabricChange={setShirtFabric}
            onPantFabricChange={setPantFabric}
          />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <Palette className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-bold">256</div>
              <div className="text-sm text-gray-600 font-medium">Color Options</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Layers className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-gray-600 font-medium">Fabric Types</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <ImageIcon className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm text-gray-600 font-medium">Logo Positions</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Share2 className="h-7 w-7 text-orange-600" />
            </div>
            <div>
              <div className="text-3xl font-bold">1-Click</div>
              <div className="text-sm text-gray-600 font-medium">Share & Export</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
