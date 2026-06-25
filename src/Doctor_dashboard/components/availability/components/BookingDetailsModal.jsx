// components/BookingDetailsModal.jsx
import React, { useState } from 'react';
import { X, Edit, Trash2, Users, Calendar, Clock, Phone, Mail, User, Activity, CreditCard, DollarSign, AlertCircle, CheckCircle, Video, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const BookingDetailsModal = ({ slot, onClose, onEdit, onDelete, onUpdateStatus }) => {
    const [updatingStatus, setUpdatingStatus] = useState(false);

    if (!slot) return null;

    // Get booking details from slot
    const isBooked = slot.is_booked;
    const booking = slot.booked_by;
    const hasBooking = isBooked && booking;

    // Format time (remove seconds if present)
    const formatTime = (time) => {
        return time?.substring(0, 5) || time;
    };

    // Get consultation type icon
    const getConsultationIcon = () => {
        switch (slot.consultation_type) {
            case 'video': return <Video className="w-4 h-4" />;
            case 'chat': return <MessageCircle className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    // Get status badge configuration
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle className="w-3.5 h-3.5" /> };
            case 'pending':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: <AlertCircle className="w-3.5 h-3.5" /> };
            case 'confirmed':
                return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: <CheckCircle className="w-3.5 h-3.5" /> };
            case 'cancelled':
                return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: <X className="w-3.5 h-3.5" /> };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: <Activity className="w-3.5 h-3.5" /> };
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!hasBooking) return;

        setUpdatingStatus(true);
        try {
            await onUpdateStatus(booking.appointment_id, { status: newStatus });
            toast.success(`Appointment ${newStatus} successfully`);
        } catch (error) {
            toast.error('Failed to update appointment status');
            console.error('Status update error:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const statusConfig = hasBooking ? getStatusConfig(booking.appointment_status) : null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {isBooked ? 'Appointment Details' : 'Slot Details'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {isBooked ? 'View and manage appointment information' : 'Slot information'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Slot Information Card */}
                    <div className="bg-gradient-to-r from-[#0a4d3e] to-[#0d614e] rounded-xl p-5 mb-6 text-white">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-emerald-100 mb-1">Date</p>
                                <p className="font-semibold text-white">
                                    {format(new Date(slot.date), 'MMMM d, yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-100 mb-1">Time</p>
                                <p className="font-semibold text-white">
                                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-100 mb-1">Consultation Type</p>
                                <div className="flex items-center gap-1.5">
                                    {getConsultationIcon()}
                                    <p className="font-semibold capitalize text-white">{slot.consultation_type}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-100 mb-1">Amount</p>
                                <div className="flex items-center gap-1">
                                    <p className="font-semibold text-white">₹{slot.amount}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-100 mb-1">Status</p>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${isBooked ? 'bg-red-400' : 'bg-emerald-400'}`} />
                                    <p className="font-semibold capitalize text-white">
                                        {isBooked ? 'Booked' : 'Available'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details Section */}
                    {hasBooking ? (
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#0D614E]" />
                                Patient Information
                            </h4>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                {/* Patient Header */}
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <Link to={'/doctor/appointments/appointment/' + booking.appointment_id} className="font-semibold text-gray-800">{booking.patient_name}</Link>
                                            </div>
                                            {/* <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{booking.phone_number}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate max-w-[200px]">{booking.email}</span>
                                                </div>
                                            </div> */}
                                        </div>

                                        {/* Status Dropdown */}
                                        {/* <div className="flex items-center gap-2">
                                            <select
                                                value={booking.appointment_status}
                                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                                disabled={updatingStatus}
                                                className={`text-xs px-3 py-1.5 rounded-full border font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D614E] ${statusConfig?.bg} ${statusConfig?.text} ${statusConfig?.border}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            {updatingStatus && (
                                                <div className="w-4 h-4 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
                                            )}
                                        </div> */}
                                    </div>
                                </div>

                                {/* Patient Details */}
                                <div className="p-4 space-y-3">
                                    {/* Appointment ID */}
                                    <div className="flex items-start gap-2 text-sm">
                                        <Activity className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                        <div>
                                            <span className="text-gray-500">Appointment ID: </span>
                                            <span className="text-gray-700 ">
                                                {booking.appointment_id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Concern */}
                                    {booking.concern && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <AlertCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="text-gray-500">Concern: </span>
                                                <span className="text-gray-700">{booking.concern}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="flex items-start gap-2 text-sm">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                                        <div>
                                            <span className="text-gray-500">Status: </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig?.bg} ${statusConfig?.text}`}>
                                                {statusConfig?.icon}
                                                <span className="capitalize">{booking.appointment_status}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        // No Booking - Show available slot message
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Slot Available</h4>
                            <p className="text-gray-500 mb-4">This time slot is currently available for booking</p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-[#0a4d3e] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;