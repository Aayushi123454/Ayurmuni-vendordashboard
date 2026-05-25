// components/SlotCard.jsx
import React from 'react';
import { Clock, Video, MessageCircle, Users } from 'lucide-react';

const SlotCard = ({ slot, onClick, isCompact = false }) => {
    const bookedCount = slot.booked_count || 1;
    const availableCount = bookedCount;

    const getStatusConfig = () => {
        // if (availableCount == 1) return { bg: 'bg-red-100', text: 'text-red-700', label: 'Full' };
        if (availableCount == 1) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Limited' };
        return { bg: 'bg-[#0D614E]/10', text: 'text-[#0D614E]/70', label: 'Available' };
    };

    const status = getStatusConfig();
    const percentage = (bookedCount / slot.max_patients) * 100;

    const getConsultationIcon = () => {
        switch (slot.consultation_type) {
            case 'video': return <Video className="w-3 h-3" />;
            case 'chat': return <MessageCircle className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    if (isCompact) {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className={`
          text-xs p-1.5 rounded-lg cursor-pointer transition-all duration-200
          ${status.bg} ${status.text} hover:shadow-md hover:scale-[1.02]
        `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {getConsultationIcon()}
                        <span className="font-medium">
                            {slot.start_time} - {slot.end_time}
                        </span>
                    </div>
                    <span className="text-xs font-semibold">
                        {bookedCount}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">
                        {slot.start_time} - {slot.end_time}
                    </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                </span>
            </div>

            <div className="space-y-2">
                {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium text-gray-800">{bookedCount}/{slot.max_patients}</span>
                </div> */}

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        {getConsultationIcon()}
                        <span className="capitalize">{slot.consultation_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{availableCount} available</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotCard;