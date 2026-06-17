// AyurMuni — Quick Test Page
// Drop this into your React app to test the patient video call immediately
// Usage: visit /test-video in your app

import React from "react";
import PatientVideoCallWeb from "./PatientVideoCallWeb";

export default function TestVideoPage() {
  return (
    <PatientVideoCallWeb
      consultationId="test-123"   // ignored when TEST_CONFIG.enabled = true
      authToken=""                // ignored when TEST_CONFIG.enabled = true
      doctorName="Priya Singh"
      onCallEnd={() => console.log("Call ended")}
    />
  );
}

/*
  ─── HOW TO RUN A QUICK TEST ──────────────────────────────────

  1. Open PatientVideoCallWeb.jsx

  2. Set TEST_CONFIG at the top:
       const TEST_CONFIG = {
         enabled: true,
         appId: "YOUR_AGORA_APP_ID",   ← from console.agora.io
         token: null,                   ← null works if Auth is disabled in Agora Console
         channel: "test-consult-1",
         uid: 2000,
       };

  3. Open DoctorVideoCall.jsx and set TEST_CONFIG too:
       const TEST_CONFIG = {
         enabled: true,
         appId: "YOUR_AGORA_APP_ID",   ← same App ID
         token: null,
         channel: "test-consult-1",    ← same channel!
         uid: 1000,                    ← different UID from patient
       };

  4. Open two browser tabs:
       Tab 1 → /test-video   (patient)
       Tab 2 → your doctor dashboard

  5. Click "Join Consultation" on both — they'll connect!

  ─── AGORA CONSOLE SETUP ─────────────────────────────────────

  For testing without token auth:
  1. Go to https://console.agora.io
  2. Your project → Edit → Authentication Mechanism
  3. Set to "Testing Mode" (no token required)
  4. Use token: null in TEST_CONFIG

  For production, switch back to "Secure Mode" and generate tokens
  via your Django backend.
*/
