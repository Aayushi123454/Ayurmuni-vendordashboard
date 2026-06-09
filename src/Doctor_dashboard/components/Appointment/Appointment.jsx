// AppointmentsPage.jsx - Enhanced with Reschedule/Cancel functionality
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    Users,
    Clock,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    Video,
    Phone,
    Mail,
    MessageSquare,
    Star,
    AlertCircle,
    CheckCheck,
    X,
    Download,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    CalendarDays,
    User,
    Activity,
    Stethoscope,
    DollarSign,
    Smile,
    Calendar,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { doctorService } from '../../../services/doctorService';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ==================== CONSTANTS ====================
const STATUS_CONFIG = {
    confirmed: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Confirmed', bg: 'emerald' },
    waiting: { color: 'bg-amber-100 text-amber-700', icon: ClockIcon, label: 'Waiting', bg: 'amber' },
    completed: { color: 'bg-blue-100 text-blue-700', icon: CheckCheck, label: 'Completed', bg: 'blue' },
    cancelled: { color: 'bg-rose-100 text-rose-700', icon: XCircle, label: 'Cancelled', bg: 'rose' },
    pending: { color: 'bg-purple-100 text-purple-700', icon: AlertCircle, label: 'Pending', bg: 'purple' },
    rescheduled: { color: 'bg-orange-100 text-orange-700', icon: RefreshCw, label: 'Rescheduled', bg: 'orange' }
};

const CONSULTATION_TYPES = ['video', 'chat', 'in-person'];
const STATUS_OPTIONS = ['confirmed', 'pending', 'completed', 'cancelled', 'rescheduled'];

// ==================== HELPER FUNCTIONS ====================
const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
    });
};

const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getStatusIcon = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return <Icon size={16} className={config.color.split(' ')[1]} />;
};

// ==================== REUSABLE COMPONENTS ====================
const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {trend && (
                    <div className="flex items-center space-x-1 mt-2">
                        {trend.up ? <ArrowUp size={12} className="text-emerald-600" /> : <ArrowDown size={12} className="text-rose-600" />}
                        <span className={`text-xs ${trend.up ? 'text-emerald-600' : 'text-rose-600'}`}>{trend.text}</span>
                    </div>
                )}
            </div>
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon size={20} className={iconColor} />
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon size={12} />
            <span>{config.label}</span>
        </span>
    );
};

// Reschedule/Cancel Modal
const ActionModal = ({ show, type, appointment, onClose, onConfirm, isLoading }) => {
    const [reason, setReason] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    useEffect(() => {
        if (show && type === 'reschedule' && appointment) {
            setNewDate(appointment.appointment_date || '');
            setNewTime(appointment.start_time?.slice(0, 5) || '');
        }
    }, [show, type, appointment]);

    if (!show) return null;

    const isReschedule = type === 'reschedule';
    const title = isReschedule ? 'Reschedule Appointment' : 'Cancel Appointment';
    const icon = isReschedule ? <RefreshCw size={24} className="text-orange-600" /> : <XCircle size={24} className="text-rose-600" />;
    const iconBg = isReschedule ? 'bg-orange-100' : 'bg-rose-100';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                        {icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                </div>

                <p className="text-gray-600 mb-4">
                    {isReschedule
                        ? `Change appointment for ${appointment?.patient_name || 'patient'} to a new time`
                        : `Are you sure you want to cancel appointment with ${appointment?.patient_name || 'patient'}?`
                    }
                </p>

                {isReschedule && (
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Date *</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Time *</label>
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason {isReschedule ? 'for Rescheduling' : 'for Cancellation'} *</label>
                            <textarea
                                rows="3"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder={isReschedule ? "Please provide reason for rescheduling..." : "Please provide reason for cancellation..."}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                            />
                        </div>
                    </div>
                )}

                {!isReschedule && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation *</label>
                        <textarea
                            rows="3"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide reason for cancellation..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                        />
                    </div>
                )}

                <div className="flex space-x-3">
                    <button onClick={e => {
                        onClose()
                        setReason("")
                    }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm({ reason, newDate, newTime, reschedule: (isReschedule ? "reschedule" : "cancel") })
                            setReason("")
                        }}
                        disabled={isLoading || (isReschedule && (!newDate || !newTime)) || !reason
                        }
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 ${isReschedule ? 'bg-orange-600 hover:bg-orange-700' : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                    >
                        {isLoading ? <RefreshCw size={16} className="animate-spin mx-auto" /> : (isReschedule ? 'Confirm Reschedule' : 'Confirm Cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Appointment Details Modal
const AppointmentDetailsModal = ({ show, appointment, onClose, onReschedule, onCancel }) => {
    if (!show || !appointment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CalendarDays size={20} className="text-[#0D614E]" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Appointment Details</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Patient Info */}
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#0D614E]/5 to-transparent rounded-xl mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {getInitials(appointment.patient_name)}
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-800">{appointment.patient_name || 'Patient'}</h4>
                            <div className="flex flex-wrap gap-3 mt-1">
                                {appointment.patient_email && (
                                    <div className="flex items-center space-x-1">
                                        <Mail size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">{appointment.patient_email}</span>
                                    </div>
                                )}
                                {appointment.patient_phone && (
                                    <div className="flex items-center space-x-1">
                                        <Phone size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">{appointment.patient_phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Appointment Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Calendar size={16} className="text-[#0D614E]" />
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                            </div>
                            <p className="font-semibold text-gray-800">{formatDate(appointment.appointment_date)}</p>
                            <p className="text-sm text-gray-600 mt-1">
                                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Clock size={16} className="text-[#0D614E]" />
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                            </div>
                            <p className="font-semibold text-gray-800">
                                {appointment.end_time ? `${Math.ceil((new Date(`2000-01-01T${appointment.end_time}`) - new Date(`2000-01-01T${appointment.start_time}`)) / (1000 * 60))} minutes` : '--'}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Video size={16} className="text-[#0D614E]" />
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Type</p>
                            </div>
                            <p className="font-semibold text-gray-800 capitalize">{appointment.consultation_type || '--'}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle size={16} className="text-[#0D614E]" />
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                            </div>
                            <StatusBadge status={appointment.status} />
                        </div>

                        <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <MessageSquare size={16} className="text-[#0D614E]" />
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Notes / Concern</p>
                            </div>
                            <p className="text-sm text-gray-700">{appointment.notes || 'No notes provided'}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'rescheduled' && (
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => { onClose(); onReschedule(appointment); }}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                            >
                                <RefreshCw size={16} />
                                <span>Reschedule</span>
                            </button>
                            <button
                                onClick={() => { onClose(); onCancel(appointment); }}
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-2"
                            >
                                <XCircle size={16} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ show, onConfirm, onCancel }) => {
    if (!show) return null;
    return (
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
                    <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Delete</button>
                </div>
            </div>
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-[#0D614E] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const EmptyState = ({ message, onRefresh }) => (
    <div className="text-center py-12">
        <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">{message || "No appointments found"}</p>
        <button onClick={onRefresh} className="px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90">
            Refresh
        </button>
    </div>
);

// ==================== MAIN COMPONENT ====================
const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    // const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [actionType, setActionType] = useState(null); // 'reschedule' or 'cancel'

    // Fetch appointments from API
    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await doctorService?.getAppointment("appointment");
            console.log("API Response:", response);

            if (response?.data?.success && response?.data?.data?.results) {
                const appointmentsData = response.data.data.results.map(apt => ({
                    id: apt.id,
                    appointment_date: apt.appointment_date,
                    start_time: apt.start_time,
                    end_time: apt.end_time,
                    consultation_type: apt.consultation_type,
                    status: apt.status,
                    notes: apt.notes,
                    concern: apt.concern,
                    patient_id: apt.patient,
                    doctor_id: apt.doctor,
                    patient_name: apt.patient_name,
                    patient_prakriti: apt.prakriti,
                    patient_email: '',
                    patient_phone: '',
                    patient_age: '',
                    patient_gender: '',
                    fee: 0,
                    availability: apt.availability
                }));
                setAppointments(appointmentsData);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Filter and sort appointments
    const filteredAppointments = useMemo(() => {
        return appointments
            .filter(apt => {
                const matchesSearch = searchTerm === '' ||
                    (apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (apt.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
                const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
                const matchesType = typeFilter === 'all' || apt.consultation_type === typeFilter;
                return matchesSearch && matchesStatus && matchesType;
            })
            .sort((a, b) => {
                const dateCompare = new Date(b.appointment_date) - new Date(a.appointment_date);
                if (dateCompare !== 0) return dateCompare;
                return (a.start_time || '').localeCompare(b.start_time || '');
            });
    }, [appointments, searchTerm, statusFilter, typeFilter]);

    // Statistics
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(apt => apt.appointment_date === today);

        return {
            total: appointments.length,
            today: todayAppointments.length,
            confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
            completed: appointments.filter(apt => apt.status === 'completed').length,
            cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
            pending: appointments.filter(apt => apt.status === 'pending').length,
            rescheduled: appointments.filter(apt => apt.status === 'rescheduled').length
        };
    }, [appointments]);

    // Handle Reschedule
    const handleReschedule = async ({ reason, newDate, newTime, reschedule }) => {
        if (!selectedAppointment) return;
        setIsActionLoading(true);
        try {
            const response = await doctorService?.updateAppointmentstatus(selectedAppointment.id, actionType === 'reschedule' ? {
                availability: selectedAppointment.availability,
                appointment_date: newDate,
                start_time: newTime,
                end_time: `${parseInt(newTime.split(':')[0]) + 1}:${newTime.split(':')[1]}:00`,
                action: reschedule,
                reschedule_reason: reason,
                rescheduled_by: 'doctor'
            } : {
                availability: selectedAppointment.availability,
                // appointment_date: newDate,
                // start_time: newTime,
                // end_time: `${parseInt(newTime.split(':')[0]) + 1}:${newTime.split(':')[1]}:00`,
                action: reschedule,
                cancellation_reason: reason,
                rescheduled_by: 'doctor'
            });

            if (response?.data?.success) {
                toast.success('Appointment rescheduled successfully');
                setShowActionModal(false);
                setSelectedAppointment(null);
                setActionType(null);
                fetchAppointments();
            } else {
                toast.error(response?.data?.message || 'Failed to reschedule appointment');
            }
        } catch (error) {
            console.error('Reschedule error:', error);
            toast.error('Failed to reschedule appointment');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Handle Cancel
    const handleCancel = async ({ reason }) => {
        if (!selectedAppointment) return;
        setIsActionLoading(true);
        try {
            const response = await doctorService?.updateAppointment(selectedAppointment.id, {
                status: 'cancelled',
                cancellation_reason: reason,
                cancelled_by: 'doctor'
            });

            if (response?.data?.success) {
                toast.success('Appointment cancelled successfully');
                setShowActionModal(false);
                setSelectedAppointment(null);
                setActionType(null);
                fetchAppointments();
            } else {
                toast.error(response?.data?.message || 'Failed to cancel appointment');
            }
        } catch (error) {
            console.error('Cancel error:', error);
            toast.error('Failed to cancel appointment');
        } finally {
            setIsActionLoading(false);
        }
    };

    // Handle Delete
    const handleDeleteAppointment = async (id) => {
        try {
            const response = await doctorService?.deleteAppointment(id);
            if (response?.data?.success) {
                toast.success('Appointment deleted successfully');
                setShowDeleteConfirm(null);
                fetchAppointments();
            } else {
                toast.error(response?.data?.message || 'Failed to delete appointment');
            }
        } catch (error) {
            console.error('Delete appointment error:', error);
            toast.error('Failed to delete appointment');
        }
    };

    // Export to CSV
    // const exportToCSV = () => {
    //     const headers = ['Date', 'Start Time', 'End Time', 'Patient Name', 'Consultation Type', 'Status', 'Notes'];
    //     const csvData = filteredAppointments.map(apt => [
    //         apt.appointment_date,
    //         formatTime(apt.start_time),
    //         formatTime(apt.end_time),
    //         apt.patient_name,
    //         apt.consultation_type,
    //         apt.status,
    //         apt.notes
    //     ]);

    //     const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    //     const blob = new Blob([csvContent], { type: 'text/csv' });
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    //     a.click();
    //     toast.success('Appointments exported successfully');
    // };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-20">
                <div className="px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
                            <p className="text-gray-500 mt-1">Manage and track all patient appointments</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={fetchAppointments} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" title="Refresh">
                                <RefreshCw size={18} className="text-gray-500" />
                            </button>
                            {/* <button onClick={exportToCSV} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                                <Download size={18} /><span>Export</span>
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard title="Total Appointments" value={stats.total} icon={CalendarIcon} iconBg="bg-emerald-50" iconColor="text-[#0D614E]" />
                    <StatCard title="Today's Appointments" value={stats.today} icon={Clock} iconBg="bg-blue-50" iconColor="text-blue-600" />
                    <StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                    <StatCard title="Pending" value={stats.pending} icon={AlertCircle} iconBg="bg-purple-50" iconColor="text-purple-600" />
                    <StatCard title="Completed" value={stats.completed} icon={CheckCheck} iconBg="bg-green-50" iconColor="text-green-600" />
                </div>

                {/* Filters and Search Bar */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by patient name or concern..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                <option value="all">All Status</option>
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>{STATUS_CONFIG[status]?.label || status}</option>
                                ))}
                            </select>
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                <option value="all">All Types</option>
                                {CONSULTATION_TYPES.map(type => (
                                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : filteredAppointments.length === 0 ? (
                        <EmptyState message="No appointments found" onRefresh={fetchAppointments} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Prakriti</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Concern</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAppointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-800">{formatDate(appointment.appointment_date)}</span>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Clock size={12} className="text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                                        {getInitials(appointment.patient_name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{appointment.patient_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {appointment.patient_prakriti || "N/A"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-1">
                                                    {appointment.consultation_type === 'video' && <Video size={14} className="text-purple-500" />}
                                                    {appointment.consultation_type === 'chat' && <MessageSquare size={14} className="text-blue-500" />}
                                                    {appointment.consultation_type === 'in-person' && <Users size={14} className="text-green-500" />}
                                                    <span className="text-sm text-gray-600 capitalize">{appointment.consultation_type || '--'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{appointment.notes?.slice(0, 40) || '--'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={appointment.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {/* View Button - Opens Details Modal */}
                                                    <Link to={`appointment/${appointment.id}`}
                                                        // onClick={() => { setSelectedAppointment(appointment); setShowDetailsModal(true); }}
                                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} className="text-gray-500" />
                                                    </Link>

                                                    {/* Reschedule Button - Only for active appointments */}
                                                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && appointment.status !== 'rescheduled' && (
                                                        <button
                                                            onClick={() => { setSelectedAppointment(appointment); setActionType('reschedule'); setShowActionModal(true); }}
                                                            className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
                                                            title="Reschedule"
                                                        >
                                                            <RefreshCw size={16} className="text-orange-600" />
                                                        </button>
                                                    )}

                                                    {/* Cancel Button - Only for active appointments */}
                                                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                                        <button
                                                            onClick={() => { setSelectedAppointment(appointment); setActionType('cancel'); setShowActionModal(true); }}
                                                            className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <XCircle size={16} className="text-rose-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {/* <AppointmentDetailsModal
                show={showDetailsModal}
                appointment={selectedAppointment}
                onClose={() => { setShowDetailsModal(false); setSelectedAppointment(null); }}
                onReschedule={(apt) => { setSelectedAppointment(apt); setActionType('reschedule'); setShowActionModal(true); }}
                onCancel={(apt) => { setSelectedAppointment(apt); setActionType('cancel'); setShowActionModal(true); }}
            /> */}

            <ActionModal
                show={showActionModal}
                type={actionType}
                appointment={selectedAppointment}
                onClose={() => { setShowActionModal(false); setSelectedAppointment(null); setActionType(null); }}
                onConfirm={handleReschedule}
                isLoading={isActionLoading}
            />

            <DeleteConfirmModal
                show={!!showDeleteConfirm}
                onConfirm={() => handleReschedule(showDeleteConfirm)}
                onCancel={() => setShowDeleteConfirm(null)}
            />

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default AppointmentsPage;