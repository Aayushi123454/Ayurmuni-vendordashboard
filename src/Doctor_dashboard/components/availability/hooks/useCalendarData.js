// hooks/useCalendarData.js
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { doctorService } from '../../../../services/doctorService';

export const useCalendarData = () => {
    const [slots, setSlots] = useState({});
    const [appointments, setAppointments] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [baseamount, setbaseamount] = useState(0)

    const fetchMonthData = useCallback(async (date) => {
        setIsLoading(true);
        try {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const response = await doctorService.getMonthlyAvailability(year, month);
            const data = response?.data?.data || {};
            setbaseamount(response?.data?.data[0]?.amount)
            // console.log(response?.data?.data[0]?.amount);


            const slotsMap = {};
            const appointmentsMap = {};

            data?.forEach((dateItem) => {
                dateItem?.slots?.forEach((slot) => {
                    const dateKey = slot.date;
                    if (!slotsMap[dateKey]) {
                        slotsMap[dateKey] = [];
                    }
                    slotsMap[dateKey].push(slot);
                });
            });

            data.appointments?.forEach(apt => {
                const dateKey = apt.date;
                if (!appointmentsMap[dateKey]) appointmentsMap[dateKey] = [];
                appointmentsMap[dateKey].push(apt);
            });

            setSlots(slotsMap);
            setAppointments(appointmentsMap);
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            toast.error('Failed to load calendar data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addSlot = useCallback(async (slotData) => {
        try {
            await doctorService.createSlot(slotData);
            toast.success('Time slot added successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add slot');
            throw error;
        }
    }, []);

    const updateSlot = useCallback(async (slotId, slotData) => {
        try {
            await doctorService.updateTimeSlot(slotId, slotData);
            toast.success('Slot updated successfully');
            return true;
        } catch (error) {
            toast.error('Failed to update slot');
            throw error;
        }
    }, []);

    const deleteSlot = useCallback(async (slotId) => {
        try {
            await doctorService.deleteTimeSlot(slotId);
            toast.success('Slot deleted successfully');
            return true;
        } catch (error) {
            toast.error('Failed to delete slot');
            throw error;
        }
    }, []);

    return {
        slots,
        appointments,
        isLoading,
        baseamount,
        fetchMonthData,
        addSlot,
        updateSlot,
        deleteSlot,
    };
};