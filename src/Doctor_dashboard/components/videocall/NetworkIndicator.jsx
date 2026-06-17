// components/NetworkIndicator.jsx - Compact Version
import React from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';

const NetworkIndicator = ({ quality }) => {
    const getQualityInfo = () => {
        if (quality >= 4) {
            return { color: 'text-green-400', icon: Wifi, label: 'Excellent' };
        }
        if (quality >= 2) {
            return { color: 'text-yellow-400', icon: Activity, label: 'Fair' };
        }
        return { color: 'text-red-400', icon: WifiOff, label: 'Poor' };
    };

    const info = getQualityInfo();
    const Icon = info.icon;

    return (
        <div className="flex items-center gap-1 px-1.5 py-1">
            <Icon size={12} className={info.color} />
        </div>
    );
};

export default NetworkIndicator;