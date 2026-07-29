import { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Zap,
  User,
  Loader2,
  Download,
  Edit,
  RotateCw,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";

interface MeasurementData {
  name: string;
  value: string;
  unit: string;
  confidence: number;
  highlighted: boolean;
  bodyPart: string;
}

interface AIPhotoMeasurementProps {
  employeeData?: {
    employeeId: string;
    employeeName: string;
    uniqueSerialNumber?: string;
    branch?: string;
    department?: string;
    designation?: string;
  };
  onClose: () => void;
  onSave?: (measurements: any) => void;
}

export function AIPhotoMeasurement({
  employeeData,
  onClose,
  onSave,
}: AIPhotoMeasurementProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [highlightedMeasurement, setHighlightedMeasurement] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated AI measurement extraction
  const extractMeasurements = (): MeasurementData[] => {
    // Generate random realistic measurements with slight variations
    const randomize = (base: number, variation: number = 0.5) => {
      return (base + (Math.random() - 0.5) * variation).toFixed(1);
    };
    
    return [
      // Shirt measurements
      { name: "Neck", value: randomize(15.5, 1), unit: "inches", confidence: 96, highlighted: false, bodyPart: "neck" },
      { name: "Chest", value: randomize(40, 2), unit: "inches", confidence: 94, highlighted: false, bodyPart: "chest" },
      { name: "Shoulder", value: randomize(17, 1), unit: "inches", confidence: 95, highlighted: false, bodyPart: "shoulder" },
      { name: "Waist", value: randomize(34, 2), unit: "inches", confidence: 92, highlighted: false, bodyPart: "waist" },
      { name: "Sleeve", value: randomize(34, 1), unit: "inches", confidence: 93, highlighted: false, bodyPart: "sleeve" },
      { name: "Length", value: randomize(30, 1), unit: "inches", confidence: 97, highlighted: false, bodyPart: "length" },
      // Pant measurements
      { name: "Hip", value: randomize(38, 2), unit: "inches", confidence: 91, highlighted: false, bodyPart: "hip" },
      { name: "Thigh", value: randomize(24, 1), unit: "inches", confidence: 90, highlighted: false, bodyPart: "thigh" },
      { name: "Inseam", value: randomize(32, 1.5), unit: "inches", confidence: 94, highlighted: false, bodyPart: "inseam" },
    ];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Auto-start analysis
        setTimeout(() => {
          startAIAnalysis();
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate AI processing
    setTimeout(() => {
      const extractedMeasurements = extractMeasurements();
      setMeasurements(extractedMeasurements);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleMeasurementHover = (bodyPart: string) => {
    setHighlightedMeasurement(bodyPart);
  };

  const handleMeasurementChange = (index: number, newValue: string) => {
    const updated = [...measurements];
    updated[index].value = newValue;
    setMeasurements(updated);
  };

  const handleSave = () => {
    if (onSave) {
      // Convert measurements array to structured object for shirt and pant
      const measurementMap: any = {};
      measurements.forEach(m => {
        measurementMap[m.name.toLowerCase()] = m.value;
      });
      
      // Create structured data matching form expectations
      const structuredMeasurements = {
        shirt: {
          neck: measurementMap["neck"] || "",
          chest: measurementMap["chest"] || "",
          shoulder: measurementMap["shoulder"] || "",
          waist: measurementMap["waist"] || "",
          sleeve: measurementMap["sleeve"] || "",
          length: measurementMap["length"] || "",
        },
        pant: {
          waist: measurementMap["waist"] || "",
          hip: measurementMap["hip"] || "",
          length: measurementMap["outseam"] || measurementMap["length"] || "",
          thigh: measurementMap["thigh"] || "",
          inseam: measurementMap["inseam"] || "",
        },
      };
      
      onSave(structuredMeasurements);
    }
    onClose();
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setAnalysisComplete(false);
    setMeasurements([]);
    setHighlightedMeasurement(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-700 border-green-300";
    if (confidence >= 80) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-orange-100 text-orange-700 border-orange-300";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  AI Photo Measurement
                  <Badge className="bg-yellow-400 text-yellow-900 border-0">
                    <Zap className="h-3 w-3 mr-1" />
                    Powered by AI
                  </Badge>
                </h2>
                <p className="text-sm text-white/90">
                  Upload a photo and let AI extract all measurements automatically
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Employee Info */}
          {employeeData && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{employeeData.employeeName}</span>
              </div>
              {employeeData.employeeId && (
                <div className="flex items-center gap-2">
                  <span className="opacity-70">ID:</span>
                  <span>{employeeData.employeeId}</span>
                </div>
              )}
              {employeeData.uniqueSerialNumber && (
                <div className="flex items-center gap-2">
                  <span className="opacity-70">Serial:</span>
                  <span>{employeeData.uniqueSerialNumber}</span>
                </div>
              )}
              {employeeData.branch && (
                <div className="flex items-center gap-2">
                  <span className="opacity-70">Branch:</span>
                  <span>{employeeData.branch}</span>
                </div>
              )}
              {employeeData.department && (
                <div className="flex items-center gap-2">
                  <span className="opacity-70">Department:</span>
                  <span>{employeeData.department}</span>
                </div>
              )}
              {employeeData.designation && (
                <div className="flex items-center gap-2">
                  <span className="opacity-70">Designation:</span>
                  <span>{employeeData.designation}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Upload & Preview */}
            <div className="space-y-4">
              {!uploadedImage ? (
                <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
                  <div className="p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center gap-4"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Upload className="h-12 w-12 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Upload Customer Photo
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Supported: JPG, PNG, HEIC (Max 10MB)
                        </p>
                      </div>
                      <Button 
                        type="button"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600"
                        onClick={(e) => {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Choose Photo
                      </Button>
                    </label>
                  </div>
                </Card>
              ) : (
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
                    />
                    
                    {/* AI Analysis Overlay */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center text-white">
                          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-indigo-400" />
                          <h3 className="text-xl font-semibold mb-2">AI Analysis in Progress...</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            Detecting body measurements from photo
                          </p>
                          <div className="flex items-center justify-center gap-2 text-xs">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span>Using advanced computer vision</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success Overlay */}
                    {analysisComplete && !isAnalyzing && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white border-0 shadow-lg">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Analysis Complete
                        </Badge>
                      </div>
                    )}

                    {/* Highlight Overlay for Body Parts */}
                    {highlightedMeasurement && analysisComplete && (
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 600">
                          {/* Highlight specific body part based on measurement */}
                          {highlightedMeasurement === "neck" && (
                            <circle cx="200" cy="80" r="30" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="3" />
                          )}
                          {highlightedMeasurement === "shoulder" && (
                            <line x1="140" y1="100" x2="260" y2="100" stroke="#6366f1" strokeWidth="4" strokeDasharray="5,5" />
                          )}
                          {highlightedMeasurement === "chest" && (
                            <ellipse cx="200" cy="150" rx="70" ry="40" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="3" />
                          )}
                          {highlightedMeasurement === "waist" && (
                            <ellipse cx="200" cy="220" rx="60" ry="35" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="3" />
                          )}
                          {highlightedMeasurement === "hip" && (
                            <ellipse cx="200" cy="280" rx="70" ry="40" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="3" />
                          )}
                          {highlightedMeasurement === "sleeve" && (
                            <line x1="140" y1="100" x2="80" y2="250" stroke="#6366f1" strokeWidth="4" strokeDasharray="5,5" />
                          )}
                          {highlightedMeasurement === "length" && (
                            <line x1="200" y1="80" x2="200" y2="350" stroke="#6366f1" strokeWidth="4" strokeDasharray="5,5" />
                          )}
                          {highlightedMeasurement === "inseam" && (
                            <line x1="200" y1="280" x2="200" y2="550" stroke="#6366f1" strokeWidth="4" strokeDasharray="5,5" />
                          )}
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <ImageIcon className="h-4 w-4 inline mr-1" />
                      Photo uploaded successfully
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetUpload}
                    >
                      <RotateCw className="h-3 w-3 mr-1" />
                      Change Photo
                    </Button>
                  </div>
                </Card>
              )}

              {/* Upload Tips */}
              {!uploadedImage && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Tips for Best Results
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Stand straight facing the camera</li>
                    <li>• Wear fitted clothing or minimal layers</li>
                    <li>• Good lighting (natural light preferred)</li>
                    <li>• Full body visible in frame</li>
                    <li>• Plain background works best</li>
                  </ul>
                </Card>
              )}

              {/* AI Info */}
              {analysisComplete && (
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <h4 className="font-semibold text-purple-900 mb-1">
                        AI Analysis Complete
                      </h4>
                      <p className="text-purple-800">
                        All measurements extracted with {measurements.reduce((acc, m) => acc + m.confidence, 0) / measurements.length}% average confidence.
                        Review and adjust if needed before saving.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right: Measurements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Extracted Measurements</h3>
                {analysisComplete && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    {measurements.length} measurements detected
                  </Badge>
                )}
              </div>

              {!analysisComplete && !isAnalyzing && (
                <Card className="p-12 text-center border-2 border-dashed">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    Upload a photo to start AI measurement extraction
                  </p>
                </Card>
              )}

              {isAnalyzing && (
                <Card className="p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Analyzing photo...</p>
                  <p className="text-sm text-gray-500">This may take a few seconds</p>
                </Card>
              )}

              {analysisComplete && measurements.length > 0 && (
                <div className="space-y-3">
                  {measurements.map((measurement, index) => (
                    <Card
                      key={index}
                      className={`p-4 transition-all cursor-pointer ${
                        highlightedMeasurement === measurement.bodyPart
                          ? "ring-2 ring-indigo-500 bg-indigo-50 shadow-lg"
                          : "hover:shadow-md hover:bg-gray-50"
                      }`}
                      onMouseEnter={() => handleMeasurementHover(measurement.bodyPart)}
                      onMouseLeave={() => setHighlightedMeasurement(null)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {measurement.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getConfidenceBadge(measurement.confidence)}`}
                            >
                              {measurement.confidence}% confidence
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              step="0.1"
                              value={measurement.value}
                              onChange={(e) => handleMeasurementChange(index, e.target.value)}
                              className="w-24 text-center font-semibold"
                            />
                            <span className="text-sm text-gray-600">{measurement.unit}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              title="Edit measurement"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getConfidenceColor(measurement.confidence)}`}>
                            {measurement.confidence >= 90 ? "✓" : measurement.confidence >= 80 ? "⚠" : "!"}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {analysisComplete && (
          <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Review all measurements before saving
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Measurements
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}