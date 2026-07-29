import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  MessageSquare,
  Package,
  Truck,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Send,
  Copy,
  Edit,
  Trash2,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: string;
  status: "approved" | "pending" | "rejected";
  language: string;
  content: string;
  variables: string[];
  icon: any;
  color: string;
}

export function MessageTemplates() {
  const [templates] = useState<Template[]>([
    {
      id: "order_confirmation",
      name: "Order Confirmation",
      category: "Order Management",
      status: "approved",
      language: "en",
      content:
        "✅ *Order Confirmed!*\n\nDear {{customer_name}},\n\nYour order *{{po_number}}* has been confirmed!\n\n📦 Items: {{item_count}} garments\n📅 Expected delivery: {{delivery_date}}\n💰 Amount: ₹{{amount}}\n\nTrack your order: {{tracking_link}}\n\nThank you for choosing us! 🙏",
      variables: [
        "customer_name",
        "po_number",
        "item_count",
        "delivery_date",
        "amount",
        "tracking_link",
      ],
      icon: CheckCircle,
      color: "green",
    },
    {
      id: "production_started",
      name: "Production Started",
      category: "Production Updates",
      status: "approved",
      language: "en",
      content:
        "🏭 *Production Started*\n\nHello {{customer_name}},\n\nGreat news! Production for your order *{{po_number}}* has begun.\n\n👔 Garments: {{item_count}} pieces\n⏱️ Estimated completion: {{completion_date}}\n\nWe'll keep you updated on the progress! 📊",
      variables: [
        "customer_name",
        "po_number",
        "item_count",
        "completion_date",
      ],
      icon: Package,
      color: "blue",
    },
    {
      id: "quality_approved",
      name: "Quality Check Passed",
      category: "Quality Control",
      status: "approved",
      language: "en",
      content:
        "✅ *Quality Check Passed*\n\nDear {{customer_name}},\n\nExcellent news! Your order *{{po_number}}* has passed all quality checks with flying colors! 🎉\n\n✓ All garments inspected\n✓ Measurements verified\n✓ Ready for dispatch\n\nExpected dispatch: {{dispatch_date}}",
      variables: ["customer_name", "po_number", "dispatch_date"],
      icon: CheckCircle,
      color: "green",
    },
    {
      id: "dispatched",
      name: "Order Dispatched",
      category: "Dispatch",
      status: "approved",
      language: "en",
      content:
        "🚚 *Order Dispatched!*\n\nHi {{customer_name}},\n\nYour order *{{po_number}}* is on its way! 📦\n\n🚛 Vehicle: {{vehicle_number}}\n👨‍✈️ Driver: {{driver_name}}\n📞 Contact: {{driver_phone}}\n📍 Track: {{tracking_link}}\n\nExpected delivery: {{delivery_date}}",
      variables: [
        "customer_name",
        "po_number",
        "vehicle_number",
        "driver_name",
        "driver_phone",
        "tracking_link",
        "delivery_date",
      ],
      icon: Truck,
      color: "indigo",
    },
    {
      id: "out_for_delivery",
      name: "Out for Delivery",
      category: "Dispatch",
      status: "approved",
      language: "en",
      content:
        "📦 *Out for Delivery*\n\nHello {{customer_name}},\n\nYour order *{{po_number}}* is out for delivery!\n\n📍 Current location: {{location}}\n⏰ ETA: {{eta}}\n\nOur driver {{driver_name}} will call you before arrival.\n\nPhone: {{driver_phone}}",
      variables: [
        "customer_name",
        "po_number",
        "location",
        "eta",
        "driver_name",
        "driver_phone",
      ],
      icon: Truck,
      color: "orange",
    },
    {
      id: "delivered",
      name: "Delivery Successful",
      category: "Dispatch",
      status: "approved",
      language: "en",
      content:
        "✅ *Delivered Successfully!*\n\nDear {{customer_name}},\n\nYour order *{{po_number}}* has been delivered! 🎉\n\n📦 Delivered at: {{delivery_time}}\n✍️ Received by: {{received_by}}\n\nThank you for your business! We hope to serve you again. 🙏\n\nRate our service: {{feedback_link}}",
      variables: [
        "customer_name",
        "po_number",
        "delivery_time",
        "received_by",
        "feedback_link",
      ],
      icon: CheckCircle,
      color: "green",
    },
    {
      id: "invoice_sent",
      name: "Invoice Shared",
      category: "Finance",
      status: "approved",
      language: "en",
      content:
        "📄 *Invoice Generated*\n\nDear {{customer_name}},\n\nYour invoice *{{invoice_number}}* is ready!\n\n💰 Amount: ₹{{amount}}\n📅 Due date: {{due_date}}\n\nDownload invoice: {{invoice_link}}\n\nBank Details:\n• A/c: {{account_number}}\n• IFSC: {{ifsc_code}}\n\nThank you! 🙏",
      variables: [
        "customer_name",
        "invoice_number",
        "amount",
        "due_date",
        "invoice_link",
        "account_number",
        "ifsc_code",
      ],
      icon: DollarSign,
      color: "purple",
    },
    {
      id: "payment_reminder",
      name: "Payment Reminder",
      category: "Finance",
      status: "approved",
      language: "en",
      content:
        "⏰ *Payment Reminder*\n\nDear {{customer_name}},\n\nFriendly reminder: Invoice *{{invoice_number}}* is due on {{due_date}}.\n\n💰 Amount: ₹{{amount}}\n📅 Days remaining: {{days_remaining}}\n\nPay now: {{payment_link}}\n\nIgnore if already paid. Thank you! 🙏",
      variables: [
        "customer_name",
        "invoice_number",
        "due_date",
        "amount",
        "days_remaining",
        "payment_link",
      ],
      icon: AlertCircle,
      color: "yellow",
    },
    {
      id: "payment_overdue",
      name: "Payment Overdue",
      category: "Finance",
      status: "approved",
      language: "en",
      content:
        "🔴 *Payment Overdue*\n\nDear {{customer_name}},\n\nInvoice *{{invoice_number}}* is now overdue by {{overdue_days}} days.\n\n💰 Amount: ₹{{amount}}\n📅 Due date was: {{due_date}}\n\nPlease clear payment at the earliest to avoid late charges.\n\nContact us: {{support_phone}}",
      variables: [
        "customer_name",
        "invoice_number",
        "overdue_days",
        "amount",
        "due_date",
        "support_phone",
      ],
      icon: AlertCircle,
      color: "red",
    },
    {
      id: "payment_received",
      name: "Payment Received",
      category: "Finance",
      status: "approved",
      language: "en",
      content:
        "✅ *Payment Received*\n\nDear {{customer_name}},\n\nThank you! We've received your payment of ₹{{amount}} for invoice *{{invoice_number}}*.\n\n📅 Payment date: {{payment_date}}\n💳 Reference: {{payment_reference}}\n\nReceipt: {{receipt_link}}\n\nWe appreciate your business! 🙏",
      variables: [
        "customer_name",
        "amount",
        "invoice_number",
        "payment_date",
        "payment_reference",
        "receipt_link",
      ],
      icon: CheckCircle,
      color: "green",
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          <CheckCircle className="h-3 w-3" />
          Approved
        </span>
      );
    } else if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
          <AlertCircle className="h-3 w-3" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
          <AlertCircle className="h-3 w-3" />
          Rejected
        </span>
      );
    }
  };

  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("Template copied to clipboard!");
  };

  const sendTestMessage = (template: Template) => {
    alert(
      `Test message would be sent using template: "${template.name}"\n\nThis would send to your configured test number.`
    );
  };

  const categoryGroups = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-green-600" />
            Message Templates
          </h2>
          <p className="text-gray-600 mt-1">
            Pre-approved templates for automated WhatsApp notifications
          </p>
        </div>

        <Button className="bg-green-600 hover:bg-green-700">
          <MessageSquare className="h-4 w-4 mr-2" />
          Create New Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {templates.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Templates</div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {templates.filter((t) => t.status === "approved").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Approved</div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {templates.filter((t) => t.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Pending</div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {Object.keys(categoryGroups).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Categories</div>
          </div>
        </Card>
      </div>

      {/* Templates by Category */}
      {Object.entries(categoryGroups).map(([category, categoryTemplates]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            {category}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-${template.color}-100 flex items-center justify-center`}
                      >
                        <Icon
                          className={`h-5 w-5 text-${template.color}-600`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {template.variables.length} variables
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(template.status)}
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <p className="text-xs text-gray-700 whitespace-pre-line line-clamp-3">
                      {template.content}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyTemplate(template.content);
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendTestMessage(template);
                      }}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTemplate(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = selectedTemplate.icon;
                    return (
                      <div
                        className={`w-12 h-12 rounded-lg bg-${selectedTemplate.color}-100 flex items-center justify-center`}
                      >
                        <Icon
                          className={`h-6 w-6 text-${selectedTemplate.color}-600`}
                        />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedTemplate.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedTemplate.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedTemplate.status)}
                  </div>
                </div>

                {/* Template Content */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Message Content
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-sm whitespace-pre-line">
                      {selectedTemplate.content}
                    </p>
                  </div>
                </div>

                {/* Variables */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Variables ({selectedTemplate.variables.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <span
                        key={variable}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-mono rounded-full"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => copyTemplate(selectedTemplate.content)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                  <Button
                    onClick={() => sendTestMessage(selectedTemplate)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Message
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
