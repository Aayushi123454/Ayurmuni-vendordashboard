// utils/calendarUtils.js
export const generateTimeSlots = (startTime, endTime, interval = 30) => {
    const slots = [];
    let start = parseTime(startTime);
    const end = parseTime(endTime);

    while (start < end) {
        const slotEnd = new Date(start.getTime() + interval * 60000);
        slots.push({
            start: formatTime(start),
            end: formatTime(slotEnd)
        });
        start = slotEnd;
    }

    return slots;
};

export const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0);
    return date;
};

export const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const isOverlapping = (slot1, slot2) => {
    return (slot1.start_time < slot2.end_time && slot1.end_time > slot2.start_time);
};

export const validateTimeSlot = (startTime, endTime) => {
    if (startTime >= endTime) {
        return { valid: false, message: 'End time must be after start time' };
    }

    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const duration = (end - start) / (1000 * 60);

    if (duration < 15) {
        return { valid: false, message: 'Slot duration must be at least 15 minutes' };
    }

    if (duration > 120) {
        return { valid: false, message: 'Slot duration cannot exceed 2 hours' };
    }

    return { valid: true, message: '' };
};

export const getDaySlots = (slots, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return slots[dateKey] || [];
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