// components/AvailabilityStats.jsx
import React, { useMemo } from 'react';
import { Calendar, Clock, Users, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const AvailabilityStats = ({ slots, appointments, currentMonth }) => {
    const stats = useMemo(() => {
        let totalSlots = 0;
        let totalAppointments = 0;
        let totalRevenue = 0;
        let bookedCount = 0;

        Object.values(slots).forEach(daySlots => {
            daySlots.forEach(slot => {
                totalSlots++;
                bookedCount += slot.booked_count || 0;
                totalRevenue += (slot.booked_count || 0) * (slot.amount || 0);
            });
        });

        Object.values(appointments).forEach(dayAppointments => {
            totalAppointments += dayAppointments.length;
        });

        const occupancyRate = totalSlots > 0 ? (bookedCount / (totalSlots * 5)) * 100 : 0;

        return {
            totalSlots,
            totalAppointments,
            totalRevenue,
            occupancyRate: Math.round(occupancyRate),
            bookedCount
        };
    }, [slots, appointments]);

    const statCards = [
        {
            label: 'Total Slots',
            value: stats.totalSlots,
            icon: Clock,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Total Appointments',
            value: stats.totalAppointments,
            icon: Users,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            label: 'Occupancy Rate',
            value: `${stats.occupancyRate}%`,
            icon: TrendingUp,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 ${stat.bgColor} rounded-xl`}>
                            <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export default AvailabilityStats;