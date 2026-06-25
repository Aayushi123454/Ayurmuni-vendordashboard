import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    User,
    Clock,
    Check,
    CheckCheck,
    Image,
    File,
    Mic,
    Smile,
    X,
    ArrowLeft,
    Users,
    Calendar,
    Activity,
    Stethoscope,
    ChevronDown,
    ChevronUp,
    Circle,
    Plus,
    Menu
} from 'lucide-react';

// Mock data
const mockPatients = [
    {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        lastMessage: 'Thank you doctor, I will follow the prescription.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 2,
        online: true,
        phone: '+1 (555) 123-4567',
        email: 'sarah.j@email.com',
        age: 34,
        gender: 'Female',
        bloodGroup: 'A+',
        allergies: ['Penicillin', 'Dust'],
        medicalHistory: ['Hypertension', 'Type 2 Diabetes']
    },
    {
        id: '2',
        name: 'Robert Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        lastMessage: 'I have been experiencing chest pain.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 0,
        online: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 15),
        phone: '+1 (555) 234-5678',
        email: 'robert.c@email.com',
        age: 45,
        gender: 'Male',
        bloodGroup: 'O-',
        allergies: ['Sulfa drugs'],
        medicalHistory: ['Coronary Artery Disease']
    },
    {
        id: '3',
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        lastMessage: 'When should I come for the next checkup?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 120),
        unreadCount: 3,
        online: true,
        phone: '+1 (555) 345-6789',
        email: 'maria.g@email.com',
        age: 28,
        gender: 'Female',
        bloodGroup: 'B+',
        allergies: ['Latex'],
        medicalHistory: ['Asthma']
    },
    {
        id: '4',
        name: 'James Wilson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        lastMessage: 'The medication is working well.',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 180),
        unreadCount: 0,
        online: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 45),
        phone: '+1 (555) 456-7890',
        email: 'james.w@email.com',
        age: 52,
        gender: 'Male',
        bloodGroup: 'AB+',
        allergies: [],
        medicalHistory: ['Arthritis', 'Gout']
    }
];

// Initial messages for demo
const getInitialMessages = (patientId) => {
    const baseMessages = [
        {
            id: '1',
            senderId: 'doctor',
            receiverId: patientId,
            content: 'Hello, how are you feeling today?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            type: 'text',
            status: 'read'
        },
        {
            id: '2',
            senderId: patientId,
            receiverId: 'doctor',
            content: 'I feel much better after taking the medication. The pain has reduced significantly.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
            type: 'text',
            status: 'read'
        },
        {
            id: '3',
            senderId: 'doctor',
            receiverId: patientId,
            content: 'That\'s great to hear! Are you experiencing any side effects?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
            type: 'text',
            status: 'read'
        },
        {
            id: '4',
            senderId: patientId,
            receiverId: 'doctor',
            content: 'No side effects so far. Everything seems to be going well.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            type: 'text',
            status: 'delivered'
        }
    ];
    return baseMessages;
};

// Helper function to format time
const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

// Helper function to format date
const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    }
};

// Message component
const MessageItem = ({ message, isDoctor }) => {
    const isOwn = message.senderId === 'doctor';

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isOwn
                    ? 'bg-[#0D614E] !text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                    <p className={"text-sm whitespace-pre-wrap break-words " + (isOwn
                        ? '!text-white'
                        : ''
                    )}>{message.content}</p>
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

