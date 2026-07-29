import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Download,
  X,
  Shirt,
  Grid3x3,
  Video,
  Image as ImageIcon,
  Sparkles,
  Check,
  ArrowLeft,
  RefreshCw,
  Maximize2,
  ZoomIn,
  Layers,
  ShirtIcon,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader } from "@/app/components/page-header";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

// Import shirt images
import shirt1 from "figma:asset/1ce4b7d23586fb4e57e7c334f8f92e09f1982836.png";
import shirt2 from "figma:asset/fa77eddde7fc1f8473498a6c1089e06b7269c803.png";
import shirt3 from "figma:asset/d8ce9b5a67a76bca91fc0d58d8bd3ca39bd03383.png";
import shirt4 from "figma:asset/71bd940c58126a0f363435b50baa374dddf6a4fc.png";
import shirt5 from "figma:asset/16b89e937989f6cb49643173bacd042b806d9558.png";
import shirt6 from "figma:asset/511f6057699b4211f7a34207d62d7ae8eaf9d929.png";

// Import model images
import model1 from "figma:asset/06f9806f9610a2c9a25a56c594e479d98e8e5deb.png";
import model2 from "figma:asset/b6ce66bbd883ebcb5c619a126999d36a64a95692.png";
import model3 from "figma:asset/ab144d1de62b1bdf8106cb709de9aaed20161b93.png";
import model4 from "figma:asset/060b25a9693583b5eb9650011487a44edb23350c.png";
import model5 from "figma:asset/00f7ade0fddb69a9f32313388b75bb1faf1268d6.png";

// Import pant images
import pant1 from "figma:asset/2f47fddb11a7a4116befd13775d827c41fee635c.png";
import pant2 from "figma:asset/49e291207b616a03ea261cdb16591dd1c6c24394.png";
import pant3 from "figma:asset/956467e7976f2976bead5be9c3500be93fd63a9d.png";
import pant4 from "figma:asset/b1459b1e063e43723091e00f031d051f6a2a89d9.png";
import pant5 from "figma:asset/5a5ed80ca56b514199ace14ec64605726f3cb655.png";
import pant6 from "figma:asset/2640577c2a64afd738cd6ba2ea0f9a3a42ad0aea.png";

// Import outfit combination result images
import outfitGreySet from "figma:asset/5bd8fdfb931809eeebe2e0c56a0473257fbc92b2.png"; // Grey hoodie + grey joggers
import outfitBrownFormal from "figma:asset/42fe159361389fe44f51e774ff11fc3dc77b7c39.png"; // Brown blazer + brown pants
import outfitBeigeFormal from "figma:asset/20e5a8f02258d1072fcdef2a08255b268919ade2.png"; // Beige blazer + beige pants
import outfitGreyFormal from "figma:asset/1694db8685da07da06c1d5fed8ed73940edf3f5c.png"; // Grey blazer + grey pants
import outfitBlackFormal from "figma:asset/2afb41e0f245a9968f6c53bc22e6d136f01f3ccf.png"; // Black blazer + black pants
import outfitBlackCasual from "figma:asset/11b3c1bec687d6c027ef99700a43f7236b7c1321.png"; // Black hoodie + black joggers

interface TryOnBetaPageProps {
  onBack: () => void;
}

interface Garment {
  id: string;
  name: string;
  image: string;
  poNumber: string;
  company: string;
  category: string;
  color: string;
  material?: string;
  size?: string;
}

interface Model {
  id: string;
  name: string;
  image: string;
  height: string;
  bodyType: string;
}

