import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Mic, Square, Play, Pause, Trash2, Send, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface VoiceRecorderProps {
  onSendVoice: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

export function VoiceRecorder({ onSendVoice, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [permission, setPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setPermission("granted"))
      .catch(() => setPermission("denied"));

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setPermission("denied");
      alert("Unable to access microphone. Please check your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSendVoice(audioBlob, duration);
      onCancel();
    }
  };

  const handleDelete = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setCurrentTime(0);
    audioChunksRef.current = [];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (permission === "denied") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700 font-semibold mb-2">Microphone Access Denied</p>
        <p className="text-xs text-red-600">
          Please enable microphone permissions in your browser settings to record voice messages.
        </p>
        <Button onClick={onCancel} variant="outline" size="sm" className="mt-3">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg">
      {!isRecording && !audioBlob && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Mic className="h-10 w-10 text-white" />
          </motion.div>
          <p className="text-sm font-semibold text-gray-700 mb-4">Ready to Record</p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={startRecording}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <Mic className="h-10 w-10 text-white" />
          </motion.div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {isPaused ? "Recording Paused" : "Recording..."}
            </p>
            <p className="text-2xl font-bold text-indigo-600">{formatTime(duration)}</p>
          </div>

          {/* Animated Waveform */}
          <div className="flex gap-1 justify-center mb-4 h-12 items-end">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-indigo-500 rounded-full"
                animate={{
                  height: isPaused ? "10%" : ["10%", "100%", "10%"],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            {!isPaused ? (
              <Button onClick={pauseRecording} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button onClick={resumeRecording} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </div>
      )}

      {audioBlob && audioUrl && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <Play className="h-10 w-10 text-white" />
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={(e) => {
              if (duration === 0) {
                setDuration(Math.floor(e.currentTarget.duration));
              }
            }}
          />

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Voice Message Ready</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-sm text-gray-600">{formatTime(Math.floor(currentTime))}</span>
              <div className="flex-1 max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            {!isPlaying ? (
              <Button onClick={playAudio} variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
            ) : (
              <Button onClick={pauseAudio} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleDelete} variant="outline" className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