// Patient list item component
const PatientListItem = ({ patient, isSelected, onClick }) => {
    return (
        <div
            className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${isSelected
                ? 'bg-[#0D614E]/10 border-l-4 border-[#0D614E]'
                : 'hover:bg-gray-50 border-l-4 border-transparent'
                }`}
            onClick={onClick}
        >
            <div className="relative flex-shrink-0">
                <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                {patient.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
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
                        {patient.isTyping ? (
                            <span className="text-[#0D614E] flex items-center gap-1">
                                typing...
                                <span className="inline-flex gap-0.5">
                                    <span className="w-1 h-1 bg-[#0D614E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1 h-1 bg-[#0D614E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1 h-1 bg-[#0D614E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </span>
                            </span>
                        ) : (
                            patient.lastMessage || ''
                        )}
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
};

// Patient info sidebar component
const PatientInfoSidebar = ({ patient, onClose }) => {
    return (
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
                    <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                    <h4 className="text-lg font-semibold text-gray-800">{patient.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 text-xs ${patient.online ? 'text-green-600' : 'text-gray-400'}`}>
                            <span className={`w-2 h-2 rounded-full ${patient.online ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            {patient.online ? 'Online' : `Last seen ${formatTime(patient.lastSeen)}`}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <User className="w-4 h-4" />
                            <span>Personal Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="text-gray-400 text-xs">Age</p>
                                <p className="font-medium text-gray-700">{patient.age} years</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Gender</p>
                                <p className="font-medium text-gray-700">{patient.gender}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Blood Group</p>
                                <p className="font-medium text-gray-700">{patient.bloodGroup}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Phone</p>
                                <p className="font-medium text-gray-700 text-xs">{patient.phone}</p>
                            </div>
                        </div>
                    </div>

                    {patient.allergies && patient.allergies.length > 0 && (
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

                    {patient.medicalHistory && patient.medicalHistory.length > 0 && (
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
                            <span>Quick Actions</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="px-3 py-1.5 bg-[#0D614E] text-white text-xs rounded-lg hover:bg-[#0A4D3E] transition-colors">
                                Schedule Visit
                            </button>
                            <button className="px-3 py-1.5 border border-[#0D614E] text-[#0D614E] text-xs rounded-lg hover:bg-[#0D614E]/5 transition-colors">
                                View Records
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Messenger Component
const Messenger = ({
    doctorId,
    doctorName,
    initialPatients = mockPatients,
    onSendMessage,
    onPatientSelect
}) => {
    const [patients, setPatients] = useState(initialPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPatientInfoOpen, setIsPatientInfoOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);

    // Load messages when patient is selected
    useEffect(() => {
        if (selectedPatient) {
            setMessages(getInitialMessages(selectedPatient.id));
            // Mark messages as read
            setPatients(prev => prev.map(p =>
                p.id === selectedPatient.id ? { ...p, unreadCount: 0 } : p
            ));
        }
    }, [selectedPatient]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Filter patients based on search
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send message handler
    const handleSendMessage = () => {
        if (!inputMessage.trim() || !selectedPatient) return;

        const newMessage = {
            id: Date.now().toString(),
            senderId: 'doctor',
            receiverId: selectedPatient.id,
            content: inputMessage.trim(),
            timestamp: new Date(),
            type: 'text',
            status: 'sent'
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setShowEmojiPicker(false);

        // Update last message in patient list
        setPatients(prev => prev.map(p =>
            p.id === selectedPatient.id
                ? { ...p, lastMessage: inputMessage.trim(), lastMessageTime: new Date() }
                : p
        ));

        // Simulate delivery and read status
        setTimeout(() => {
            setMessages(prev =>
                prev.map(m =>
                    m.id === newMessage.id ? { ...m, status: 'delivered' } : m
                )
            );
        }, 1000);

        setTimeout(() => {
            setMessages(prev =>
                prev.map(m =>
                    m.id === newMessage.id ? { ...m, status: 'read' } : m
                )
            );
        }, 2000);

        // Simulate patient typing indicator
        if (selectedPatient) {
            setPatients(prev => prev.map(p =>
                p.id === selectedPatient.id ? { ...p, isTyping: true } : p
            ));

            setTimeout(() => {
                setPatients(prev => prev.map(p =>
                    p.id === selectedPatient.id ? { ...p, isTyping: false } : p
                ));
                // Simulate reply
                const reply = {
                    id: (Date.now() + 1).toString(),
                    senderId: selectedPatient.id,
                    receiverId: 'doctor',
                    content: 'Thank you doctor. I\'ll follow your advice.',
                    timestamp: new Date(),
                    type: 'text',
                    status: 'read'
                };
                setMessages(prev => [...prev, reply]);

                setPatients(prev => prev.map(p =>
                    p.id === selectedPatient.id
                        ? { ...p, lastMessage: reply.content, lastMessageTime: new Date() }
                        : p
                ));
            }, 3000);
        }

        if (onSendMessage) {
            onSendMessage(newMessage);
        }
    };

    // Handle key press (Enter to send)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file && selectedPatient) {
            // Simulate file upload
            const fileMessage = {
                id: Date.now().toString(),
                senderId: 'doctor',
                receiverId: selectedPatient.id,
                content: `📎 ${file.name}`,
                timestamp: new Date(),
                type: 'file',
                status: 'sent',
                fileName: file.name,
                fileSize: file.size
            };
            setMessages(prev => [...prev, fileMessage]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle patient selection
    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setIsPatientInfoOpen(false);
        if (onPatientSelect) {
            onPatientSelect(patient);
        }
    };

    // Render empty state
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
            {/* Left Panel - Patient List */}
            <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                {/* Header */}
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

                {/* Patient List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredPatients.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                            No patients found
                        </div>
                    ) : (
                        filteredPatients.map(patient => (
                            <PatientListItem
                                key={patient.id}
                                patient={patient}
                                isSelected={selectedPatient?.id === patient.id}
                                onClick={() => handlePatientSelect(patient)}
                            />
                        ))
                    )}
                </div>

                {/* Doctor info */}
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

            {/* Middle Panel - Chat Area */}
            {selectedPatient ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={selectedPatient.avatar}
                                    alt={selectedPatient.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                {selectedPatient.online && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">{selectedPatient.name}</h3>
                                <p className="text-xs text-gray-400">
                                    {selectedPatient.online ? 'Online' : `Last seen ${formatTime(selectedPatient.lastSeen)}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Phone className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Video className="w-5 h-5 text-gray-600" />
                            </button> */}
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                onClick={() => setIsPatientInfoOpen(!isPatientInfoOpen)}
                            >
                                <User className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        <div className="flex flex-col">
                            <div className="text-center mb-4">
                                <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                                    {formatDate(new Date())}
                                </span>
                            </div>
                            {messages.map(message => (
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    isDoctor={message.senderId === 'doctor'}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="flex items-end gap-2">
                            <div className="flex items-center gap-1">
                                {/* <button
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <Smile className="w-5 h-5" />
                                </button> */}
                                <button
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    multiple
                                />
                            </div>
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-1 resize-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D614E]/50 focus:border-transparent max-h-32 min-h-[34px]"
                                rows={1}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className={`p-2.5 rounded-lg transition-all ${inputMessage.trim()
                                    ? 'bg-[#0D614E] hover:bg-[#0A4D3E] text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        {showEmojiPicker && (
                            <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="flex gap-1 flex-wrap">
                                    {['😊', '❤️', '👍', '👋', '🙏', '😄', '😅', '🤗', '🤔', '😊', '✨', '💪'].map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => {
                                                setInputMessage(prev => prev + emoji);
                                                setShowEmojiPicker(false);
                                                inputRef.current?.focus();
                                            }}
                                            className="p-1.5 hover:bg-gray-100 rounded transition-colors text-xl"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                renderEmptyState()
            )}

            {/* Right Panel - Patient Info */}
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