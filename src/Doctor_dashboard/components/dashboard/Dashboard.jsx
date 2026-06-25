import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar,
    Users,
    Activity,
    Clock,
    MessageSquare,
    TrendingUp,
    Pill,
    Stethoscope,
    FileText,
    Settings,
    Bell,
    Search,
    Menu,
    User,
    ChevronDown,
    Star,
    Video,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowUp,
    ArrowDown,
    MoreVertical,
    Download,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Mail,
    MapPin,
    Award,
    Heart,
    Brain,
    Leaf,
    Sun,
    Moon,
    Wind,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Mic,
    Camera,
    Send,
    Paperclip,
    Smile,
    ThumbsUp,
    ThumbsDown,
    BarChart3,
    LineChart,
    PieChart,
    CalendarDays,
    CheckCheck,
    X,
    Loader2,
    IndianRupee,
    Wallet,
    PiggyBank,
    DollarSign,
    Target
} from 'lucide-react';
import { doctorService } from '../../../services/doctorService';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
    const chatEndRef = useRef(null);
    const [activeTab, setActiveTab] = useState('overview');
    // const [selectedPatient, setSelectedPatient] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showAddAppointment, setShowAddAppointment] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [newAppointment, setNewAppointment] = useState({
    //     patient: '',
    //     time: '',
    //     type: 'Consultation',
    //     concern: ''
    // });
    const [toast, setToast] = useState(null);

    // Dashboard Data State
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalPatients: 0,
            consultedPatients: 0,
            totalAppointments: 0,
            totalRevenue: 0,
            averageRating: 0,
            totalReviews: 0
        },
        todayAppointments: [],
        upcomingConsultations: [],
        recentPatients: [],
        ratings: {
            average_rating: null,
            total_reviews: 0,
            recent_reviews: []
        }
    });

    const [statsCards, setStatsCards] = useState([
        { title: 'Total Patients', value: '0', change: '+0%', trend: 'up', icon: Users, color: '#0D614E' },
        { title: 'Consulted Patients', value: '0', change: '+0%', trend: 'up', icon: Activity, color: '#0D614E' },
        { title: 'Total Appointments', value: '0', change: '+0%', trend: 'up', icon: Calendar, color: '#0D614E' },
        { title: 'Total Revenue', value: '₹0', change: '+0%', trend: 'up', icon: IndianRupee, color: '#0D614E' }
    ]);

    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'patient', message: 'Doctor, I\'ve been feeling better after taking the prescribed medicines.', time: '10:30 AM', patientId: 1 },
        { id: 2, sender: 'doctor', message: 'That\'s great to hear! Continue the medication and keep me updated.', time: '10:35 AM', patientId: 1 }
    ]);

    const [newMessage, setNewMessage] = useState('');

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const res = await doctorService.dashboardget();

            if (res?.data?.success) {
                const data = res.data.data;

                // Update dashboard data
                setDashboardData({
                    stats: {
                        totalPatients: data.total_patients || 0,
                        consultedPatients: data.consulted_patient_count || 0,
                        totalAppointments: (data.today_appointments?.count || 0) + (data.upcoming_consultations?.count || 0),
                        totalRevenue: calculateTotalRevenue(data.upcoming_consultations?.results || []),
                        averageRating: data.ratings?.average_rating || 0,
                        totalReviews: data.ratings?.total_reviews || 0
                    },
                    todayAppointments: data.today_appointments?.results || [],
                    upcomingConsultations: data.upcoming_consultations?.results || [],
                    recentPatients: data.recent_patients || [],
                    ratings: data.ratings || { average_rating: null, total_reviews: 0, recent_reviews: [] }
                });

                // Update stats cards
                updateStatsCards(data);
            } else {
                toast.error('Failed to load dashboard data', 'error');
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Error loading dashboard data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total revenue
    const calculateTotalRevenue = (appointments) => {
        return appointments.reduce((total, apt) => total + (apt.amount || 0), 0);
    };

    // Update stats cards with real data
    const updateStatsCards = (data) => {
        setStatsCards([
            {
                title: 'Total Patients',
                value: data.total_patients?.toString() || '0',
                change: '+12%',
                trend: 'up',
                icon: Users,
                color: '#0D614E'
            },
            {
                title: 'Consulted Patients',
                value: data.consulted_patient_count?.toString() || '0',
                change: '+8%',
                trend: 'up',
                icon: Activity,
                color: '#0D614E'
            },
            {
                title: 'Total Appointments',
                value: data.total_appointments?.toString(),
                change: '+15%',
                trend: 'up',
                icon: Calendar,
                color: '#0D614E'
            },
            {
                title: 'Total Revenue',
                value: `₹${calculateTotalRevenue(data.upcoming_consultations?.results || [])}`,
                change: '+18%',
                trend: 'up',
                icon: IndianRupee,
                color: '#0D614E'
            }
        ]);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-100 text-emerald-700';
            case 'waiting': return 'bg-amber-100 text-amber-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-rose-100 text-rose-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return <CheckCircle size={14} />;
            case 'waiting': return <Clock size={14} />;
            case 'completed': return <CheckCheck size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    // Get consultation type icon
    const getConsultationTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'video': return <Video size={16} />;
            case 'in-person': return <Users size={16} />;
            case 'follow-up': return <Activity size={16} />;
            default: return <Stethoscope size={16} />;
        }
    };

    // Get dosha icon
    const getDoshaIcon = (prakriti) => {
        if (!prakriti) return <Leaf size={16} />;
        if (prakriti.toLowerCase().includes('vata')) return <Wind size={16} />;
        if (prakriti.toLowerCase().includes('pitta')) return <Sun size={16} />;
        if (prakriti.toLowerCase().includes('kapha')) return <Moon size={16} />;
        return <Leaf size={16} />;
    };

    // Get dosha color
    const getDoshaColor = (prakriti) => {
        if (!prakriti) return 'bg-gray-100 text-gray-700';
        if (prakriti.toLowerCase().includes('vata')) return 'bg-purple-100 text-purple-700';
        if (prakriti.toLowerCase().includes('pitta')) return 'bg-orange-100 text-orange-700';
        if (prakriti.toLowerCase().includes('kapha')) return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Format time
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString.substring(0, 5);
    };

    // Show toast notification
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Handle add appointment
    // const handleAddAppointment = () => {
    //     if (!newAppointment.patient || !newAppointment.time) {
    //         showToast('Please fill all required fields', 'error');
    //         return;
    //     }
    //     showToast('Appointment added successfully', 'success');
    //     setShowAddAppointment(false);
    //     setNewAppointment({ patient: '', time: '', type: 'Consultation', concern: '' });
    // };

    // Send message
    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const newMsg = {
            id: chatMessages.length + 1,
            sender: 'doctor',
            message: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            patientId: 1
        };
        setChatMessages([...chatMessages, newMsg]);
        setNewMessage('');
    };

    // Dosha tips
    const doshaTips = {
        Vata: ['Warm, cooked foods', 'Regular routine', 'Oil massage', 'Avoid cold drinks'],
        Pitta: ['Cooling foods', 'Avoid spicy', 'Coconut oil', 'Moonlight walks'],
        Kapha: ['Light, warm foods', 'Regular exercise', 'Dry brushing', 'Honey in warm water']
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#0D614E', borderTopColor: 'transparent' }} />
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <main className="p-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] rounded-2xl p-6 mb-8 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Welcome back</h2>
                            <p className="text-emerald-100 text-green-600">You have {dashboardData.todayAppointments.length} confirmed appointments today</p>
                            <div className="flex items-center space-x-2 mt-3">
                                <div className="flex -space-x-2">
                                    {dashboardData.recentPatients.slice(0, 3).map((patient, idx) => (
                                        <div key={idx} className="w-8 h-8 rounded-full bg-white bg-opacity-20 border-2 border-[#0D614E] flex items-center justify-center text-xs font-semibold">
                                            {patient.first_name?.charAt(0) || patient.patient_name?.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-emerald-100">+{dashboardData.recentPatients.length} patients this week</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <CalendarDays size={40} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1 font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <div className="flex items-center space-x-1 mt-2">
                                        {/* {stat.trend === 'up' ?
                                            <ArrowUp size={12} className="text-emerald-600" /> :
                                            <ArrowDown size={12} className="text-rose-600" />
                                        } */}
                                        {/* <p className="text-xs text-emerald-600">{stat.change} from last month</p> */}
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ backgroundColor: `${stat.color}10` }}>
                                    <stat.icon size={24} style={{ color: stat.color }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Consultations */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Upcoming Consultations</h3>
                                        <p className="text-sm text-gray-500 mt-1">{dashboardData.upcomingConsultations.length} appointments scheduled</p>
                                    </div>
                                    {/* <div className="flex space-x-2">
                                        <button
                                            onClick={() => setShowAddAppointment(true)}
                                            className="px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors hover:shadow-md"
                                            style={{ backgroundColor: '#0D614E', color: 'white' }}
                                        >
                                            <Plus size={16} />
                                            <span className="text-sm">New</span>
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                            <Filter size={18} className="text-gray-500" />
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                            {/* Add Appointment Modal */}
                            {/* {showAddAppointment && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-xl font-semibold mb-4">Add New Appointment</h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Patient Name"
                                                value={newAppointment.patient}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                            <input
                                                type="time"
                                                value={newAppointment.time}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                            <input
                                                type="date"
                                                value={newAppointment.date}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                            <select
                                                value={newAppointment.type}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            >
                                                <option>Consultation</option>
                                                <option>Follow-up</option>
                                                <option>Therapy</option>
                                            </select>
                                            <textarea
                                                placeholder="Concern (optional)"
                                                value={newAppointment.concern}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, concern: e.target.value })}
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>
                                        <div className="flex space-x-3 mt-6">
                                            <button
                                                onClick={handleAddAppointment}
                                                className="flex-1 py-2 rounded-lg text-white"
                                                style={{ backgroundColor: '#0D614E' }}
                                            >
                                                Add Appointment
                                            </button>
                                            <button
                                                onClick={() => setShowAddAppointment(false)}
                                                className="flex-1 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            <div className="divide-y divide-gray-100">
                                {dashboardData.upcomingConsultations.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <Calendar size={40} className="mx-auto mb-3 opacity-50" />
                                        <p>No upcoming consultations</p>
                                    </div>
                                ) : (
                                    dashboardData.upcomingConsultations.map((appointment, index) => (
                                        <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white font-semibold">
                                                        {appointment.patient?.first_name?.charAt(0)}{appointment.patient?.last_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {appointment.patient?.first_name} {appointment.patient?.last_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{appointment.concern || 'General Consultation'}</p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Clock size={12} className="text-gray-400" />
                                                            <span className="text-xs text-gray-500">{formatDate(appointment.appointment_date)} at {formatTime(appointment.start_time)}</span>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <div className="flex items-center space-x-1">
                                                                {getConsultationTypeIcon(appointment.consultation_type)}
                                                                <span className="text-xs text-gray-500 capitalize">{appointment.consultation_type}</span>
                                                            </div>
                                                        </div>
                                                        {appointment.prakriti && (
                                                            <div className="mt-1">
                                                                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getDoshaColor(appointment.prakriti)}`}>
                                                                    {getDoshaIcon(appointment.prakriti)}
                                                                    <span>{appointment.prakriti}</span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-1">
                                                        {/* {getStatusIcon(appointment.status)} */}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            to={"/doctor/appointments/appointment/" + appointment.id}
                                                            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                                                        >
                                                            <Eye size={16} className="text-gray-600" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {dashboardData.upcomingConsultations.length > 5 && (
                                <div className="p-4 border-t border-gray-200">
                                    <button className="w-full py-2 text-sm font-medium rounded-lg transition-all hover:shadow-md" style={{ color: '#0D614E', backgroundColor: `${'#0D614E'}10` }}>
                                        View All Appointments
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent Patients */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Patients</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prakriti</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Visits</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {dashboardData.recentPatients.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                                    <Users size={40} className="mx-auto mb-3 opacity-50" />
                                                    <p>No patients found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            dashboardData.recentPatients.map((patient) => (
                                                <tr key={patient.id} className="hover:bg-gray-50 cursor-pointer">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            {patient.profile_picture ? (
                                                                <img src={patient.profile_picture} alt={patient.patient_name} className="w-8 h-8 rounded-full object-cover" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                                                                    {patient.first_name?.charAt(0) || patient.patient_name?.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <span className="font-medium text-gray-800">{patient.patient_name || `${patient.first_name} ${patient.last_name}`}</span>
                                                                <p className="text-xs text-gray-500">{patient.gender} • {patient.relation}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {patient.prakriti_result && (
                                                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDoshaColor(patient.prakriti_result)}`}>
                                                                {getDoshaIcon(patient.prakriti_result)}
                                                                <span>{patient.prakriti_result}</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{patient.total_appointments || 0}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(patient.last_appointment_date)}</td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-sm font-medium hover:underline flex items-center space-x-1" style={{ color: '#0D614E' }}>
                                                            <Eye size={14} />
                                                            <span>View</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Chat Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Quick Messages</h3>
                            </div>
                            <div className="h-[435px] flex flex-col">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {chatMessages.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.sender === "doctor" ? "items-end" : "items-start"}`}>
                                            <div className={"max-w-xs rounded-2xl rounded-tl-sm p-3"} style={msg.sender === "doctor" ? { backgroundColor: "#0D614E" } : {background:"#D3D3D3"}}>
                                                <p className="text-sm text-black">{msg.message}</p>
                                            </div>
                                            <p className={`text-xs mt-1 opacity-75 text-black`}>{msg.time}</p>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                        />
                                        <button onClick={sendMessage} className="p-2 rounded-lg text-white" style={{ backgroundColor: '#0D614E' }}>
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br text-white rounded-xl p-6 shadow-sm" style={{ background: 'linear-gradient(135deg, #0D614E 0%, #0a4d3e 100%)' }}>
                            <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link to={"/doctor/appointments"} className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>New Appointments</span>
                                    <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
                                </Link>
                                <Link to={"/doctor/patients"} className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>New Patients</span>
                                    <Users size={18} className="group-hover:scale-110 transition-transform" />
                                </Link>
                                {/* <button className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>Create Prescription</span>
                                    <Pill size={18} className="group-hover:rotate-12 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>Video Consultation</span>
                                    <Video size={18} className="group-hover:scale-110 transition-transform" />
                                </button> */}
                            </div>
                        </div>

                        {/* Today's Appointments */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
                            {dashboardData.todayAppointments.length === 0 ? (
                                <div className="text-center py-6 text-gray-400">
                                    <Clock size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>No appointments today</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dashboardData.todayAppointments.map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-800">{appointment.patient?.first_name} {appointment.patient?.last_name}</p>
                                                <p className="text-xs text-gray-500 mt-1">{formatTime(appointment.start_time)} • {appointment.consultation_type}</p>
                                            </div>
                                            <button className="px-3 py-1 bg-[#0D614E] text-white rounded-lg text-xs">Join</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Ratings Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Ratings</h3>
                            <div className="text-center mb-4">
                                <div className="flex items-center justify-center space-x-2">
                                    <Star size={32} className="text-yellow-400 fill-current" />
                                    <span className="text-3xl font-bold text-gray-800">{dashboardData.ratings.average_rating || 'N/A'}</span>
                                    <span className="text-gray-500">/5.0</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Based on {dashboardData.ratings.total_reviews || 0} reviews</p>
                            </div>
                            {dashboardData.ratings.recent_reviews?.length > 0 && (
                                <div className="space-y-3">
                                    {dashboardData.ratings.recent_reviews.slice(0, 2).map((review, idx) => (
                                        <div key={idx} className="border-t border-gray-100 pt-3">
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{review.comment}</p>
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(review.created_at)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dosha-Specific Tips */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${'#0D614E'}10` }}>
                                    <Leaf size={20} style={{ color: '#0D614E' }} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Dosha-Specific Tips</h3>
                            </div>
                            <div className="space-y-4">
                                {Object.entries(doshaTips).map(([dosha, tips]) => (
                                    <div key={dosha} className="border-l-4 pl-3" style={{ borderColor: '#0D614E' }}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            {dosha === 'Vata' && <Wind size={16} className="text-purple-600" />}
                                            {dosha === 'Pitta' && <Sun size={16} className="text-orange-600" />}
                                            {dosha === 'Kapha' && <Moon size={16} className="text-blue-600" />}
                                            <p className="font-semibold text-gray-800">{dosha}</p>
                                        </div>
                                        <ul className="space-y-1">
                                            {tips.map((tip, idx) => (
                                                <li key={idx} className="text-xs text-gray-600 flex items-start space-x-2">
                                                    <span className="text-emerald-500">•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default DoctorDashboard;