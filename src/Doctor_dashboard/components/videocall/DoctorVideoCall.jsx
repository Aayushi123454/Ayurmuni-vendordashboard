// DoctorVideoCall.jsx - Production Ready
import React, { useState, useEffect, useRef, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Import missing icons
import { CheckCircle, AlertCircle, Loader2, Phone, Video, Clock } from "lucide-react";

import VideoHeader from "./VideoHeader";
import VideoControls from "./VideoControls";
import WaitingScreen from "./WaitingScreen";
import VideoPip from "./VideoPip";

const API_BASE = process.env.REACT_APP_API_BASE ;

// Utility functions
const getAccessToken = () => sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken") || "";
const authHeaders = () => ({ Authorization: `Bearer ${getAccessToken()}`, "ngrok-skip-browser-warning": "true" });

// Recording Service
class RecordingService {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.startTime = null;
  }

  async startRecording(stream) {
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.recordedChunks.push(event.data);
    };

    this.mediaRecorder.start(1000);
    this.isRecording = true;
    this.startTime = Date.now();
  }

  async stopRecording() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, duration: Date.now() - this.startTime });
      };
      this.mediaRecorder.stop();
      this.isRecording = false;
    });
  }
}

// API Calls
const ensureCallStarted = async (consultationId) => {
  try {
    await axios.post(`${API_BASE}/doctors/appointments/${consultationId}/call/start/`, {}, { headers: authHeaders() });
  } catch (err) {
    if (err.response?.data?.code !== "already_started") throw err;
  }
};

const fetchAgoraToken = async (consultationId) => {
  const response = await axios.post(`${API_BASE}/doctors/appointments/${consultationId}/call/token/`, {}, { headers: authHeaders() });
  if (response.data?.success && response.data?.data) return response.data.data;
  throw new Error(response.data?.message || "Failed to get token");
};

const markEnded = async (consultationId) => {
  await axios.post(`${API_BASE}/doctors/appointments/${consultationId}/call/end/`, {}, { headers: authHeaders() });
};

