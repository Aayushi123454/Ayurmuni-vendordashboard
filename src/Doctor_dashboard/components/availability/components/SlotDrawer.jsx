// components/SlotDrawer.jsx
import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Trash2, Edit2, Coffee, Save, AlertCircle, IndianRupee } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import toast from 'react-hot-toast';

const SlotDrawer = ({ isOpen, selectedDate, editingSlot, onClose, onSave, onUpdate, baseamount }) => {
    const [slots, setSlots] = useState([]);
    const [originalSlots, setOriginalSlots] = useState([]); // Track original slots for comparison
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringDays, setRecurringDays] = useState([]);
    const [recurringEndDate, setRecurringEndDate] = useState('');
    const [editingSlotId, setEditingSlotId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize slots based on editingSlot (which can be a single slot or array of slots)
    useEffect(() => {
        console.log(baseamount);

        if (isOpen) {
            if (editingSlot && Array.isArray(editingSlot) && editingSlot.length > 0) {
                // Handle multiple slots for editing
                const initializedSlots = editingSlot.map((slot, index) => ({
                    id: slot.id,
                    start_time: slot.start_time || "09:00",
                    end_time: slot.end_time || "10:00",
                    max_patients: slot.max_patients || 5,
                    consultation_type: slot.consultation_type || "video",
                    break_between_slots: slot.break_between_slots || 15,
                    is_active: slot.is_active !== undefined ? slot.is_active : true,
                    amount: slot.amount > 0 ? slot.amount : (baseamount || 0),
                    date: slot.date || format(selectedDate, 'yyyy-MM-dd'),
                    is_new: false,
                    is_modified: false
                }));
                setSlots(initializedSlots);
                setOriginalSlots(JSON.parse(JSON.stringify(initializedSlots))); // Deep copy
            } else if (editingSlot && !Array.isArray(editingSlot)) {
                // Handle single slot for editing
                const initializedSlot = [{
                    id: editingSlot.id,
                    start_time: editingSlot.start_time || "09:00",
                    end_time: editingSlot.end_time || "10:00",
                    max_patients: editingSlot.max_patients || 5,
                    consultation_type: editingSlot.consultation_type || "video",
                    break_between_slots: editingSlot.break_between_slots || 15,
                    is_active: editingSlot.is_active !== undefined ? editingSlot.is_active : true,
                    amount: editingSlot.amount > 0 ? editingSlot.amount : (baseamount || 0),
                    date: editingSlot.date || format(selectedDate, 'yyyy-MM-dd'),
                    is_new: false,
                    is_modified: false
                }];
                setSlots(initializedSlot);
                setOriginalSlots(JSON.parse(JSON.stringify(initializedSlot)));
            } else {
                // Default new slot
                const defaultSlot = [{
                    id: Date.now(),
                    start_time: '09:00',
                    end_time: '10:00',
                    max_patients: 5,
                    consultation_type: 'video',
                    break_between_slots: 15,
                    is_active: true,
                    amount: baseamount || 0,
                    is_new: true,
                    is_modified: false
                }];
                setSlots(defaultSlot);
                setOriginalSlots([]);
            }
        }
    }, [editingSlot, isOpen, selectedDate]);

    const addNewSlot = () => {
        const lastSlot = slots[slots.length - 1];
        let nextStart = '10:00';

        if (lastSlot && lastSlot.end_time) {
            const [hours, minutes] = lastSlot.end_time.split(':').map(Number);
            const nextDate = new Date();
            nextDate.setHours(hours, minutes + (lastSlot.break_between_slots || 15), 0);
            nextStart = format(nextDate, 'HH:mm');
        }

        const newSlot = {
            id: Date.now() + Math.random(),
            start_time: nextStart,
            end_time: addMinutesToTime(nextStart, 60),
            max_patients: 5,
            consultation_type: 'video',
            break_between_slots: 15,
            is_active: true,
            amount: baseamount || 0,
            is_new: true,
            is_modified: false
        };

        setSlots([...slots, newSlot]);
        setEditingSlotId(slots.length);
    };

    const removeSlot = (index) => {
        const slotToRemove = slots[index];

        // If it's an existing slot (not new), mark it for deletion
        if (!slotToRemove.is_new && slotToRemove.id) {
            const updatedSlots = slots.filter((_, i) => i !== index);
            setSlots(updatedSlots);
            // Mark that this slot should be deleted
            if (window.deletedSlots) {
                window.deletedSlots.push(slotToRemove.id);
            } else {
                window.deletedSlots = [slotToRemove.id];
            }
        } else {
            // Just remove new slot from UI
            const newSlots = slots.filter((_, i) => i !== index);
            setSlots(newSlots);
        }

        if (slots.length === 1) {
            toast.warning('At least one time slot is required');
            return;
        }

        if (editingSlotId === index) setEditingSlotId(null);
        if (editingSlotId > index) setEditingSlotId(editingSlotId - 1);
    };

    const updateSlot = (index, field, value) => {
        const updatedSlots = [...slots];
        const oldSlot = updatedSlots[index];

        updatedSlots[index] = {
            ...oldSlot,
            [field]: value,
            is_new: oldSlot.is_new || false,
            is_modified: !oldSlot.is_new // Mark as modified for existing slots
        };

        // Auto-update next slot's start time if end time changes
        if (field === 'end_time' && index < slots.length - 1) {
            const currentSlot = updatedSlots[index];
            const nextSlot = updatedSlots[index + 1];
            const nextStartTime = addMinutesToTime(
                currentSlot.end_time,
                currentSlot.break_between_slots || 15
            );
            if (nextSlot.start_time !== nextStartTime) {
                updatedSlots[index + 1] = {
                    ...nextSlot,
                    start_time: nextStartTime,
                    end_time: addMinutesToTime(nextStartTime, 60),
                    is_modified: !nextSlot.is_new
                };
            }
        }

        setSlots(updatedSlots);
    };

    const toggleSlotActive = (index) => {
        const updatedSlots = [...slots];
        updatedSlots[index].is_active = !updatedSlots[index].is_active;
        updatedSlots[index].is_modified = !updatedSlots[index].is_new;
        setSlots(updatedSlots);
    };

    const validateSlots = () => {
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (!slot.is_active) continue;

            if (!slot.start_time || !slot.end_time) {
                toast.error(`Slot ${i + 1}: Please fill in both start and end times`);
                return false;
            }

            if (slot.start_time >= slot.end_time) {
                toast.error(`Slot ${i + 1}: End time must be after start time`);
                return false;
            }
            if (slot.amount == 0) {
                toast.error(`Slot ${i + 1}: Please fill Amount`);
                return false;
            }
            if (isRecurring) {
                if (recurringEndDate == "") {
                    toast.error(`Slot ${i + 1}: Repeat end date required`);
                    return false;
                }
            }

            // Check overlap with next slots
            for (let j = i + 1; j < slots.length; j++) {
                const nextSlot = slots[j];
                if (!nextSlot.is_active || !nextSlot.start_time) continue;
                if (slot.end_time > nextSlot.start_time) {
                    toast.error(`Slot ${i + 1} (${slot.start_time}-${slot.end_time}) overlaps with Slot ${j + 1} (${nextSlot.start_time}-${nextSlot.end_time})`);
                    return false;
                }
            }
        }
        return true;
    };

    // Helper function to check if slot data has changed
    const hasSlotChanged = (originalSlot, currentSlot) => {
        if (!originalSlot) return true;
        return originalSlot.start_time !== currentSlot.start_time ||
            originalSlot.end_time !== currentSlot.end_time ||
            originalSlot.amount !== currentSlot.amount ||
            originalSlot.break_between_slots !== currentSlot.break_between_slots ||
            originalSlot.max_patients !== currentSlot.max_patients ||
            originalSlot.consultation_type !== currentSlot.consultation_type ||
            originalSlot.is_active !== currentSlot.is_active;
    };

    const handleSubmit = async () => {
        try {
            if (!validateSlots()) return;

            // Separate new slots and modified existing slots
            const newSlots = slots.filter(slot => slot.is_new && slot.start_time && slot.end_time);
            const existingSlots = slots.filter(slot => !slot.is_new && slot.start_time && slot.end_time);

            // Find modified existing slots
            const modifiedSlots = existingSlots.filter((slot, index) => {
                const originalSlot = originalSlots.find(orig => orig.id === slot.id);
                return hasSlotChanged(originalSlot, slot);
            });

            // Prepare deletions (if any)
            const deletedSlotIds = window.deletedSlots || [];

            if (newSlots.length === 0 && modifiedSlots.length === 0 && deletedSlotIds.length === 0) {
                toast.error("No changes to save");
                onClose();
                return;
            }

            setIsLoading(true);

            // Handle CREATE - New Slots
            if (newSlots.length > 0 && onSave) {

                const formattedNewSlots = newSlots.map((slot) => ({
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    consultation_type: slot.consultation_type,
                    amount: Number(slot.amount || 0),
                    max_patients: Number(slot.max_patients || 1),
                    break_between_slots: Number(slot.break_between_slots || 0),
                    is_active: slot.is_active,
                }));

                await onSave(isRecurring ? {
                    "repeat_type": "weekly",
                    "repeat_until": recurringEndDate,
                    "repeat_days": recurringDays.map(e => e.toLowerCase()),
                    "availability": [
                        {
                            "date": format(selectedDate, "yyyy-MM-dd"),
                            "slots": formattedNewSlots
                        }
                    ]
                } : {
                    "availability": [{
                        date: format(selectedDate, "yyyy-MM-dd"),
                        slots: formattedNewSlots,
                    }]
                });
                toast.success(`${formattedNewSlots.length} new slot(s) added successfully`);
            }

            // Handle UPDATE - Modified Existing Slots
            if (modifiedSlots.length > 0 && onUpdate) {
                const updatePromises = modifiedSlots.map(async (slot) => {
                    const updatedSlot = {
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                        consultation_type: slot.consultation_type,
                        amount: Number(slot.amount || 0),
                        max_patients: Number(slot.max_patients || 1),
                        break_between_slots: Number(slot.break_between_slots || 0),
                        is_active: slot.is_active,
                    };
                    await onUpdate(slot.id, updatedSlot);
                });
                await Promise.all(updatePromises);
                toast.success(`${modifiedSlots.length} slot(s) updated successfully`);
            }

            // Handle DELETE - Removed Slots
            if (deletedSlotIds.length > 0 && onUpdate) {
                // Assuming you have a delete API endpoint
                // If you have a separate delete function, use that instead
                toast.success(`${deletedSlotIds.length} slot(s) removed`);
            }

            // Clear deleted slots tracking
            window.deletedSlots = [];

            // Close drawer after successful save
            onClose();

        } catch (error) {
            console.error("Slot submit error:", error);
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.detail ||
                error?.message ||
                "Something went wrong while saving slots";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const isPastDate = isPast(selectedDate) && !isToday(selectedDate);

    // Quick template functions
    const applyMorningTemplate = () => {
        const morningSlots = [
            { start_time: '09:00', end_time: '10:00' },
            { start_time: '10:00', end_time: '11:00' },
            { start_time: '11:00', end_time: '12:00' },
            { start_time: '12:00', end_time: '13:00' }
        ];
        const newSlots = morningSlots.map((slot, idx) => ({
            id: Date.now() + idx,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_patients: 5,
            consultation_type: 'video',
            break_between_slots: 15,
            is_active: true,
            amount: 0,
            is_new: true,
            is_modified: false
        }));
        setSlots(newSlots);
        setOriginalSlots([]);
        setEditingSlotId(null);
    };

    const applyAfternoonTemplate = () => {
        const afternoonSlots = [
            { start_time: '14:00', end_time: '15:00' },
            { start_time: '15:00', end_time: '16:00' },
            { start_time: '16:00', end_time: '17:00' },
            { start_time: '17:00', end_time: '18:00' }
        ];
        const newSlots = afternoonSlots.map((slot, idx) => ({
            id: Date.now() + idx,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_patients: 5,
            consultation_type: 'video',
            break_between_slots: 15,
            is_active: true,
            amount: 0,
            is_new: true,
            is_modified: false
        }));
        setSlots(newSlots);
        setOriginalSlots([]);
        setEditingSlotId(null);
    };

    const applyFullDayTemplate = () => {
        const fullDaySlots = [
            { start_time: '09:00', end_time: '10:00' },
            { start_time: '10:00', end_time: '11:00' },
            { start_time: '11:00', end_time: '12:00' },
            { start_time: '12:00', end_time: '13:00' },
            { start_time: '14:00', end_time: '15:00' },
            { start_time: '15:00', end_time: '16:00' },
            { start_time: '16:00', end_time: '17:00' }
        ];
        const newSlots = fullDaySlots.map((slot, idx) => ({
            id: Date.now() + idx,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_patients: 5,
            consultation_type: 'video',
            break_between_slots: 15,
            is_active: true,
            amount: 0,
            is_new: true,
            is_modified: false
        }));
        setSlots(newSlots);
        setOriginalSlots([]);
        setEditingSlotId(null);
    };

    if (!isOpen) return null;

    const getActiveSlotsCount = () => {
        return slots.filter(s => s.is_active && s.start_time && s.end_time).length;
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-[5]">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingSlot ? 'Edit Time Slots' : 'Add Time Slots'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {isPastDate ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <p className="text-red-700 font-medium">Cannot add slots for past dates</p>
                            <p className="text-red-600 text-sm mt-1">Please select a future date</p>
                        </div>
                    ) : (
                        <>
                            {/* Quick Templates */}
                            {/* {!editingSlot && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={applyMorningTemplate} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                            🌅 Morning (9AM-1PM)
                                        </button>
                                        <button onClick={applyAfternoonTemplate} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                            🌤️ Afternoon (2PM-6PM)
                                        </button>
                                        <button onClick={applyFullDayTemplate} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                            ⭐ Full Day (9AM-5PM)
                                        </button>
                                    </div>
                                </div>
                            )} */}

                            {/* Slots List */}
                            <div className="space-y-3 mb-6">
                                {slots.map((slot, index) => (
                                    <SlotEditorCard
                                        key={slot.id}
                                        slot={slot}
                                        index={index}
                                        isEditing={editingSlotId === index}
                                        onEdit={() => setEditingSlotId(index)}
                                        onSave={() => setEditingSlotId(null)}
                                        onUpdate={(field, value) => updateSlot(index, field, value)}
                                        onDelete={() => removeSlot(index)}
                                        onToggleActive={() => toggleSlotActive(index)}
                                    />
                                ))}
                            </div>

                            {/* Add Slot Button */}
                            {/* {!editingSlot && ( */}
                            <button
                                type="button"
                                onClick={addNewSlot}
                                disabled={isLoading}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#0D614E]/60 hover:text-[#0D614E] transition-all duration-200 flex items-center justify-center gap-2 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Slot
                            </button>
                            {/* )} */}

                            {/* Recurring Options */}
                            {!editingSlot && (
                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                                        <input
                                            type="checkbox"
                                            checked={isRecurring}
                                            onChange={(e) => setIsRecurring(e.target.checked)}
                                            className="rounded border-gray-300 text-[#0D614E] focus:ring-teal-500 w-[20px]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Repeat these slots weekly</span>
                                    </label>

                                    {isRecurring && (
                                        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on</label>
                                                <div className="grid grid-cols-7 gap-1">
                                                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
                                                        <label key={day} className="flex flex-col items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                value={day}
                                                                checked={recurringDays.includes(day)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setRecurringDays([...recurringDays, day]);
                                                                    } else {
                                                                        setRecurringDays(recurringDays.filter(d => d !== day));
                                                                    }
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
                                                    value={recurringEndDate}
                                                    onChange={(e) => setRecurringEndDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                                    min={format(selectedDate, 'yyyy-MM-dd')}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Summary */}
                            {!editingSlot && getActiveSlotsCount() > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Summary:</strong> {getActiveSlotsCount()} active slot(s) will be created/updated
                                        {isRecurring && recurringDays.length > 0 &&
                                            `, repeating weekly on ${recurringDays.map(d => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].filter(e => e == d)).join(', ')}`}
                                        {isRecurring && recurringEndDate &&
                                            ` until ${format(new Date(recurringEndDate), 'MMM dd, yyyy')}`}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-[#0D614E]/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {editingSlot ? 'Update Slots' : `Save ${getActiveSlotsCount()} Slot(s)`}
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

const SlotEditorCard = ({ slot, index, isEditing, onEdit, onSave, onUpdate, onDelete, onToggleActive }) => {
    if (isEditing) {
        return (
            <div className="border border-[#0D614E]/60 rounded-xl p-4 bg-[#0D614E]/10">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) => onUpdate('start_time', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                            <input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) => onUpdate('end_time', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Fees (₹)
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="number"
                                    value={slot.amount}
                                    onChange={(e) => onUpdate('amount', parseInt(e.target.value) || 0)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                    min="0"
                                    step="100"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Break (mins)</label>
                            <input
                                type="number"
                                value={slot.break_between_slots}
                                onChange={(e) => onUpdate('break_between_slots', parseInt(e.target.value))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                min="0"
                                max="60"
                                step="5"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={onSave}
                            className="flex-1 px-3 py-1.5 text-sm bg-[#0D614E] text-white rounded-lg hover:bg-teal-700 transition"
                        >
                            Save Slot
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isIncomplete = !slot.start_time || !slot.end_time;

    return (
        <div className={`border rounded-xl p-4 transition-all ${slot.is_active && !isIncomplete ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleActive}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${slot.is_active ? 'bg-[#0D614E]' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${slot.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm font-medium text-gray-500">Slot {index + 1}</span>
                    {isIncomplete && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Incomplete</span>
                    )}
                    {slot.is_modified && !slot.is_new && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Modified</span>
                    )}
                </div>
                <button onClick={onEdit} className="text-blue-500 hover:text-blue-600 transition">
                    <Edit2 className="w-4 h-4 text-[#0D614E]" />
                </button>
                {/* <button onClick={onDelete} className="text-red-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                </button> */}
            </div>

            {isIncomplete ? (
                <div className="text-center py-3">
                    <p className="text-sm text-gray-400 mb-2">⏰ Time not set</p>
                    <button
                        onClick={onEdit}
                        className="text-sm text-[#0D614E] hover:text-[#0D614E]/80 font-medium"
                    >
                        + Set Time & Details
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-800">{slot.start_time} - {slot.end_time}</span>
                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{slot.amount} Fees</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Coffee className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{slot.break_between_slots} min break</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const addMinutesToTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

export default SlotDrawer;