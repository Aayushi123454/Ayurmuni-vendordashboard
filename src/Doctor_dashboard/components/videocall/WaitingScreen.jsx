// components/WaitingScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, User, Activity } from 'lucide-react';

const WaitingScreen = ({ patientName, appointmentDate, appointmentTime, concern }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="relative mb-8">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
        />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#0a4d3e] to-[#0d614e] flex items-center justify-center shadow-2xl">
          <Users size={48} className="text-white" />
        </div>
      </div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white mb-2"
      >
        Waiting for Patient
      </motion.h2>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-300 text-center mb-8"
      >
        Your consultation room is ready.
        <br />
        The patient will join shortly.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Appointment Details</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <User size={18} className="text-emerald-400" />
            <span>Patient: <span className="text-white font-medium">{patientName || "Loading..."}</span></span>
          </div>
          
          {/* <div className="flex items-center gap-3 text-gray-300">
            <Calendar size={18} className="text-emerald-400" />
            <span>Date: <span className="text-white font-medium">{appointmentDate || "Today"}</span></span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-300">
            <Clock size={18} className="text-emerald-400" />
            <span>Time: <span className="text-white font-medium">{appointmentTime || "Scheduled"}</span></span>
          </div> */}
          
          {concern && (
            <div className="flex items-start gap-3 text-gray-300">
              <Activity size={18} className="text-emerald-400 mt-0.5" />
              <span>Concern: <span className="text-white font-medium">{concern}</span></span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mt-8 flex gap-2"
      >
        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
        <div className="w-2 h-2 bg-emerald-400 rounded-full animation-delay-200" />
        <div className="w-2 h-2 bg-emerald-400 rounded-full animation-delay-400" />
      </motion.div>
    </motion.div>
  );
};

export default WaitingScreen;