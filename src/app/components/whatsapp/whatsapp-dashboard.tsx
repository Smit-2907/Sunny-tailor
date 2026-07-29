import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  MessageCircle,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

interface Message {
  id: string;
  timestamp: Date;
  recipient: string;
  recipientName: string;
  template: string;
  status: "sent" | "delivered" | "read" | "failed";
  category: string;
  poNumber?: string;
}

export function WhatsAppDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [messages] = useState<Message[]>([
    {
      id: "msg_001",
      timestamp: new Date("2026-01-27T14:30:00"),
      recipient: "+91-98765-11111",
      recipientName: "ABC Garments",
      template: "Order Confirmation",
      status: "read",
      category: "Order Management",
      poNumber: "PO-2026-089",
    },
    {
      id: "msg_002",
      timestamp: new Date("2026-01-27T14:15:00"),
      recipient: "+91-98765-22222",
      recipientName: "StyleCraft Inc",
      template: "Production Started",
      status: "delivered",
      category: "Production Updates",
      poNumber: "PO-2026-103",
    },
    {
      id: "msg_003",
      timestamp: new Date("2026-01-27T13:45:00"),
      recipient: "+91-98765-33333",
      recipientName: "Fashion Hub",
      template: "Order Dispatched",
      status: "delivered",
      category: "Dispatch",
      poNumber: "PO-2026-112",
    },
    {
      id: "msg_004",
      timestamp: new Date("2026-01-27T13:00:00"),
      recipient: "+91-98765-44444",
      recipientName: "Elite Wear",
      template: "Payment Reminder",
      status: "read",
      category: "Finance",
      poNumber: "PO-2026-085",
    },
    {
      id: "msg_005",
      timestamp: new Date("2026-01-27T12:30:00"),
      recipient: "+91-98765-55555",
      recipientName: "TechWear Solutions",
      template: "Delivery Successful",
      status: "read",
      category: "Dispatch",
      poNumber: "PO-2026-087",
    },
    {
      id: "msg_006",
      timestamp: new Date("2026-01-27T11:45:00"),
      recipient: "+91-98765-66666",
      recipientName: "Fashion Point",
      template: "Invoice Shared",
      status: "delivered",
      category: "Finance",
      poNumber: "PO-2026-091",
    },
    {
      id: "msg_007",
      timestamp: new Date("2026-01-27T11:00:00"),
      recipient: "+91-98765-77777",
      recipientName: "Global Fashion",
      template: "Quality Check Passed",
      status: "delivered",
      category: "Quality Control",
      poNumber: "PO-2026-098",
    },
    {
      id: "msg_008",
      timestamp: new Date("2026-01-27T10:30:00"),
      recipient: "+91-98765-88888",
      recipientName: "Trend Setters",
      template: "Payment Overdue",
      status: "read",
      category: "Finance",
      poNumber: "PO-2026-075",
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Send className="h-4 w-4 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "read":
        return (
          <div className="flex">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <CheckCircle className="h-4 w-4 text-blue-600 -ml-2" />
          </div>
        );
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      sent: { bg: "bg-blue-100", text: "text-blue-700", label: "Sent" },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Delivered",
      },
      read: { bg: "bg-blue-100", text: "text-blue-700", label: "Read" },
      failed: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
    };

    const config = configs[status as keyof typeof configs] || configs.sent;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 ${config.bg} ${config.text} text-xs font-medium rounded-full`}
      >
        {getStatusIcon(status)}
        {config.label}
      </span>
    );
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipient.includes(searchQuery) ||
      message.poNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || message.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: messages.length,
    sent: messages.filter((m) => m.status === "sent").length,
    delivered: messages.filter((m) => m.status === "delivered").length,
    read: messages.filter((m) => m.status === "read").length,
    failed: messages.filter((m) => m.status === "failed").length,
    deliveryRate:
      ((messages.filter((m) => m.status === "delivered" || m.status === "read")
        .length /
        messages.length) *
        100).toFixed(1),
    readRate:
      ((messages.filter((m) => m.status === "read").length / messages.length) *
        100).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-green-600" />
            WhatsApp Notifications Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Track all WhatsApp messages sent to customers
          </p>
        </div>

        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Sent</div>
            </div>
            <MessageCircle className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.delivered + stats.read}
              </div>
              <div className="text-sm text-gray-600 mt-1">Delivered</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.read}
              </div>
              <div className="text-sm text-gray-600 mt-1">Read</div>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.deliveryRate}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Delivery Rate</div>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.readRate}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Read Rate</div>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer, phone, or PO number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All ({messages.length})
            </Button>
            <Button
              variant={filterStatus === "delivered" ? "default" : "outline"}
              onClick={() => setFilterStatus("delivered")}
              size="sm"
            >
              Delivered ({stats.delivered})
            </Button>
            <Button
              variant={filterStatus === "read" ? "default" : "outline"}
              onClick={() => setFilterStatus("read")}
              size="sm"
            >
              Read ({stats.read})
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Timestamp
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Recipient
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Template
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  PO Number
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="text-sm text-gray-900">
                      {message.timestamp.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-900">
                      {message.recipientName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {message.recipient}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">
                      {message.template}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {message.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-mono text-indigo-600">
                      {message.poNumber || "-"}
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(message.status)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Resend
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <Card className="p-12 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No messages found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </Card>
      )}
    </div>
  );
}
