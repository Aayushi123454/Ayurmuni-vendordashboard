// PatientVideoCall.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import toast from "react-hot-toast";
// Import missing icons for patient component
import { CheckCircle, AlertCircle, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Users, Leaf } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE || "https://aghast-cognition-earflap.ngrok-free.dev";

function getAccessToken() {
  return (
    // sessionStorage.getItem("accessToken") ||
    // localStorage.getItem("accessToken") ||
    // sessionStorage.getItem("access") ||
    // localStorage.getItem("access") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzgxNTg1ODUyLCJpYXQiOjE3ODE0OTk0NTIsImp0aSI6IjkzNmM4NzI3YmY1MDQ1MWY5ZjE2OGJhZjI2NmYzNDY0IiwidXNlcl9pZCI6IjI4ZTQ4MTZjLTRiZjQtNDUwYS1iN2ZkLTkyZWUwOTc3MjU1YyIsInJvbGUiOiJjdXN0b21lciIsImN1c3RvbWVyX2lkIjoiNGI2NjA1ZDctY2EzZi00NDkzLTk5ZTMtYzdkYTNiNGMxMWI4IiwicGF0aWVudF9pZCI6ImRhMDEzZGYwLWM3MDAtNDE2MS1iNjNjLTBkOGVhOGEzZTM1YiIsInZlbmRvcl9pZCI6bnVsbCwiZG9jdG9yX2lkIjpudWxsfQ.JZR8X6NdQFsGvSSm-JUtAXEAGVdDWKNznCzxsI4rx98"
  );
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getAccessToken()}`,
    "ngrok-skip-browser-warning": "true",
  };
}

function apiErrorMessage(err, fallback) {
  return err.response?.data?.message || err.message || fallback;
}

// IMPORTANT: Set TEST_CONFIG.enabled = false to use real API
// Set to true only for testing without backend
const TEST_CONFIG = {
  enabled: false,  // ← CHANGE TO false for real API calls
  appId: "",
  token: "",
  channel: "",
  uid: null,
};

async function fetchCallStatus(consultationId) {
  const response = await axios.get(
    `${API_BASE}/doctors/appointments/${consultationId}/call/status/`,
    { headers: authHeaders() }
  );
  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to get call status");
}

async function markEnded(consultationId) {
  const response = await axios.post(
    `${API_BASE}/doctors/appointments/${consultationId}/call/end/`,
    {},
    { headers: authHeaders() }
  );
  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to end call");
  }
}

async function fetchAgoraTokenForPatient(consultationId) {
  // If test mode is enabled, use test config
  if (TEST_CONFIG.enabled) {
    return {
      app_id: TEST_CONFIG.appId,
      token: TEST_CONFIG.token,
      channel: TEST_CONFIG.channel,
      uid: TEST_CONFIG.uid,
    };
  }

  // Real API call - different endpoint for patient
  const response = await axios.post(
    `${API_BASE}/doctors/appointments/${consultationId}/call/token/`,
    {},
    { headers: authHeaders() }
  );

  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to get token");
}

export default function PatientVideoCallWeb({
  consultationId = "4f34a05b-a4d1-4dec-acbe-46093c7c943d",
  doctorName = "Doctor",
  onCallEnd,
}) {
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

  // ── Permissions check ─────────────────────────────────────
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        cam.getTracks().forEach(t => t.stop());
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        mic.getTracks().forEach(t => t.stop());
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

  // Play local video after callState becomes "active"
  useEffect(() => {
    if (callState === "active" && localTracksRef.current.video && localVideoRef.current) {
      localTracksRef.current.video.play(localVideoRef.current);
    }
  }, [callState]);

  // ── Join ──────────────────────────────────────────────────
  const joinCall = useCallback(async () => {
    if (!permissionsGranted) {
      setError("Please allow camera and microphone access first");
      return;
    }

    setCallState("joining");
    setError(null);
    toast.loading("Connecting to consultation...", { id: "join" });

    try {
      if (!getAccessToken()) {
        throw new Error("Please log in again — session token not found");
      }

      if (!TEST_CONFIG.enabled) {
        const callStatus = await fetchCallStatus(consultationId);
        if (callStatus.call_status === "ended") {
          throw new Error("This video call has already ended.");
        }
        if (callStatus.call_status === "not_started") {
          throw new Error("Please wait for the doctor to start the consultation.");
        }
      }

      // Fetch token for patient
      const tokenData = await fetchAgoraTokenForPatient(consultationId);

      if (!tokenData?.app_id || !tokenData?.channel || !tokenData?.token) {
        throw new Error("Invalid token data received");
      }

      console.log("Patient joining:", {
        app_id: tokenData.app_id,
        channel: tokenData.channel,
        uid: tokenData.uid
      });

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (user, mediaType) => {
        console.log("User published:", user.uid, mediaType);
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          setDoctorJoined(true);
          toast.success("Doctor has joined the consultation", { id: "join" });

          setTimeout(() => {
            if (remoteVideoRef.current && user.videoTrack) {
              user.videoTrack.play(remoteVideoRef.current);
            }
          }, 100);
        }

        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user) => {
        if (user.videoTrack) user.videoTrack.stop();
      });

      client.on("user-left", () => {
        setDoctorJoined(false);
        toast("Doctor left the consultation", { icon: "👨‍⚕️" });
      });

      client.on("connection-state-change", (curState) => {
        console.log("Connection state:", curState);
        if (curState === "DISCONNECTED") {
          setError("Connection lost. Please refresh the page.");
        }
      });

      // Join the channel
      await client.join(
        tokenData.app_id,
        tokenData.channel,
        tokenData.token,
        Number(tokenData.uid)
      );

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracksRef.current = { audio: audioTrack, video: videoTrack };

      await client.publish([audioTrack, videoTrack]);

      setCallState("active");
      toast.success("Connected successfully", { id: "join" });
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);

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
  }, [consultationId, permissionsGranted]);

  // ── Leave ─────────────────────────────────────────────────
  const leaveCall = useCallback(async () => {
    clearInterval(timerRef.current);
    setShowLeaveConfirm(false);
    toast.loading("Ending consultation...", { id: "end" });

    const { audio, video } = localTracksRef.current;
    if (audio) { audio.stop(); audio.close(); }
    if (video) { video.stop(); video.close(); }
    if (clientRef.current) await clientRef.current.leave();

    try {
      await markEnded(consultationId);
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
    await audio.setEnabled(isMuted);
    setIsMuted(m => !m);
    toast(isMuted ? "Microphone unmuted" : "Microphone muted");
  }, [isMuted]);

  const toggleCamera = useCallback(async () => {
    const { video } = localTracksRef.current;
    if (!video) return;
    await video.setEnabled(isCameraOff);
    setIsCameraOff(c => !c);
    toast(isCameraOff ? "Camera started" : "Camera stopped");
  }, [isCameraOff]);

  const formatDuration = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      const { audio, video } = localTracksRef.current;
      if (audio) { audio.stop(); audio.close(); }
      if (video) { video.stop(); video.close(); }
      clientRef.current?.leave().catch(console.error);
    };
  }, []);

  // ── Screens ───────────────────────────────────────────────
  if (checkingPermissions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#0D614E", borderTopColor: "transparent" }} />
          <p className="text-gray-400">Checking camera and microphone permissions...</p>
        </div>
      </div>
    );
  }

  if (callState === "ended") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Consultation Ended</h2>
          <p className="text-gray-500 mb-4">Duration: {formatDuration(duration)}</p>
          <button onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-[#0a4d3e] transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0D614E] rounded-xl flex items-center justify-center">
                <Leaf size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Video Consultation</h1>
                <p className="text-sm text-gray-300">Patient View</p>
              </div>
            </div>
            {callState === "active" && (
              <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                <span className="text-white font-mono text-sm">{formatDuration(duration)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Video area */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {/* Remote video slot */}
          <div ref={remoteVideoRef} className="absolute inset-0 bg-gray-900" />

          {/* Waiting overlay */}
          {!doctorJoined && callState === "active" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Users size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">Waiting for doctor to join...</p>
            </div>
          )}

          {/* Idle state overlay */}
          {callState !== "active" && callState !== "joining" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
              <Video size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                {callState === "idle" ? "Ready to join consultation" : "Connecting..."}
              </p>
              {callState === "idle" && permissionsGranted && (
                <button onClick={joinCall}
                  className="px-8 py-3 bg-[#0D614E] text-white rounded-xl font-semibold hover:bg-[#0a4d3e] transition-all flex items-center gap-2">
                  <Phone size={18} /> Join Consultation
                </button>
              )}
              {error && (
                <div className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Doctor name tag */}
          {doctorJoined && (
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur rounded-lg z-20">
              <span className="text-white text-sm">Dr. {doctorName}</span>
            </div>
          )}

          {/* Local video PiP */}
          <div
            className="absolute bottom-4 right-4 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 bg-gray-800 z-20"
            style={{ width: 192, display: callState === "active" ? "block" : "none" }}
          >
            <div ref={localVideoRef} className="w-full aspect-video bg-gray-800" />
            {isCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff size={24} className="text-gray-500" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-xs text-white">
              You {isMuted && "(Muted)"}
            </div>
          </div>

          {/* Doctor connected badge */}
          {doctorJoined && callState === "active" && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-500/90 backdrop-blur rounded-lg flex items-center gap-2 z-20">
              <CheckCircle size={14} className="text-white" />
              <span className="text-white text-sm">Doctor Connected</span>
            </div>
          )}
        </div>

        {/* Controls */}
        {callState === "active" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mt-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={toggleMic}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${isMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <button onClick={toggleCamera}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${isCameraOff ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                {isCameraOff ? "Start Camera" : "Stop Camera"}
              </button>

              <button onClick={() => setShowLeaveConfirm(true)}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all flex items-center gap-2">
                <PhoneOff size={18} /> Leave Consultation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leave confirm dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-2">End Consultation?</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to leave the consultation?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button onClick={leaveCall}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Leave Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

