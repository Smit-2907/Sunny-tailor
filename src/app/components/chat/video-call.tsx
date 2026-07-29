import { useState, useRef, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  Maximize,
  Minimize,
  Users,
  Settings,
  MessageSquare,
  MoreVertical,
  Volume2,
  VolumeX,
  Camera,
  Grid3x3,
  User,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoCallProps {
  channel: {
    id: string;
    name: string;
    type: string;
    members: string[];
  };
  currentUser: string;
  onEndCall: () => void;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
}

export function VideoCall({ channel, currentUser, onEndCall }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "speaker">("speaker");
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor">("excellent");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock participants (in real app, these would come from WebRTC)
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      avatar: "RK",
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      isSpeaking: false,
    },
    {
      id: "2",
      name: "Priya Sharma",
      avatar: "PS",
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      isSpeaking: false,
    },
    {
      id: "3",
      name: "Amit Patel",
      avatar: "AP",
      isVideoOn: false,
      isAudioOn: true,
      isScreenSharing: false,
      isSpeaking: false,
    },
  ]);

  useEffect(() => {
    // Start video stream
    startVideo();

    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Simulate speaking detection
    const speakingInterval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: Math.random() > 0.7 && p.isAudioOn,
        }))
      );
    }, 1000);

    return () => {
      stopVideo();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      clearInterval(speakingInterval);
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera/microphone:", error);
      setIsVideoOn(false);
      setIsAudioOn(false);
    }
  };

  const stopVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenShareRef.current?.srcObject) {
        const stream = screenShareRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        screenShareRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
          },
          audio: false,
        });

        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
        }

        // Listen for user stopping share via browser UI
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const switchCamera = async () => {
    // In a real app, enumerate devices and switch
    alert("Camera switching - In a real app, this would switch between front/back cameras");
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    if (confirm("Are you sure you want to end the call?")) {
      stopVideo();
      onEndCall();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-gray-900 ${
        isFullScreen ? "" : "md:inset-4 md:rounded-2xl md:overflow-hidden"
      }`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg md:text-xl flex items-center gap-2">
              <Video className="h-5 w-5" />
              {channel.name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/80 text-sm">{formatDuration(callDuration)}</span>
              <span className="text-white/60 text-xs">•</span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionQuality === "excellent"
                      ? "bg-green-500"
                      : connectionQuality === "good"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-white/80 text-sm capitalize">
                  {connectionQuality}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowParticipants(!showParticipants)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-10 w-10"
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-10 w-10"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              onClick={toggleFullScreen}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-10 w-10 hidden md:flex"
            >
              {isFullScreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative h-full w-full">
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="h-full p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {/* Local User */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden min-h-[200px]">
              {isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-white font-semibold">{currentUser}</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="px-2 py-1 bg-black/60 rounded text-white text-xs font-semibold">
                  You {isAudioOn ? "" : "(Muted)"}
                </div>
                {!isAudioOn && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <MicOff className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Remote Participants */}
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`relative bg-gray-800 rounded-xl overflow-hidden min-h-[200px] ${
                  participant.isSpeaking ? "ring-4 ring-green-500" : ""
                }`}
              >
                {participant.isVideoOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <p className="text-white text-sm">[Video Stream - {participant.name}]</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {participant.avatar}
                        </span>
                      </div>
                      <p className="text-white font-semibold">{participant.name}</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="px-2 py-1 bg-black/60 rounded text-white text-xs font-semibold">
                    {participant.name}
                  </div>
                  {!participant.isAudioOn && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Speaker View */
          <div className="h-full flex flex-col p-4 md:p-6">
            {/* Main Speaker / Screen Share */}
            <div className="flex-1 bg-gray-800 rounded-xl overflow-hidden mb-4">
              {isScreenSharing ? (
                <video
                  ref={screenShareRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full">
                  {participants[0]?.isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <p className="text-white text-lg">
                        [Video Stream - {participants[0]?.name}]
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-5xl font-bold">
                            {participants[0]?.avatar}
                          </span>
                        </div>
                        <p className="text-white font-bold text-xl">
                          {participants[0]?.name}
                        </p>
                      </div>
                    </div>
                  )}
                  {participants[0]?.isSpeaking && (
                    <div className="absolute top-4 left-4 px-3 py-2 bg-green-500 rounded-lg text-white text-sm font-semibold flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Speaking
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {/* Local User Thumbnail */}
              <div className="flex-shrink-0 w-32 h-24 md:w-40 md:h-28 bg-gray-800 rounded-lg overflow-hidden relative">
                {isVideoOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
                    <span className="text-white font-bold text-xl">You</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 rounded text-white text-xs">
                  You
                </div>
              </div>

              {/* Remote Participant Thumbnails */}
              {participants.slice(1).map((participant) => (
                <div
                  key={participant.id}
                  className={`flex-shrink-0 w-32 h-24 md:w-40 md:h-28 bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-white ${
                    participant.isSpeaking ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  {participant.isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <span className="text-white text-xs">Video</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                      <span className="text-white font-bold">{participant.avatar}</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 rounded text-white text-xs">
                    {participant.name.split(" ")[0]}
                  </div>
                  {!participant.isAudioOn && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6">
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          {/* Microphone */}
          <Button
            onClick={toggleAudio}
            size="icon"
            className={`h-12 w-12 md:h-14 md:w-14 rounded-full ${
              isAudioOn
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isAudioOn ? (
              <Mic className="h-5 w-5 md:h-6 md:w-6 text-white" />
            ) : (
              <MicOff className="h-5 w-5 md:h-6 md:w-6 text-white" />
            )}
          </Button>

          {/* Camera */}
          <Button
            onClick={toggleVideo}
            size="icon"
            className={`h-12 w-12 md:h-14 md:w-14 rounded-full ${
              isVideoOn
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isVideoOn ? (
              <Video className="h-5 w-5 md:h-6 md:w-6 text-white" />
            ) : (
              <VideoOff className="h-5 w-5 md:h-6 md:w-6 text-white" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            onClick={toggleScreenShare}
            size="icon"
            className={`h-12 w-12 md:h-14 md:w-14 rounded-full ${
              isScreenSharing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isScreenSharing ? (
              <MonitorOff className="h-5 w-5 md:h-6 md:w-6 text-white" />
            ) : (
              <Monitor className="h-5 w-5 md:h-6 md:w-6 text-white" />
            )}
          </Button>

          {/* View Mode Toggle */}
          <Button
            onClick={() => setViewMode(viewMode === "grid" ? "speaker" : "grid")}
            size="icon"
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gray-700 hover:bg-gray-600 hidden md:flex"
          >
            <Grid3x3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </Button>

          {/* Switch Camera (Mobile) */}
          <Button
            onClick={switchCamera}
            size="icon"
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gray-700 hover:bg-gray-600 md:hidden"
          >
            <Camera className="h-5 w-5 text-white" />
          </Button>

          {/* End Call */}
          <Button
            onClick={handleEndCall}
            size="icon"
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-red-600 hover:bg-red-700 ml-2"
          >
            <PhoneOff className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-white/60 text-xs md:text-sm">
            {participants.length + 1} participants • End-to-end encrypted
          </p>
        </div>
      </div>

      {/* Participants Panel */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-lg border-l border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg">
                Participants ({participants.length + 1})
              </h3>
              <Button
                onClick={() => setShowParticipants(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {/* Current User */}
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">You</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{currentUser} (You)</p>
                  <p className="text-white/60 text-xs">Host</p>
                </div>
                {isAudioOn ? (
                  <Mic className="h-4 w-4 text-green-500" />
                ) : (
                  <MicOff className="h-4 w-4 text-red-500" />
                )}
              </div>

              {/* Other Participants */}
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {participant.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">
                      {participant.name}
                    </p>
                    {participant.isSpeaking && (
                      <p className="text-green-500 text-xs">Speaking...</p>
                    )}
                  </div>
                  {participant.isAudioOn ? (
                    <Mic className="h-4 w-4 text-green-500" />
                  ) : (
                    <MicOff className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
