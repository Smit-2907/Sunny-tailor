import { useState, useRef } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Upload, Image as ImageIcon, X, MoveHorizontal, MoveVertical } from "lucide-react";

interface LogoUploaderProps {
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export function LogoUploader({
  logo,
  onLogoChange,
  position,
  onPositionChange,
}: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onLogoChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const positions = [
    { label: "Left Chest", x: 25, y: 20 },
    { label: "Center Chest", x: 50, y: 20 },
    { label: "Right Chest", x: 75, y: 20 },
    { label: "Center", x: 50, y: 50 },
    { label: "Lower Center", x: 50, y: 75 },
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-indigo-600" />
        Company Logo
      </h3>

      {!logo ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm font-medium">Upload Logo</span>
            <span className="text-xs text-gray-500">PNG, JPG or SVG</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Logo Preview */}
          <div className="relative">
            <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center p-4">
              <img
                src={logo}
                alt="Company Logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              onClick={handleRemoveLogo}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Change Logo Button */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Change Logo
          </Button>

          {/* Position Presets */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Logo Position
            </label>
            <div className="grid grid-cols-2 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.label}
                  onClick={() => onPositionChange({ x: pos.x, y: pos.y })}
                  className={`px-3 py-2 text-xs rounded-lg border-2 transition-all ${
                    position.x === pos.x && position.y === pos.y
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Position Sliders */}
          <div className="space-y-3 pt-3 border-t">
            <div>
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-2">
                <MoveHorizontal className="h-3 w-3" />
                Horizontal: {position.x}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={position.x}
                onChange={(e) =>
                  onPositionChange({ ...position, x: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-2">
                <MoveVertical className="h-3 w-3" />
                Vertical: {position.y}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={position.y}
                onChange={(e) =>
                  onPositionChange({ ...position, y: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              <strong>💡 Tip:</strong> Logo looks best on left chest position for
              professional uniforms
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  );
}
