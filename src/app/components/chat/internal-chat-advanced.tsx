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
  Edit2,
  Trash2,
  Reply,
  Forward,
  Copy,
  AlertCircle,
  Volume2,
  VolumeX,
  Settings,
  UserPlus,
  LogOut,
  Archive,
  Bookmark,
  ChevronDown,
  AtSign,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatView } from "@/app/components/chat/chat-view";
import { VoiceRecorder } from "@/app/components/chat/voice-recorder";
import { VideoCall } from "@/app/components/chat/video-call";

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  reactions?: { emoji: string; users: string[] }[];
  attachments?: { type: string; name: string; url: string; size?: number }[];
  isPinned?: boolean;
  isEdited?: boolean;
  replyTo?: {
    id: string;
    sender: string;
    content: string;
  };
  mentions?: string[];
  isForwarded?: boolean;
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
  avatar?: string;
  isOnline?: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
}

interface InternalChatProps {
  currentUser: string;
  currentRole: string;
}

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏", "✅", "❌"];

export function InternalChat({ currentUser, currentRole }: InternalChatProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [channelSearchQuery, setChannelSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "pinned">("all");
  const [showChannelList, setShowChannelList] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [notificationSound, setNotificationSound] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Initialize channels
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "general",
      name: "General",
      type: "department",
      icon: <Hash className="h-4 w-4" />,
      members: ["All"],
      unreadCount: 3,
      lastMessage: "Meeting at 3 PM today",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      description: "Company-wide announcements and discussions",
      isPinned: true,
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
      description: "HR team discussions and updates",
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
      description: "Production updates and coordination",
      isPinned: true,
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
      description: "Shipping and delivery coordination",
    },
  ]);

  const [groupChats, setGroupChats] = useState<Channel[]>([
    {
      id: "managers",
      name: "Manager Group",
      type: "group",
      icon: <Users className="h-4 w-4" />,
      members: ["Master Manager", "Production", "HR"],
      unreadCount: 7,
      lastMessage: "Quarterly review tomorrow",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 1),
      isPinned: true,
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
  ]);

  const [directMessages, setDirectMessages] = useState<Channel[]>([
    {
      id: "dm-rajesh",
      name: "Rajesh Kumar",
      type: "dm",
      icon: <User className="h-4 w-4" />,
      members: [currentUser, "Rajesh Kumar"],
      unreadCount: 2,
      lastMessage: "Can you check the measurements?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 3),
      isOnline: true,
      avatar: "RK",
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
      isOnline: true,
      avatar: "PS",
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
      isOnline: false,
      avatar: "AP",
    },
  ]);

  // Initialize messages for selected channel
  useEffect(() => {
    if (selectedChannel) {
      // Load messages from localStorage or use sample data
      const storedMessages = localStorage.getItem(`chat-messages-${selectedChannel.id}`);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        // Sample messages
        const sampleMessages: Message[] = [
          {
            id: "1",
            sender: "Master Manager",
            senderRole: "master-manager",
            senderAvatar: "MM",
            content: "Good morning team! We have a busy day ahead. Let's make it count! 💪",
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            status: "read",
            reactions: [
              { emoji: "👍", users: ["Rajesh Kumar", "Priya Sharma"] },
              { emoji: "🔥", users: ["Amit Patel"] },
            ],
            isPinned: true,
          },
          {
            id: "2",
            sender: "Rajesh Kumar",
            senderRole: "production-manager",
            senderAvatar: "RK",
            content: "Production for Order #234 is complete. Ready for quality check.",
            timestamp: new Date(Date.now() - 1000 * 60 * 90),
            status: "read",
            mentions: ["Master Manager"],
          },
          {
            id: "3",
            sender: "Priya Sharma",
            senderRole: "measurement-expert",
            senderAvatar: "PS",
            content: "New measurements uploaded for Order #456. Please review. @MasterManager",
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            status: "delivered",
            attachments: [
              { type: "file", name: "measurements-456.xlsx", url: "#", size: 245000 },
            ],
            mentions: ["Master Manager"],
          },
          {
            id: "4",
            sender: currentUser,
            senderRole: currentRole,
            senderAvatar: currentUser.substring(0, 2).toUpperCase(),
            content: "Great work everyone! Keep it up. 🎉",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: "read",
            reactions: [{ emoji: "❤️", users: ["Rajesh Kumar", "Priya Sharma", "Amit Patel"] }],
          },
          {
            id: "5",
            sender: "Amit Patel",
            senderRole: "dispatch",
            senderAvatar: "AP",
            content: "Orders #221, #222, #223 dispatched successfully! 🚚",
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            status: "read",
            attachments: [
              { type: "image", name: "delivery-proof.jpg", url: "#", size: 890000 },
            ],
          },
        ];
        setMessages(sampleMessages);
      }

      // Mark messages as read
      if (selectedChannel.unreadCount > 0) {
        updateChannelUnread(selectedChannel.id, 0);
      }

      // On mobile, hide channel list when chat is selected
      if (window.innerWidth < 768) {
        setShowChannelList(false);
      }
    }
  }, [selectedChannel]);

  // Save messages to localStorage
  useEffect(() => {
    if (selectedChannel && messages.length > 0) {
      localStorage.setItem(`chat-messages-${selectedChannel.id}`, JSON.stringify(messages));
    }
  }, [messages, selectedChannel]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [messageInput]);

  // Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simulate typing indicator
  useEffect(() => {
    if (messageInput && selectedChannel) {
      // Show typing indicator
      const randomUser = ["Rajesh Kumar", "Priya Sharma", "Amit Patel"][Math.floor(Math.random() * 3)];
      if (!isTyping.includes(randomUser) && Math.random() > 0.7) {
        setIsTyping([...isTyping, randomUser]);
        setTimeout(() => {
          setIsTyping(prev => prev.filter(u => u !== randomUser));
        }, 3000);
      }
    }
  }, [messageInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateChannelUnread = (channelId: string, count: number) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, unreadCount: count } : ch));
    setGroupChats(prev => prev.map(ch => ch.id === channelId ? { ...ch, unreadCount: count } : ch));
    setDirectMessages(prev => prev.map(ch => ch.id === channelId ? { ...ch, unreadCount: count } : ch));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChannel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      senderRole: currentRole,
      senderAvatar: currentUser.substring(0, 2).toUpperCase(),
      content: messageInput,
      timestamp: new Date(),
      status: "sending",
      replyTo: replyingTo ? {
        id: replyingTo.id,
        sender: replyingTo.sender,
        content: replyingTo.content,
      } : undefined,
      mentions: extractMentions(messageInput),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    setReplyingTo(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Update channel last message
    updateChannelLastMessage(selectedChannel.id, messageInput);

    // Play notification sound
    if (notificationSound) {
      playNotificationSound();
    }

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1500);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 3000);
  };

  const handleEditMessage = () => {
    if (!editingMessage || !messageInput.trim()) return;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === editingMessage.id
          ? { ...msg, content: messageInput, isEdited: true }
          : msg
      )
    );

    setMessageInput("");
    setEditingMessage(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedChannel) {
      const fileType = file.type.startsWith("image/") ? "image" : "file";
      
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: currentUser,
        senderRole: currentRole,
        senderAvatar: currentUser.substring(0, 2).toUpperCase(),
        content: `Shared a ${fileType}: ${file.name}`,
        timestamp: new Date(),
        status: "sending",
        attachments: [
          {
            type: fileType,
            name: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
          },
        ],
      };

      setMessages([...messages, newMessage]);
      updateChannelLastMessage(selectedChannel.id, `📎 ${file.name}`);

      // Simulate upload
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 2000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);

          if (existingReaction) {
            if (existingReaction.users.includes(currentUser)) {
              // Remove reaction
              return {
                ...msg,
                reactions: reactions
                  .map(r =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          users: r.users.filter(u => u !== currentUser),
                        }
                      : r
                  )
                  .filter(r => r.users.length > 0),
              };
            } else {
              // Add user to reaction
              return {
                ...msg,
                reactions: reactions.map(r =>
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
    setShowEmojiPicker(false);
  };

  const togglePinMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      )
    );
  };

  const togglePinChannel = (channelId: string) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, isPinned: !ch.isPinned } : ch));
    setGroupChats(prev => prev.map(ch => ch.id === channelId ? { ...ch, isPinned: !ch.isPinned } : ch));
    setDirectMessages(prev => prev.map(ch => ch.id === channelId ? { ...ch, isPinned: !ch.isPinned } : ch));
  };

  const toggleMuteChannel = (channelId: string) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, isMuted: !ch.isMuted } : ch));
    setGroupChats(prev => prev.map(ch => ch.id === channelId ? { ...ch, isMuted: !ch.isMuted } : ch));
    setDirectMessages(prev => prev.map(ch => ch.id === channelId ? { ...ch, isMuted: !ch.isMuted } : ch));
  };

  const updateChannelLastMessage = (channelId: string, message: string) => {
    const now = new Date();
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, lastMessage: message, lastMessageTime: now } : ch));
    setGroupChats(prev => prev.map(ch => ch.id === channelId ? { ...ch, lastMessage: message, lastMessageTime: now } : ch));
    setDirectMessages(prev => prev.map(ch => ch.id === channelId ? { ...ch, lastMessage: message, lastMessageTime: now } : ch));
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const totalUnread = [...channels, ...groupChats, ...directMessages].reduce(
    (sum, ch) => sum + ch.unreadCount,
    0
  );

  const filteredMessages = messages.filter(msg => {
    if (selectedFilter === "pinned") return msg.isPinned;
    if (searchQuery) {
      return msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             msg.sender.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const allChannels = [...channels, ...groupChats, ...directMessages];
  const filteredChannels = allChannels.filter(ch => {
    if (selectedFilter === "unread" && ch.unreadCount === 0) return false;
    if (selectedFilter === "pinned" && !ch.isPinned) return false;
    if (channelSearchQuery) {
      return ch.name.toLowerCase().includes(channelSearchQuery.toLowerCase());
    }
    return true;
  });

  const pinnedChannels = filteredChannels.filter(ch => ch.isPinned);
  const unpinnedChannels = filteredChannels.filter(ch => !ch.isPinned);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedMessage(null);
    setReplyingTo(null);
    setEditingMessage(null);
    if (window.innerWidth < 768) {
      setShowChannelList(false);
    }
  };

  const handleBackToChannels = () => {
    setShowChannelList(true);
    setSelectedChannel(null);
  };

  const startReply = (message: Message) => {
    setReplyingTo(message);
    setSelectedMessage(null);
    textareaRef.current?.focus();
  };

  const startEdit = (message: Message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
    setSelectedMessage(null);
    textareaRef.current?.focus();
  };

  const forwardMessage = (message: Message) => {
    // In a real app, this would open a channel selector
    alert("Forward message feature - Select a channel to forward to");
  };

  const copyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.content);
    alert("Message copied to clipboard!");
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
            <span className="hidden sm:inline">Advanced team collaboration & messaging</span>
            <span className="sm:hidden">Team messaging</span>
            {totalUnread > 0 && (
              <span className="ml-2 md:ml-3 px-2 md:px-3 py-0.5 md:py-1 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full animate-pulse">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="md:size-lg shadow-md"
            onClick={() => setNotificationSound(!notificationSound)}
          >
            {notificationSound ? <Volume2 className="h-4 w-4 md:h-5 md:w-5" /> : <VolumeX className="h-4 w-4 md:h-5 md:w-5" />}
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
                    placeholder="Search conversations..."
                    value={channelSearchQuery}
                    onChange={(e) => setChannelSearchQuery(e.target.value)}
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
                  {/* Pinned Channels */}
                  {pinnedChannels.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        Pinned
                      </h3>
                      <div className="space-y-1">
                        {pinnedChannels.map((channel) => (
                          <ChannelItem
                            key={channel.id}
                            channel={channel}
                            onSelect={handleChannelSelect}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular Channels */}
                  {unpinnedChannels.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                        Conversations
                      </h3>
                      <div className="space-y-1">
                        {unpinnedChannels.map((channel) => (
                          <ChannelItem
                            key={channel.id}
                            channel={channel}
                            onSelect={handleChannelSelect}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            /* Mobile Chat View */
            selectedChannel && (
              <ChatView
                channel={selectedChannel}
                messages={filteredMessages}
                currentUser={currentUser}
                currentRole={currentRole}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                editingMessage={editingMessage}
                setEditingMessage={setEditingMessage}
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                isTyping={isTyping}
                textareaRef={textareaRef}
                fileInputRef={fileInputRef}
                messagesEndRef={messagesEndRef}
                emojiPickerRef={emojiPickerRef}
                onBackToChannels={handleBackToChannels}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onFileUpload={handleFileUpload}
                addReaction={addReaction}
                togglePinMessage={togglePinMessage}
                startReply={startReply}
                startEdit={startEdit}
                forwardMessage={forwardMessage}
                copyMessage={copyMessage}
                formatTime={formatTime}
                formatFileSize={formatFileSize}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showChannelInfo={showChannelInfo}
                setShowChannelInfo={setShowChannelInfo}
                toggleMuteChannel={toggleMuteChannel}
                togglePinChannel={togglePinChannel}
                isMobile={true}
              />
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
                  placeholder="Search conversations..."
                  value={channelSearchQuery}
                  onChange={(e) => setChannelSearchQuery(e.target.value)}
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
                {/* Pinned Channels */}
                {pinnedChannels.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      Pinned
                    </h3>
                    <div className="space-y-1">
                      {pinnedChannels.map((channel) => (
                        <ChannelItem
                          key={channel.id}
                          channel={channel}
                          onSelect={handleChannelSelect}
                          isActive={selectedChannel?.id === channel.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Channels */}
                {unpinnedChannels.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Conversations
                    </h3>
                    <div className="space-y-1">
                      {unpinnedChannels.map((channel) => (
                        <ChannelItem
                          key={channel.id}
                          channel={channel}
                          onSelect={handleChannelSelect}
                          isActive={selectedChannel?.id === channel.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Center - Chat Messages */}
          <div className="md:col-span-8 lg:col-span-9">
            {selectedChannel ? (
              <ChatView
                channel={selectedChannel}
                messages={filteredMessages}
                currentUser={currentUser}
                currentRole={currentRole}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                editingMessage={editingMessage}
                setEditingMessage={setEditingMessage}
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                isTyping={isTyping}
                textareaRef={textareaRef}
                fileInputRef={fileInputRef}
                messagesEndRef={messagesEndRef}
                emojiPickerRef={emojiPickerRef}
                onBackToChannels={handleBackToChannels}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onFileUpload={handleFileUpload}
                addReaction={addReaction}
                togglePinMessage={togglePinMessage}
                startReply={startReply}
                startEdit={startEdit}
                forwardMessage={forwardMessage}
                copyMessage={copyMessage}
                formatTime={formatTime}
                formatFileSize={formatFileSize}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showChannelInfo={showChannelInfo}
                setShowChannelInfo={setShowChannelInfo}
                toggleMuteChannel={toggleMuteChannel}
                togglePinChannel={togglePinChannel}
                isMobile={false}
              />
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

// Channel Item Component
interface ChannelItemProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
  isActive?: boolean;
}

function ChannelItem({ channel, onSelect, isActive }: ChannelItemProps) {
  return (
    <button
      onClick={() => onSelect(channel)}
      className={`w-full text-left p-3 rounded-lg transition-all ${
        isActive
          ? "bg-indigo-50 border-2 border-indigo-500"
          : "hover:bg-gray-50 border-2 border-transparent active:bg-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {channel.type === "dm" ? (
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {channel.avatar || channel.name.charAt(0)}
              </div>
              {channel.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
          ) : (
            channel.icon
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">
                {channel.name}
              </span>
              {channel.isPinned && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              )}
              {channel.isMuted && (
                <VolumeX className="h-3 w-3 text-gray-400 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {channel.unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
              {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 truncate">
        {channel.lastMessage}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {channel.lastMessageTime && formatTime(channel.lastMessageTime)}
      </p>
    </button>
  );
}

function formatTime(date: Date) {
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
}

// Chat View Component (to be continued in next part due to length)
// ... [Continued in next artifact]