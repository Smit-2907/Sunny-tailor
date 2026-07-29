import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Play, Pause, Download, Mic } from "lucide-react";
import { motion } from "motion/react";

interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration: number;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

export function VoiceMessagePlayer({
  audioUrl,
  duration,
  sender,
  timestamp,
  isOwn,
}: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = e.currentTarget;
    if (audio && progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice-message-${timestamp.getTime()}.webm`;
    a.click();
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`relative p-3 rounded-xl ${
        isOwn
          ? "bg-indigo-600/20 border border-indigo-400/30"
          : "bg-gray-100 border border-gray-200"
      }`}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          size="icon"
          className={`h-10 w-10 rounded-full flex-shrink-0 ${
            isOwn
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white ml-0.5" />
          )}
        </Button>

        {/* Waveform / Progress */}
        <div className="flex-1 min-w-0">
          {/* Animated Waveform when playing */}
          <div
            onClick={handleSeek}
            className="cursor-pointer h-8 flex items-end gap-0.5 mb-1"
          >
            {[...Array(30)].map((_, i) => {
              const barProgress = (i / 30) * 100;
              const isPassed = barProgress <= progress;
              return (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${
                    isPassed
                      ? isOwn
                        ? "bg-indigo-600"
                        : "bg-indigo-500"
                      : isOwn
                      ? "bg-indigo-300"
                      : "bg-gray-300"
                  }`}
                  animate={{
                    height: isPlaying ? ["30%", "100%", "30%"] : "40%",
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.03,
                  }}
                  style={{
                    height: !isPlaying
                      ? `${30 + Math.sin(i * 0.5) * 30}%`
                      : undefined,
                  }}
                />
              );
            })}
          </div>

          {/* Time Display */}
          <div className="flex items-center justify-between text-xs">
            <span className={isOwn ? "text-indigo-700" : "text-gray-600"}>
              {formatTime(currentTime)}
            </span>
            <span className={isOwn ? "text-indigo-600" : "text-gray-500"}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Playback Speed */}
        <Button
          onClick={cyclePlaybackRate}
          size="sm"
          variant="ghost"
          className={`h-8 px-2 text-xs font-semibold flex-shrink-0 ${
            isOwn
              ? "text-indigo-700 hover:bg-indigo-700/20"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {playbackRate}x
        </Button>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          size="icon"
          variant="ghost"
          className={`h-8 w-8 flex-shrink-0 ${
            isOwn
              ? "text-indigo-700 hover:bg-indigo-700/20"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Voice Message Icon */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
        <Mic className="h-3 w-3 text-white" />
      </div>
    </div>
  );
}
