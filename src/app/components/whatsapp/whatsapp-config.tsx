import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  MessageCircle,
  Settings,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Save,
  TestTube,
  RefreshCw,
} from "lucide-react";

export function WhatsAppConfig() {
  const [config, setConfig] = useState({
    apiKey: "waba_demo_key_2026_xxxxxxxxxx",
    phoneNumberId: "+91-98765-43210",
    businessAccountId: "business_demo_123456",
    webhookUrl: "https://your-domain.com/webhook/whatsapp",
    webhookSecret: "webhook_secret_key_xxxxxxxxxx",
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "testing">("connected");
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = () => {
    // Save configuration
    localStorage.setItem("whatsapp_config", JSON.stringify(config));
    alert("WhatsApp configuration saved successfully!");
  };

  const handleTest = () => {
    setConnectionStatus("testing");
    setTestResult(null);

    // Simulate API test
    setTimeout(() => {
      setConnectionStatus("connected");
      setTestResult("✅ Connection successful! WhatsApp Business API is working correctly.");
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-green-600" />
            WhatsApp Business Integration
          </h2>
          <p className="text-gray-600 mt-1">
            Configure WhatsApp Business API for automated customer communications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              connectionStatus === "connected"
                ? "bg-green-100 text-green-700"
                : connectionStatus === "testing"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {connectionStatus === "connected" ? (
              <CheckCircle className="h-4 w-4" />
            ) : connectionStatus === "testing" ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="font-semibold text-sm">
              {connectionStatus === "connected"
                ? "Connected"
                : connectionStatus === "testing"
                ? "Testing..."
                : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Configuration Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* API Configuration */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">API Configuration</h3>
          </div>

          <div className="space-y-4">
            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Business API Key
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={config.apiKey}
                    onChange={(e) =>
                      setConfig({ ...config, apiKey: e.target.value })
                    }
                    placeholder="Enter your API key"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(config.apiKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from WhatsApp Business Manager
              </p>
            </div>

            {/* Phone Number ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Phone Number
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={config.phoneNumberId}
                  onChange={(e) =>
                    setConfig({ ...config, phoneNumberId: e.target.value })
                  }
                  placeholder="+91-XXXXXXXXXX"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(config.phoneNumberId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your verified WhatsApp Business phone number
              </p>
            </div>

            {/* Business Account ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Account ID
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={config.businessAccountId}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      businessAccountId: e.target.value,
                    })
                  }
                  placeholder="business_xxxxx"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(config.businessAccountId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Found in WhatsApp Business Manager settings
              </p>
            </div>
          </div>
        </Card>

        {/* Webhook Configuration */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Webhook Configuration</h3>
          </div>

          <div className="space-y-4">
            {/* Webhook URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={config.webhookUrl}
                  onChange={(e) =>
                    setConfig({ ...config, webhookUrl: e.target.value })
                  }
                  placeholder="https://your-domain.com/webhook"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(config.webhookUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Endpoint to receive WhatsApp webhooks
              </p>
            </div>

            {/* Webhook Secret */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook Verify Token
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showWebhookSecret ? "text" : "password"}
                    value={config.webhookSecret}
                    onChange={(e) =>
                      setConfig({ ...config, webhookSecret: e.target.value })
                    }
                    placeholder="Enter verify token"
                  />
                  <button
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showWebhookSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(config.webhookSecret)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Secret token for webhook verification
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                📘 Webhook Setup Instructions:
              </p>
              <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                <li>Copy the webhook URL above</li>
                <li>Go to WhatsApp Business Manager → Configuration</li>
                <li>Paste the webhook URL and verify token</li>
                <li>Subscribe to message events</li>
                <li>Click "Verify and Save"</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Test Connection */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TestTube className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Test Connection</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Test your WhatsApp Business API connection to ensure everything
              is configured correctly.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleTest}
                disabled={connectionStatus === "testing"}
                className="bg-green-600 hover:bg-green-700"
              >
                {connectionStatus === "testing" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>

              <Button onClick={handleSave} variant="default">
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">{testResult}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Features Enabled */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Enabled Features</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Order Confirmations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Production Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Dispatch Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Delivery Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Payment Reminders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Invoice Sharing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Customer Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Photo Sharing</span>
            </div>
          </div>
        </Card>

        {/* Quick Start Guide */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <h3 className="text-lg font-semibold mb-3 text-green-900">
            🚀 Quick Start Guide
          </h3>

          <div className="space-y-3 text-sm text-green-800">
            <div className="flex gap-2">
              <span className="font-bold">Step 1:</span>
              <span>
                Sign up for WhatsApp Business API at{" "}
                <a
                  href="https://business.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  business.whatsapp.com
                </a>
              </span>
            </div>

            <div className="flex gap-2">
              <span className="font-bold">Step 2:</span>
              <span>
                Get your phone number verified and approved by WhatsApp
              </span>
            </div>

            <div className="flex gap-2">
              <span className="font-bold">Step 3:</span>
              <span>
                Copy your API credentials from WhatsApp Business Manager
              </span>
            </div>

            <div className="flex gap-2">
              <span className="font-bold">Step 4:</span>
              <span>Paste credentials in the form above and save</span>
            </div>

            <div className="flex gap-2">
              <span className="font-bold">Step 5:</span>
              <span>
                Test the connection to verify everything works correctly
              </span>
            </div>

            <div className="flex gap-2">
              <span className="font-bold">Step 6:</span>
              <span>
                Create message templates in WhatsApp Business Manager (required
                for notifications)
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
