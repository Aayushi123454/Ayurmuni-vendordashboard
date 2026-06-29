// components/CalendarHeader.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const CalendarHeader = ({ currentMonth, onPrevious, onNext }) => {
    return (
        <div className="bg-[#0D614E] px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                        <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <p className="text-emerald-100 text-sm">Manage your availability</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevious}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-white font-semibold px-4 py-2 bg-white/10 rounded-xl">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={onNext}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarHeader;