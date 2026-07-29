import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Send,
  Search,
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
  Star,
  Image as ImageIcon,
  File,
  Download,
  ArrowLeft,
  Edit2,
  Trash2,
  Reply,
  Forward,
  Copy,
  Info,
  VolumeX,
  Volume2,
  UserPlus,
  Archive,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏", "✅", "❌"];

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

interface ChatViewProps {
  channel: Channel;
  messages: Message[];
  currentUser: string;
  currentRole: string;
  messageInput: string;
  setMessageInput: (value: string) => void;
  replyingTo: Message | null;
  setReplyingTo: (value: Message | null) => void;
  editingMessage: Message | null;
  setEditingMessage: (value: Message | null) => void;
  selectedMessage: string | null;
  setSelectedMessage: (value: string | null) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: boolean) => void;
  isTyping: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  emojiPickerRef: React.RefObject<HTMLDivElement>;
  onBackToChannels: () => void;
  onSendMessage: () => void;
  onEditMessage: () => void;
  onDeleteMessage: (id: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addReaction: (messageId: string, emoji: string) => void;
  togglePinMessage: (messageId: string) => void;
  startReply: (message: Message) => void;
  startEdit: (message: Message) => void;
  forwardMessage: (message: Message) => void;
  copyMessage: (message: Message) => void;
  formatTime: (date: Date) => string;
  formatFileSize: (bytes: number) => string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showChannelInfo: boolean;
  setShowChannelInfo: (value: boolean) => void;
  toggleMuteChannel: (channelId: string) => void;
  togglePinChannel: (channelId: string) => void;
  isMobile: boolean;
}

export function ChatView({
  channel,
  messages,
  currentUser,
  currentRole,
  messageInput,
  setMessageInput,
  replyingTo,
  setReplyingTo,
  editingMessage,
  setEditingMessage,
  selectedMessage,
  setSelectedMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  isTyping,
  textareaRef,
  fileInputRef,
  messagesEndRef,
  emojiPickerRef,
  onBackToChannels,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onFileUpload,
  addReaction,
  togglePinMessage,
  startReply,
  startEdit,
  forwardMessage,
  copyMessage,
  formatTime,
  formatFileSize,
  searchQuery,
  setSearchQuery,
  showChannelInfo,
  setShowChannelInfo,
  toggleMuteChannel,
  togglePinChannel,
  isMobile,
}: ChatViewProps) {
  const pinnedMessages = messages.filter(msg => msg.isPinned);

  return (
    <Card className="shadow-lg flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-300px)]">
      {/* Chat Header */}
      <div className="p-3 md:p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToChannels}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {channel.type === "dm" ? (
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {channel.avatar || channel.name.charAt(0)}
                </div>
                {channel.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                {channel.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm md:text-base truncate">{channel.name}</h3>
                {channel.isPinned && (
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                )}
                {channel.isMuted && (
                  <VolumeX className="h-3 w-3 text-gray-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-600 truncate">
                {channel.type === "dm"
                  ? channel.isOnline ? "Online" : "Offline"
                  : `${channel.members.length} members`}
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setShowChannelInfo(!showChannelInfo)}
            >
              <Info className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pinned Messages Banner */}
        {pinnedMessages.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Pin className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-yellow-900">
                  {pinnedMessages.length} pinned message{pinnedMessages.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-yellow-700 truncate">
                  {pinnedMessages[0].content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-xl ${
                  message.sender === currentUser ? "items-end" : "items-start"
                }`}
              >
                {/* Sender Info */}
                {message.sender !== currentUser && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {message.senderAvatar || message.sender.charAt(0)}
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-700">
                      {message.sender}
                    </span>
                  </div>
                )}

                {/* Reply Context */}
                {message.replyTo && (
                  <div className={`mb-2 ${message.sender === currentUser ? "flex justify-end" : ""}`}>
                    <div className="p-2 bg-gray-100 rounded-lg border-l-4 border-indigo-500 max-w-full">
                      <p className="text-xs font-semibold text-gray-700">
                        Replying to {message.replyTo.sender}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {message.replyTo.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative group ${
                    message.sender === currentUser
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  } rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-sm`}
                  onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                >
                  {message.isPinned && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                      <Pin className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}

                  {message.isForwarded && (
                    <div className="flex items-center gap-1 mb-1 opacity-70">
                      <Forward className="h-3 w-3" />
                      <span className="text-xs">Forwarded</span>
                    </div>
                  )}

                  {/* Message Status Indicator */}
                  {message.status === "sending" && (
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      <Clock className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}

                  {/* Mentions */}
                  {message.mentions && message.mentions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {message.mentions.map((mention, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            message.sender === currentUser
                              ? "bg-indigo-700"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          @{mention}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {message.isEdited && (
                    <span className="text-xs opacity-70 ml-2">(edited)</span>
                  )}

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className={`p-2 md:p-3 rounded-lg ${
                            message.sender === currentUser
                              ? "bg-indigo-700"
                              : "bg-white"
                          } flex items-center gap-3 group/attachment hover:shadow-md transition-shadow`}
                        >
                          {attachment.type === "image" ? (
                            <>
                              <ImageIcon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs md:text-sm font-medium block truncate">
                                  {attachment.name}
                                </span>
                                {attachment.size && (
                                  <span className="text-xs opacity-70">
                                    {formatFileSize(attachment.size)}
                                  </span>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0 opacity-0 group-hover/attachment:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(attachment.url, '_blank');
                                }}
                              >
                                <Download className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <File className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs md:text-sm font-medium block truncate">
                                  {attachment.name}
                                </span>
                                {attachment.size && (
                                  <span className="text-xs opacity-70">
                                    {formatFileSize(attachment.size)}
                                  </span>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0 opacity-0 group-hover/attachment:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(attachment.url, '_blank');
                                }}
                              >
                                <Download className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </>
                          )}
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

                  {/* Quick Actions (Desktop hover) */}
                  {!isMobile && (
                    <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg shadow-lg p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addReaction(message.id, "👍");
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Like"
                      >
                        👍
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addReaction(message.id, "❤️");
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Love"
                      >
                        ❤️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startReply(message);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Reply"
                      >
                        <Reply className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinMessage(message.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Pin"
                      >
                        <Pin className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Actions Menu (Mobile) */}
                {isMobile && selectedMessage === message.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 p-2 bg-white rounded-lg shadow-lg border"
                  >
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => {
                          addReaction(message.id, "👍");
                          setSelectedMessage(null);
                        }}
                        className="flex flex-col items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <span className="text-xl">👍</span>
                        <span className="text-xs mt-1">Like</span>
                      </button>
                      <button
                        onClick={() => {
                          startReply(message);
                          setSelectedMessage(null);
                        }}
                        className="flex flex-col items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <Reply className="h-5 w-5 text-gray-600" />
                        <span className="text-xs mt-1">Reply</span>
                      </button>
                      <button
                        onClick={() => {
                          forwardMessage(message);
                          setSelectedMessage(null);
                        }}
                        className="flex flex-col items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <Forward className="h-5 w-5 text-gray-600" />
                        <span className="text-xs mt-1">Forward</span>
                      </button>
                      <button
                        onClick={() => {
                          copyMessage(message);
                          setSelectedMessage(null);
                        }}
                        className="flex flex-col items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <Copy className="h-5 w-5 text-gray-600" />
                        <span className="text-xs mt-1">Copy</span>
                      </button>
                      {message.sender === currentUser && (
                        <>
                          <button
                            onClick={() => {
                              startEdit(message);
                              setSelectedMessage(null);
                            }}
                            className="flex flex-col items-center p-2 hover:bg-gray-50 rounded"
                          >
                            <Edit2 className="h-5 w-5 text-gray-600" />
                            <span className="text-xs mt-1">Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              onDeleteMessage(message.id);
                              setSelectedMessage(null);
                            }}
                            className="flex flex-col items-center p-2 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-5 w-5 text-red-600" />
                            <span className="text-xs mt-1 text-red-600">Delete</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          togglePinMessage(message.id);
                          setSelectedMessage(null);
                        }}
                        className="flex flex-col items-center p-2 hover:bg-gray-50 rounded"
                      >
                        <Pin className="h-5 w-5 text-gray-600" />
                        <span className="text-xs mt-1">
                          {message.isPinned ? "Unpin" : "Pin"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-2 ml-2 flex-wrap">
                    {message.reactions.map((reaction, idx) => (
                      <button
                        key={idx}
                        onClick={() => addReaction(message.id, reaction.emoji)}
                        className={`px-2 py-0.5 md:px-2 md:py-1 bg-white border-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1 hover:scale-110 ${
                          reaction.users.includes(currentUser)
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        <span>{reaction.emoji}</span>
                        <span className="text-gray-600">{reaction.users.length}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="px-2 py-0.5 md:px-2 md:py-1 bg-white border-2 border-gray-200 rounded-full text-xs hover:border-indigo-400 transition-all hover:scale-110"
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
          <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm">
            <div className="flex gap-1">
              <Circle className="h-1.5 w-1.5 animate-bounce fill-current" />
              <Circle className="h-1.5 w-1.5 animate-bounce fill-current delay-100" />
              <Circle className="h-1.5 w-1.5 animate-bounce fill-current delay-200" />
            </div>
            <span>{isTyping.join(", ")} {isTyping.length === 1 ? 'is' : 'are'} typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply/Edit Banner */}
      {(replyingTo || editingMessage) && (
        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-indigo-900">
                {editingMessage ? "Editing message" : `Replying to ${replyingTo?.sender}`}
              </p>
              <p className="text-xs text-indigo-700 truncate">
                {editingMessage?.content || replyingTo?.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={() => {
                setReplyingTo(null);
                setEditingMessage(null);
                setMessageInput("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-3 md:p-4 border-t bg-gray-50">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 h-10 w-10"
            title="Attach file"
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
                  if (editingMessage) {
                    onEditMessage();
                  } else {
                    onSendMessage();
                  }
                }
              }}
              placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none max-h-32 text-sm"
              rows={1}
            />
          </div>

          <div className="relative" ref={emojiPickerRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex-shrink-0 h-10 w-10"
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </Button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border p-3 z-50"
              >
                <div className="grid grid-cols-5 gap-2">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setMessageInput(messageInput + emoji);
                        setShowEmojiPicker(false);
                        textareaRef.current?.focus();
                      }}
                      className="text-2xl hover:bg-gray-100 p-2 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <Button
            onClick={editingMessage ? onEditMessage : onSendMessage}
            disabled={!messageInput.trim()}
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 h-10 w-10"
            title={editingMessage ? "Save changes" : "Send message"}
          >
            {editingMessage ? (
              <Check className="h-5 w-5" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Typing hint */}
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </Card>
  );
}
