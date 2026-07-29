import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  MessageCircle,
  Settings,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { WhatsAppConfig } from "@/app/components/whatsapp/whatsapp-config";
import { MessageTemplates } from "@/app/components/whatsapp/message-templates";
import { WhatsAppDashboard } from "@/app/components/whatsapp/whatsapp-dashboard";

type ViewType = "dashboard" | "templates" | "config";

export function WhatsAppHub() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b pb-4">
        <Button
          variant={activeView === "dashboard" ? "default" : "outline"}
          onClick={() => setActiveView("dashboard")}
          className={
            activeView === "dashboard"
              ? "bg-green-600 hover:bg-green-700"
              : ""
          }
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Message Dashboard
        </Button>
        <Button
          variant={activeView === "templates" ? "default" : "outline"}
          onClick={() => setActiveView("templates")}
          className={
            activeView === "templates"
              ? "bg-green-600 hover:bg-green-700"
              : ""
          }
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message Templates
        </Button>
        <Button
          variant={activeView === "config" ? "default" : "outline"}
          onClick={() => setActiveView("config")}
          className={
            activeView === "config" ? "bg-green-600 hover:bg-green-700" : ""
          }
        >
          <Settings className="h-4 w-4 mr-2" />
          Configuration
        </Button>
      </div>

      {/* Content */}
      {activeView === "dashboard" && <WhatsAppDashboard />}
      {activeView === "templates" && <MessageTemplates />}
      {activeView === "config" && <WhatsAppConfig />}
    </div>
  );
}
