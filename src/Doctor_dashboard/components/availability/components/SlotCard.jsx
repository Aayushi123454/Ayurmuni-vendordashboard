// components/SlotCard.jsx
import React from 'react';
import { Clock, Video, MessageCircle, Users, CheckCircle, XCircle, Calendar, DollarSign, User, Phone, Mail, AlertCircle } from 'lucide-react';

const SlotCard = ({ slot, onClick, isCompact = false }) => {
    // Get status based on booking status
    const getStatusConfig = () => {
        if (slot.is_booked) {
            return {
                bg: 'bg-red-100',
                text: 'text-red-700',
                label: 'Booked',
                icon: <XCircle className="w-3 h-3" />
            };
        }
        return {
            bg: 'bg-emerald-100',
            text: 'text-emerald-700',
            label: 'Available',
            icon: <CheckCircle className="w-3 h-3" />
        };
    };

    const status = getStatusConfig();

    // Get consultation type icon
    const getConsultationIcon = () => {
        switch (slot.consultation_type) {
            case 'video': return <Video className="w-3 h-3" />;
            case 'chat': return <MessageCircle className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    // Format time (remove seconds if present)
    const formatTime = (time) => {
        return time?.substring(0, 5) || time;
    };

    // Get booked patient info
    const bookedBy = slot.booked_by;
    const hasPatient = slot.is_booked && bookedBy;

    if (isCompact) {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className={`
                    text-xs p-2 rounded-lg cursor-pointer transition-all duration-200
                    ${status.bg} ${status.text} hover:shadow-md hover:scale-[1.02]
                    ${slot.is_booked ? 'opacity-75' : ''}
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        {getConsultationIcon()}
                        <span className="font-medium">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                    </div>

                </div>

                {/* Show patient name for booked slots in compact view */}
                {hasPatient && (
                    <>
                        <div className="flex items-center gap-1">
                            {status.icon}
                            <span className="text-xs font-medium">{status.label} by</span>
                        </div>
                        <div className="mt-1 text-[10px] text-gray-600 flex items-center gap-1">
                            <User className="w-2.5 h-2.5" />
                            <span className="truncate">{bookedBy.patient_name}</span>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className={`
            bg-white border rounded-xl p-4 hover:shadow-lg transition-all duration-200
            ${slot.is_booked ? 'border-red-200 bg-red-50/30' : 'border-gray-200 hover:border-emerald-200'}
        `}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${status.bg} ${status.text}`}>
                    {status.icon}
                    <span>{status.label}</span>
                </div>
            </div>

            {/* Consultation Type & Amount */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        {getConsultationIcon()}
                        <span className="capitalize">{slot.consultation_type}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-600">₹{slot.amount}</span>
                </div>
            </div>

            {/* Booked Patient Details */}
            {hasPatient && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">Patient Details</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700 font-medium">{bookedBy.patient_name}</span>
                        </div>
                        {bookedBy.concern && (
                            <div className="flex items-start gap-2 text-xs">
                                <AlertCircle className="w-3 h-3 text-gray-400 mt-0.5" />
                                <span className="text-gray-600">Concern: {bookedBy.concern}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-xs">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500">{bookedBy.phone_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500 text-xs truncate">{bookedBy.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500 capitalize">{bookedBy.appointment_status}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className={`
                    w-full mt-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${slot.is_booked
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow'
                    }
                `}
                disabled={slot.is_booked}
            >
                {slot.is_booked ? 'Already Booked' : 'Book Appointment'}
            </button>
        </div>
    );
};

export default SlotCard;