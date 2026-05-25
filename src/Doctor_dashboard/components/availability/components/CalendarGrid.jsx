// components/CalendarGrid.jsx
import React from 'react';
import { format } from 'date-fns';
import CalendarDayCard from './CalendarDayCard';

const CalendarGrid = ({ days, onDateClick, onSlotClick }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map(day => (
                    <div
                        key={day}
                        className="text-center text-sm font-semibold text-gray-600 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                    <CalendarDayCard
                        key={idx}
                        date={day.date}
                        isCurrentMonth={day.isCurrentMonth}
                        isToday={day.isToday}
                        isPast={day.isPast}
                        slots={day.slots}
                        appointments={day.appointments}
                        onDateClick={onDateClick}
                        onSlotClick={onSlotClick}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
                {/* <LegendItem color="bg-red-100" text="Available" /> */}
                <LegendItem color="bg-green-100" text="Available" />
                <LegendItem color="bg-yellow-100" text="Fully Booked" />
                <LegendItem color="bg-gray-100" text="Past Date" />
                <LegendItem color="bg-emerald-100" text="Today" />
            </div>
        </div>
    );
};

const LegendItem = ({ color, text }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 ${color} rounded`}></div>
        <span className="text-xs text-gray-600">{text}</span>
    </div>
);

export default CalendarGrid;