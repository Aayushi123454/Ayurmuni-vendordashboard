// DoctorAvailabilityCalendar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, Plus, X, Edit, Trash2, Calendar as CalendarIcon, Video, MessageCircle, MapPin, CheckCircle, AlertCircle, Phone, Mail, Edit2, Coffee, Calendar, Info, Save, Camera, MessageCircleCheck } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isPast, startOfWeek, endOfWeek } from 'date-fns';
import toast from 'react-hot-toast';
import { doctorService } from '../../../services/doctorService';

const DoctorAvailabilityCalendar1 = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState({});
    const [appointments, setAppointments] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showSlotDetails, setShowSlotDetails] = useState(null);
    const [editingSlot, setEditingSlot] = useState(null);
    const [hoveredSlot, setHoveredSlot] = useState(null);

    useEffect(() => {
        fetchMonthData(currentMonth);
    }, [currentMonth]);

    const fetchMonthData = async (date) => {
        setIsLoading(true);
        try {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const response = await doctorService.getMonthlyAvailability(year, month);
            const data = response?.data?.data || {};

            // Transform API response to date-keyed object
            const slotsMap = {};
            const appointmentsMap = {};

            data.slots?.forEach(slot => {
                const dateKey = slot.date;
                if (!slotsMap[dateKey]) slotsMap[dateKey] = [];
                slotsMap[dateKey].push(slot);
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
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        // Only show add modal if date is not in the past
        if (!isPast(date) || isToday(date)) {
            setShowSlotModal(true);
        } else {
            toast.error('Cannot add slots for past dates');
        }
    };

    const handleSlotClick = (slot) => {
        setShowSlotDetails(slot);
    };

    const handleAddSlot = async (slotData) => {
        try {
            const response = await doctorService.createTimeSlot(slotData);
            toast.success('Time slot added successfully');
            setShowSlotModal(false);
            await fetchMonthData(currentMonth);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add slot');
        }
    };

    const handleUpdateSlot = async (slotId, slotData) => {
        try {
            await doctorService.updateTimeSlot(slotId, slotData);
            toast.success('Slot updated successfully');
            setEditingSlot(null);
            setShowSlotDetails(null);
            await fetchMonthData(currentMonth);
        } catch (error) {
            toast.error('Failed to update slot');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (window.confirm('Are you sure you want to delete this time slot?')) {
            try {
                await doctorService.deleteTimeSlot(slotId);
                toast.success('Slot deleted successfully');
                setShowSlotDetails(null);
                await fetchMonthData(currentMonth);
            } catch (error) {
                toast.error('Failed to delete slot');
            }
        }
    };

    const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const getSlotStatus = (slot) => {
        // const bookedCount = slot.is_booked ;
        // const availableCount = slot.max_patients - bookedCount;
        if (slot.is_booked ) return { status: 'full', label: 'Fully Booked', color: 'bg-red-100 text-red-700' };
        // if (availableCount <= 2) return { status: 'limited', label: 'Limited', color: 'bg-yellow-100 text-yellow-700' };
        return { status: 'available', label: 'Available', color: 'bg-green-100 text-green-700' };
    };

    const getConsultationIcon = (type) => {
        switch (type) {
            case 'video': return <Video size={12} />;
            case 'chat': return <MessageCircle size={12} />;
            default: return <MapPin size={12} />;
        }
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    if (isLoading) {
        return <CalendarSkeleton />;
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Availability Calendar</h2>
                        <p className="text-emerald-100 text-sm mt-1">Manage your consultation slots</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={previousMonth}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-white font-semibold min-w-[150px] text-center">
                            {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-white"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                            {day.substring(0, 3)}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);
                        const isPastDate = isPast(day) && !isToday(day);
                        const daySlots = slots[format(day, 'yyyy-MM-dd')] || [];
                        const dayAppointments = appointments[format(day, 'yyyy-MM-dd')] || [];
                        const totalBookings = dayAppointments.length;

                        return (
                            <div
                                key={day.toISOString()}
                                className={`
                                    min-h-[140px] border-2 rounded-xl p-2 transition-all relative
                                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                                    ${isSelected ? 'border-[#0D614E] ring-2 ring-[#0D614E]/20' : 'border-[#0D614E]/30'}
                                    ${!isPastDate && isCurrentMonth ? 'hover:shadow-lg cursor-pointer border-[#0D614E]' : 'cursor-not-allowed opacity-60'}
                                `}
                                onClick={() => !isPastDate && isCurrentMonth && handleDateClick(day)}
                            >
                                {/* Date Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`
                                        w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                                        ${isTodayDate ? 'bg-[#0D614E] text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                                        ${isSelected && !isTodayDate ? 'bg-[#0D614E]/10 text-[#0D614E] font-bold' : ''}
                                    `}>
                                        {format(day, 'd')}
                                    </div>
                                    {totalBookings > 0 && (
                                        <div className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                                            {totalBookings}
                                        </div>
                                    )}
                                </div>

                                {/* Add Button (only for non-past dates) */}
                                {!isPastDate && isCurrentMonth && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDate(day);
                                            setShowSlotModal(true);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition opacity-0 group-hover:opacity-100"
                                    >
                                        <Plus size={12} />
                                    </button>
                                )}

                                {/* Time Slots */}
                                <div className="space-y-1 mt-1">
                                    {daySlots.slice(0, 2).map(slot => {
                                        const slotStatus = getSlotStatus(slot);
                                        return (
                                            <div
                                                key={slot.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSlotClick(slot);
                                                }}
                                                onMouseEnter={() => setHoveredSlot(slot.id)}
                                                onMouseLeave={() => setHoveredSlot(null)}
                                                className={`
                                                    text-xs p-1.5 rounded cursor-pointer transition-all relative
                                                    ${slotStatus.color} hover:shadow-md
                                                `}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        {getConsultationIcon(slot.consultation_type)}
                                                        <span className="font-medium">
                                                            {slot.start_time} - {slot.end_time}
                                                        </span>
                                                    </div>
                                                    {/* <span className="text-xs font-semibold">
                                                        {slot.booked_count || 0}/{slot.max_patients}
                                                    </span> */}
                                                </div>

                                                {/* Tooltip with patient details */}
                                                {hoveredSlot === slot.id && slot.booked_patients?.length > 0 && (
                                                    <AppointmentTooltip patients={slot.booked_patients} />
                                                )}
                                            </div>
                                        );
                                    })}
                                    {daySlots.length > 2 && (
                                        <div className="text-xs text-center text-gray-500 mt-1">
                                            +{daySlots.length - 2} more
                                        </div>
                                    )}
                                    {daySlots.length === 0 && !isPastDate && isCurrentMonth && (
                                        <div className="text-xs text-center text-gray-400 mt-2">
                                            Click to add slot
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 rounded"></div>
                        <span className="text-xs text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                        <span className="text-xs text-gray-600">Limited (≤2 left)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 rounded"></div>
                        <span className="text-xs text-gray-600">Fully Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 rounded"></div>
                        <span className="text-xs text-gray-600">Past Date</span>
                    </div>
                </div>
            </div>

            {/* Add/Edit Slot Modal */}
            {showSlotModal && (
                <AddSlotModal
                    selectedDate={selectedDate}
                    editingSlot={editingSlot}
                    onClose={() => {
                        setShowSlotModal(false);
                        setEditingSlot(null);
                    }}
                    onSave={handleAddSlot}
                    onUpdate={editingSlot ? handleUpdateSlot : null}
                />
            )}

            {/* Slot Details Modal */}
            {showSlotDetails && (
                <SlotDetailsModal
                    slot={showSlotDetails}
                    appointments={appointments[showSlotDetails.date]?.filter(apt => apt.slot_id === showSlotDetails.id) || []}
                    onClose={() => setShowSlotDetails(null)}
                    onEdit={() => {
                        setEditingSlot(showSlotDetails);
                        setShowSlotDetails(null);
                        setShowSlotModal(true);
                    }}
                    onDelete={() => handleDeleteSlot(showSlotDetails.id)}
                    onUpdateStatus={handleUpdateSlot}
                />
            )}
        </div>
    );
};

// Appointment Tooltip Component
const AppointmentTooltip = ({ patients }) => (
    <div className="absolute z-20 bottom-full left-0 mb-1 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl min-w-[180px] animate-fadeIn">
        <p className="font-semibold mb-1 text-xs">Booked Patients:</p>
        {patients.map(patient => (
            <div key={patient.id} className="mb-1 pb-1 border-b border-gray-700 last:border-0">
                <p className="font-medium">{patient.name}</p>
                <p className="text-gray-300 text-xs">{patient.time}</p>
            </div>
        ))}
    </div>
);

// Add Slot Modal Component - Enhanced with Active/Inactive Toggle & Better UI
const AddSlotModal = ({ selectedDate, editingSlot, onClose, onSave, onUpdate }) => {
    const [slots, setSlots] = useState([
        {
            id: Date.now(),
            start_time: '09:00',
            end_time: '10:00',
            max_patients: 5,
            consultation_type: 'video',
            break_between_slots: 15,
            is_active: true,
            Amount: ""
        }
    ]);

    const [formData, setFormData] = useState({
        date: format(selectedDate, 'yyyy-MM-dd'),
        is_recurring: false,
        recurring_days: [],
        recurring_end_date: ''
    });

    const [isRecurring, setIsRecurring] = useState(false);
    const [editingSlotId, setEditingSlotId] = useState(null);

    // If editing an existing slot, initialize with that single slot
    React.useEffect(() => {
        if (editingSlot) {
            setSlots([{
                id: editingSlot.id || Date.now(),
                start_time: editingSlot.start_time || '09:00',
                end_time: editingSlot.end_time || '10:00',
                max_patients: editingSlot.max_patients || 5,
                consultation_type: editingSlot.consultation_type || 'video',
                break_between_slots: editingSlot.break_between_slots || 15,
                is_active: editingSlot.is_active !== undefined ? editingSlot.is_active : true,
                amount: editingSlot.amount
            }]);
        }
    }, [editingSlot]);

    const addNewSlot = () => {
        // Calculate default next slot time based on last slot
        const lastSlot = slots[slots.length - 1];
        let nextStart = '10:00';

        if (lastSlot) {
            const lastEnd = lastSlot.end_time;
            const [hours, minutes] = lastEnd.split(':').map(Number);
            const nextDate = new Date();
            nextDate.setHours(hours, minutes + (lastSlot.break_between_slots || 15), 0);
            nextStart = format(nextDate, 'HH:mm');
        }

        // Add new slot with empty values - user will fill them
        setSlots([{
            id: Date.now() + Math.random(),
            start_time: '',
            end_time: '',
            max_patients: 5,
            consultation_type: 'video',
            break_between_slots: 15,
            is_active: true,
            is_new: true // Flag for new slot that needs user input
        }, ...slots]);

        // Auto-edit the new slot
        setEditingSlotId(0);
    };

    const removeSlot = (index) => {
        if (slots.length === 1) {
            toast.warning('At least one time slot is required');
            return;
        }
        const newSlots = slots.filter((_, i) => i !== index);
        setSlots(newSlots);
        if (editingSlotId === index) setEditingSlotId(null);
        if (editingSlotId > index) setEditingSlotId(editingSlotId - 1);
    };

    const toggleSlotActive = (index) => {
        const updatedSlots = [...slots];
        updatedSlots[index] = {
            ...updatedSlots[index],
            is_active: !updatedSlots[index].is_active
        };
        setSlots(updatedSlots);
    };

    const updateSlot = (index, field, value) => {
        const updatedSlots = [...slots];
        updatedSlots[index] = { ...updatedSlots[index], [field]: value, is_new: false };

        // Auto-update next slot's start time based on end time + break
        if ((field === 'end_time' || field === 'break_between_slots') && updatedSlots[index].start_time && updatedSlots[index].end_time) {
            const currentSlot = updatedSlots[index];
            const nextSlot = updatedSlots[index + 1];
            if (nextSlot && !nextSlot.start_time) {
                const nextStartTime = addMinutesToTime(
                    currentSlot.end_time,
                    currentSlot.break_between_slots || 15
                );
                updatedSlots[index + 1] = {
                    ...nextSlot,
                    start_time: nextStartTime,
                };
            }
        }

        setSlots(updatedSlots);
    };

    const addMinutesToTime = (time, minutes) => {
        const [hours, mins] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, mins + minutes, 0);
        return format(date, 'HH:mm');
    };

    const validateSlots = () => {
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];

            // Skip validation for inactive slots
            if (!slot.is_active) continue;

            if (!slot.start_time || !slot.end_time) {
                toast.error(`Slot ${i + 1}: Please fill in both start and end times`);
                return false;
            }

            if (slot.start_time >= slot.end_time) {
                toast.error(`Slot ${i + 1}: End time must be after start time`);
                return false;
            }

            // Check overlap with next slot
            for (let j = i + 1; j < slots.length; j++) {
                const nextSlot = slots[j];
                if (!nextSlot.is_active) continue;

                if (nextSlot.start_time && slot.end_time > nextSlot.start_time) {
                    toast.error(`Slot ${i + 1} overlaps with Slot ${j + 1}`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateSlots()) return;

        if (editingSlot && onUpdate) {
            // Update single slot
            await onUpdate(editingSlot.id, slots[0]);
            toast.success('Slot updated successfully');
        } else {
            // Create multiple slots (only active ones)
            const activeSlots = slots.filter(slot => slot.is_active && slot.start_time && slot.end_time);

            if (activeSlots.length === 0) {
                toast.warning('No active slots to save');
                return;
            }

            const slotPromises = activeSlots.map(slot => ({
                date: formData.date,
                start_time: slot.start_time,
                end_time: slot.end_time,
                max_patients: slot.max_patients,
                consultation_type: slot.consultation_type,
                break_between_slots: slot.break_between_slots,
                is_active: true,
                is_recurring: isRecurring,
                recurring_days: isRecurring ? formData.recurring_days : [],
                recurring_end_date: isRecurring ? formData.recurring_end_date : ''
            }));

            // Save all slots
            for (const slotData of slotPromises) {
                await onSave(slotData);
            }
            toast.success(`${activeSlots.length} slot(s) added successfully`);
        }
        onClose();
    };

    const isPastDate = isPast(selectedDate) && !isToday(selectedDate);

    // Quick add common slot patterns
    const quickAddPatterns = [
        {
            label: '🌅 Morning (9AM-1PM)',
            icon: '☀️',
            slots: [
                { start_time: '09:00', end_time: '10:00' },
                { start_time: '10:00', end_time: '11:00' },
                { start_time: '11:00', end_time: '12:00' },
                { start_time: '12:00', end_time: '13:00' }
            ]
        },
        {
            label: '🌤️ Afternoon (2PM-6PM)',
            icon: '☁️',
            slots: [
                { start_time: '14:00', end_time: '15:00' },
                { start_time: '15:00', end_time: '16:00' },
                { start_time: '16:00', end_time: '17:00' },
                { start_time: '17:00', end_time: '18:00' }
            ]
        },
        {
            label: '⭐ Full Day (9AM-5PM)',
            icon: '📅',
            slots: [
                { start_time: '09:00', end_time: '10:00' },
                { start_time: '10:00', end_time: '11:00' },
                { start_time: '11:00', end_time: '12:00' },
                { start_time: '12:00', end_time: '13:00' },
                { start_time: '14:00', end_time: '15:00' },
                { start_time: '15:00', end_time: '16:00' },
                { start_time: '16:00', end_time: '17:00' }
            ]
        },
        {
            label: '⚡ 2 Slots (10-12, 2-4)',
            icon: '🚀',
            slots: [
                { start_time: '10:00', end_time: '12:00' },
                { start_time: '14:00', end_time: '16:00' }
            ]
        }
    ];

    const applyQuickPattern = (pattern) => {
        const newSlots = pattern.slots.map((slot, idx) => ({
            id: Date.now() + idx,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_patients: 5,
            consultation_type: 'video',
            break_between_slots: 15,
            is_active: true,
            is_new: false
        }));
        setSlots(newSlots);
        setEditingSlotId(null);
    };

    const SlotCard = ({ slot, index }) => {
        const isEditing = editingSlotId === index;

        return (
            <div className={`border rounded-lg p-4 mb-3 transition-all duration-200 ${slot.is_active
                ? 'border-gray-200 bg-white hover:shadow-md'
                : 'border-gray-200 bg-gray-50 opacity-60'
                }`}>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        {/* Active/Inactive Toggle */}
                        <button
                            type="button"
                            onClick={() => toggleSlotActive(index)}
                            className={`relative inline-flex h-5 w-11 items-center rounded-full transition-colors focus:outline-none ${slot.is_active ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${slot.is_active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>

                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${slot.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                            }`}>
                            {slot.is_active ? 'Active' : 'Inactive'}
                        </span>

                        <span className="text-sm font-medium text-gray-500">
                            Slot {index + 1}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        className="text-red-400 hover:text-red-600 transition p-1"
                        title="Delete slot"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                {isEditing ? (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <Clock size={12} className="inline mr-1" /> Start Time
                                </label>
                                <input
                                    type="time"
                                    value={slot.start_time}
                                    onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D614E] focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <Clock size={12} className="inline mr-1" /> End Time
                                </label>
                                <input
                                    type="time"
                                    value={slot.end_time}
                                    onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D614E] focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <Users size={12} className="inline mr-1" /> Max Patients
                                </label>
                                <input
                                    type="number"
                                    value={slot.max_patients}
                                    onChange={(e) => updateSlot(index, 'max_patients', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    min="1"
                                    max="20"
                                />
                            </div> */}

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <Users size={12} className="inline mr-1" /> Fees
                                </label>
                                <input
                                    type="number"
                                    value={slot.amount}
                                    onChange={(e) => updateSlot(index, 'amount', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    min="1"
                                    max="20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <Coffee size={12} className="inline mr-1" /> Break (mins)
                                </label>
                                <input
                                    type="number"
                                    value={slot.break_between_slots}
                                    onChange={(e) => updateSlot(index, 'break_between_slots', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    min="0"
                                    max="60"
                                    step="5"
                                />
                            </div>
                            {/* <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <Video size={12} className="inline mr-1" /> Consultation Type
                                </label>
                                <select
                                    value={slot.consultation_type}
                                    onChange={(e) => updateSlot(index, 'consultation_type', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                >
                                    <option value="video"> Video Consultation</option>
                                    <option value="chat"> Chat Consultation</option>
                                </select>
                            </div> */}
                        </div>


                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditingSlotId(null)}
                                className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (slot.start_time && slot.end_time) {
                                        setEditingSlotId(null);
                                    } else {
                                        toast.error('Please fill in start and end times');
                                    }
                                }}
                                className="flex-1 px-3 py-1.5 text-sm bg-[#0D614E] text-white rounded-lg hover:bg-[#0D614E]/90 transition"
                            >
                                Save Slot
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {!slot.start_time || !slot.end_time ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-400 mb-2">⏰ Time not set</p>
                                <button
                                    type="button"
                                    onClick={() => setEditingSlotId(index)}
                                    className="text-sm text-[#0D614E] hover:text-[#0D614E]/80"
                                >
                                    + Set Time & Details
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span className="font-medium text-gray-800">
                                            {slot.start_time} - {slot.end_time}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSlotId(index)}
                                        className="text-blue-500 hover:text-blue-600 text-xs"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {/* <div className="flex items-center gap-1">
                                        <Users size={12} className="text-gray-400" />
                                        <span className="text-gray-600">{slot.max_patients} patients</span>
                                    </div> */}
                                    <div className="flex items-center gap-1">
                                        <Coffee size={13} className="text-gray-400" />
                                        <span className="text-gray-600">{slot.break_between_slots} min break</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {slot.consultation_type === 'video' && <Video size={13} className="text-gray-400" />}
                                        {slot.consultation_type === 'chat' && <MessageCircleCheck size={13} className="text-gray-400" />}
                                        {slot.consultation_type === 'inperson' && '🏥'}
                                        <span className="text-gray-600 capitalize">{slot.consultation_type}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Calendar size={22} className="text-[#0D614E]" />
                            {editingSlot ? 'Edit Time Slot' : 'Add Time Slots'}
                        </h3>
                        {!editingSlot && slots.filter(s => s.is_active && s.start_time).length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                {slots.filter(s => s.is_active && s.start_time).length} active slot(s) will be created
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {isPastDate ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
                            <p className="text-red-700 font-medium">Cannot add slots for past dates</p>
                            <p className="text-red-600 text-sm mt-1">Please select a future date</p>
                        </div>
                    ) : (
                        <>
                            {/* Date Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                                <div className="relative">
                                    <CalendarIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D614E] focus:border-transparent"
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Quick Add Templates */}
                            {/* {!editingSlot && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
                                    <div className="flex flex-wrap gap-2">
                                        {quickAddPatterns.map((pattern, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => applyQuickPattern(pattern)}
                                                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-1"
                                            >
                                                <span>{pattern.icon}</span>
                                                <span>{pattern.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {/* Slots List */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-medium text-gray-700">Time Slots</label>
                                    {!editingSlot && (
                                        <button
                                            type="button"
                                            onClick={addNewSlot}
                                            className="text-sm text-[#0D614E] hover:text-[#0D614E]/80 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-green-50 transition"
                                        >
                                            <Plus size={16} /> Add Slot
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-96 overflow-y-auto pr-1 space-y-2">
                                    {slots.map((slot, index) => (
                                        <SlotCard key={slot.id} slot={slot} index={index} />
                                    ))}
                                </div>
                            </div>

                            {/* Recurring Options */}
                            {!editingSlot && (
                                <>
                                    <div className="border-t border-gray-200 pt-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isRecurring}
                                                onChange={(e) => setIsRecurring(e.target.checked)}
                                                className="rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E] w-4 h-4"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                🔄 Repeat these slots weekly
                                            </span>
                                        </label>
                                    </div>

                                    {isRecurring && (
                                        <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on</label>
                                                <div className="grid grid-cols-7 gap-1">
                                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                                                        <label key={day} className="flex flex-col items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                value={idx}
                                                                checked={formData.recurring_days.includes(idx)}
                                                                onChange={(e) => {
                                                                    const days = e.target.checked
                                                                        ? [...formData.recurring_days, idx]
                                                                        : formData.recurring_days.filter(d => d !== idx);
                                                                    setFormData({ ...formData, recurring_days: days });
                                                                }}
                                                                className="mb-1"
                                                            />
                                                            <span className="text-xs text-gray-600">{day}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.recurring_end_date}
                                                    onChange={(e) => setFormData({ ...formData, recurring_end_date: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D614E]"
                                                    min={formData.date}
                                                    required={isRecurring}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Summary */}
                            {!editingSlot && slots.filter(s => s.is_active && s.start_time).length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800 flex items-start gap-2">
                                        <Info size={16} className="flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong>Summary:</strong> {slots.filter(s => s.is_active && s.start_time).length} active slot(s) on {format(new Date(formData.date), 'MMMM dd, yyyy')}
                                            {isRecurring && formData.recurring_days.length > 0 &&
                                                `, repeating weekly on ${formData.recurring_days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}`}
                                            {isRecurring && formData.recurring_end_date &&
                                                ` until ${format(new Date(formData.recurring_end_date), 'MMM dd, yyyy')}`}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPastDate}
                            className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-[#0D614E]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {editingSlot ? 'Update Slot' : `Save ${slots.filter(s => s.is_active && s.start_time).length} Slot(s)`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Slot Details Modal Component
const SlotDetailsModal = ({ slot, appointments, onClose, onEdit, onDelete, onUpdateStatus }) => {
    const [updatingStatus, setUpdatingStatus] = useState(false);

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

    const bookedCount = slot.booked_count || 0;
    const availableCount = slot.max_patients - bookedCount;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Slot Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Slot Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="font-medium text-gray-800">{format(new Date(slot.date), 'MMMM d, yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="font-medium text-gray-800">{slot.start_time} - {slot.end_time}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Consultation Type</p>
                                <p className="font-medium text-gray-800 capitalize">{slot.consultation_type}</p>
                            </div>
                            {/* <div>
                                <p className="text-xs text-gray-500">Capacity</p>
                                <p className="font-medium text-gray-800">{bookedCount}/{slot.max_patients} booked</p>
                                {availableCount > 0 ? (
                                    <span className="text-xs text-green-600">{availableCount} slots available</span>
                                ) : (
                                    <span className="text-xs text-red-600">Fully booked</span>
                                )}
                            </div> */}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={onEdit}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#0D614E] text-[#0D614E] rounded-lg hover:bg-[#0D614E]/10 transition"
                        >
                            <Edit size={16} />
                            Edit Slot
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                            <Trash2 size={16} />
                            Delete Slot
                        </button>
                    </div>

                    {/* Appointments List */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Users size={16} />
                            Booked Appointments ({appointments.length})
                        </h4>

                        {appointments.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <CalendarIcon size={40} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No appointments booked for this slot</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {appointments.map(apt => (
                                    <div key={apt.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-800">{apt.patient_name}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span>{apt.patient_age} yrs</span>
                                                    <span>{apt.patient_gender}</span>
                                                </div>
                                            </div>
                                            <select
                                                value={apt.status}
                                                onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                                                disabled={updatingStatus}
                                                className={`
                                                    text-xs px-2 py-1 rounded border
                                                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                            apt.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                'bg-gray-100 text-gray-700 border-gray-200'}
                                                `}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Phone size={12} />
                                                {apt.patient_phone}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Mail size={12} />
                                                {apt.patient_email}
                                            </div>
                                        </div>

                                        {apt.reason && (
                                            <p className="text-xs text-gray-600 mt-2 border-t border-gray-100 pt-2">
                                                <span className="font-medium">Reason:</span> {apt.reason}
                                            </p>
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

// Calendar Skeleton Loader
const CalendarSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-7 gap-2 mb-3">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded"></div>
                ))}
            </div>
        </div>
    </div>
);

// Add custom CSS for animations
const styles = document.createElement('style');
styles.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }
    .group-hover\\:opacity-100 {
        opacity: 0;
    }
    .group:hover .group-hover\\:opacity-100 {
        opacity: 1;
    }
`;
document.head.appendChild(styles);

export default DoctorAvailabilityCalendar1;