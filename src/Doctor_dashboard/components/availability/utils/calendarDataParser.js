/**
 * Normalizes monthly availability API responses into date-keyed slot/appointment maps.
 * Supports both array-of-days and flat { slots, appointments } object shapes.
 */
export function parseMonthlyAvailabilityResponse(rawData) {
    const slotsMap = {};
    const appointmentsMap = {};
    let baseamount = 0;

    if (!rawData) {
        return { slotsMap, appointmentsMap, baseamount };
    }

    const addSlot = (slot) => {
        if (!slot?.date) return;
        if (!slotsMap[slot.date]) slotsMap[slot.date] = [];
        slotsMap[slot.date].push(slot);
        if (!baseamount && slot.amount > 0) baseamount = slot.amount;
    };

    const addAppointment = (apt) => {
        if (!apt?.date) return;
        if (!appointmentsMap[apt.date]) appointmentsMap[apt.date] = [];
        appointmentsMap[apt.date].push(apt);
    };

    if (Array.isArray(rawData)) {
        rawData.forEach((dateItem) => {
            if (!baseamount && dateItem?.amount > 0) baseamount = dateItem.amount;
            dateItem?.slots?.forEach(addSlot);
            dateItem?.appointments?.forEach(addAppointment);
        });
    } else if (typeof rawData === 'object') {
        if (Array.isArray(rawData.slots)) {
            rawData.slots.forEach(addSlot);
        }
        if (Array.isArray(rawData.appointments)) {
            rawData.appointments.forEach(addAppointment);
        }
        if (Array.isArray(rawData.data)) {
            return parseMonthlyAvailabilityResponse(rawData.data);
        }
    }

    return { slotsMap, appointmentsMap, baseamount };
}
