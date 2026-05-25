// utils/dateHelpers.js
import { format } from 'date-fns';

export const addMinutesToTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

export const getSlotStatus = (slot) => {
    const bookedCount = slot.booked_count || 0;
    const availableCount = slot.max_patients - bookedCount;

    if (availableCount === 0) {
        return { status: 'full', label: 'Fully Booked', color: 'bg-red-100 text-red-700' };
    }
    if (availableCount <= 2) {
        return { status: 'limited', label: 'Limited', color: 'bg-yellow-100 text-yellow-700' };
    }
    return { status: 'available', label: 'Available', color: 'bg-green-100 text-green-700' };
};

export const getConsultationIcon = (type) => {
    const icons = {
        video: '📹',
        chat: '💬',
        inperson: '🏥'
    };
    return icons[type] || '📅';
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
};