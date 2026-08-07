/**
 * Consultation chat API + WebSocket client for the AyurMuni backend.
 *
 * Conversation: GET /communication/conversation/
 *               GET /communication/conversation/messages/?patient_id=
 * Appointment: GET/POST /communication/appointments/{appointment_id}/messages/
 * WS:           ws(s)://<host>/ws/communication/appointments/{appointment_id}/?token=<jwt>
 */
import API from "./api";

const CHAT_SENDER_DOCTOR = "doctor";
const CHAT_SENDER_PATIENT = "patient";

function getAccessToken() {
  return (
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("restoreToken") ||
    ""
  );
}

function unwrapData(response) {
  if (response.data?.success && response.data?.data !== undefined) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Request failed");
}

/** Derive WebSocket origin from REACT_APP_WS_BASE or REACT_APP_API_BASE. */
export function getWebSocketBaseUrl() {
  const explicit = process.env.REACT_APP_WS_BASE;
  if (explicit) {
    return String(explicit).replace(/\/$/, "");
  }

  const apiBase = process.env.REACT_APP_API_BASE;
  if (!apiBase) return "";

  try {
    const url = new URL(apiBase);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url.origin;
  } catch {
    return "";
  }
}

export function buildChatWebSocketUrl(appointmentId, token = getAccessToken()) {
  const base = getWebSocketBaseUrl();
  const encodedToken = encodeURIComponent(token);
  return `${base}/ws/communication/appointments/${appointmentId}/?token=${encodedToken}`;
}

function chatMessagesPath(appointmentId) {
  return `/communication/appointments/${appointmentId}/messages/`;
}

export function normalizePatientId(rawId) {
  if (rawId == null || rawId === "") return "";
  return String(rawId).trim().toLowerCase();
}

export function deduplicateConversationsByPatientId(conversations) {
  const byPatient = new Map();

  for (const item of conversations || []) {
    const patientKey = normalizePatientId(
      item?.patient_id ?? item?.patientId ?? item?.participant?.id
    );
    if (!patientKey) continue;

    const existing = byPatient.get(patientKey);
    if (!existing) {
      byPatient.set(patientKey, item);
      continue;
    }

    const existingTime = existing.last_message_at
      ? new Date(existing.last_message_at).getTime()
      : 0;
    const itemTime = item.last_message_at
      ? new Date(item.last_message_at).getTime()
      : 0;
    const primary = itemTime >= existingTime ? item : existing;
    const secondary = primary === item ? existing : item;

    byPatient.set(patientKey, {
      ...primary,
      unread_count: (primary.unread_count || 0) + (secondary.unread_count || 0),
    });
  }

  return Array.from(byPatient.values()).sort((a, b) => {
    const timeA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
    const timeB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
    return timeB - timeA;
  });
}

export async function fetchConversationList({ search = "", limit, offset } = {}) {
  const params = {};
  const trimmedSearch = String(search || "").trim();
  if (trimmedSearch) params.search = trimmedSearch;
  if (limit != null) params.limit = limit;
  if (offset != null) params.offset = offset;

  const response = await API.get("/communication/conversation/", { params });
  return unwrapData(response);
}

export async function fetchConversationMessages(patientId) {
  const response = await API.get("/communication/conversation/messages/", {
    params: { patient_id: patientId },
  });
  return unwrapData(response);
}

export function formatLastMessagePreview(lastMessage) {
  if (!lastMessage) return "";
  if (lastMessage.text?.trim()) return lastMessage.text.trim();
  if (lastMessage.attachments?.length) {
    return lastMessage.attachments.length === 1
      ? "📷 Image"
      : `📷 ${lastMessage.attachments.length} images`;
  }
  return "";
}

/** Map GET /communication/conversation/ item for the doctor messenger sidebar. */
export function mapConversationListItem(item) {
  const participant = item.participant || {};
  const patientId = item.patient_id ?? item.patientId ?? participant.id ?? null;
  const normalizedPatientId = normalizePatientId(patientId);

  return {
    id: normalizedPatientId,
    patientId: normalizedPatientId,
    doctorId: item.doctor_id,
    appointmentId: item.chat_access?.active_appointment_id || null,
    name: participant.name || "Patient",
    avatar: participant.profile_picture || null,
    lastMessage: formatLastMessagePreview(item.last_message),
    lastMessageTime: item.last_message_at ? new Date(item.last_message_at) : null,
    unreadCount: item.unread_count || 0,
    online: false,
    phone: participant.phone_number || "",
    email: participant.email || "",
    chatAccess: item.chat_access || null,
  };
}

/** Map and collapse duplicate rows to one entry per patient_id. */
export function mapConversationListItems(conversations) {
  return deduplicateConversationsByPatientId(conversations).map(mapConversationListItem);
}

const CHAT_SYNC_CHANNEL_NAME = "ayurmuni-doctor-chat-v1";

function getChatSyncChannel() {
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHAT_SYNC_CHANNEL_NAME);
}

export { getChatSyncChannel };

export function notifyChatActivity(patientId, tabId) {
  const channel = getChatSyncChannel();
  if (!channel) return;
  channel.postMessage({ type: "chat-activity", patientId, tabId });
  channel.close();
}

export function notifyConversationListRefresh(tabId) {
  const channel = getChatSyncChannel();
  if (!channel) return;
  channel.postMessage({ type: "conversations-refresh", tabId });
  channel.close();
}

export async function fetchChatHistory(appointmentId, { markRead = false } = {}) {
  const params = markRead ? { mark_read: "true" } : undefined;
  const response = await API.get(chatMessagesPath(appointmentId), { params });
  return unwrapData(response);
}

export async function sendChatMessageRest(
  appointmentId,
  { text = "", attachments = null } = {}
) {
  const body = { text };
  if (attachments?.length) {
    body.attachments = attachments;
  }

  const response = await API.post(chatMessagesPath(appointmentId), body);
  return unwrapData(response);
}

export async function uploadChatImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("dir", "consultation-chat");

  const response = await API.post("/user/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!response.data?.success || !response.data?.data?.url) {
    throw new Error(response.data?.message || "Image upload failed");
  }

  const { url, filename } = response.data.data;
  return {
    file_url: url,
    file_type: "image",
    file_name: filename || file.name,
    mime_type: file.type || undefined,
  };
}

export function mapBackendMessageToUi(message, patientId) {
  const isDoctor = message.sender_role === CHAT_SENDER_DOCTOR;
  const hasImages = Boolean(message.attachments?.length);
  const messageType =
    message.message_type === "text" && !hasImages
      ? "text"
      : hasImages
        ? "image"
        : "text";

  let status = "read";
  if (isDoctor) {
    status = message.is_seen ? "read" : "sent";
  }

  const content =
    message.text?.trim() ||
    (hasImages
      ? message.attachments.length === 1
        ? "📷 Image"
        : `📷 ${message.attachments.length} images`
      : "");

  return {
    id: message.id,
    appointmentId: message.appointment_id,
    senderId: isDoctor ? CHAT_SENDER_DOCTOR : String(patientId || CHAT_SENDER_PATIENT),
    receiverId: isDoctor ? String(patientId || CHAT_SENDER_PATIENT) : CHAT_SENDER_DOCTOR,
    content,
    timestamp: message.created_at ? new Date(message.created_at) : new Date(),
    type: messageType,
    status,
    attachments: message.attachments || [],
    senderRole: message.sender_role,
    isSeen: message.is_seen,
    raw: message,
  };
}

export function applySeenReceiptToMessages(messages, seenData) {
  if (!seenData?.message_ids?.length) return messages;

  const readerRole = seenData.reader_role;
  const readAt = seenData.read_at ? new Date(seenData.read_at) : new Date();
  const idSet = new Set(seenData.message_ids.map(String));

  return messages.map((msg) => {
    if (!idSet.has(String(msg.id))) return msg;
    if (msg.senderRole !== CHAT_SENDER_DOCTOR) return msg;
    if (readerRole !== CHAT_SENDER_PATIENT) return msg;

    return {
      ...msg,
      status: "read",
      isSeen: true,
      seenAt: readAt,
    };
  });
}

export function countUnreadPeerMessages(messages) {
  return messages.filter(
    (msg) => msg.senderRole === CHAT_SENDER_PATIENT && !msg.isSeen
  ).length;
}

export function mergeMessagesById(existing, incoming) {
  const byId = new Map(existing.map((msg) => [String(msg.id), msg]));
  for (const msg of incoming) {
    const key = String(msg.id);
    // Incoming wins so REST sync / chat.message refresh read receipts and fields.
    byId.set(key, { ...byId.get(key), ...msg, id: msg.id });
  }
  return Array.from(byId.values()).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
}

export function apiErrorMessage(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || error?.message || fallback;
}

