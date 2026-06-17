// components/RecordingIndicator.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Circle, Square } from 'lucide-react';

const RecordingIndicator = ({ duration }) => {
    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 backdrop-blur"
        >
            <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <Circle size={12} className="text-red-400 fill-red-400" />
            </motion.div>
            <span className="text-xs font-medium text-red-400">
                REC {formatDuration(duration)}
            </span>
        </motion.div>
    );
};

export default RecordingIndicator;