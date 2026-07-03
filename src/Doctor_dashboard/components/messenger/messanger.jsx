import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Search,
    Send,
    Paperclip,
    User,
    Check,
    CheckCheck,
    X,
    Users,
    Calendar,
    Activity,
    Stethoscope,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { doctorService } from '../../../services/doctorService';
import {
    fetchChatHistory,
    sendChatMessageRest,
    uploadChatImage,
    mapBackendMessageToUi,
    applySeenReceiptToMessages,
    countUnreadPeerMessages,
    mergeMessagesById,
    createConsultationChatConnection,
    disconnectActiveConsultationChat,
    apiErrorMessage,
} from '../../../services/consultationChatService';

const CHAT_SENDER_DOCTOR = 'doctor';
const CHAT_SENDER_PATIENT = 'patient';

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatTime = (date) => {
    if (!date) return '';
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(value);
};

const formatDate = (date) => {
    const value = date instanceof Date ? date : new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (value.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (value.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(value);
};

const Avatar = ({ src, name, className = 'w-12 h-12' }) => {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${className} rounded-full object-cover`}
            />
        );
    }
    return (
        <div
            className={`${className} rounded-full bg-[#0D614E]/15 flex items-center justify-center text-[#0D614E] font-semibold text-sm`}
        >
            {getInitials(name)}
        </div>
    );
};

const mapAppointmentToConversation = (apt) => {
    const patient = typeof apt.patient === 'object' ? apt.patient : null;
    const patientId = patient?.id || apt.patient_id || apt.patient;
    const patientName = apt.patient_name
        || (patient
            ? `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
            : 'Patient');

    return {
        id: apt.id,
        appointmentId: apt.id,
        patientId,
        name: patientName || 'Patient',
        avatar: patient?.profile_picture || patient?.profile_image || null,
        lastMessage: '',
        lastMessageTime: null,
        unreadCount: 0,
        online: false,
        phone: patient?.phone_number || patient?.phone || apt.patient_phone || '',
        email: patient?.email || apt.patient_email || '',
        age: patient?.age || null,
        gender: patient?.gender || apt.patient_gender || '',
        bloodGroup: patient?.blood_group || '',
        allergies: patient?.allergies || [],
        medicalHistory: patient?.medical_history || [],
        appointmentDate: apt.appointment_date,
        appointmentStatus: apt.status,
        callStatus: apt.call_status,
    };
};

const MessageItem = ({ message }) => {
    const isOwn = message.senderId === CHAT_SENDER_DOCTOR;

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isOwn
                    ? 'bg-[#0D614E] !text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                    {message.type === 'image' && message.attachments?.length > 0 && (
                        <div className="space-y-2 mb-2">
                            {message.attachments.map((attachment, index) => (
                                <a
                                    key={`${message.id}-img-${index}`}
                                    href={attachment.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={attachment.file_url}
                                        alt={attachment.file_name || 'Attachment'}
                                        className="max-w-full rounded-lg max-h-48 object-cover"
                                    />
                                </a>
                            ))}
                        </div>
                    )}
                    {message.content && (
                        <p className={`text-sm whitespace-pre-wrap break-words ${isOwn ? '!text-white' : ''}`}>
                            {message.content}
                        </p>
                    )}
                </div>
                <div className={`flex items-center mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                    </span>
                    {isOwn && (
                        <span className="ml-1.5">
                            {message.status === 'sent' && <Check className="w-3.5 h-3.5 text-gray-400" />}
                            {message.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-gray-400" />}
                            {message.status === 'read' && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const PatientListItem = ({ patient, isSelected, onClick }) => (
    <div
        className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${isSelected
            ? 'bg-[#0D614E]/10 border-l-4 border-[#0D614E]'
            : 'hover:bg-gray-50 border-l-4 border-transparent'
            }`}
        onClick={onClick}
    >
        <div className="relative flex-shrink-0">
            <Avatar src={patient.avatar} name={patient.name} />
            {patient.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
        </div>
        <div className="flex-1 min-w-0 ml-3">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-800 text-sm truncate">{patient.name}</h4>
                {patient.lastMessageTime && (
                    <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTime(patient.lastMessageTime)}
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-gray-500 truncate">
                    {patient.lastMessage || (patient.appointmentDate ? `Visit: ${patient.appointmentDate}` : '')}
                </p>
                {patient.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-[#0D614E] text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {patient.unreadCount}
                    </span>
                )}
            </div>
        </div>
    </div>
);

const PatientInfoSidebar = ({ patient, onClose }) => (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Patient Info</h3>
            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center text-center mb-6">
                <Avatar src={patient.avatar} name={patient.name} className="w-20 h-20" />
                <h4 className="text-lg font-semibold text-gray-800 mt-3">{patient.name}</h4>
                {patient.appointmentDate && (
                    <p className="text-xs text-gray-500 mt-1">
                        Appointment: {formatDate(new Date(patient.appointmentDate))}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <User className="w-4 h-4" />
                        <span>Personal Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {patient.age && (
                            <div>
                                <p className="text-gray-400 text-xs">Age</p>
                                <p className="font-medium text-gray-700">{patient.age} years</p>
                            </div>
                        )}
                        {patient.gender && (
                            <div>
                                <p className="text-gray-400 text-xs">Gender</p>
                                <p className="font-medium text-gray-700">{patient.gender}</p>
                            </div>
                        )}
                        {patient.bloodGroup && (
                            <div>
                                <p className="text-gray-400 text-xs">Blood Group</p>
                                <p className="font-medium text-gray-700">{patient.bloodGroup}</p>
                            </div>
                        )}
                        {patient.phone && (
                            <div>
                                <p className="text-gray-400 text-xs">Phone</p>
                                <p className="font-medium text-gray-700 text-xs">{patient.phone}</p>
                            </div>
                        )}
                    </div>
                </div>

                {patient.allergies?.length > 0 && (
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Activity className="w-4 h-4" />
                            <span>Allergies</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {patient.allergies.map((allergy, index) => (
                                <span key={index} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">
                                    {allergy}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {patient.medicalHistory?.length > 0 && (
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Stethoscope className="w-4 h-4" />
                            <span>Medical History</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {patient.medicalHistory.map((condition, index) => (
                                <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                                    {condition}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Consultation</span>
                    </div>
                    <p className="text-sm text-gray-700 capitalize">
                        Status: {patient.appointmentStatus || '—'}
                    </p>
                    {patient.callStatus && (
                        <p className="text-sm text-gray-700 capitalize mt-1">
                            Call: {patient.callStatus.replace(/_/g, ' ')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const Messenger = ({ onSendMessage, onPatientSelect }) => {
    const profile = (() => {
        try {
            return JSON.parse(sessionStorage.getItem('profile') || '{}');
        } catch {
            return {};
        }
    })();
    const doctorName = profile.first_name
        ? `${profile.first_name} ${profile.last_name || ''}`.trim()
        : 'Doctor';

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPatientInfoOpen, setIsPatientInfoOpen] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [chatAccess, setChatAccess] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    const wsConnectionRef = useRef(null);
    const selectedPatientRef = useRef(null);
    const messagesByAppointmentRef = useRef(new Map());
    const wsSessionRef = useRef(0);
    const historyRequestRef = useRef(0);

    const isActiveAppointment = useCallback(
        (appointmentId) => selectedPatientRef.current?.appointmentId === appointmentId,
        []
    );

    const updateConversationPreview = useCallback((appointmentId, messageList) => {
        if (!messageList?.length) return;
        const last = messageList[messageList.length - 1];
        const unread = countUnreadPeerMessages(messageList);

        setPatients((prev) => prev.map((p) => (
            p.appointmentId === appointmentId
                ? {
                    ...p,
                    lastMessage: last.content,
                    lastMessageTime: last.timestamp,
                    unreadCount: selectedPatientRef.current?.appointmentId === appointmentId ? 0 : unread,
                }
                : p
        )));
    }, []);

    const syncMessagesForAppointment = useCallback((appointmentId, nextMessages) => {
        messagesByAppointmentRef.current.set(appointmentId, nextMessages);
        if (selectedPatientRef.current?.appointmentId === appointmentId) {
            setMessages(nextMessages);
        }
        updateConversationPreview(appointmentId, nextMessages);
    }, [updateConversationPreview]);

    const loadChatHistory = useCallback(async (appointmentId, patientId, { markRead = true } = {}) => {
        const requestId = ++historyRequestRef.current;
        setIsLoadingMessages(true);
        try {
            const data = await fetchChatHistory(appointmentId, { markRead });
            if (requestId !== historyRequestRef.current) return data;
            if (!isActiveAppointment(appointmentId)) return data;

            const uiMessages = (data.messages || []).map((msg) =>
                mapBackendMessageToUi(msg, patientId)
            );
            const existing = messagesByAppointmentRef.current.get(appointmentId) || [];
            syncMessagesForAppointment(
                appointmentId,
                mergeMessagesById(existing, uiMessages)
            );

            if (isActiveAppointment(appointmentId)) {
                setChatAccess(data.chat_access || null);
            }

            if (
                markRead
                && isActiveAppointment(appointmentId)
                && wsConnectionRef.current?.isConnected()
            ) {
                wsConnectionRef.current.sendChatRead();
            }

            return data;
        } catch (error) {
            if (requestId === historyRequestRef.current && isActiveAppointment(appointmentId)) {
                toast.error(apiErrorMessage(error, 'Failed to load chat history'));
            }
            throw error;
        } finally {
            if (requestId === historyRequestRef.current && isActiveAppointment(appointmentId)) {
                setIsLoadingMessages(false);
            }
        }
    }, [syncMessagesForAppointment, isActiveAppointment]);

    const handleChatEvent = useCallback((event, appointmentId, patientId, sessionId) => {
        if (wsSessionRef.current !== sessionId) return;

        switch (event.type) {
            case 'chat.connected':
                if (isActiveAppointment(appointmentId)) {
                    setChatAccess(event.data?.chat_access || null);
                }
                break;

            case 'chat.message': {
                const uiMessage = mapBackendMessageToUi(event.message, patientId);
                const existing = messagesByAppointmentRef.current.get(appointmentId) || [];
                const merged = mergeMessagesById(existing, [uiMessage]);
                syncMessagesForAppointment(appointmentId, merged);

                if (
                    uiMessage.senderRole === CHAT_SENDER_PATIENT
                    && isActiveAppointment(appointmentId)
                    && wsSessionRef.current === sessionId
                    && wsConnectionRef.current?.isConnected()
                ) {
                    wsConnectionRef.current.sendChatRead([uiMessage.id]);
                }
                break;
            }

            case 'chat.seen': {
                const existing = messagesByAppointmentRef.current.get(appointmentId) || [];
                const updated = applySeenReceiptToMessages(existing, event.data);
                syncMessagesForAppointment(appointmentId, updated);
                break;
            }

            case 'chat.error':
                if (isActiveAppointment(appointmentId)) {
                    toast.error(event.message || 'Chat error');
                }
                break;

            default:
                break;
        }
    }, [syncMessagesForAppointment, isActiveAppointment]);

    const connectWebSocket = useCallback((patient) => {
        const sessionId = ++wsSessionRef.current;

        if (wsConnectionRef.current) {
            wsConnectionRef.current.disconnect();
            wsConnectionRef.current = null;
        }

        const appointmentId = patient.appointmentId;
        const patientId = patient.patientId;

        wsConnectionRef.current = createConsultationChatConnection(appointmentId, {
            onOpen: (isReconnect) => {
                if (wsSessionRef.current !== sessionId) return;
                toast.dismiss(`chat-reconnect-${appointmentId}`);
                if (isReconnect) {
                    loadChatHistory(appointmentId, patientId, { markRead: true }).catch(() => {});
                }
            },
            onEvent: (event) => handleChatEvent(event, appointmentId, patientId, sessionId),
            onReconnecting: () => {
                if (wsSessionRef.current !== sessionId) return;
                toast.loading('Reconnecting chat…', { id: `chat-reconnect-${appointmentId}` });
            },
            onClose: (event) => {
                if (wsSessionRef.current !== sessionId) return;
                if (event.code === 1000) {
                    toast.dismiss(`chat-reconnect-${appointmentId}`);
                }
            },
            onError: (error) => {
                if (wsSessionRef.current !== sessionId) return;
                if (error?.message && isActiveAppointment(appointmentId)) {
                    toast.error(error.message);
                }
            },
        });
    }, [handleChatEvent, loadChatHistory, isActiveAppointment]);

    const fetchConversations = useCallback(async () => {
        setIsLoadingConversations(true);
        try {
            const response = await doctorService.getAppointment('appointment');
            const results = response?.data?.data?.results || [];
            const conversations = results
                .filter((apt) => apt.status !== 'cancelled')
                .map((apt) => {
                    const mapped = mapAppointmentToConversation({
                        ...apt,
                        patient_name: apt.patient
                            ? `${apt.patient.first_name || ''} ${apt.patient.last_name || ''}`.trim()
                            : 'Patient',
                        patient_id: apt.patient?.id || apt.patient,
                    });
                    return mapped;
                })
                .sort((a, b) => {
                    const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
                    const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
                    return bTime - aTime;
                });

            setPatients(conversations);
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Failed to load conversations'));
            setPatients([]);
        } finally {
            setIsLoadingConversations(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => () => {
        historyRequestRef.current += 1;
        wsSessionRef.current += 1;
        disconnectActiveConsultationChat();
        wsConnectionRef.current = null;
    }, []);

    useEffect(() => {
        selectedPatientRef.current = selectedPatient;
    }, [selectedPatient]);

    useEffect(() => {
        if (!selectedPatient) {
            wsSessionRef.current += 1;
            historyRequestRef.current += 1;
            disconnectActiveConsultationChat();
            wsConnectionRef.current = null;
            setMessages([]);
            setChatAccess(null);
            return undefined;
        }

        const cached = messagesByAppointmentRef.current.get(selectedPatient.appointmentId);
        setMessages(cached || []);
        setPatients((prev) => prev.map((p) => (
            p.appointmentId === selectedPatient.appointmentId ? { ...p, unreadCount: 0 } : p
        )));

        loadChatHistory(
            selectedPatient.appointmentId,
            selectedPatient.patientId,
            { markRead: true }
        ).catch(() => {});

        connectWebSocket(selectedPatient);

        const handleOnline = () => {
            wsConnectionRef.current?.reconnect();
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'visible' && selectedPatientRef.current) {
                loadChatHistory(
                    selectedPatientRef.current.appointmentId,
                    selectedPatientRef.current.patientId,
                    { markRead: true }
                ).catch(() => {});
            }
        };

        window.addEventListener('online', handleOnline);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('online', handleOnline);
            document.removeEventListener('visibilitychange', handleVisibility);
            wsSessionRef.current += 1;
            historyRequestRef.current += 1;
            disconnectActiveConsultationChat();
            wsConnectionRef.current = null;
        };
    }, [selectedPatient, connectWebSocket, loadChatHistory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const canSend = Boolean(chatAccess?.can_send);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedPatient || !canSend || isSending) return;

        const text = inputMessage.trim();
        const appointmentId = selectedPatient.appointmentId;
        setInputMessage('');
        setIsSending(true);

        try {
            const sentViaWs = wsConnectionRef.current?.sendChatMessage({ text });

            if (!sentViaWs) {
                const data = await sendChatMessageRest(appointmentId, { text });
                if (data.chat_access) {
                    setChatAccess(data.chat_access);
                }
                if (data.message) {
                    const uiMessage = mapBackendMessageToUi(data.message, selectedPatient.patientId);
                    const existing = messagesByAppointmentRef.current.get(appointmentId) || [];
                    syncMessagesForAppointment(
                        appointmentId,
                        mergeMessagesById(existing, [uiMessage])
                    );
                }
            }

            if (onSendMessage) {
                onSendMessage({ text, appointmentId });
            }
        } catch (error) {
            setInputMessage(text);
            toast.error(apiErrorMessage(error, 'Failed to send message'));
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !selectedPatient || !canSend || isUploading) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Only image attachments are supported.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const appointmentId = selectedPatient.appointmentId;
        setIsUploading(true);

        try {
            const attachment = await uploadChatImage(file);
            const sentViaWs = wsConnectionRef.current?.sendChatMessage({
                text: '',
                attachments: [attachment],
            });

            if (!sentViaWs) {
                const data = await sendChatMessageRest(appointmentId, {
                    text: '',
                    attachments: [attachment],
                });
                if (data.chat_access) {
                    setChatAccess(data.chat_access);
                }
                if (data.message) {
                    const uiMessage = mapBackendMessageToUi(data.message, selectedPatient.patientId);
                    const existing = messagesByAppointmentRef.current.get(appointmentId) || [];
                    syncMessagesForAppointment(
                        appointmentId,
                        mergeMessagesById(existing, [uiMessage])
                    );
                }
            }
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Failed to upload image'));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setIsPatientInfoOpen(false);
        if (onPatientSelect) {
            onPatientSelect(patient);
        }
    };

    const renderEmptyState = () => (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-20 h-20 bg-[#0D614E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-[#0D614E]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No Patient Selected</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    Choose a patient from the list to start messaging
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(84vh)] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D614E]/50 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoadingConversations ? (
                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                            Loading conversations…
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                            No patients found
                        </div>
                    ) : (
                        filteredPatients.map((patient) => (
                            <PatientListItem
                                key={patient.id}
                                patient={patient}
                                isSelected={selectedPatient?.id === patient.id}
                                onClick={() => handlePatientSelect(patient)}
                            />
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0D614E] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {doctorName?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">{doctorName}</p>
                            <p className="text-xs text-gray-400">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {selectedPatient ? (
                <div className="flex-1 flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar src={selectedPatient.avatar} name={selectedPatient.name} className="w-10 h-10" />
                            <div>
                                <h3 className="font-medium text-gray-800">{selectedPatient.name}</h3>
                                <p className="text-xs text-gray-400">
                                    {chatAccess?.active_phase
                                        ? `${chatAccess.active_phase.replace(/_/g, ' ')} chat`
                                        : chatAccess?.can_send
                                            ? 'Chat available'
                                            : 'Read-only chat'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                onClick={() => setIsPatientInfoOpen(!isPatientInfoOpen)}
                            >
                                <User className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        <div className="flex flex-col">
                            <div className="text-center mb-4">
                                <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                                    {formatDate(messages[0]?.timestamp || new Date())}
                                </span>
                            </div>
                            {isLoadingMessages && messages.length === 0 ? (
                                <div className="text-center text-sm text-gray-500 py-8">
                                    Loading messages…
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-sm text-gray-500 py-8">
                                    No messages yet. Start the conversation.
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-3 border-t border-gray-200 bg-white">
                        {!canSend && (
                            <p className="text-xs text-amber-600 mb-2">
                                Messaging is only available during a live consultation or active follow-up period.
                            </p>
                        )}
                        <div className="flex items-end gap-2">
                            <div className="flex items-center gap-1">
                                <button
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-50"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={!canSend || isUploading}
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={canSend ? 'Type a message...' : 'Chat is read-only'}
                                disabled={!canSend || isSending}
                                className="flex-1 resize-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D614E]/50 focus:border-transparent max-h-32 min-h-[34px] disabled:bg-gray-50 disabled:text-gray-400"
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || !canSend || isSending}
                                className={`p-2.5 rounded-lg transition-all ${inputMessage.trim() && canSend && !isSending
                                    ? 'bg-[#0D614E] hover:bg-[#0A4D3E] text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                renderEmptyState()
            )}

            {isPatientInfoOpen && selectedPatient && (
                <PatientInfoSidebar
                    patient={selectedPatient}
                    onClose={() => setIsPatientInfoOpen(false)}
                />
            )}
        </div>
    );
};

export default Messenger;