// Mock shirt data with proper images
const mockShirts: Garment[] = [
  {
    id: "s1",
    name: "Grey Half-Zip Sweatshirt",
    image: shirt1,
    poNumber: "PO-2026-001",
    company: "ABC Garments Ltd.",
    category: "Casual",
    color: "Heather Grey",
    material: "Cotton Blend",
    size: "M, L, XL",
  },
  {
    id: "s2",
    name: "Black Pullover Hoodie",
    image: shirt2,
    poNumber: "PO-2026-002",
    company: "StyleCraft Inc.",
    category: "Casual",
    color: "Jet Black",
    material: "Cotton Fleece",
    size: "S, M, L, XL",
  },
  {
    id: "s3",
    name: "Black Zip-Up Hoodie",
    image: shirt3,
    poNumber: "PO-2026-003",
    company: "TrendWear Co.",
    category: "Casual",
    color: "Black",
    material: "Cotton Blend",
    size: "M, L, XL, XXL",
  },
  {
    id: "s4",
    name: "Beige Formal Blazer",
    image: shirt4,
    poNumber: "PO-2026-004",
    company: "Urban Fits",
    category: "Formal",
    color: "Light Beige",
    material: "Wool Blend",
    size: "S, M, L",
  },
  {
    id: "s5",
    name: "Black Formal Blazer",
    image: shirt5,
    poNumber: "PO-2026-005",
    company: "Elite Textiles",
    category: "Formal",
    color: "Jet Black",
    material: "Premium Wool",
    size: "M, L, XL",
  },
  {
    id: "s6",
    name: "Grey Double-Breasted Blazer",
    image: shirt6,
    poNumber: "PO-2026-006",
    company: "Premium Suits Co.",
    category: "Formal",
    color: "Charcoal Grey",
    material: "Wool Blend",
    size: "M, L, XL",
  },
];

// Mock model data
const mockModels: Model[] = [
  {
    id: "m1",
    name: "Model A - Classic Pose",
    image: model1,
    height: "6'0\"",
    bodyType: "Athletic",
  },
  {
    id: "m2",
    name: "Model B - Casual Stance",
    image: model2,
    height: "5'11\"",
    bodyType: "Slim",
  },
  {
    id: "m3",
    name: "Model C - Formal Pose",
    image: model3,
    height: "6'0\"",
    bodyType: "Athletic",
  },
  {
    id: "m4",
    name: "Model D - Relaxed Pose",
    image: model4,
    height: "5'10\"",
    bodyType: "Regular",
  },
  {
    id: "m5",
    name: "Model E - Standing Pose",
    image: model5,
    height: "5'9\"",
    bodyType: "Athletic",
  },
];

// Mock pants data with proper images
const mockPants: Garment[] = [
  {
    id: "p1",
    name: "Classic Black Formal Pants",
    image: pant1,
    poNumber: "PO-2026-001",
    company: "ABC Garments Ltd.",
    category: "Formal",
    color: "Black",
    material: "Wool Blend",
    size: "30, 32, 34, 36",
  },
  {
    id: "p2",
    name: "Grey Textured Dress Pants",
    image: pant2,
    poNumber: "PO-2026-002",
    company: "StyleCraft Inc.",
    category: "Formal",
    color: "Charcoal Grey",
    material: "Premium Polyester",
    size: "30, 32, 34, 36, 38",
  },
  {
    id: "p3",
    name: "Brown Formal Trousers",
    image: pant3,
    poNumber: "PO-2026-003",
    company: "Elite Textiles",
    category: "Semi-Formal",
    color: "Dark Brown",
    material: "Cotton Blend",
    size: "32, 34, 36, 38",
  },
  {
    id: "p4",
    name: "Beige Chino Pants",
    image: pant4,
    poNumber: "PO-2026-004",
    company: "TrendWear Co.",
    category: "Casual",
    color: "Light Beige",
    material: "Stretch Cotton",
    size: "30, 32, 34, 36",
  },
  {
    id: "p5",
    name: "Grey Jogger Pants",
    image: pant5,
    poNumber: "PO-2026-005",
    company: "Urban Fits",
    category: "Casual",
    color: "Heather Grey",
    material: "Cotton Fleece",
    size: "S, M, L, XL",
  },
  {
    id: "p6",
    name: "Black Athletic Joggers",
    image: pant6,
    poNumber: "PO-2026-006",
    company: "Premium Suits Co.",
    category: "Casual",
    color: "Jet Black",
    material: "Cotton Blend",
    size: "S, M, L, XL",
  },
];