const MAX_RECONNECT_DELAY_MS = 30000;

let activeConnection = null;

function detachWebSocketHandlers(socket) {
  if (!socket) return;
  socket.onopen = null;
  socket.onmessage = null;
  socket.onclose = null;
  socket.onerror = null;
}

function closeWebSocket(socket) {
  if (!socket) return;
  detachWebSocketHandlers(socket);
  if (
    socket.readyState === WebSocket.OPEN
    || socket.readyState === WebSocket.CONNECTING
  ) {
    socket.close(1000);
  }
}

/**
 * Force-close the app-wide active chat socket (e.g. on logout or unmount).
 */
export function disconnectActiveConsultationChat() {
  if (activeConnection) {
    activeConnection.disconnect();
    activeConnection = null;
  }
}

/**
 * Manages a single appointment chat WebSocket with automatic reconnect.
 * Only one active connection is allowed app-wide.
 */
export function createConsultationChatConnection(appointmentId, handlers = {}) {
  if (activeConnection) {
    activeConnection.disconnect();
    activeConnection = null;
  }

  let ws = null;
  let reconnectTimer = null;
  let reconnectAttempt = 0;
  let disposed = false;
  let socketGeneration = 0;

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const scheduleReconnect = () => {
    if (disposed) return;
    clearReconnectTimer();
    const delay = Math.min(1000 * 2 ** reconnectAttempt, MAX_RECONNECT_DELAY_MS);
    reconnectAttempt += 1;
    handlers.onReconnecting?.(reconnectAttempt, delay);
    reconnectTimer = setTimeout(connect, delay);
  };

  function connect() {
    if (disposed) return;

    const token = getAccessToken();
    if (!token) {
      handlers.onError?.({
        type: "chat.error",
        code: "auth_required",
        message: "Authentication required for chat.",
      });
      return;
    }

    closeWebSocket(ws);
    ws = null;

    const connectionGeneration = ++socketGeneration;

    try {
      ws = new WebSocket(buildChatWebSocketUrl(appointmentId, token));
    } catch (error) {
      handlers.onError?.({
        type: "chat.error",
        code: "connection_failed",
        message: error.message || "Failed to open WebSocket.",
      });
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      if (disposed || connectionGeneration !== socketGeneration) return;
      const wasReconnect = reconnectAttempt > 0;
      reconnectAttempt = 0;
      handlers.onOpen?.(wasReconnect);
    };

    ws.onmessage = (event) => {
      if (disposed || connectionGeneration !== socketGeneration) return;
      try {
        const payload = JSON.parse(event.data);
        handlers.onEvent?.(payload);
      } catch {
        handlers.onError?.({
          type: "chat.error",
          code: "invalid_json",
          message: "Received invalid WebSocket payload.",
        });
      }
    };

    ws.onerror = () => {
      if (disposed || connectionGeneration !== socketGeneration) return;
      handlers.onError?.({
        type: "chat.error",
        code: "websocket_error",
        message: "WebSocket connection error.",
      });
    };

    ws.onclose = (event) => {
      if (connectionGeneration !== socketGeneration) return;
      handlers.onClose?.(event);
      ws = null;
      if (!disposed && event.code !== 1000) {
        scheduleReconnect();
      }
    };
  }

  const send = (payload) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      return true;
    }
    return false;
  };

  const sendChatMessage = ({ text = "", attachments = null } = {}) => {
    const payload = { type: "chat.send", text };
    if (attachments?.length) {
      payload.attachments = attachments;
    }
    return send(payload);
  };

  const sendChatRead = (messageIds) => {
    const payload = { type: "chat.read" };
    if (messageIds?.length) {
      payload.message_ids = messageIds;
    }
    return send(payload);
  };

  const disconnect = () => {
    disposed = true;
    socketGeneration += 1;
    clearReconnectTimer();
    closeWebSocket(ws);
    ws = null;
    if (activeConnection === api) {
      activeConnection = null;
    }
  };

  const isConnected = () => ws?.readyState === WebSocket.OPEN;

  const reconnect = () => {
    disposed = false;
    reconnectAttempt = 0;
    clearReconnectTimer();
    closeWebSocket(ws);
    ws = null;
    connect();
  };

  const api = {
    send,
    sendChatMessage,
    sendChatRead,
    disconnect,
    isConnected,
    reconnect,
    getAppointmentId: () => appointmentId,
  };

  activeConnection = api;
  connect();

  return api;
}
