// PatientVideoCallWeb.jsx — Patient-side Agora video consultation
import React, { useState, useEffect, useRef, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Leaf,
  Clock,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { useParams } from "react-router-dom";
import VideoPip from "./VideoPip";

const API_BASE = process.env.REACT_APP_API_BASE;

function getAccessToken() {
  return (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzgxOTM2MTQ3LCJpYXQiOjE3ODE4NDk3NDcsImp0aSI6ImM3ZTM0YjVmNzIxYzRmODZiOTZjOGY0NDQ0YTZhZjI0IiwidXNlcl9pZCI6IjI4ZTQ4MTZjLTRiZjQtNDUwYS1iN2ZkLTkyZWUwOTc3MjU1YyIsInJvbGUiOiJjdXN0b21lciIsImN1c3RvbWVyX2lkIjoiNGI2NjA1ZDctY2EzZi00NDkzLTk5ZTMtYzdkYTNiNGMxMWI4IiwicGF0aWVudF9pZCI6ImRhMDEzZGYwLWM3MDAtNDE2MS1iNjNjLTBkOGVhOGEzZTM1YiIsInZlbmRvcl9pZCI6bnVsbCwiZG9jdG9yX2lkIjpudWxsfQ.xw023m_A4pmC-BzGX1xeYJ1C8ox3RIV8dzosU7pwV4o"
  );
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token || getAccessToken()}`,
    "ngrok-skip-browser-warning": "true",
  };
}

function apiErrorMessage(err, fallback) {
  return err.response?.data?.message || err.message || fallback;
}

const TEST_CONFIG = {
  enabled: false,
  appId: "",
  token: "",
  channel: "",
  uid: null,
};

async function fetchCallStatus(token, consultationId) {
  const response = await axios.get(
    `${API_BASE}/doctors/appointments/${consultationId}/call/status/`,
    { headers: authHeaders(token) }
  );
  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to get call status");
}

async function markEnded(token, consultationId) {
  const response = await axios.post(
    `${API_BASE}/doctors/appointments/${consultationId}/call/end/`,
    {},
    { headers: authHeaders(token) }
  );
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to end call");
  }
}

async function fetchAgoraTokenForPatient(token, consultationId) {
  if (TEST_CONFIG.enabled) {
    return {
      app_id: TEST_CONFIG.appId,
      token: TEST_CONFIG.token,
      channel: TEST_CONFIG.channel,
      uid: TEST_CONFIG.uid,
    };
  }

  const response = await axios.post(
    `${API_BASE}/doctors/appointments/${consultationId}/call/token/`,
    {},
    { headers: authHeaders(token) }
  );

  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to get token");
}

const ControlButton = ({ icon: Icon, active, onClick, variant = "default", label }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    aria-label={label}
    className={`flex flex-col items-center gap-1 min-w-[52px] sm:min-w-0 sm:flex-row sm:gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-xl font-medium transition-all ${variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
      : active
        ? "bg-white/15 hover:bg-white/25 text-white"
        : "bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
      }`}
  >
    <Icon size={20} className="sm:w-[18px] sm:h-[18px]" />
    <span className="text-[10px] sm:text-sm leading-none">{label}</span>
  </motion.button>
);

export default function PatientVideoCallWeb({ doctorName = "Doctor", onCallEnd }) {
  const { token, consultationId } = useParams();

  const [callState, setCallState] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [doctorJoined, setDoctorJoined] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localTracksRef = useRef({ audio: null, video: null });
  const timerRef = useRef(null);
  const isMutedRef = useRef(false);
  const isCameraOffRef = useRef(false);

  const playLocalVideo = useCallback(async () => {
    const { video } = localTracksRef.current;
    if (!video || !localVideoRef.current || isCameraOffRef.current) return;
    try {
      await video.play(localVideoRef.current);
    } catch (err) {
      console.warn("Local video play failed:", err);
    }
  }, []);

  const playRemoteVideo = useCallback((track) => {
    if (!track || !remoteVideoRef.current) return;
    try {
      track.play(remoteVideoRef.current);
    } catch (err) {
      console.warn("Remote video play failed:", err);
    }
  }, []);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isCameraOffRef.current = isCameraOff;
  }, [isCameraOff]);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        cam.getTracks().forEach((t) => t.stop());
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        mic.getTracks().forEach((t) => t.stop());
        setPermissionsGranted(true);
      } catch (err) {
        console.error("Permission error:", err);
        setError("Camera or microphone access is required. Please allow permissions and refresh.");
        setPermissionsGranted(false);
      } finally {
        setCheckingPermissions(false);
      }
    };
    checkPermissions();
  }, []);

  useEffect(() => {
    if (callState === "active") {
      playLocalVideo();
    }
  }, [callState, playLocalVideo]);

  const joinCall = useCallback(async () => {
    if (!permissionsGranted) {
      setError("Please allow camera and microphone access first");
      return;
    }

    setCallState("joining");
    setError(null);
    toast.loading("Connecting to consultation...", { id: "join" });

    try {
      if (!token) {
        throw new Error("Please log in again — session token not found");
      }

      if (!TEST_CONFIG.enabled) {
        const callStatus = await fetchCallStatus(token, consultationId);
        if (callStatus.call_status === "ended") {
          throw new Error("This video call has already ended.");
        }
        if (callStatus.call_status === "not_started") {
          throw new Error("Please wait for the doctor to start the consultation.");
        }
      }

      const tokenData = await fetchAgoraTokenForPatient(token, consultationId);

      if (!tokenData?.app_id || !tokenData?.channel || !tokenData?.token) {
        throw new Error("Invalid token data received");
      }

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          setDoctorJoined(true);
          toast.success("Doctor has joined the consultation", { id: "join" });
          setTimeout(() => playRemoteVideo(user.videoTrack), 100);
        }

        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video" && user.videoTrack) {
          user.videoTrack.stop();
        }
      });

      client.on("user-left", () => {
        setDoctorJoined(false);
        toast("Doctor left the consultation", { icon: "👨‍⚕️" });
      });

      client.on("connection-state-change", (curState) => {
        if (curState === "DISCONNECTED") {
          setError("Connection lost. Please refresh the page.");
        }
      });

      await client.join(
        tokenData.app_id,
        tokenData.channel,
        tokenData.token,
        Number(tokenData.uid)
      );

      // Separate tracks — avoids mobile browsers coupling mic mute with camera
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: "720p_1",
        facingMode: "user",
      });

      localTracksRef.current = { audio: audioTrack, video: videoTrack };
      isMutedRef.current = false;
      isCameraOffRef.current = false;
      setIsMuted(false);
      setIsCameraOff(false);

      await client.publish([audioTrack, videoTrack]);

      setCallState("active");
      toast.success("Connected successfully", { id: "join" });
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err) {
      console.error("Join error:", err);
      const message = apiErrorMessage(
        err,
        "Could not join. Check your camera/mic permissions or credentials."
      );
      setError(message);
      toast.error(message, { id: "join" });
      setCallState("idle");
    }
  }, [consultationId, permissionsGranted, playRemoteVideo]);

  const leaveCall = useCallback(async () => {
    clearInterval(timerRef.current);
    setShowLeaveConfirm(false);
    toast.loading("Ending consultation...", { id: "end" });

    const { audio, video } = localTracksRef.current;
    if (audio) {
      audio.stop();
      audio.close();
    }
    if (video) {
      video.stop();
      video.close();
    }
    if (clientRef.current) await clientRef.current.leave();

    try {
      await markEnded(token, consultationId);
    } catch (e) {
      console.error("markEnded:", e);
      toast.error(apiErrorMessage(e, "Failed to end call on server"));
    }

    setCallState("ended");
    toast.success("Consultation ended", { id: "end" });
    if (onCallEnd) onCallEnd();
  }, [consultationId, onCallEnd]);

  const toggleMic = useCallback(async () => {
    const { audio } = localTracksRef.current;
    if (!audio) return;

    const nextMuted = !isMutedRef.current;
    await audio.setEnabled(!nextMuted);
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    // Mobile browsers may pause the video preview when audio toggles — restore camera only
    if (!isCameraOffRef.current) {
      await playLocalVideo();
    }

    toast(nextMuted ? "Microphone muted" : "Microphone unmuted");
  }, [playLocalVideo]);

  const toggleCamera = useCallback(async () => {
    const { video } = localTracksRef.current;
    if (!video) return;

    const nextCameraOff = !isCameraOffRef.current;
    await video.setEnabled(!nextCameraOff);
    isCameraOffRef.current = nextCameraOff;
    setIsCameraOff(nextCameraOff);

    if (!nextCameraOff) {
      await playLocalVideo();
    }

    toast(nextCameraOff ? "Camera stopped" : "Camera started");
  }, [playLocalVideo]);

  const formatDuration = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      const { audio, video } = localTracksRef.current;
      if (audio) {
        audio.stop();
        audio.close();
      }
      if (video) {
        video.stop();
        video.close();
      }
      clientRef.current?.leave().catch(console.error);
    };
  }, []);

  if (checkingPermissions) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#0a2e26] via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 size={48} className="mx-auto text-emerald-400 animate-spin" />
          <p className="text-gray-400 text-sm sm:text-base">Checking camera and microphone...</p>
        </div>
      </div>
    );
  }

  if (callState === "ended") {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#0a2e26] via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-emerald-600 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Consultation Ended</h2>
          <p className="text-gray-500 mb-6">Duration: {formatDuration(duration)}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-3 bg-[#0D614E] text-white rounded-xl hover:bg-[#0a4d3e] transition-colors font-medium"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-br from-[#0a2e26] via-gray-900 to-gray-950 overflow-hidden flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="shrink-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4 safe-top"
      >
        <div className="bg-gradient-to-r from-[#0a4d3e]/95 to-[#0D614E]/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                <Leaf size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-white truncate">Video Consultation</h1>
                <p className="text-[10px] sm:text-xs text-emerald-100/80 flex items-center gap-1">
                  <Stethoscope size={10} />
                  Dr. {doctorName}
                </p>
              </div>
            </div>

            {callState === "active" && (
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg">
                  {isMuted ? (
                    <MicOff size={12} className="text-red-300" />
                  ) : (
                    <Mic size={12} className="text-emerald-300" />
                  )}
                  {isCameraOff ? (
                    <VideoOff size={12} className="text-red-300" />
                  ) : (
                    <Video size={12} className="text-emerald-300" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/25 rounded-lg">
                  <Clock size={12} className="text-emerald-200" />
                  <span className="text-white font-mono text-xs sm:text-sm tabular-nums">
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main video area */}
      <div className="flex-1 min-h-0 px-3 py-3 sm:px-4 sm:py-4 pb-28 sm:pb-32">
        <div className="relative w-full h-full !min-h-[86.5vh] sm:min-h-0 bg-black/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/5 ">
          <div
            ref={remoteVideoRef}
            className="absolute inset-0 [&_video]:object-cover [&_video]:w-full [&_video]:h-full"
          />

          {!doctorJoined && callState === "active" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/90 z-10 p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Users size={32} className="text-gray-400 sm:w-10 sm:h-10" />
              </div>
              <p className="text-white font-medium text-base sm:text-lg mb-1">Waiting for your doctor</p>
              <p className="text-gray-400 text-xs sm:text-sm max-w-xs">
                Dr. {doctorName} will join shortly. Please stay on this screen.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 text-xs">Connected — waiting room</span>
              </div>
            </div>
          )}
          {/* {console.log(callState)} */}
          {callState !== "active" && callState !== "joining" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/95 z-10 p-6 text-center">

              {callState === "idle" ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-[#0D614E]/20 flex items-center justify-center mb-4">
                    <Video size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-white font-medium text-base sm:text-lg mb-1">Ready to join</p>
                  <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-xs">
                    Your consultation with Dr. {doctorName} is ready. Tap below when you&apos;re set.
                  </p>
                  {permissionsGranted && (
                    <button
                      type="button"
                      onClick={joinCall}
                      className="px-8 py-3.5 bg-[#0D614E] text-white rounded-2xl font-semibold hover:bg-[#0a4d3e] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/40"
                    >
                      <Phone size={18} /> Join Consultation
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Loader2 size={40} className="text-emerald-400 animate-spin mb-3" />
                  <p className="text-gray-300 text-sm">Connecting...</p>
                </>
              )}
              {error && (
                <div className="mt-4 px-4 py-2.5 bg-red-500/15 border border-red-500/30 rounded-xl flex items-start gap-2 max-w-sm">
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 text-xs sm:text-sm text-left">{error}</p>
                </div>
              )}
            </div>
          )}

          {doctorJoined && callState === "active" && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-col gap-2">
              <div className="px-2.5 py-1.5 bg-emerald-500/90 backdrop-blur rounded-lg flex items-center gap-1.5 w-fit">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-white text-[10px] sm:text-xs font-medium">Doctor Connected</span>
              </div>
              <div className="px-2.5 py-1 bg-black/50 backdrop-blur rounded-lg w-fit">
                <span className="text-white text-xs sm:text-sm">Dr. {doctorName}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Local PiP — draggable, responsive */}
      {callState === "active" && (
        <VideoPip
          videoRef={localVideoRef}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          onDragEnd={() => { }}
        />
      )}

      {/* Bottom controls */}
      <AnimatePresence>
        {callState === "active" && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-6"
          >
            <div className="max-w-lg mx-auto bg-black/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl px-2 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                <ControlButton
                  icon={isMuted ? MicOff : Mic}
                  active={!isMuted}
                  onClick={toggleMic}
                  label={isMuted ? "Unmute" : "Mute"}
                />
                <ControlButton
                  icon={isCameraOff ? VideoOff : Video}
                  active={!isCameraOff}
                  onClick={toggleCamera}
                  label={isCameraOff ? "Camera" : "Video"}
                />
                <ControlButton
                  icon={PhoneOff}
                  onClick={() => setShowLeaveConfirm(true)}
                  variant="danger"
                  label="Leave"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave confirmation */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">End Consultation?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to leave? This will end your video consultation.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={leaveCall}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  Leave Call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