export function TryOnBetaPage({ onBack }: TryOnBetaPageProps) {
  const [mode, setMode] = useState<"live" | "upload">("upload");
  const [selectedShirt, setSelectedShirt] = useState<Garment | null>(null);
  const [selectedPant, setSelectedPant] = useState<Garment | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [photoSource, setPhotoSource] = useState<"upload" | "model">("upload");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [activeGarmentTab, setActiveGarmentTab] = useState<"shirts" | "pants">("shirts");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera for live try-on
  const startCamera = async () => {
    setCameraError(null); // Clear any previous errors
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1280, 
          height: 720,
          facingMode: "user" 
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error: any) {
      // Handle errors silently and show user-friendly messages in UI
      
      // Provide user-friendly error messages based on error type
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraError(
          "Camera access was denied. Please allow camera permissions in your browser settings to use Live Try-On."
        );
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setCameraError(
          "No camera found on your device. Please ensure a camera is connected or use Photo Upload mode instead."
        );
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        setCameraError(
          "Camera is already in use by another application. Please close other apps using the camera and try again."
        );
      } else {
        setCameraError(
          "Unable to access camera. Please check your browser permissions or try Photo Upload mode."
        );
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Intelligent outfit matching algorithm
  const getMatchedOutfit = (shirtId?: string, pantId?: string): string | null => {
    // Perfect Matching Combinations
    const perfectMatches: Record<string, string> = {
      // Grey Sweatshirt + Grey Joggers = Grey Casual Set
      "s1-p5": outfitGreySet,
      
      // Black Zip-Up Hoodie + Black Joggers = Black Casual Set
      "s3-p6": outfitBlackCasual,
      "s2-p6": outfitBlackCasual, // Black Pullover + Black Joggers also works
      
      // Beige Blazer + Beige Chino = Beige Formal Set
      "s4-p4": outfitBeigeFormal,
      
      // Black Blazer + Black Formal Pants = Black Formal Set
      "s5-p1": outfitBlackFormal,
      
      // Grey Blazer + Grey Dress Pants = Grey Formal Set
      "s6-p2": outfitGreyFormal,
      
      // Brown Blazer would match with Brown Trousers (but we don't have brown blazer)
      // Using grey formal as closest match for brown pants with grey blazer
      "s6-p3": outfitGreyFormal,
    };

    // Check for exact match
    if (shirtId && pantId) {
      const matchKey = `${shirtId}-${pantId}`;
      if (perfectMatches[matchKey]) {
        return perfectMatches[matchKey];
      }
      
      // Smart matching logic: Find closest color/style match
      // Black combinations
      if ((shirtId === "s5" || shirtId === "s3" || shirtId === "s2") && (pantId === "p1" || pantId === "p6")) {
        return shirtId === "s5" ? outfitBlackFormal : outfitBlackCasual;
      }
      
      // Grey combinations
      if ((shirtId === "s1" || shirtId === "s6") && (pantId === "p2" || pantId === "p5")) {
        return shirtId === "s6" ? outfitGreyFormal : outfitGreySet;
      }
      
      // Beige combinations
      if (shirtId === "s4" && pantId === "p4") {
        return outfitBeigeFormal;
      }
      
      // Default fallback: Match by category
      const shirt = mockShirts.find(s => s.id === shirtId);
      const pant = mockPants.find(p => p.id === pantId);
      
      if (shirt?.category === "Formal" && pant?.category === "Formal") {
        // Return a formal outfit based on color
        if (shirt.color.toLowerCase().includes("black")) return outfitBlackFormal;
        if (shirt.color.toLowerCase().includes("grey")) return outfitGreyFormal;
        if (shirt.color.toLowerCase().includes("beige")) return outfitBeigeFormal;
        return outfitBlackFormal; // Default formal
      }
      
      if (shirt?.category === "Casual" && pant?.category === "Casual") {
        // Return a casual outfit based on color
        if (shirt.color.toLowerCase().includes("black")) return outfitBlackCasual;
        if (shirt.color.toLowerCase().includes("grey")) return outfitGreySet;
        return outfitBlackCasual; // Default casual
      }
    }
    
    return null;
  };

  // Simulate AI try-on processing
  const processTryOn = () => {
    if (!selectedShirt && !selectedPant) {
      alert("Please select at least a shirt or pant!");
      return;
    }

    if (mode === "upload" && !uploadedPhoto && !selectedModel) {
      alert("Please upload a photo or select a model first!");
      return;
    }

    setIsProcessing(true);
    setShowBeforeAfter(false);

    // Simulate AI processing with realistic timing
    setTimeout(() => {
      // Try to get matched outfit combination
      const matchedOutfit = getMatchedOutfit(selectedShirt?.id, selectedPant?.id);
      
      if (matchedOutfit) {
        // We have a perfect match! Show the realistic outfit photo
        setTryOnResult(matchedOutfit);
      } else {
        // Fallback to uploaded photo or default
        setTryOnResult(uploadedPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600");
      }
      
      setIsProcessing(false);
      setShowBeforeAfter(true);
    }, 3000);
  };

  // Download result
  const downloadResult = () => {
    if (tryOnResult) {
      const link = document.createElement("a");
      link.href = tryOnResult;
      link.download = `tryon-result-${Date.now()}.jpg`;
      link.click();
    }
  };

  // Reset try-on
  const resetTryOn = () => {
    setTryOnResult(null);
    setUploadedPhoto(null);
    setShowBeforeAfter(false);
    if (mode === "live") {
      stopCamera();
    }
  };

  // Clear selections
  const clearSelections = () => {
    setSelectedShirt(null);
    setSelectedPant(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const renderGarmentCard = (garment: Garment, isSelected: boolean, onSelect: () => void, type: "shirt" | "pant") => {
    return (
      <div
        key={garment.id}
        onClick={onSelect}
        className={`cursor-pointer rounded-xl border-2 transition-all duration-200 hover:shadow-lg group ${
          isSelected
            ? "border-indigo-600 bg-indigo-50 shadow-lg ring-2 ring-indigo-200"
            : "border-gray-200 hover:border-indigo-300 bg-white"
        }`}
      >
        <div className="p-4">
          <div className="relative mb-3">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-white border border-gray-200">
              <img
                src={garment.image}
                alt={garment.name}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isSelected ? "scale-105" : "group-hover:scale-105"
                }`}
                onError={(e) => {
                  console.error("Image failed to load:", garment.image);
                  e.currentTarget.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                }}
              />
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                <Check className="h-5 w-5 text-white" />
              </div>
            )}
            <Badge 
              className={`absolute top-2 left-2 ${
                garment.category === "Formal" 
                  ? "bg-blue-600" 
                  : garment.category === "Casual"
                  ? "bg-green-600"
                  : "bg-purple-600"
              }`}
            >
              {garment.category}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className={`font-semibold text-sm line-clamp-2 ${
              isSelected ? "text-indigo-900" : "text-gray-900"
            }`}>
              {garment.name}
            </h4>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">PO:</span>
                <span className="text-xs font-medium text-gray-700">{garment.poNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Color:</span>
                <span className="text-xs font-medium text-gray-700">{garment.color}</span>
              </div>
              {garment.material && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Material:</span>
                  <span className="text-xs font-medium text-gray-700">{garment.material}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 truncate">{garment.company}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="hover:bg-gray-100 group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      {/* Page Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg blur-sm opacity-50" />
          <div className="relative p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Virtual Try-On Studio
        </h1>
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-0.5 text-xs shadow-lg">
          <Sparkles className="h-3 w-3 mr-1" />
          BETA
        </Badge>
      </div>

      {/* Info Box - Clean Horizontal Layout */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <div className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Welcome Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-bold">i</span>
                </div>
              </div>
              <div>
                <p className="text-base text-gray-900">
                  Welcome back, <span className="font-semibold">theacsindia@gmail.com</span>!
                </p>
              </div>
            </div>
            
            {/* Right Side - Quick Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMode("live");
                  resetTryOn();
                }}
                className={`transition-all ${
                  mode === "live" 
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700" 
                    : "hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                <Video className="h-4 w-4 mr-2" />
                Live Mode
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMode("upload");
                  resetTryOn();
                }}
                className={`transition-all ${
                  mode === "upload" 
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700" 
                    : "hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo Mode
              </Button>

              {(selectedShirt || selectedPant) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelections}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
              )}

              {(selectedShirt || selectedPant) && (uploadedPhoto || mode === "live") && (
                <Button
                  onClick={processTryOn}
                  size="sm"
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Apply Try-On
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Beta Notice - Enhanced */}
      <Alert className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-lg">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <AlertDescription className="text-purple-800 font-medium">
          <strong className="text-purple-900">Beta Feature:</strong> This virtual try-on uses advanced AI to simulate how garments look. 
          Results are for visualization purposes. Help us improve by providing feedback!
        </AlertDescription>
      </Alert>

      {/* Mode Selection - Enhanced */}
      <Card className="p-8 shadow-xl border-2 border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Video className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900">Select Mode</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Button
            variant={mode === "live" ? "default" : "outline"}
            size="lg"
            onClick={() => {
              setMode("live");
              resetTryOn();
            }}
            className={`h-28 flex flex-col gap-3 transition-all ${
              mode === "live" 
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg scale-105" 
                : "hover:border-indigo-400 hover:bg-indigo-50"
            }`}
          >
            <Video className="h-10 w-10" />
            <div>
              <div className="font-semibold text-base">Live Try-On</div>
              <div className="text-xs opacity-80 mt-1">Real-time camera preview</div>
            </div>
          </Button>

          <Button
            variant={mode === "upload" ? "default" : "outline"}
            size="lg"
            onClick={() => {
              setMode("upload");
              resetTryOn();
            }}
            className={`h-28 flex flex-col gap-3 transition-all ${
              mode === "upload" 
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg scale-105" 
                : "hover:border-indigo-400 hover:bg-indigo-50"
            }`}
          >
            <ImageIcon className="h-10 w-10" />
            <div>
              <div className="font-semibold text-base">Photo Upload</div>
              <div className="text-xs opacity-80 mt-1">Upload your full body photo</div>
            </div>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enhanced Garment Gallery with Tabs */}
        <Card className="p-6 xl:col-span-1 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Grid3x3 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-lg">Garment Gallery</h3>
          </div>

          <Tabs value={activeGarmentTab} onValueChange={(v) => setActiveGarmentTab(v as "shirts" | "pants")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="shirts" className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Shirts
                {selectedShirt && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600 text-white text-xs">
                    1
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pants" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Pants
                {selectedPant && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600 text-white text-xs">
                    1
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shirts" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {mockShirts.map((shirt) => 
                  renderGarmentCard(
                    shirt, 
                    selectedShirt?.id === shirt.id, 
                    () => setSelectedShirt(shirt),
                    "shirt"
                  )
                )}
              </div>
            </TabsContent>

            <TabsContent value="pants" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {mockPants.map((pant) => 
                  renderGarmentCard(
                    pant, 
                    selectedPant?.id === pant.id, 
                    () => setSelectedPant(pant),
                    "pant"
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Main Try-On Area - Enhanced */}
        <Card className="p-6 xl:col-span-2 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-lg">
                  {mode === "live" ? "Live Preview" : "Photo Try-On"}
                </h3>
              </div>
              {tryOnResult && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetTryOn}
                    className="hover:bg-gray-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={downloadResult}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Result
                  </Button>
                </div>
              )}
            </div>

            {/* Side-by-Side View */}
            {showBeforeAfter && tryOnResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Badge variant="outline" className="bg-gray-100 px-4 py-1 text-sm">
                      Original Photo
                    </Badge>
                  </div>
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-gray-300 shadow-md">
                    <img
                      src={uploadedPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* After */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-4 py-1 text-sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Try-On Result
                    </Badge>
                  </div>
                  <div className="aspect-[3/4] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden border-2 border-indigo-300 relative shadow-xl">
                    <img
                      src={tryOnResult}
                      alt="After Try-On"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Garment Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
                      <div className="space-y-2">
                        {selectedShirt && (
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                              <Shirt className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold">
                                {selectedShirt.name}
                              </p>
                              <p className="text-white/80 text-xs">
                                {selectedShirt.poNumber} • {selectedShirt.color}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedPant && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                              <Layers className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold">
                                {selectedPant.name}
                              </p>
                              <p className="text-white/80 text-xs">
                                {selectedPant.poNumber} • {selectedPant.color}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular View */
              <div className="space-y-4">
                {mode === "live" ? (
                  /* Live Camera View */
                  <div className="space-y-4">
                    {/* Camera Error Alert */}
                    {cameraError && (
                      <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
                        <X className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          <strong className="text-red-900">Camera Error:</strong> {cameraError}
                          <div className="mt-2 text-sm">
                            <strong>How to fix:</strong>
                            <ul className="ml-4 mt-1 list-disc space-y-1">
                              <li>Click the camera/lock icon in your browser's address bar</li>
                              <li>Allow camera permissions for this website</li>
                              <li>Refresh the page and try again</li>
                              <li>Or use <strong>Photo Upload</strong> mode instead</li>
                            </ul>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMode("upload")}
                            className="mt-3 bg-white hover:bg-gray-50"
                          >
                            Switch to Photo Upload Mode
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative shadow-xl">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <div className="text-center text-white p-8">
                            <div className="mb-6 inline-flex p-6 bg-white/10 rounded-full">
                              <Camera className="h-20 w-20 opacity-50" />
                            </div>
                            <p className="text-xl font-semibold mb-3">Camera Not Active</p>
                            <p className="text-sm opacity-75 mb-6 max-w-md">
                              Click the button below to start your camera and see live try-on preview
                            </p>
                          </div>
                        </div>
                      )}
                      {(selectedShirt) && isCameraActive && (
                        <div className="absolute top-4 right-4 space-y-3">
                          {selectedShirt && (
                            <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20">
                              <img
                                src={selectedShirt.image}
                                alt={selectedShirt.name}
                                className="w-24 h-24 object-cover rounded-lg mb-2"
                              />
                              <p className="text-white text-xs font-semibold truncate max-w-[100px]">
                                {selectedShirt.name}
                              </p>
                              <Badge className="mt-1 bg-blue-600 text-xs">Shirt</Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 justify-center flex-wrap">
                      {!isCameraActive ? (
                        <Button
                          onClick={startCamera}
                          size="lg"
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Start Camera
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={stopCamera}
                            variant="outline"
                            size="lg"
                            className="hover:bg-gray-100"
                          >
                            <X className="h-5 w-5 mr-2" />
                            Stop Camera
                          </Button>
                          <Button
                            onClick={processTryOn}
                            size="lg"
                            disabled={(!selectedShirt) || isProcessing}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                Processing AI...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Apply Virtual Try-On
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Photo Upload View */
                  <div className="space-y-4">
                    {!uploadedPhoto && !selectedModel ? (
                      /* Photo Source Selection */
                      <Tabs value={photoSource} onValueChange={(v) => setPhotoSource(v as "upload" | "model")} className="w-full">
                        <div className="flex items-center justify-center mb-4">
                          <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="upload" className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Upload Photo
                            </TabsTrigger>
                            <TabsTrigger value="model" className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Select Model
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        <TabsContent value="upload" className="mt-0">
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-[3/4] max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all group"
                          >
                            <div className="text-center p-8">
                              <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full group-hover:scale-110 transition-transform">
                                <Upload className="h-16 w-16 text-indigo-600" />
                              </div>
                              <p className="text-xl font-semibold mb-3 text-gray-900">Upload Your Photo</p>
                              <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">
                                Full body photo works best for accurate virtual try-on results
                              </p>
                              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                                <Upload className="h-5 w-5 mr-2" />
                                Choose Photo
                              </Button>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="model" className="mt-0">
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Choose a professional model to try on your selected garments</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                              {mockModels.map((model) => (
                                <div
                                  key={model.id}
                                  onClick={() => {
                                    setSelectedModel(model);
                                    setUploadedPhoto(model.image);
                                  }}
                                  className="cursor-pointer rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-indigo-400 group overflow-hidden"
                                >
                                  <div className="aspect-[3/4] bg-gray-100 relative">
                                    <img
                                      src={model.image}
                                      alt={model.name}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      onError={(e) => {
                                        console.error("Model image failed to load:", model.image);
                                        e.currentTarget.src = "https://via.placeholder.com/300x400?text=Model";
                                      }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                      <p className="text-white text-xs font-semibold truncate">{model.name}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-white/80 text-xs">{model.height}</span>
                                        <span className="text-white/60 text-xs">•</span>
                                        <span className="text-white/80 text-xs">{model.bodyType}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="space-y-4">
                        <div className="aspect-[3/4] max-w-md mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-xl relative group">
                          <img
                            src={uploadedPhoto}
                            alt={selectedModel ? selectedModel.name : "Uploaded"}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          {selectedModel && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-purple-600 text-white">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                {selectedModel.name}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 justify-center flex-wrap">
                          <Button
                            onClick={() => {
                              setUploadedPhoto(null);
                              setSelectedModel(null);
                              setTryOnResult(null);
                            }}
                            variant="outline"
                            size="lg"
                            className="hover:bg-gray-100"
                          >
                            <X className="h-5 w-5 mr-2" />
                            {selectedModel ? "Change Model" : "Remove Photo"}
                          </Button>
                          <Button
                            onClick={processTryOn}
                            size="lg"
                            disabled={(!selectedShirt) || isProcessing}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                Processing AI Try-On...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Apply Virtual Try-On
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Instructions */}
            {!tryOnResult && (
              <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <ImageIcon className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 text-sm">
                  <strong className="text-blue-900">Pro Tips for Best Results:</strong>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <ul className="space-y-2 ml-4 list-disc">
                      <li>Use well-lit photos with clear visibility</li>
                      <li>Stand straight, facing the camera directly</li>
                      <li>Ensure full body is visible in frame</li>
                    </ul>
                    <ul className="space-y-2 ml-4 list-disc">
                      <li>Select shirt and/or pants from gallery</li>
                      <li>Avoid busy backgrounds if possible</li>
                      <li>Use high-resolution images (recommended)</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}