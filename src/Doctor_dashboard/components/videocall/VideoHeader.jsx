// components/VideoHeader.jsx - Compact Version
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, User, Clock, Mic, MicOff, Video, VideoOff, Wifi, WifiOff, Activity } from 'lucide-react';

const VideoHeader = ({ 
  patientName, 
  duration, 
  isMuted, 
  isCameraOff,
  networkQuality,
  isRecording,
  recordingDuration 
}) => {
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getQualityIcon = () => {
    if (networkQuality >= 4) return <Wifi size={12} className="text-green-400" />;
    if (networkQuality >= 2) return <Activity size={12} className="text-yellow-400" />;
    return <WifiOff size={12} className="text-red-400" />;
  };

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-4 z-50 mx-4"
    >
      <div className="bg-gradient-to-r from-[#0a4d3e] to-[#0d614e] rounded-xl shadow-lg backdrop-blur-sm border border-white/10">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            
            {/* Brand - Compact */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-white">AyurMuni</h1>
                <p className="text-[10px] text-emerald-100">Telemedicine</p>
              </div>
            </div>

            {/* Patient & Duration - Compact */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg">
                <User size={12} className="text-emerald-200" />
                <span className="text-xs text-white font-medium max-w-[100px] truncate">
                  {patientName?.split(' ')[0] || "Patient"}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg">
                <Clock size={12} className="text-emerald-200" />
                <span className="text-xs text-white font-mono font-semibold">
                  {formatDuration(duration)}
                </span>
              </div>

              {/* Recording Badge */}
              {isRecording && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-red-400 font-mono">
                    {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Status Indicators - Compact */}
            <div className="flex items-center gap-1.5">
              {/* Network Quality */}
              <div className="px-1.5 py-1 bg-white/10 rounded-lg">
                {getQualityIcon()}
              </div>

              {/* Mic Status */}
              <div className={`px-1.5 py-1 rounded-lg ${isMuted ? 'bg-red-500/20' : 'bg-white/10'}`}>
                {isMuted ? <MicOff size={12} className="text-red-400" /> : <Mic size={12} className="text-emerald-400" />}
              </div>
              
              {/* Camera Status */}
              <div className={`px-1.5 py-1 rounded-lg ${isCameraOff ? 'bg-red-500/20' : 'bg-white/10'}`}>
                {isCameraOff ? <VideoOff size={12} className="text-red-400" /> : <Video size={12} className="text-emerald-400" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoHeader;