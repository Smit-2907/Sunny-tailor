import { useState, useRef, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  MessageCircle,
  Send,
  Search,
  Hash,
  Users,
  User,
  Paperclip,
  Smile,
  Pin,
  MoreVertical,
  Phone,
  Video,
  X,
  Check,
  CheckCheck,
  Circle,
  Plus,
  Filter,
  Star,
  Image as ImageIcon,
  File,
  Download,
  ThumbsUp,
  Heart,
  Laugh,
  Clock,
  ArrowLeft,
  Menu,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  reactions?: { emoji: string; users: string[] }[];
  attachments?: { type: string; name: string; url: string }[];
  isPinned?: boolean;
  replyTo?: string;
}

interface Channel {
  id: string;
  name: string;
  type: "department" | "group" | "dm";
  icon: React.ReactNode;
  members: string[];
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  description?: string;
}

interface InternalChatProps {
  currentUser: string;
  currentRole: string;
}

export function InternalChat({ currentUser, currentRole }: InternalChatProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "pinned">("all");
  const [showChannelList, setShowChannelList] = useState(true); // Mobile: toggle channel list
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Department Channels
  const channels: Channel[] = [
    {
      id: "general",
      name: "General",
      type: "department",
      icon: <Hash className="h-4 w-4" />,
      members: ["All"],
      unreadCount: 3,
      lastMessage: "Meeting at 3 PM today",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      description: "Company-wide announcements",
    },
    {
      id: "hr",
      name: "HR Department",
      type: "department",
      icon: <Hash className="h-4 w-4" />,
      members: ["HR Team"],
      unreadCount: 0,
      lastMessage: "Leave approval completed",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      description: "HR team discussions",
    },
    {
      id: "production",
      name: "Production",
      type: "department",
      icon: <Hash className="h-4 w-4" />,
      members: ["Production Team"],
      unreadCount: 5,
      lastMessage: "Order #234 completed",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 2),
      description: "Production updates",
    },
    {
      id: "measurement",
      name: "Measurement",
      type: "department",
      icon: <Hash className="h-4 w-4" />,
      members: ["Measurement Team"],
      unreadCount: 2,
      lastMessage: "New measurement sheet uploaded",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 10),
      description: "Measurement coordination",
    },
    {
      id: "dispatch",
      name: "Dispatch",
      type: "department",
      icon: <Hash className="h-4 w-4" />,
      members: ["Dispatch Team"],
      unreadCount: 1,
      lastMessage: "Ready for delivery",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
      description: "Shipping & delivery",
    },
    {
      id: "accounts",
      name: "Accounts",
      type: "department",
      icon: <Hash className="h-4 w-4" />,
      members: ["Finance Team"],
      unreadCount: 0,
      lastMessage: "Invoice sent",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 45),
      description: "Financial discussions",
    },
  ];

  const groupChats: Channel[] = [
    {
      id: "managers",
      name: "Manager Group",
      type: "group",
      icon: <Users className="h-4 w-4" />,
      members: ["Master Manager", "Production", "HR"],
      unreadCount: 7,
      lastMessage: "Quarterly review tomorrow",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 1),
    },
    {
      id: "order-tracking",
      name: "Order Tracking",
      type: "group",
      icon: <Users className="h-4 w-4" />,
      members: ["Production", "Measurement", "Dispatch"],
      unreadCount: 0,
      lastMessage: "Order #456 in progress",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 20),
    },
  ];

  const directMessages: Channel[] = [
    {
      id: "dm-rajesh",
      name: "Rajesh Kumar",
      type: "dm",
      icon: <User className="h-4 w-4" />,
      members: [currentUser, "Rajesh Kumar"],
      unreadCount: 2,
      lastMessage: "Can you check the measurements?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "dm-priya",
      name: "Priya Sharma",
      type: "dm",
      icon: <User className="h-4 w-4" />,
      members: [currentUser, "Priya Sharma"],
      unreadCount: 0,
      lastMessage: "Thanks for the update!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "dm-amit",
      name: "Amit Patel",
      type: "dm",
      icon: <User className="h-4 w-4" />,
      members: [currentUser, "Amit Patel"],
      unreadCount: 1,
      lastMessage: "Order status?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 8),
    },
  ];

  // Sample messages for selected channel
  const sampleMessages: Message[] = [
    {
      id: "1",
      sender: "Master Manager",
      senderRole: "master-manager",
      content: "Good morning team! We have a busy day ahead.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      status: "read",
      reactions: [
        { emoji: "👍", users: ["Rajesh", "Priya"] },
        { emoji: "🔥", users: ["Amit"] },
      ],
      isPinned: true,
    },
    {
      id: "2",
      sender: "Rajesh Kumar",
      senderRole: "production-manager",
      content: "Production for Order #234 is complete. Ready for quality check.",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      status: "read",
    },
    {
      id: "3",
      sender: "Priya Sharma",
      senderRole: "measurement-expert",
      content: "New measurements uploaded for Order #456. Please review.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: "delivered",
      attachments: [
        { type: "file", name: "measurements-456.xlsx", url: "#" },
      ],
    },
    {
      id: "4",
      sender: currentUser,
      senderRole: currentRole,
      content: "Great work everyone! Keep it up.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "read",
      reactions: [{ emoji: "❤️", users: ["Rajesh", "Priya", "Amit"] }],
    },
    {
      id: "5",
      sender: "Amit Patel",
      senderRole: "dispatch",
      content: "Orders #221, #222, #223 dispatched successfully!",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: "read",
      attachments: [
        { type: "image", name: "delivery-proof.jpg", url: "#" },
      ],
    },
  ];

  useEffect(() => {
    if (selectedChannel) {
      setMessages(sampleMessages);
      // On mobile, hide channel list when chat is selected
      if (window.innerWidth < 768) {
        setShowChannelList(false);
      }
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [messageInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChannel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      senderRole: currentRole,
      content: messageInput,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate delivery and read status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedChannel) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: currentUser,
        senderRole: currentRole,
        content: `Shared a file: ${file.name}`,
        timestamp: new Date(),
        status: "sent",
        attachments: [
          {
            type: file.type.startsWith("image/") ? "image" : "file",
            name: file.name,
            url: URL.createObjectURL(file),
          },
        ],
      };

      setMessages([...messages, newMessage]);
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            if (existingReaction.users.includes(currentUser)) {
              // Remove reaction
              return {
                ...msg,
                reactions: reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          users: r.users.filter((u) => u !== currentUser),
                        }
                      : r
                  )
                  .filter((r) => r.users.length > 0),
              };
            } else {
              // Add user to reaction
              return {
                ...msg,
                reactions: reactions.map((r) =>
                  r.emoji === emoji
                    ? { ...r, users: [...r.users, currentUser] }
                    : r
                ),
              };
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [...reactions, { emoji, users: [currentUser] }],
            };
          }
        }
        return msg;
      })
    );
  };

  const togglePinMessage = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      )
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const totalUnread = [...channels, ...groupChats, ...directMessages].reduce(
    (sum, ch) => sum + ch.unreadCount,
    0
  );

  const filteredMessages = messages.filter((msg) => {
    if (selectedFilter === "pinned") return msg.isPinned;
    return true;
  });

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    if (window.innerWidth < 768) {
      setShowChannelList(false);
    }
  };

  const handleBackToChannels = () => {
    setShowChannelList(true);
    setSelectedChannel(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-5 w-5 md:h-7 md:w-7 text-white" />
            </div>
            <span className="hidden sm:inline">Internal Chat</span>
            <span className="sm:hidden">Chat</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-600 mt-1 md:mt-2">
            <span className="hidden sm:inline">Team collaboration & real-time messaging</span>
            <span className="sm:hidden">Real-time messaging</span>
            {totalUnread > 0 && (
              <span className="ml-2 md:ml-3 px-2 md:px-3 py-0.5 md:py-1 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full">
                {totalUnread}
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2 md:gap-3">
          <Button variant="outline" size="sm" className="md:size-lg shadow-md flex-1 sm:flex-initial">
            <Plus className="h-4 w-4 md:h-5 md:w-5 sm:mr-2" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
          <Button variant="outline" size="sm" className="md:size-lg shadow-md flex-1 sm:flex-initial">
            <Users className="h-4 w-4 md:h-5 md:w-5 sm:mr-2" />
            <span className="hidden sm:inline">Group</span>
          </Button>
        </div>
      </div>

      {/* Main Chat Interface - Mobile Responsive */}
      <div className="relative">
        {/* Mobile: Channel List OR Chat View */}
        <div className="md:hidden">
          {showChannelList ? (
            /* Mobile Channel List */
            <Card className="shadow-lg">
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("all")}
                    className="flex-1 text-xs"
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedFilter === "unread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("unread")}
                    className="flex-1 text-xs"
                  >
                    Unread
                  </Button>
                  <Button
                    variant={selectedFilter === "pinned" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter("pinned")}
                    className="flex-1 text-xs"
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                </div>

                {/* Channels List */}
                <div className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {/* Department Channels */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Departments
                    </h3>
                    <div className="space-y-1">
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => handleChannelSelect(channel)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border-2 border-transparent active:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {channel.icon}
                              <span className="font-semibold text-sm">
                                {channel.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {channel.unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                  {channel.unreadCount}
                                </span>
                              )}
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {channel.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {channel.lastMessageTime && formatTime(channel.lastMessageTime)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group Chats */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Group Chats
                    </h3>
                    <div className="space-y-1">
                      {groupChats.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => handleChannelSelect(channel)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border-2 border-transparent active:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {channel.icon}
                              <span className="font-semibold text-sm">
                                {channel.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {channel.unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                  {channel.unreadCount}
                                </span>
                              )}
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {channel.lastMessage}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct Messages */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Direct Messages
                    </h3>
                    <div className="space-y-1">
                      {directMessages.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => handleChannelSelect(channel)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border-2 border-transparent active:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                {channel.name.charAt(0)}
                              </div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm truncate">
                                  {channel.name}
                                </span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {channel.unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                      {channel.unreadCount}
                                    </span>
                                  )}
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {channel.lastMessage}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            /* Mobile Chat View */
            selectedChannel && (
              <Card className="shadow-lg flex flex-col h-[calc(100vh-180px)]">
                {/* Mobile Chat Header */}
                <div className="p-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToChannels}
                      className="flex-shrink-0"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {selectedChannel.type === "dm"
                          ? selectedChannel.name.charAt(0)
                          : selectedChannel.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{selectedChannel.name}</h3>
                        <p className="text-xs text-gray-600 truncate">
                          {selectedChannel.type === "dm"
                            ? "Online"
                            : `${selectedChannel.members.length} members`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mobile Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {filteredMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          message.sender === currentUser
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] ${
                            message.sender === currentUser ? "items-end" : "items-start"
                          }`}
                        >
                          {/* Sender Info */}
                          {message.sender !== currentUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {message.sender.charAt(0)}
                              </div>
                              <span className="text-xs font-semibold text-gray-700">
                                {message.sender}
                              </span>
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`relative ${
                              message.sender === currentUser
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            } rounded-2xl px-3 py-2 shadow-sm`}
                          >
                            {message.isPinned && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                                <Pin className="h-2.5 w-2.5 text-white" />
                              </div>
                            )}

                            <p className="text-sm leading-relaxed break-words">{message.content}</p>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-2 rounded-lg ${
                                      message.sender === currentUser
                                        ? "bg-indigo-700"
                                        : "bg-white"
                                    } flex items-center gap-2`}
                                  >
                                    {attachment.type === "image" ? (
                                      <ImageIcon className="h-4 w-4 flex-shrink-0" />
                                    ) : (
                                      <File className="h-4 w-4 flex-shrink-0" />
                                    )}
                                    <span className="flex-1 text-xs font-medium truncate">
                                      {attachment.name}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 flex-shrink-0"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Message Status */}
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs opacity-70">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.sender === currentUser && (
                                <>
                                  {message.status === "sent" && (
                                    <Check className="h-3 w-3 opacity-70" />
                                  )}
                                  {message.status === "delivered" && (
                                    <CheckCheck className="h-3 w-3 opacity-70" />
                                  )}
                                  {message.status === "read" && (
                                    <CheckCheck className="h-3 w-3 text-blue-300" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Reactions */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-1 ml-2 flex-wrap">
                              {message.reactions.map((reaction, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => addReaction(message.id, reaction.emoji)}
                                  className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs font-semibold active:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-gray-600">
                                    {reaction.users.length}
                                  </span>
                                </button>
                              ))}
                              <button
                                onClick={() => addReaction(message.id, "👍")}
                                className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs active:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <div className="flex gap-1">
                        <Circle className="h-1.5 w-1.5 animate-bounce" />
                        <Circle className="h-1.5 w-1.5 animate-bounce delay-100" />
                        <Circle className="h-1.5 w-1.5 animate-bounce delay-200" />
                      </div>
                      <span>{isTyping.join(", ")} typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Mobile Message Input */}
                <div className="p-3 border-t bg-gray-50">
                  <div className="flex items-end gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0 h-10 w-10"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none max-h-32 text-sm"
                        rows={1}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="flex-shrink-0 h-10 w-10"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      size="icon"
                      className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 h-10 w-10"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>

        {/* Desktop: 2-Column Layout */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-6">
          {/* Left Sidebar - Channels & Contacts */}
          <div className="md:col-span-4 lg:col-span-3">
            <Card className="p-4 shadow-lg h-[calc(100vh-300px)] flex flex-col">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                  className="flex-1 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("unread")}
                  className="flex-1 text-xs"
                >
                  Unread
                </Button>
                <Button
                  variant={selectedFilter === "pinned" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("pinned")}
                  className="flex-1 text-xs"
                >
                  <Star className="h-3 w-3" />
                </Button>
              </div>

              {/* Channels List */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Department Channels */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Departments
                  </h3>
                  <div className="space-y-1">
                    {channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedChannel?.id === channel.id
                            ? "bg-indigo-50 border-2 border-indigo-500"
                            : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {channel.icon}
                            <span className="font-semibold text-sm">
                              {channel.name}
                            </span>
                          </div>
                          {channel.unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                              {channel.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {channel.lastMessage}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {channel.lastMessageTime && formatTime(channel.lastMessageTime)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Chats */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Group Chats
                  </h3>
                  <div className="space-y-1">
                    {groupChats.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedChannel?.id === channel.id
                            ? "bg-indigo-50 border-2 border-indigo-500"
                            : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {channel.icon}
                            <span className="font-semibold text-sm">
                              {channel.name}
                            </span>
                          </div>
                          {channel.unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                              {channel.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {channel.lastMessage}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Messages */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Direct Messages
                  </h3>
                  <div className="space-y-1">
                    {directMessages.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedChannel?.id === channel.id
                            ? "bg-indigo-50 border-2 border-indigo-500"
                            : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                              {channel.name.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">
                                {channel.name}
                              </span>
                              {channel.unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                  {channel.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {channel.lastMessage}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Center - Chat Messages */}
          <div className="md:col-span-8 lg:col-span-9">
            {selectedChannel ? (
              <Card className="shadow-lg h-[calc(100vh-300px)] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {selectedChannel.type === "dm"
                          ? selectedChannel.name.charAt(0)
                          : selectedChannel.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{selectedChannel.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedChannel.type === "dm"
                            ? "Online"
                            : `${selectedChannel.members.join(", ")}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Search className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {filteredMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          message.sender === currentUser
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xl ${
                            message.sender === currentUser ? "items-end" : "items-start"
                          }`}
                        >
                          {/* Sender Info */}
                          {message.sender !== currentUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {message.sender.charAt(0)}
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {message.sender}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`relative group ${
                              message.sender === currentUser
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            } rounded-2xl px-4 py-3 shadow-sm`}
                          >
                            {message.isPinned && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                                <Pin className="h-3 w-3 text-white" />
                              </div>
                            )}

                            <p className="text-sm leading-relaxed">{message.content}</p>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded-lg ${
                                      message.sender === currentUser
                                        ? "bg-indigo-700"
                                        : "bg-white"
                                    } flex items-center gap-3`}
                                  >
                                    {attachment.type === "image" ? (
                                      <ImageIcon className="h-5 w-5" />
                                    ) : (
                                      <File className="h-5 w-5" />
                                    )}
                                    <span className="flex-1 text-sm font-medium">
                                      {attachment.name}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Message Status */}
                            {message.sender === currentUser && (
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-xs opacity-70">
                                  {formatTime(message.timestamp)}
                                </span>
                                {message.status === "sent" && (
                                  <Check className="h-3 w-3 opacity-70" />
                                )}
                                {message.status === "delivered" && (
                                  <CheckCheck className="h-3 w-3 opacity-70" />
                                )}
                                {message.status === "read" && (
                                  <CheckCheck className="h-3 w-3 text-blue-300" />
                                )}
                              </div>
                            )}

                            {/* Quick Actions (on hover) */}
                            <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg shadow-lg p-1">
                              <button
                                onClick={() => addReaction(message.id, "👍")}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <ThumbsUp className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => addReaction(message.id, "❤️")}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Heart className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => togglePinMessage(message.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Pin className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Reactions */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex gap-2 mt-2 ml-2">
                              {message.reactions.map((reaction, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => addReaction(message.id, reaction.emoji)}
                                  className="px-2 py-1 bg-white border-2 border-gray-200 rounded-full text-xs font-semibold hover:border-indigo-400 transition-colors flex items-center gap-1"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-gray-600">
                                    {reaction.users.length}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <div className="flex gap-1">
                        <Circle className="h-2 w-2 animate-bounce" />
                        <Circle className="h-2 w-2 animate-bounce delay-100" />
                        <Circle className="h-2 w-2 animate-bounce delay-200" />
                      </div>
                      <span>{isTyping.join(", ")} typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-end gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none max-h-32"
                        rows={1}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="flex-shrink-0"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="shadow-lg h-[calc(100vh-300px)] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Conversation Selected
                  </h3>
                  <p className="text-gray-500">
                    Select a channel or start a new conversation
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
