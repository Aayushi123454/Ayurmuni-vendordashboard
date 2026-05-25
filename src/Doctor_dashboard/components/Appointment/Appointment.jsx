import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Users,
    Clock,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    Video,
    Phone,
    MapPin,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Download,
    Upload,
    Mail,
    MessageSquare,
    Star,
    AlertCircle,
    CheckCheck,
    X,
    CalendarDays,
    List,
    Grid3x3,
    User,
    Bell,
    Settings,
    Activity,
    Pill,
    FileText,
    Stethoscope,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    Send,
    PhoneCall,
    VideoIcon,
    Users as UsersIcon,
    DollarSign,
    Smile,
    Frown,
    Meh
} from 'lucide-react';

const AppointmentsPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('time');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [toast, setToast] = useState(null);

    // Sample appointments data
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patientName: 'Priya Sharma',
            patientAge: 34,
            patientGender: 'Female',
            patientPhone: '+91 98765 43210',
            patientEmail: 'priya.sharma@email.com',
            patientAvatar: 'PS',
            time: '09:00 AM',
            date: '2024-01-15',
            type: 'Consultation',
            status: 'confirmed',
            concern: 'Digestive Issues',
            dosha: 'Vata',
            duration: 45,
            fee: 1500,
            notes: 'Patient complaining of irregular digestion and bloating',
            lastVisit: '2024-01-01',
            prescription: ['Triphala', 'Ashwagandha']
        },
        {
            id: 2,
            patientName: 'Rajesh Kumar',
            patientAge: 42,
            patientGender: 'Male',
            patientPhone: '+91 98765 43211',
            patientEmail: 'rajesh.k@email.com',
            patientAvatar: 'RK',
            time: '10:30 AM',
            date: '2024-01-15',
            type: 'Follow-up',
            status: 'waiting',
            concern: 'Joint Pain',
            dosha: 'Vata-Pitta',
            duration: 30,
            fee: 1000,
            notes: 'Chronic knee pain, morning stiffness',
            lastVisit: '2024-01-08',
            prescription: ['Yograj Guggul', 'Dashmool']
        },
        {
            id: 3,
            patientName: 'Anita Desai',
            patientAge: 29,
            patientGender: 'Female',
            patientPhone: '+91 98765 43212',
            patientEmail: 'anita.desai@email.com',
            patientAvatar: 'AD',
            time: '12:00 PM',
            date: '2024-01-15',
            type: 'Therapy',
            status: 'completed',
            concern: 'Stress Management',
            dosha: 'Pitta',
            duration: 60,
            fee: 2000,
            notes: 'High stress, anxiety, sleep issues',
            lastVisit: '2024-01-10',
            prescription: ['Brahmi', 'Jatamansi']
        },
        {
            id: 4,
            patientName: 'Vikram Singh',
            patientAge: 38,
            patientGender: 'Male',
            patientPhone: '+91 98765 43213',
            patientEmail: 'vikram.s@email.com',
            patientAvatar: 'VS',
            time: '02:00 PM',
            date: '2024-01-15',
            type: 'Consultation',
            status: 'cancelled',
            concern: 'Skin Problems',
            dosha: 'Pitta-Kapha',
            duration: 45,
            fee: 1500,
            notes: 'Acne, eczema, skin allergies',
            lastVisit: '2024-01-05',
            prescription: ['Neem', 'Manjistha']
        },
        {
            id: 5,
            patientName: 'Neha Gupta',
            patientAge: 31,
            patientGender: 'Female',
            patientPhone: '+91 98765 43214',
            patientEmail: 'neha.gupta@email.com',
            patientAvatar: 'NG',
            time: '03:30 PM',
            date: '2024-01-15',
            type: 'Follow-up',
            status: 'confirmed',
            concern: 'Hormonal Balance',
            dosha: 'Vata-Kapha',
            duration: 30,
            fee: 1000,
            notes: 'Irregular periods, hormonal acne',
            lastVisit: '2024-01-12',
            prescription: ['Shatavari', 'Lodhra']
        },
        {
            id: 6,
            patientName: 'Meera Patel',
            patientAge: 45,
            patientGender: 'Female',
            patientPhone: '+91 98765 43215',
            patientEmail: 'meera.p@email.com',
            patientAvatar: 'MP',
            time: '11:00 AM',
            date: '2024-01-16',
            type: 'Consultation',
            status: 'confirmed',
            concern: 'Thyroid Issues',
            dosha: 'Kapha',
            duration: 45,
            fee: 1500,
            notes: 'Weight gain, fatigue, hair loss',
            lastVisit: '2024-01-05',
            prescription: ['Kanchnar Guggul', 'Punarnava']
        },
        {
            id: 7,
            patientName: 'Amit Joshi',
            patientAge: 52,
            patientGender: 'Male',
            patientPhone: '+91 98765 43216',
            patientEmail: 'amit.j@email.com',
            patientAvatar: 'AJ',
            time: '04:00 PM',
            date: '2024-01-16',
            type: 'Therapy',
            status: 'pending',
            concern: 'Diabetes Management',
            dosha: 'Kapha-Pitta',
            duration: 60,
            fee: 2000,
            notes: 'Type 2 diabetes, high blood sugar',
            lastVisit: '2024-01-09',
            prescription: ['Vijayasar', 'Gudmar']
        },
        {
            id: 8,
            patientName: 'Sunita Reddy',
            patientAge: 28,
            patientGender: 'Female',
            patientPhone: '+91 98765 43217',
            patientEmail: 'sunita.r@email.com',
            patientAvatar: 'SR',
            time: '09:30 AM',
            date: '2024-01-17',
            type: 'Follow-up',
            status: 'confirmed',
            concern: 'Weight Management',
            dosha: 'Kapha',
            duration: 30,
            fee: 1000,
            notes: 'Obesity, slow metabolism',
            lastVisit: '2024-01-10',
            prescription: ['Triphala', 'Guggul']
        }
    ]);

    const [newAppointment, setNewAppointment] = useState({
        patientName: '',
        patientAge: '',
        patientGender: 'Female',
        patientPhone: '',
        patientEmail: '',
        time: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Consultation',
        concern: '',
        dosha: 'Vata',
        duration: 30,
        fee: 1000,
        notes: ''
    });

    // Filter and sort appointments
    const filteredAppointments = appointments
        .filter(apt => {
            const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.patientPhone.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
            const matchesType = typeFilter === 'all' || apt.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((a, b) => {
            if (sortBy === 'time') return a.time.localeCompare(b.time);
            if (sortBy === 'name') return a.patientName.localeCompare(b.patientName);
            if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
            return 0;
        });

    // Statistics
    const stats = {
        total: appointments.length,
        today: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length,
        confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
        completed: appointments.filter(apt => apt.status === 'completed').length,
        cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
        pending: appointments.filter(apt => apt.status === 'pending').length,
        totalRevenue: appointments.reduce((sum, apt) => apt.status === 'completed' ? sum + apt.fee : sum, 0),
        averageRating: 4.8
    };

    // Get status color and icon
    const getStatusInfo = (status) => {
        switch (status) {
            case 'confirmed': return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Confirmed' };
            case 'waiting': return { color: 'bg-amber-100 text-amber-700', icon: ClockIcon, label: 'Waiting' };
            case 'completed': return { color: 'bg-blue-100 text-blue-700', icon: CheckCheck, label: 'Completed' };
            case 'cancelled': return { color: 'bg-rose-100 text-rose-700', icon: XCircle, label: 'Cancelled' };
            case 'pending': return { color: 'bg-purple-100 text-purple-700', icon: AlertCircle, label: 'Pending' };
            default: return { color: 'bg-gray-100 text-gray-700', icon: ClockIcon, label: status };
        }
    };

    // Get type icon
    const getTypeIcon = (type) => {
        switch (type) {
            case 'Consultation': return <Users size={14} />;
            case 'Follow-up': return <Clock size={14} />;
            case 'Therapy': return <Activity size={14} />;
            default: return <CalendarIcon size={14} />;
        }
    };

    // CRUD Operations
    const handleAddAppointment = () => {
        if (!newAppointment.patientName || !newAppointment.time || !newAppointment.date) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
        const appointment = {
            id: newId,
            ...newAppointment,
            patientAvatar: newAppointment.patientName.split(' ').map(n => n[0]).join(''),
            status: 'confirmed',
            lastVisit: new Date().toISOString().split('T')[0],
            prescription: []
        };

        setAppointments([...appointments, appointment]);
        setShowModal(false);
        setNewAppointment({
            patientName: '',
            patientAge: '',
            patientGender: 'Female',
            patientPhone: '',
            patientEmail: '',
            time: '',
            date: new Date().toISOString().split('T')[0],
            type: 'Consultation',
            concern: '',
            dosha: 'Vata',
            duration: 30,
            fee: 1000,
            notes: ''
        });
        showToast('Appointment added successfully', 'success');
    };

    const handleUpdateAppointment = () => {
        if (!editingAppointment) return;

        setAppointments(appointments.map(apt =>
            apt.id === editingAppointment.id ? editingAppointment : apt
        ));
        setEditingAppointment(null);
        setShowModal(false);
        showToast('Appointment updated successfully', 'success');
    };

    const handleDeleteAppointment = (id) => {
        setAppointments(appointments.filter(apt => apt.id !== id));
        setShowDeleteConfirm(null);
        showToast('Appointment deleted successfully', 'success');
    };

    const handleStatusChange = (id, newStatus) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status: newStatus } : apt
        ));
        showToast(`Appointment status changed to ${newStatus}`, 'success');
    };

    // Show toast notification
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Patient Name', 'Age', 'Gender', 'Phone', 'Email', 'Date', 'Time', 'Type', 'Status', 'Concern', 'Dosha', 'Fee'];
        const csvData = appointments.map(apt => [
            apt.patientName,
            apt.patientAge,
            apt.patientGender,
            apt.patientPhone,
            apt.patientEmail,
            apt.date,
            apt.time,
            apt.type,
            apt.status,
            apt.concern,
            apt.dosha,
            apt.fee
        ]);

        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        showToast('Appointments exported successfully', 'success');
    };

    return (
        <div className="min-h-screen">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${toast.type === 'success' ? 'bg-emerald-500' :
                        toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                        } text-white`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> :
                            toast.type === 'error' ? <XCircle size={20} /> : <AlertCircle size={20} />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="border-b border-gray-200 sticky top-0 z-20">
                <div className="px-8 py-6 pt-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
                            <p className="text-gray-500 mt-1">Manage and track all patient appointments</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingAppointment(null);
                                setShowModal(true);
                            }}
                            className="px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm hover:shadow-md transition-all"
                            style={{ backgroundColor: '#0D614E', color: 'white' }}
                        >
                            <Plus size={18} />
                            <span>New Appointment</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Total Appointments</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <ArrowUp size={12} className="text-emerald-600" />
                                    <span className="text-xs text-emerald-600">+12% this month</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <CalendarIcon size={20} style={{ color: '#0D614E' }} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Today's Appointments</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.today}</p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <span className="text-xs text-gray-500">{stats.confirmed} confirmed</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Clock size={20} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Revenue</p>
                                <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <ArrowUp size={12} className="text-emerald-600" />
                                    <span className="text-xs text-emerald-600">+18% this month</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <DollarSign size={20} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Patient Satisfaction</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <Star size={12} className="text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-500">from 128 reviews</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                                <Smile size={20} className="text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search Bar */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by patient name, concern, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                            >
                                <option value="all">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="waiting">Waiting</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="pending">Pending</option>
                            </select>

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                            >
                                <option value="all">All Types</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Therapy">Therapy</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                            >
                                <option value="time">Sort by Time</option>
                                <option value="name">Sort by Name</option>
                                <option value="date">Sort by Date</option>
                            </select>

                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                            >
                                <Download size={18} />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Concern</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Dosha</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAppointments.map((appointment) => {
                                    const statusInfo = getStatusInfo(appointment.status);
                                    const StatusIcon = statusInfo.icon;
                                    return (
                                        <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white font-semibold text-sm">
                                                        {appointment.patientAvatar}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{appointment.patientName}</p>
                                                        <p className="text-xs text-gray-500">{appointment.patientAge} yrs • {appointment.patientGender}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-800">{appointment.time}</span>
                                                    <span className="text-xs text-gray-500">{appointment.date}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-1">
                                                    {getTypeIcon(appointment.type)}
                                                    <span className="text-sm text-gray-600">{appointment.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{appointment.concern}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${appointment.dosha.includes('Vata') ? 'bg-purple-100 text-purple-700' :
                                                    appointment.dosha.includes('Pitta') ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    <span>{appointment.dosha}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon size={12} />
                                                    <span>{statusInfo.label}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-800">₹{appointment.fee}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAppointment(appointment);
                                                            setShowModal(true);
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} className="text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingAppointment(appointment);
                                                            setShowModal(true);
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} className="text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(appointment.id)}
                                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} className="text-gray-500" />
                                                    </button>
                                                    <select
                                                        value={appointment.status}
                                                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    >
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="waiting">Waiting</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                        <option value="pending">Pending</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                                    <AlertCircle size={24} className="text-rose-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Delete Appointment</h3>
                            </div>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this appointment? This action cannot be undone.</p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleDeleteAppointment(showDeleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Appointment Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {editingAppointment ? 'Edit Appointment' : selectedAppointment ? 'Appointment Details' : 'Add New Appointment'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingAppointment(null);
                                        setSelectedAppointment(null);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                {selectedAppointment && !editingAppointment ? (
                                    // View Details Mode
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white text-xl font-bold">
                                                {selectedAppointment.patientAvatar}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-800">{selectedAppointment.patientName}</h4>
                                                <p className="text-gray-500">{selectedAppointment.patientAge} years • {selectedAppointment.patientGender}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Mail size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">{selectedAppointment.patientEmail}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Phone size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">{selectedAppointment.patientPhone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Date & Time</p>
                                                <p className="font-semibold">{selectedAppointment.date} at {selectedAppointment.time}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Duration</p>
                                                <p className="font-semibold">{selectedAppointment.duration} minutes</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Type</p>
                                                <p className="font-semibold">{selectedAppointment.type}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500">Fee</p>
                                                <p className="font-semibold">₹{selectedAppointment.fee}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                                                <p className="text-xs text-gray-500">Concern</p>
                                                <p className="font-semibold">{selectedAppointment.concern}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                                                <p className="text-xs text-gray-500">Doctor's Notes</p>
                                                <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Add/Edit Form
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                                                <input
                                                    type="text"
                                                    value={editingAppointment ? editingAppointment.patientName : newAppointment.patientName}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, patientName: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, patientName: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                                <input
                                                    type="number"
                                                    value={editingAppointment ? editingAppointment.patientAge : newAppointment.patientAge}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, patientAge: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, patientAge: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                                <select
                                                    value={editingAppointment ? editingAppointment.patientGender : newAppointment.patientGender}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, patientGender: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, patientGender: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                >
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={editingAppointment ? editingAppointment.patientPhone : newAppointment.patientPhone}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, patientPhone: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, patientPhone: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={editingAppointment ? editingAppointment.patientEmail : newAppointment.patientEmail}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, patientEmail: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, patientEmail: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                                <input
                                                    type="date"
                                                    value={editingAppointment ? editingAppointment.date : newAppointment.date}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, date: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, date: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                                                <input
                                                    type="time"
                                                    value={editingAppointment ? editingAppointment.time : newAppointment.time}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, time: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, time: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                <select
                                                    value={editingAppointment ? editingAppointment.type : newAppointment.type}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, type: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, type: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                >
                                                    <option>Consultation</option>
                                                    <option>Follow-up</option>
                                                    <option>Therapy</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Dosha</label>
                                                <select
                                                    value={editingAppointment ? editingAppointment.dosha : newAppointment.dosha}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, dosha: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, dosha: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                >
                                                    <option>Vata</option>
                                                    <option>Pitta</option>
                                                    <option>Kapha</option>
                                                    <option>Vata-Pitta</option>
                                                    <option>Pitta-Kapha</option>
                                                    <option>Vata-Kapha</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                                <input
                                                    type="number"
                                                    value={editingAppointment ? editingAppointment.duration : newAppointment.duration}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, duration: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, duration: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee (₹)</label>
                                                <input
                                                    type="number"
                                                    value={editingAppointment ? editingAppointment.fee : newAppointment.fee}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, fee: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, fee: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Concern</label>
                                                <input
                                                    type="text"
                                                    value={editingAppointment ? editingAppointment.concern : newAppointment.concern}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, concern: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, concern: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor's Notes</label>
                                                <textarea
                                                    rows="3"
                                                    value={editingAppointment ? editingAppointment.notes : newAppointment.notes}
                                                    onChange={(e) => editingAppointment ?
                                                        setEditingAppointment({ ...editingAppointment, notes: e.target.value }) :
                                                        setNewAppointment({ ...newAppointment, notes: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingAppointment(null);
                                        setSelectedAppointment(null);
                                    }}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                {!selectedAppointment && (
                                    <button
                                        onClick={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
                                        className="px-4 py-2 rounded-lg text-white transition-colors"
                                        style={{ backgroundColor: '#0D614E' }}
                                    >
                                        {editingAppointment ? 'Update' : 'Save'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AppointmentsPage; 