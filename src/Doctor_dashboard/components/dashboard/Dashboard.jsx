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
    Loader2
} from 'lucide-react';

const DoctorDashboard = () => {
    const chatEndRef = useRef(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAddAppointment, setShowAddAppointment] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newAppointment, setNewAppointment] = useState({
        patient: '',
        time: '',
        type: 'Consultation',
        concern: ''
    });

    // Enhanced sample data with more details
    const [stats, setStats] = useState([
        { title: 'Total Patients', value: '1,284', change: '+12%', trend: 'up', icon: Users, color: '#0D614E' },
        { title: 'Today\'s Appointments', value: '24', change: '+3', trend: 'up', icon: Calendar, color: '#0D614E' },
        { title: 'Revenue This Month', value: '₹48,250', change: '+18%', trend: 'up', icon: TrendingUp, color: '#0D614E' },
        { title: 'Patient Satisfaction', value: '4.8', change: '+0.2', trend: 'up', icon: Star, color: '#0D614E' }
    ]);

    const [appointments, setAppointments] = useState([
        { id: 1, patient: 'Priya Sharma', time: '09:00 AM', type: 'Consultation', status: 'confirmed', avatar: 'PS', ayurvedicConcern: 'Digestive Issues', phone: '+91 98765 43210', email: 'priya.sharma@email.com' },
        { id: 2, patient: 'Rajesh Kumar', time: '10:30 AM', type: 'Follow-up', status: 'waiting', avatar: 'RK', ayurvedicConcern: 'Joint Pain', phone: '+91 98765 43211', email: 'rajesh.k@email.com' },
        { id: 3, patient: 'Anita Desai', time: '12:00 PM', type: 'Therapy', status: 'completed', avatar: 'AD', ayurvedicConcern: 'Stress Management', phone: '+91 98765 43212', email: 'anita.desai@email.com' },
        { id: 4, patient: 'Vikram Singh', time: '02:00 PM', type: 'Consultation', status: 'cancelled', avatar: 'VS', ayurvedicConcern: 'Skin Problems', phone: '+91 98765 43213', email: 'vikram.s@email.com' },
        { id: 5, patient: 'Neha Gupta', time: '03:30 PM', type: 'Follow-up', status: 'confirmed', avatar: 'NG', ayurvedicConcern: 'Hormonal Balance', phone: '+91 98765 43214', email: 'neha.gupta@email.com' }
    ]);

    const [recentPatients, setRecentPatients] = useState([
        { id: 1, name: 'Meera Patel', lastVisit: '2 days ago', condition: 'Vata Imbalance', progress: '+15%', dosha: 'Vata', age: 34, lastPrescription: 'Ashwagandha, Triphala' },
        { id: 2, name: 'Amit Joshi', lastVisit: '3 days ago', condition: 'Pitta Disorder', progress: '+8%', dosha: 'Pitta', age: 42, lastPrescription: 'Brahmi, Guduchi' },
        { id: 3, name: 'Sunita Reddy', lastVisit: '5 days ago', condition: 'Kapha Excess', progress: '+22%', dosha: 'Kapha', age: 28, lastPrescription: 'Tulsi, Ginger' }
    ]);

    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New patient registered', time: '5 min ago', read: false, type: 'info' },
        { id: 2, message: 'Appointment reminder: Priya Sharma in 30 min', time: '15 min ago', read: false, type: 'warning' },
        { id: 3, message: 'Lab results uploaded for Rajesh Kumar', time: '1 hour ago', read: true, type: 'success' }
    ]);

    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'patient', message: 'Doctor, I\'ve been feeling better after taking the prescribed medicines.', time: '10:30 AM', patientId: 1 },
        { id: 2, sender: 'doctor', message: 'That\'s great to hear! Continue the medication and keep me updated.', time: '10:35 AM', patientId: 1 },
        { id: 3, sender: 'patient', message: 'Should I continue the Panchakarma treatment?', time: '10:40 AM', patientId: 1 }
    ]);

    const [upcomingConsultations, setUpcomingConsultations] = useState([
        {
            id: 1,
            time: '04:00 PM',
            patient: 'Kavita Nair',
            type: 'Video Call',
            dosha: 'Vata-Pitta',
            age: 45,
            concern: 'Chronic Anxiety & Sleep Issues',
            duration: '45 min',
            phone: '+91 98765 43215',
            email: 'kavita.nair@email.com',
            lastVisit: '2 weeks ago',
            status: 'upcoming',
            priority: 'high'
        },
        {
            id: 2,
            time: '05:30 PM',
            patient: 'Rahul Verma',
            type: 'In-person',
            dosha: 'Kapha',
            age: 38,
            concern: 'Weight Management & Digestion',
            duration: '60 min',
            phone: '+91 98765 43216',
            email: 'rahul.verma@email.com',
            lastVisit: '1 month ago',
            status: 'upcoming',
            priority: 'medium'
        },
        {
            id: 3,
            time: '11:00 AM',
            patient: 'Sneha Reddy',
            type: 'Video Call',
            dosha: 'Pitta',
            age: 29,
            concern: 'Skin Problems (Acne & Eczema)',
            duration: '30 min',
            phone: '+91 98765 43217',
            email: 'sneha.reddy@email.com',
            lastVisit: 'First visit',
            status: 'upcoming',
            priority: 'high'
        },
        {
            id: 4,
            time: '02:30 PM',
            patient: 'Arjun Mehta',
            type: 'Follow-up',
            dosha: 'Vata',
            age: 52,
            concern: 'Joint Pain & Arthritis',
            duration: '45 min',
            phone: '+91 98765 43218',
            email: 'arjun.mehta@email.com',
            lastVisit: '1 week ago',
            status: 'upcoming',
            priority: 'medium'
        },
        // {
        //     id: 5,
        //     time: '06:00 PM',
        //     patient: 'Lakshmi Iyer',
        //     type: 'Therapy',
        //     dosha: 'Kapha-Pitta',
        //     age: 61,
        //     concern: 'Respiratory Issues & Sinusitis',
        //     duration: '60 min',
        //     phone: '+91 98765 43219',
        //     email: 'lakshmi.iyer@email.com',
        //     lastVisit: '3 weeks ago',
        //     status: 'upcoming',
        //     priority: 'low'
        // },
        // {
        //     id: 6,
        //     time: '09:30 AM',
        //     patient: 'Deepak Joshi',
        //     type: 'Video Call',
        //     dosha: 'Pitta-Vata',
        //     age: 34,
        //     concern: 'Acidity & GERD',
        //     duration: '30 min',
        //     phone: '+91 98765 43220',
        //     email: 'deepak.joshi@email.com',
        //     lastVisit: 'First visit',
        //     status: 'upcoming',
        //     priority: 'medium'
        // },
        // {
        //     id: 7,
        //     time: '01:00 PM',
        //     patient: 'Priyanka Shah',
        //     type: 'In-person',
        //     dosha: 'Vata',
        //     age: 27,
        //     concern: 'Hormonal Imbalance & PCOS',
        //     duration: '45 min',
        //     phone: '+91 98765 43221',
        //     email: 'priyanka.shah@email.com',
        //     lastVisit: '2 weeks ago',
        //     status: 'upcoming',
        //     priority: 'high'
        // },
        // {
        //     id: 8,
        //     time: '07:30 PM',
        //     patient: 'Mohan Das',
        //     type: 'Follow-up',
        //     dosha: 'Kapha',
        //     age: 48,
        //     concern: 'Diabetes Management',
        //     duration: '30 min',
        //     phone: '+91 98765 43222',
        //     email: 'mohan.das@email.com',
        //     lastVisit: '1 week ago',
        //     status: 'upcoming',
        //     priority: 'medium'
        // }
    ]);

    const [newMessage, setNewMessage] = useState('');

    // Filter appointments based on search
    const filteredAppointments = appointments.filter(apt =>
        apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.ayurvedicConcern.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get status color with better styling
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-100 text-emerald-700';
            case 'waiting': return 'bg-amber-100 text-amber-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-rose-100 text-rose-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={14} />;
            case 'waiting': return <Clock size={14} />;
            case 'completed': return <CheckCheck size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    // Handle appointment status update
    const updateAppointmentStatus = (id, newStatus) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status: newStatus } : apt
        ));
        showToast(`Appointment status updated to ${newStatus}`, 'success');
    };

    // Handle delete appointment
    const deleteAppointment = (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            setAppointments(appointments.filter(apt => apt.id !== id));
            showToast('Appointment deleted successfully', 'success');
        }
    };

    // Handle add appointment
    const handleAddAppointment = () => {
        if (!newAppointment.patient || !newAppointment.time) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        const newId = appointments.length + 1;
        const newApt = {
            id: newId,
            patient: newAppointment.patient,
            time: newAppointment.time,
            type: newAppointment.type,
            status: 'confirmed',
            avatar: newAppointment.patient.split(' ').map(n => n[0]).join(''),
            ayurvedicConcern: newAppointment.concern || 'General Checkup',
            phone: '+91 XXXXX XXXXX',
            email: 'patient@email.com'
        };

        setAppointments([...appointments, newApt]);
        setShowAddAppointment(false);
        setNewAppointment({ patient: '', time: '', type: 'Consultation', concern: '' });
        showToast('Appointment added successfully', 'success');
    };

    // Toast notification
    const [toast, setToast] = useState(null);
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Mark notification as read
    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
        showToast('All notifications marked as read', 'success');
    };

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

    // Dosha tips based on selected
    const doshaTips = {
        Vata: ['Warm, cooked foods', 'Regular routine', 'Oil massage', 'Avoid cold drinks'],
        Pitta: ['Cooling foods', 'Avoid spicy', 'Coconut oil', 'Moonlight walks'],
        Kapha: ['Light, warm foods', 'Regular exercise', 'Dry brushing', 'Honey in warm water']
    };
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);
    return (
        <div className="min-h-screen font-sans">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                        } text-white`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}


            {/* Main Content */}
            <main className="">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] rounded-2xl p-6 mb-8 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Welcome back, Dr. Sharma</h2>
                            <p className="text-emerald-100">You have {appointments.filter(a => a.status === 'confirmed').length} confirmed appointments today</p>
                            <div className="flex items-center space-x-2 mt-3">
                                <div className="flex -space-x-2">
                                    {recentPatients.slice(0, 3).map((patient, idx) => (
                                        <div key={idx} className="w-8 h-8 rounded-full bg-white bg-opacity-20 border-2 border-[#0D614E] flex items-center justify-center text-xs font-semibold">
                                            {patient.name.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-emerald-100">+{recentPatients.length} patients this week</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                <CalendarDays size={40} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid with loading state */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1 font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <div className="flex items-center space-x-1 mt-2">
                                        {stat.trend === 'up' ?
                                            <ArrowUp size={12} className="text-emerald-600" /> :
                                            <ArrowDown size={12} className="text-rose-600" />
                                        }
                                        <p className="text-xs text-emerald-600">{stat.change} from last month</p>
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
                        {/* Today's Appointments with Actions */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Today's Appointments</h3>
                                        <p className="text-sm text-gray-500 mt-1">{appointments.length} appointments scheduled</p>
                                    </div>
                                    <div className="flex space-x-2">
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
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                            <Download size={18} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add Appointment Modal */}
                            {showAddAppointment && (
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
                                            <select
                                                value={newAppointment.type}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            >
                                                <option>Consultation</option>
                                                <option>Follow-up</option>
                                                <option>Therapy</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Concern (optional)"
                                                value={newAppointment.concern}
                                                onChange={(e) => setNewAppointment({ ...newAppointment, concern: e.target.value })}
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
                            )}

                            <div className="divide-y divide-gray-100">
                                {filteredAppointments.map((appointment) => (
                                    <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white font-semibold">
                                                    {appointment.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{appointment.patient}</p>
                                                    <p className="text-sm text-gray-500">{appointment.ayurvedicConcern}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Clock size={12} className="text-gray-400" />
                                                        <span className="text-xs text-gray-500">{appointment.time}</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-500">{appointment.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(appointment.status)}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                                <div className="relative group">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                        <MoreVertical size={18} className="text-gray-400" />
                                                    </button>
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                                        >
                                                            Mark as Completed
                                                        </button>
                                                        <button
                                                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => deleteAppointment(appointment.id)}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-rose-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-gray-200">
                                <button className="w-full py-2 text-sm font-medium rounded-lg transition-all hover:shadow-md" style={{ color: '#0D614E', backgroundColor: `${'#0D614E'}10` }}>
                                    View All Appointments
                                </button>
                            </div>
                        </div>

                        {/* Recent Patients with Expanded Info */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Patients</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosha</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Rx</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentPatients.map((patient) => (
                                            <tr key={patient.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                                                            {patient.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-800">{patient.name}</span>
                                                            <p className="text-xs text-gray-500">{patient.age} yrs</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${patient.dosha === 'Vata' ? 'bg-purple-100 text-purple-700' :
                                                        patient.dosha === 'Pitta' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {patient.dosha === 'Vata' && <Wind size={12} />}
                                                        {patient.dosha === 'Pitta' && <Sun size={12} />}
                                                        {patient.dosha === 'Kapha' && <Moon size={12} />}
                                                        <span>{patient.dosha}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{patient.condition}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                                            <div className="bg-emerald-500 rounded-full h-2" style={{ width: patient.progress }}></div>
                                                        </div>
                                                        <span className="text-sm text-emerald-600">{patient.progress}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{patient.lastPrescription}</td>
                                                <td className="px-6 py-4">
                                                    <button className="text-sm font-medium hover:underline flex items-center space-x-1" style={{ color: '#0D614E' }}>
                                                        <Eye size={14} />
                                                        <span>View</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-xs rounded-lg p-3 ${msg.sender === "doctor"
                                                    ? "text-white"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                                style={msg.sender === "doctor" ? { backgroundColor: "#0D614E" } : {}}
                                            >
                                                <p className={`text-sm ${msg.sender === "doctor"
                                                    ? "text-white"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}>{msg.message}</p>
                                                <p className={`text-xs mt-1 opacity-75 ${msg.sender === "doctor"
                                                    ? "text-white"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}>{msg.time}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 👇 THIS IS IMPORTANT */}
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
                                        <button
                                            onClick={sendMessage}
                                            className="p-2 rounded-lg text-white"
                                            style={{ backgroundColor: '#0D614E' }}
                                        >
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
                                <button onClick={() => setShowAddAppointment(true)} className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>New Appointment</span>
                                    <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>Add Patient</span>
                                    <Users size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>Create Prescription</span>
                                    <Pill size={18} className="group-hover:rotate-12 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between px-4 py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all group">
                                    <span>Video Consultation</span>
                                    <Video size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Consultations with Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Consultations</h3>
                            <div className="space-y-4">
                                {upcomingConsultations.map((consultation, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                                        <div>
                                            <p className="font-semibold text-gray-800">{consultation.patient}</p>
                                            <p className="text-xs text-gray-500 mt-1">{consultation.time} • {consultation.type}</p>
                                            <span className="inline-flex items-center space-x-1 px-2 py-1 bg-[#0D614E] bg-opacity-10 rounded text-xs mt-1" style={{ color: '#0D614E' }}>
                                                <Sparkles size={10} />
                                                <span>{consultation.dosha}</span>
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            {/* <button className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-110">
                                                <Phone size={16} className="text-gray-600" />
                                            </button> */}
                                            <button className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-110">
                                                <Video size={16} className="text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dosha-Specific Tips with Icons */}
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

                        {/* Patient Satisfaction Chart Placeholder */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Patient Satisfaction</h3>
                                <div className="flex items-center space-x-1">
                                    <Star size={16} className="text-yellow-400 fill-current" />
                                    <span className="font-bold text-gray-800">4.8</span>
                                    <span className="text-xs text-gray-500">/5.0</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {['Treatment Effectiveness', 'Communication', 'Wait Time', 'Facility'].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{item}</span>
                                            <span className="text-gray-800 font-medium">{4.5 + (idx * 0.1)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="h-2 rounded-full" style={{ width: `${(4.5 + (idx * 0.1)) * 20}%`, backgroundColor: '#0D614E' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Patient Details Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-semibold">Patient Details</h3>
                            <button onClick={() => setSelectedPatient(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedPatient.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h4>
                                    <p className="text-gray-500">{selectedPatient.age} years • {selectedPatient.dosha} Dosha</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Mail size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">{selectedPatient.name.toLowerCase().replace(' ', '.')}@email.com</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Last Visit</p>
                                    <p className="font-semibold">{selectedPatient.lastVisit}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Condition</p>
                                    <p className="font-semibold">{selectedPatient.condition}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                                    <p className="text-xs text-gray-500">Last Prescription</p>
                                    <p className="font-semibold">{selectedPatient.lastPrescription}</p>
                                </div>
                            </div>
                            <div className="bg-emerald-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Award size={18} style={{ color: '#0D614E' }} />
                                    <p className="font-semibold" style={{ color: '#0D614E' }}>Next Steps</p>
                                </div>
                                <p className="text-sm text-gray-700">Schedule follow-up in 2 weeks. Continue current medication and monitor symptoms.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;