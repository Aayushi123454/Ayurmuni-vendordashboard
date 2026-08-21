/**
 * Appointment video-call API client for the AyurMuni backend.
 *
 * **Production use in this repo:** Doctor Dashboard (`DoctorVideoCall.jsx`).
 * All call HTTP traffic goes through the shared `API` instance (`REACT_APP_API_BASE`,
 * auth interceptors). Agora credentials come from POST /call/token/ at runtime.
 *
 * See `Doctor_dashboard/components/videocall/README.md`.
 */
import axios from "axios";
import API from "./api";

const tokenCacheByAppointment = new Map();
const joinedAttemptStartByAppointment = new Map();

function callPath(appointmentId, suffix) {
  return `/doctors/appointments/${appointmentId}/call/${suffix}`;
}

/** Optional bearer override (e.g. reference patient prototype with URL token). */
function requestConfig(accessToken) {
  if (!accessToken) return undefined;
  return { headers: { Authorization: `Bearer ${accessToken}` } };
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
  const response = await API.get(
    callPath(appointmentId, "status/"),
    requestConfig(accessToken)
  );
  return unwrapData(response);
}

export async function startCall(appointmentId, accessToken) {
  try {
    const response = await API.post(
      callPath(appointmentId, "start/"),
      {},
      requestConfig(accessToken)
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

  const response = await API.post(
    callPath(appointmentId, "token/"),
    {},
    requestConfig(accessToken)
  );
  const data = unwrapData(response);
  tokenCacheByAppointment.set(appointmentId, data);
  return data;
}

export async function endCall(appointmentId, accessToken) {
  // const response = await axios.post(
  //   // callUrl(appointmentId, "end/"),
  //   callUrl(appointmentId, "events/"),
  //   {
  //     "event_type": "left",
  //     "metadata": {
  //       "reason": "user_hangup"
  //     }
  //   },
  //   // {},
  //   { headers: authHeaders(accessToken) }
  // );

  const response = await API.post(
    callPath(appointmentId, "events/"),
    {
      "event_type": "left",
      "metadata": {
        "reason": "user_hangup"
      }
    },
    requestConfig(accessToken)
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
      const response = await API.post(
        callPath(appointmentId, "events/"),
        { event_type: "joined" },
        requestConfig(accessToken)
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

export async function joinAgoraChannel(
  client,
  tokenData,
  { forceRefreshToken, appointmentId, accessToken }
) {
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

/** Human-readable ended-state copy from GET /call/status/ payload. */
export function getCallEndedPresentation(status) {
  if (!status) {
    return { title: "Consultation Ended", subtitle: null };
  }

  if (status.status === "cancelled") {
    return {
      title: "Consultation Cancelled",
      subtitle: "This appointment is no longer available for video consultation.",
    };
  }

  if (status.status === "missed" || status.missed_by) {
    return {
      title: "Consultation Missed",
      subtitle:
        status.missed_reason ||
        (status.missed_by
          ? `Marked missed by ${status.missed_by.replace(/_/g, " ")}.`
          : "This consultation was marked as missed."),
    };
  }

  if (status.call_status === "ended" && status.status === "completed") {
    return { title: "Consultation Completed", subtitle: null };
  }

  return { title: "Consultation Ended", subtitle: null };
}

export function isCallJoinBlocked(status) {
  if (!status) return false;
  if (status.call_status === "ended") return true;
  if (status.status === "cancelled" || status.status === "missed") return true;
  return false;
}