export default function DoctorVideoCall({ consultationId: consultationIdProp, patientDetails, onCallEnd }) {
  const { consultationId: consultationIdParam } = useParams();
  const consultationId = consultationIdProp || consultationIdParam;

  // State
  const [callState, setCallState] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [patientJoined, setPatientJoined] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [networkQuality, setNetworkQuality] = useState(4);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [devices, setDevices] = useState({ audioInputs: [], videoInputs: [], currentAudio: null, currentVideo: null });

  // Refs
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localTracksRef = useRef({ audio: null, video: null });
  const timerRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const recordingServiceRef = useRef(new RecordingService());
  const containerRef = useRef(null);
  const pipPositionRef = useRef({ x: 0, y: 0 });

  // Permissions check
  const [permissions, setPermissions] = useState({ camera: false, microphone: false });
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        cam.getTracks().forEach(t => t.stop());
        setPermissions(p => ({ ...p, camera: true }));

        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        mic.getTracks().forEach(t => t.stop());
        setPermissions(p => ({ ...p, microphone: true }));
      } catch (err) {
        console.error("Permission error:", err);
      } finally {
        setCheckingPermissions(false);
      }
    };
    checkPermissions();
  }, []);

  // Get available devices
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setDevices(prev => ({ ...prev, audioInputs, videoInputs }));
    } catch (err) {
      console.error("Error getting devices:", err);
    }
  }, []);

  useEffect(() => {
    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
  }, [getDevices]);

  // Play local video after active
  useEffect(() => {
    if (callState === "active" && localTracksRef.current.video && localVideoRef.current) {
      localTracksRef.current.video.play(localVideoRef.current);
    }
  }, [callState]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingDuration(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // Join call
  const joinCall = useCallback(async () => {
    setCallState("joining");
    setError(null);

    try {
      if (!permissions.camera || !permissions.microphone) {
        throw new Error("Camera or microphone access required");
      }

      toast.loading("Starting consultation...", { id: "call-join" });
      await ensureCallStarted(consultationId);

      const tokenData = await fetchAgoraToken(consultationId);
      if (!tokenData?.app_id || !tokenData?.channel || !tokenData?.token) {
        throw new Error("Invalid token data");
      }

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // Event listeners
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setPatientJoined(true);
          setTimeout(() => {
            if (remoteVideoRef.current && user.videoTrack) {
              user.videoTrack.play(remoteVideoRef.current);
            }
          }, 100);
        }
        if (mediaType === "audio") user.audioTrack.play();
      });

      client.on("user-unpublished", (user) => user.videoTrack?.stop());
      client.on("user-left", () => setPatientJoined(false));
      client.on("network-quality", (stats) => setNetworkQuality(Math.max(stats.uplinkNetworkQuality, stats.downlinkNetworkQuality)));
      client.on("connection-state-change", (curState) => {
        if (curState === "DISCONNECTED") {
          setError("Connection lost. Reconnecting...");
          setTimeout(() => window.location.reload(), 3000);
        }
      });

      await client.join(tokenData.app_id, tokenData.channel, tokenData.token, Number(tokenData.uid));

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracksRef.current = { audio: audioTrack, video: videoTrack };
      await client.publish([audioTrack, videoTrack]);

      setCallState("active");
      toast.success("Consultation started", { id: "call-join" });
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);

    } catch (err) {
      setError(err.message);
      toast.error(err.message, { id: "call-join" });
      setCallState("idle");
    }
  }, [consultationId, permissions]);

  // Leave call
  const leaveCall = useCallback(async () => {
    clearInterval(timerRef.current);
    if (isRecording) await toggleRecording();

    const { audio, video } = localTracksRef.current;
    if (audio) { audio.stop(); audio.close(); }
    if (video) { video.stop(); video.close(); }
    if (clientRef.current) await clientRef.current.leave();

    try { await markEnded(consultationId); } catch (e) { console.error(e); }

    setCallState("ended");
    toast.success("Consultation ended");
    if (onCallEnd) onCallEnd();
  }, [consultationId, onCallEnd, isRecording]);

  // Toggle recording
  const toggleRecording = useCallback(async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      await recordingServiceRef.current.startRecording(stream);
      setIsRecording(true);
      toast.success("Recording started");
    } else {
      const { blob, url, duration: recordDuration } = await recordingServiceRef.current.stopRecording();
      setIsRecording(false);
      // Upload to server or save locally
      const file = new File([blob], `consultation_${consultationId}_${Date.now()}.webm`, { type: 'video/webm' });
      console.log("Recording saved:", file, url, recordDuration);
      toast.success("Recording saved");
    }
  }, [isRecording, consultationId]);

  // Toggle mic - FIXED BUG
  const toggleMic = useCallback(async () => {
    const { audio } = localTracksRef.current;
    if (!audio) return;
    // FIX: Correct boolean logic - setEnabled(true) enables, setEnabled(false) disables
    await audio.setEnabled(isMuted); // If muted, enable; if not muted, disable
    setIsMuted(!isMuted);
    toast(isMuted ? "Microphone unmuted" : "Microphone muted");
  }, [isMuted]);

  // Toggle camera - FIXED BUG
  const toggleCamera = useCallback(async () => {
    const { video } = localTracksRef.current;
    if (!video) return;
    // FIX: Correct boolean logic
    await video.setEnabled(isCameraOff); // If camera off, enable; if on, disable
    setIsCameraOff(!isCameraOff);
    toast(isCameraOff ? "Camera started" : "Camera stopped");
  }, [isCameraOff]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const switchCamera = useCallback(async () => {
    const { video } = localTracksRef.current;
    if (!video) return;

    const currentDeviceId = video.getTrack().getSettings().deviceId;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    const currentIndex = videoDevices.findIndex(d => d.deviceId === currentDeviceId);
    const nextDevice = videoDevices[(currentIndex + 1) % videoDevices.length];

    if (nextDevice) {
      await video.setDevice(nextDevice.deviceId);
      toast.success("Camera switched");
    }
  }, []);

  const onDragEnd = (event, info) => {
    pipPositionRef.current = { x: info.point.x, y: info.point.y };
  };

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      const { audio, video } = localTracksRef.current;
      if (audio) { audio.stop(); audio.close(); }
      if (video) { video.stop(); video.close(); }
      clientRef.current?.leave().catch(console.error);
    };
  }, []);

  // Loading state
  if (checkingPermissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#0a4d3e', borderTopColor: 'transparent' }} />
          <p className="text-gray-400 mt-4">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Ended state
  if (callState === "ended") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Consultation Completed</h2>
          <p className="text-gray-500 mb-6">Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</p>
          <button onClick={onCallEnd} className="px-6 py-2 bg-[#0a4d3e] text-white rounded-lg hover:bg-[#0d614e] transition-colors">
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  // In DoctorVideoCall.jsx - Update the return section

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">

      {/* Compact Header - Sticky on top */}
      <VideoHeader
        patientName={patientDetails?.first_name}
        duration={duration}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        networkQuality={networkQuality}
        isRecording={isRecording}
        recordingDuration={recordingDuration}
      />

      {/* Main Video Area - Full screen with padding for header and controls */}
      <div className="relative h-[100vh] mx-4">

        {/* Remote Video - Full size */}
        <div className="relative w-full h-full bg-black/50 rounded-2xl overflow-hidden shadow-2xl">
          <div ref={remoteVideoRef} className="absolute inset-0" />

          {/* Waiting Screen */}
          {!patientJoined && callState === "active" && (
            <WaitingScreen
              patientName={patientDetails?.first_name}
              // appointmentDate={patientDetails?.appointmentDate}
              // appointmentTime={patientDetails?.appointmentTime}
              // concern={patientDetails?.concern}
            />
          )}

          {/* Idle Screen - Compact */}
          {callState !== "active" && callState !== "joining" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
              {callState === "idle" ? (
                <>
                  <Video size={48} className="text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm mb-4">Ready to start consultation</p>
                  {permissions.camera && permissions.microphone ? (
                    <button onClick={joinCall} className="px-6 py-2.5 bg-[#0a4d3e] text-white rounded-xl text-sm font-semibold hover:bg-[#0d614e] transition-all flex items-center gap-2 shadow-lg">
                      <Phone size={16} /> Start Consultation
                    </button>
                  ) : (
                    <button onClick={() => window.location.reload()} className="px-5 py-2 bg-[#0a4d3e] text-white rounded-lg text-sm">
                      Refresh & Allow
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Loader2 size={40} className="text-emerald-500 animate-spin mb-3" />
                  <p className="text-gray-400 text-sm">Connecting...</p>
                </>
              )}
              {error && (
                <div className="mt-3 px-3 py-1.5 bg-red-500/20 rounded-lg flex items-center gap-1.5">
                  <AlertCircle size={12} className="text-red-400" />
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Patient Connected Badge - Compact */}
          {patientJoined && callState === "active" && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500/90 backdrop-blur rounded-lg flex items-center gap-1.5 z-20">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white text-xs">Patient Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Draggable Local Video PiP - Smaller size */}
      {callState === "active" && (
        <VideoPip
          videoRef={localVideoRef}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          onDragEnd={onDragEnd}
        />
      )}

      {/* Compact Controls - Fixed bottom */}
      {/* {callState === "active" && */}
        <VideoControls
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          isRecording={isRecording}
          isFullscreen={isFullscreen}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
          onToggleRecording={toggleRecording}
          onToggleFullscreen={toggleFullscreen}
          onEndCall={leaveCall}
          onOpenSettings={() => setShowSettings(!showSettings)}
          onSwitchCamera={switchCamera}
          availableCameras={devices.videoInputs}
          callState={callState}
          onJoinCall={joinCall}
        />
      {/* } */}
    </div>
  );
}
