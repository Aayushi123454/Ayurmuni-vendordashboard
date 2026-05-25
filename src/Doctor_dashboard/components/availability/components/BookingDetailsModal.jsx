// components/BookingDetailsModal.jsx
import React, { useState } from 'react';
import { X, Edit, Trash2, Users, Calendar, Clock, Phone, Mail, User, Activity, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const BookingDetailsModal = ({ slot, appointments, onClose, onEdit, onDelete, onUpdateStatus }) => {
    const [updatingStatus, setUpdatingStatus] = useState(false);

    if (!slot) return null;

    const bookedCount = slot.booked_count || 0;
    const availableCount = slot.max_patients - bookedCount;
    const percentage = (bookedCount / slot.max_patients) * 100;

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        setUpdatingStatus(true);
        try {
            await onUpdateStatus(appointmentId, { status: newStatus });
            toast.success(`Appointment ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Slot Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Slot Information */}
                    <div className="bg-[#0D614E] rounded-xl p-5 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1 text-white">Date</p>
                                <p className="font-semibold text-gray-800 text-white">{format(new Date(slot.date), 'MMMM d, yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1 text-white">Time</p>
                                <p className="font-semibold text-gray-800 text-white">{slot.start_time} - {slot.end_time}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1 text-white">Consultation Type</p>
                                <p className="font-semibold text-gray-800 capitalize text-white">{slot.consultation_type}</p>
                            </div>
                            {/* <div>
                                <p className="text-xs text-gray-500 mb-1">Capacity</p>
                                <p className="font-semibold text-gray-800">{bookedCount}/{slot.max_patients} booked</p>
                            </div> */}
                        </div>

                        {/* <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Availability</span>
                                <span className="font-medium text-gray-800">{availableCount} slots left</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div> */}
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex gap-3 mb-6">
                        <button
                            onClick={onEdit}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#0D614E] text-[#0D614E] rounded-xl hover:bg-teal-50 transition"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Slot
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Slot
                        </button>
                    </div> */}

                    {/* Appointments List */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#0D614E]" />
                            Booked Appointments ({appointments.length})
                        </h4>

                        {appointments.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400">No appointments booked for this slot</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appointments.map(apt => (
                                    <div key={apt.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <p className="font-semibold text-gray-800">{apt.patient_name}</p>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>{apt.patient_age} years</span>
                                                    <span>{apt.patient_gender}</span>
                                                </div>
                                            </div>
                                            <select
                                                value={apt.status}
                                                onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                                                disabled={updatingStatus}
                                                className={`text-xs px-3 py-1.5 rounded-full border font-medium cursor-pointer ${getStatusColor(apt.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>{apt.patient_phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span>{apt.patient_email}</span>
                                            </div>
                                        </div>

                                        {apt.reason && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <p className="text-xs text-gray-600">
                                                    <span className="font-medium">Reason:</span> {apt.reason}
                                                </p>
                                            </div>
                                        )}

                                        {apt.payment_status && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${apt.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {apt.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;