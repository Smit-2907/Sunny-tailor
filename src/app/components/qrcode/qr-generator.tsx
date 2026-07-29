import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  QrCode,
  Download,
  Copy,
  CheckCircle,
  Printer,
  Package,
  Scan,
} from "lucide-react";

interface QRGeneratorProps {
  garmentData?: {
    serialNumber: string;
    poNumber: string;
    orderDate: string;
    customerName: string;
    garmentType: string;
  };
}

export function QRGenerator({ garmentData }: QRGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default data if none provided
  const data = garmentData || {
    serialNumber: "GRM-2026-001234",
    poNumber: "PO-2026-089",
    orderDate: "2026-01-27",
    customerName: "ABC Garments",
    garmentType: "Formal Shirt",
  };

  // Generate tracking URL
  const trackingUrl = `https://sunny-tailor.com/track/${data.serialNumber}`;

  useEffect(() => {
    generateQRCode();
  }, [data]);

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(trackingUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(url);

      // Also draw on canvas for download
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, trackingUrl, {
          width: 400,
          margin: 2,
        });
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `QR-${data.serialNumber}.png`;
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${data.serialNumber}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
                padding: 40px;
              }
              img {
                max-width: 300px;
                border: 2px solid #000;
                padding: 20px;
                background: white;
              }
              h2 {
                margin-top: 20px;
                font-size: 18px;
              }
              p {
                margin: 5px 0;
                font-size: 14px;
              }
              .url {
                font-family: monospace;
                font-size: 12px;
                margin-top: 15px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${qrCodeUrl}" alt="QR Code" />
              <h2>${data.serialNumber}</h2>
              <p>${data.garmentType}</p>
              <p>PO: ${data.poNumber}</p>
              <p class="url">${trackingUrl}</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 100);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <QrCode className="h-6 w-6 text-indigo-600" />
        <h3 className="text-lg font-semibold">QR Code Generator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <div className="flex flex-col items-center justify-center">
          {qrCodeUrl ? (
            <div className="relative">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64 border-4 border-gray-200 rounded-lg shadow-lg"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Scan className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Hidden canvas for download */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleCopy} variant="outline">
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Garment Information */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Serial Number
            </label>
            <Input value={data.serialNumber} readOnly className="font-mono" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              PO Number
            </label>
            <Input value={data.poNumber} readOnly />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Customer Name
            </label>
            <Input value={data.customerName} readOnly />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Garment Type
            </label>
            <Input value={data.garmentType} readOnly />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Order Date
            </label>
            <Input value={data.orderDate} readOnly />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Tracking URL
            </label>
            <div className="flex gap-2">
              <Input
                value={trackingUrl}
                readOnly
                className="font-mono text-xs"
              />
              <Button onClick={handleCopy} size="sm" variant="outline">
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium mb-2">
          📲 How customers will use this QR Code:
        </p>
        <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
          <li>Scan with smartphone camera or QR scanner app</li>
          <li>View complete garment production journey</li>
          <li>See who made their garment (craftsman info)</li>
          <li>Check quality certifications</li>
          <li>Access care instructions</li>
          <li>Verify authenticity</li>
        </ul>
      </div>
    </Card>
  );
}
