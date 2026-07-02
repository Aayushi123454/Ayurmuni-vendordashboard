/**
 * Appointment video-call API client for the AyurMuni backend.
 *
 * **Production use in this repo:** Doctor Dashboard (`DoctorVideoCall.jsx`).
 * The patient app is a separate repository; copy or share this module when
 * implementing the same flow there. See `Doctor_dashboard/components/videocall/README.md`.
 */
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE;

const tokenCacheByAppointment = new Map();
const joinedAttemptStartByAppointment = new Map();

function resolveAccessToken(accessToken) {
  return (
    accessToken ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken") ||
    ""
  );
}

function authHeaders(accessToken) {
  return {
    Authorization: `Bearer ${resolveAccessToken(accessToken)}`,
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  };
}

function callUrl(appointmentId, suffix) {
  return `${BASE_URL}/doctors/appointments/${appointmentId}/call/${suffix}`;
}

function unwrapData(response) {
  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Request failed");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableJoinedError(error) {
  if (!error.response) return true;
  return error.response.status >= 500;
}

function shouldStopJoinedRetry(status, appointmentId) {
  const sync = status?.presence_sync;
  if (!sync) {
    return status?.call_status !== "in_progress";
  }
  if (!sync.should_report_joined) return true;
  if (!sync.can_report_presence) return true;
  if (sync.slot_ends_at && Date.now() >= new Date(sync.slot_ends_at).getTime()) {
    return true;
  }

  const maxRetrySeconds = sync.joined_event_max_retry_seconds ?? 180;
  const startedAt = joinedAttemptStartByAppointment.get(appointmentId);
  if (
    startedAt &&
    maxRetrySeconds > 0 &&
    (Date.now() - startedAt) / 1000 >= maxRetrySeconds
  ) {
    return true;
  }

  return false;
}

export async function fetchCallStatus(appointmentId, accessToken) {
  const response = await axios.get(callUrl(appointmentId, "status/"), {
    headers: authHeaders(accessToken),
  });
  return unwrapData(response);
}

export async function startCall(appointmentId, accessToken) {
  try {
    const response = await axios.post(
      callUrl(appointmentId, "start/"),
      {},
      { headers: authHeaders(accessToken) }
    );
    return unwrapData(response);
  } catch (error) {
    if (error.response?.data?.code === "already_started") {
      return (
        error.response.data?.data || {
          call_status: "in_progress",
        }
      );
    }
    throw error;
  }
}

export function clearCachedAgoraToken(appointmentId) {
  tokenCacheByAppointment.delete(appointmentId);
}

export function getCachedAgoraToken(appointmentId) {
  const cached = tokenCacheByAppointment.get(appointmentId);
  if (!cached) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (cached.expires_at && cached.expires_at - 60 <= nowSec) {
    return null;
  }

  return cached;
}

export async function fetchAgoraToken(
  appointmentId,
  accessToken,
  { forceRefresh = false } = {}
) {
  if (!forceRefresh) {
    const cached = getCachedAgoraToken(appointmentId);
    if (cached) return cached;
  }

  const response = await axios.post(
    callUrl(appointmentId, "token/"),
    {},
    { headers: authHeaders(accessToken) }
  );
  const data = unwrapData(response);
  tokenCacheByAppointment.set(appointmentId, data);
  return data;
}

export async function endCall(appointmentId, accessToken) {
  const response = await axios.post(
    callUrl(appointmentId, "end/"),
    {},
    { headers: authHeaders(accessToken) }
  );

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Failed to end call");
  }

  clearCachedAgoraToken(appointmentId);
  joinedAttemptStartByAppointment.delete(appointmentId);
  return response.data.data;
}

export async function reportJoinedEvent(appointmentId, accessToken) {
  if (!joinedAttemptStartByAppointment.has(appointmentId)) {
    joinedAttemptStartByAppointment.set(appointmentId, Date.now());
  }

  let delayMs = 1000;
  const maxDelayMs = 30000;

  while (true) {
    let status;
    try {
      status = await fetchCallStatus(appointmentId, accessToken);
      if (shouldStopJoinedRetry(status, appointmentId)) {
        joinedAttemptStartByAppointment.delete(appointmentId);
        return { stopped: true, status };
      }
    } catch {
      // Keep retrying joined delivery on transient status failures.
    }

    try {
      const response = await axios.post(
        callUrl(appointmentId, "events/"),
        { event_type: "joined" },
        { headers: authHeaders(accessToken) }
      );

      if (response.data?.success) {
        joinedAttemptStartByAppointment.delete(appointmentId);
        return response.data.data;
      }

      throw new Error(response.data?.message || "Failed to report joined");
    } catch (error) {
      if (!isRetryableJoinedError(error)) {
        joinedAttemptStartByAppointment.delete(appointmentId);
        throw error;
      }

      await sleep(delayMs);
      delayMs = Math.min(delayMs * 2, maxDelayMs);
    }
  }
}

export async function joinAgoraChannel(client, tokenData, { forceRefreshToken, appointmentId, accessToken }) {
  const attemptJoin = async (credentials) => {
    await client.join(
      credentials.app_id,
      credentials.channel,
      credentials.token,
      Number(credentials.uid)
    );
  };

  try {
    await attemptJoin(tokenData);
    return tokenData;
  } catch (joinError) {
    if (!forceRefreshToken) {
      const refreshed = await fetchAgoraToken(appointmentId, accessToken, {
        forceRefresh: true,
      });
      await attemptJoin(refreshed);
      return refreshed;
    }
    throw joinError;
  }
}

export function apiErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}
