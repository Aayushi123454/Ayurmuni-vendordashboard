// src/pages/doctor/AppointmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doctorService } from '../../../services/doctorService';
import {
    ArrowLeft, Calendar, Clock, User, Mail, Smartphone, Cake,
    Activity, Droplet, Heart, Stethoscope, Pill, AlertCircle,
    CheckCircle, XCircle, MessageCircle, Save, Plus, Trash2,
    Edit2, TrendingUp, CalendarDays, NotebookPen, History,
    FileHeart, BadgeCheck, Download, Sparkles, ShieldCheck,
    FileText, ChevronDown, ChevronUp, Brain, Receipt, CreditCard,
    Upload, Image, File, X, Video, ClipboardList, Wind, Droplets,
    Scale, ThermometerSun, IndianRupee, Phone, VideoIcon, Clock3,
    UserCircle, FolderOpen, Calendar as CalendarIcon, CheckSquare,
    Building, Home, Shield, Eye, Printer, Share2, MoreVertical
} from 'lucide-react';
import { BsLungs, BsPrescription } from 'react-icons/bs';

// ─── HELPERS ────────────────────────────────────────────────────────────────
const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (t) => {
    if (!t) return 'N/A';
    return t.substring(0, 5);
};

const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date(), b = new Date(dob);
    let age = today.getFullYear() - b.getFullYear();
    if (today.getMonth() - b.getMonth() < 0 || (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) age--;
    return age;
};

const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'P';
};

const STATUS_CONFIG = {
    pending: { color: '#d97706', bg: '#fef3c7', border: '#fbbf24', label: 'Pending', icon: Clock },
    confirmed: { color: '#0D614E', bg: '#e8f5f2', border: '#6ee7d0', label: 'Confirmed', icon: BadgeCheck },
    'in-progress': { color: '#2563eb', bg: '#dbeafe', border: '#93c5fd', label: 'In Progress', icon: Activity },
    completed: { color: '#059669', bg: '#d1fae5', border: '#6ee7b7', label: 'Completed', icon: CheckCircle },
    cancelled: { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: 'Cancelled', icon: XCircle },
    'no-show': { color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db', label: 'No Show', icon: XCircle },
};

const CONSULTATION_TYPES = {
    video: { icon: Video, label: 'Video Call', color: '#3B82F6' },
    clinic: { icon: Building, label: 'In-Clinic', color: '#10B981' },
    home: { icon: Home, label: 'Home Visit', color: '#8B5CF6' }
};

// ─── MOCK DATA STRUCTURE ───────────────────────────────────────────────────
const MOCK_APPOINTMENT_DATA = {
    "id": "cf0e880d-b883-449e-832b-86f53fa4da7c",
    "doctor": "5cc338d5-45b7-4075-8ed8-ce5e2e2ac27b",
    "patient": {
        "id": "68938a48-a9d8-4cd3-8fea-4c41dc191c5b",
        "first_name": "Vikram",
        "last_name": "Singh",
        "dob": "1986-03-15",
        "gender": "male",
        "blood_group": "B+",
        "relation": "self",
        "height": 175,
        "weight": 72,
        "phone_number": "+919999888877",
        "email": "vikram.singh@example.com",
        "profile_picture": null,
        "emergency_contact_name": "Priya Singh",
        "emergency_contact_relation": "Spouse",
        "emergency_contact_phone": "+919888777666",
        "insurance_provider": "Star Health",
        "insurance_policy_number": "SH-2023-447821",
        "insurance_valid_thru": "2026-12-31",
        "is_active_profile": true,
        "created_at": "2026-05-22T05:55:32.072607Z",
        "updated_at": "2026-05-22T05:55:32.072634Z"
    },
    "patient_name": "Vikram Singh",
    "availability": "d44c1fec-436b-4573-8977-9ca213adbdd2",
    "appointment_date": "2026-06-02",
    "start_time": "15:00:00",
    "end_time": "16:00:00",
    "consultation_type": "video",
    "payment_id": "PAY-123456789",
    "payment_status": "paid",
    "payment_method": "upi",
    "transaction_id": "UPI20250602150011",
    "status": "confirmed",
    "notes": "Follow-up skin check - Patient responding well to treatment",
    "concern": "Skin rash on left arm, itching since 5 days",
    "diagnosis": "Contact Dermatitis",
    "prescriptions": [
        {
            "id": 1,
            "medicine_name": "Hydrocortisone Cream",
            "dosage": "1%",
            "frequency": "Twice daily",
            "duration": "7 days",
            "instructions": "Apply thin layer on affected area"
        },
        {
            "id": 2,
            "medicine_name": "Cetirizine",
            "dosage": "10mg",
            "frequency": "Once daily",
            "duration": "5 days",
            "instructions": "Take at bedtime"
        }
    ],
    "vitals": {
        "blood_pressure": "118/76",
        "heart_rate": 72,
        "temperature": 98.6,
        "weight": 72,
        "height": 175,
        "respiratory_rate": 16,
        "oxygen_saturation": 98,
        "blood_sugar": 95
    },
    "health_score": 85,
    "medical_history": {
        "hypertension": "No",
        "diabetes": "No",
        "heart_disease": "No",
        "thyroid_issues": "No",
        "previous_surgeries": "None",
        "family_history": "Father has diabetes"
    },
    "previous_appointments": [
        {
            "id": "prev-001",
            "date": "2026-05-15",
            "doctor_name": "Dr. Sharma",
            "diagnosis": "Seasonal Allergy",
            "prescriptions": ["Cetirizine 10mg", "Montelukast 10mg"]
        }
    ],
    "documents": [
        {
            "id": "doc-001",
            "name": "blood_report.pdf",
            "type": "application/pdf",
            "url": "#",
            "upload_date": "2026-05-20T10:30:00Z"
        }
    ],
    "reschedule_reason": null,
    "cancellation_reason": null,
    "cancelled_by": null,
    "previous_appointment_date": null,
    "previous_start_time": null,
    "previous_end_time": null,
    "prakriti": "Pitta-Kapha",
    "amount": 1700.0,
    "created_at": "2026-05-22T06:20:43.809311Z",
    "updated_at": "2026-05-28T11:53:10.484914Z"
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
const SectionCard = ({ children, className = '' }) => (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ icon: Icon, title, action, badge }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <Icon className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            {badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{badge}</span>
            )}
        </div>
        {action}
    </div>
);

const InfoRow = ({ label, value, mono, highlight }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
        <span className={`text-sm font-semibold ${highlight ? 'text-emerald-700' : 'text-gray-700'} ${mono ? 'font-mono text-xs' : ''}`}>
            {value || '—'}
        </span>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm"
            style={{ background: config.bg, color: config.color, borderColor: config.border }}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

const VitalsCard = ({ vitals }) => {
    const vitalItems = [
        { label: 'Blood Pressure', value: vitals?.blood_pressure, icon: Activity, unit: 'mmHg' },
        { label: 'Heart Rate', value: vitals?.heart_rate, icon: Heart, unit: 'bpm' },
        { label: 'Temperature', value: vitals?.temperature, icon: ThermometerSun, unit: '°F' },
        { label: 'Oxygen Level', value: vitals?.oxygen_saturation, icon: Wind, unit: '%' },
        { label: 'Blood Sugar', value: vitals?.blood_sugar, icon: Droplet, unit: 'mg/dL' },
        { label: 'Respiratory Rate', value: vitals?.respiratory_rate, icon: BsLungs, unit: 'breaths/min' }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {vitalItems.map((item, idx) => item.value && (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <item.icon className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs text-gray-500">{item.label}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{item.value} <span className="text-xs font-normal text-gray-400">{item.unit}</span></p>
                </div>
            ))}
        </div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AppointmentDetail = () => {
    const { type, appointmentId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [activeTab, setActiveTab] = useState('prescription');
    const [updating, setUpdating] = useState(false);
    const [showAddMed, setShowAddMed] = useState(false);
    const [expandedPx, setExpandedPx] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        symptom_description: '',
        history_of_past_illness: '',
        clinical_notes: '',
        diagnosis: '',
        prescriptions: [],
        follow_up: { schedule: false, date: '', reason: '' }
    });

    const [newMed, setNewMed] = useState({
        medicine_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });

    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAppointmentDetails();
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            // Use mock data instead of API call for demo
            const response = await doctorService.getAppointmentDetails?.(type, appointmentId);
            const apiData = response?.data?.data || response?.data || response;

            // Using mock data
            // const apiData = MOCK_APPOINTMENT_DATA;

            setAppointment(apiData);
            setDocuments(apiData?.documents || []);

            // Set form data
            setFormData({
                symptom_description: apiData?.concern || '',
                history_of_past_illness: apiData?.reschedule_reason || '',
                clinical_notes: apiData?.notes || '',
                diagnosis: apiData?.diagnosis || '',
                prescriptions: apiData?.prescriptions || [],
                follow_up: { schedule: false, date: '', reason: '' }
            });

        } catch (err) {
            console.error('Error fetching appointment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddMed = () => {
        if (!newMed.medicine_name.trim()) return;
        setFormData(prev => ({
            ...prev,
            prescriptions: [...prev.prescriptions, { ...newMed, id: Date.now() }]
        }));
        setNewMed({ medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' });
        setShowAddMed(false);
    };

    const handleRemovePrescription = (id) => {
        setFormData(prev => ({
            ...prev,
            prescriptions: prev.prescriptions.filter(x => x.id !== id)
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);
        setTimeout(() => {
            setDocuments(prev => [...prev, ...files.map(f => ({
                id: Date.now() + Math.random(),
                name: f.name,
                type: f.type,
                size: f.size,
                upload_date: new Date().toISOString(),
                url: URL.createObjectURL(f)
            }))]);
            setUploading(false);
        }, 1000);
    };

    const handleRemoveDocument = (id) => {
        setDocuments(prev => prev.filter(x => x.id !== id));
    };

    const handleSaveAll = async () => {
        setUpdating(true);
        const saveData = {
            appointment_id: appointment?.id,
            ...formData
        };
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saved:', saveData);
            alert('Changes saved successfully!');
        } catch (err) {
            console.error('Save failed:', err);
            alert('Failed to save changes');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin"
                        style={{ borderColor: '#0D614E', borderTopColor: 'transparent' }} />
                    <p className="text-sm text-gray-500 font-medium">Loading appointment details...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Appointment Not Found</h2>
                    <p className="text-sm text-gray-500 mb-6">The appointment you're looking for doesn't exist or has been removed.</p>
                    <button onClick={() => navigate('/doctor/appointments')}
                        className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg"
                        style={{ background: '#0D614E' }}>
                        <ArrowLeft className="w-4 h-4 inline mr-2" /> Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    const patient = appointment.patient;
    const initials = getInitials(patient?.first_name, patient?.last_name);
    const ConsultationIcon = CONSULTATION_TYPES[appointment.consultation_type]?.icon || Video;
    const consultationLabel = CONSULTATION_TYPES[appointment.consultation_type]?.label || appointment.consultation_type;

    const tabs = [
        { id: 'prescription', label: 'Prescription', icon: Pill },
        { id: 'history', label: 'History', icon: History },
        { id: 'documents', label: 'Documents', icon: FileHeart },
        { id: 'billing', label: 'Billing', icon: IndianRupee },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/doctor/appointments')}
                                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Appointment Details</h1>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {appointment.id?.slice(0, 12)}...</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-all">
                                <Printer className="w-4 h-4" />
                            </button>
                            <StatusBadge status={appointment.status} />
                            <button onClick={handleSaveAll} disabled={updating}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg, #0D614E 0%, #0a4a3d 100%)' }}>
                                <Save className="w-4 h-4" />
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Patient Profile Card */}
                        <SectionCard>
                            <div className="h-24 rounded-t-2xl bg-gradient-to-r from-emerald-700 to-teal-600" />
                            <div className="-mt-12 flex flex-col items-center px-6 pb-6">
                                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-emerald-600 to-teal-600">
                                    {initials}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mt-3">{appointment.patient_name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Patient ID: {patient?.id?.slice(0, 8)}...</p>
                                {appointment.prakriti && (
                                    <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                        <Sparkles className="w-3 h-3" /> Prakriti: {appointment.prakriti}
                                    </span>
                                )}
                                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                                    <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 bg-emerald-50 text-emerald-700">
                                        <MessageCircle className="w-3.5 h-3.5" /> Message
                                    </button>
                                    <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 bg-emerald-50 text-emerald-700">
                                        <Phone className="w-3.5 h-3.5" /> Call
                                    </button>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Vitals Section */}
                        {/* {appointment.vitals && (
                            <SectionCard>
                                <SectionHeader icon={Activity} title="Vital Signs" />
                                <div className="p-5">
                                    <VitalsCard vitals={appointment.vitals} />
                                </div>
                            </SectionCard>
                        )} */}

                        {/* Appointment Info */}
                        <SectionCard>
                            <SectionHeader icon={Calendar} title="Appointment Details" />
                            <div className="p-5">
                                <InfoRow label="Date" value={formatDate(appointment.appointment_date)} />
                                <InfoRow label="Time" value={`${formatTime(appointment.start_time)} – ${formatTime(appointment.end_time)}`} />
                                <InfoRow label="Type" value={
                                    <span className="flex items-center gap-1">
                                        <ConsultationIcon className="w-3 h-3" />
                                        {consultationLabel}
                                    </span>
                                } />
                                <InfoRow label="Amount" value={`₹${appointment.amount}`} highlight />
                            </div>
                        </SectionCard>

                        {/* Patient Info */}
                        <SectionCard>
                            <SectionHeader icon={User} title="Patient Information" />
                            <div className="p-5">
                                <InfoRow label="Age" value={`${calculateAge(patient?.dob)} years`} />
                                <InfoRow label="Gender" value={patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'} />
                                <InfoRow label="Blood Group" value={patient?.blood_group || 'Not recorded'} />
                                <InfoRow label="Phone" value={patient?.phone_number || 'N/A'} />
                                <InfoRow label="Email" value={patient?.email || 'Not provided'} />
                            </div>
                        </SectionCard>

                        {/* Emergency Contact */}
                        {(patient?.emergency_contact_name || patient?.emergency_contact_phone) && (
                            <SectionCard>
                                <SectionHeader icon={Shield} title="Emergency Contact" />
                                <div className="p-5">
                                    {patient.emergency_contact_name && <InfoRow label="Name" value={patient.emergency_contact_name} />}
                                    {patient.emergency_contact_relation && <InfoRow label="Relation" value={patient.emergency_contact_relation} />}
                                    {patient.emergency_contact_phone && <InfoRow label="Phone" value={patient.emergency_contact_phone} />}
                                </div>
                            </SectionCard>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="lg:col-span-9">
                        <SectionCard className="overflow-hidden">
                            {/* Tabs */}
                            <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-thin bg-gray-50/50">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all relative
                                            ${activeTab === tab.id ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}>
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="p-6 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">

                                {/* Prescription Tab */}
                                {activeTab === 'prescription' && (
                                    <div className="space-y-6">
                                        {/* Chief Complaint */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
                                                Chief Complaint
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={formData.symptom_description}
                                                onChange={e => handleInputChange('symptom_description', e.target.value)}
                                                placeholder="Patient's main concern..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all"
                                            />
                                        </div>

                                        {/* History of Past Illness */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <History className="w-3.5 h-3.5 text-emerald-600" />
                                                History of Past Illness
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={formData.history_of_past_illness}
                                                onChange={e => handleInputChange('history_of_past_illness', e.target.value)}
                                                placeholder="Describe progression of illness, associated symptoms, treatments tried..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all"
                                            />
                                        </div>

                                        {/* Clinical Notes */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <NotebookPen className="w-3.5 h-3.5 text-emerald-600" />
                                                Clinical Notes
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={formData.clinical_notes}
                                                onChange={e => handleInputChange('clinical_notes', e.target.value)}
                                                placeholder="Examination findings, clinical observations..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all"
                                            />
                                        </div>

                                        {/* Diagnosis */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                                                Diagnosis / Advice
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={formData.diagnosis}
                                                onChange={e => handleInputChange('diagnosis', e.target.value)}
                                                placeholder="Primary diagnosis and treatment plan..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all"
                                            />
                                        </div>

                                        {/* Prescriptions */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prescribed Medicines</p>
                                                <button onClick={() => setShowAddMed(!showAddMed)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-md"
                                                    style={{ background: '#0D614E' }}>
                                                    <Plus className="w-4 h-4" /> Add Medicine
                                                </button>
                                            </div>

                                            {showAddMed && (
                                                <div className="mb-5 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-emerald-200 space-y-3">
                                                    <input type="text" placeholder="Medicine name *" value={newMed.medicine_name}
                                                        onChange={e => setNewMed({ ...newMed, medicine_name: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input type="text" placeholder="Dosage" value={newMed.dosage}
                                                            onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                                                            className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                                        <input type="text" placeholder="Frequency" value={newMed.frequency}
                                                            onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                                                            className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                                    </div>
                                                    <input type="text" placeholder="Duration" value={newMed.duration}
                                                        onChange={e => setNewMed({ ...newMed, duration: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                                    <textarea placeholder="Instructions" rows={2} value={newMed.instructions}
                                                        onChange={e => setNewMed({ ...newMed, instructions: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                                    <div className="flex gap-3 pt-2">
                                                        <button onClick={handleAddMed} className="flex-1 py-2.5 rounded-xl text-white font-semibold transition-all hover:shadow-md" style={{ background: '#0D614E' }}>Add to Prescription</button>
                                                        <button onClick={() => setShowAddMed(false)} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all">Cancel</button>
                                                    </div>
                                                </div>
                                            )}

                                            {formData.prescriptions.length > 0 ? (
                                                <div className="space-y-3">
                                                    {formData.prescriptions.map(med => (
                                                        <div key={med.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 group hover:shadow-md transition-all">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100">
                                                                <Pill className="w-5 h-5 text-emerald-700" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">{med.medicine_name}</p>
                                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                                                                    {med.dosage && <span className="text-xs text-gray-500">💊 {med.dosage}</span>}
                                                                    {med.frequency && <span className="text-xs text-gray-500">⏰ {med.frequency}</span>}
                                                                    {med.duration && <span className="text-xs text-gray-500">📅 {med.duration}</span>}
                                                                </div>
                                                                {med.instructions && <p className="mt-2 text-xs text-gray-500 italic">📝 {med.instructions}</p>}
                                                            </div>
                                                            <button onClick={() => handleRemovePrescription(med.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                    <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                    <p className="text-sm text-gray-400">No medicines prescribed yet</p>
                                                    <p className="text-xs text-gray-300 mt-1">Click "Add Medicine" to start prescribing</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Follow-up */}
                                        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={formData.follow_up.schedule}
                                                    onChange={e => handleInputChange('follow_up', { ...formData.follow_up, schedule: e.target.checked })}
                                                    className="w-4 h-4 rounded accent-emerald-600" />
                                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                                                    Schedule Follow-up Appointment
                                                </span>
                                            </label>
                                            {formData.follow_up.schedule && (
                                                <div className="mt-4 space-y-3 pl-7">
                                                    <input type="date" value={formData.follow_up.date}
                                                        onChange={e => handleInputChange('follow_up', { ...formData.follow_up, date: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                                    <input type="text" placeholder="Reason for follow-up" value={formData.follow_up.reason}
                                                        onChange={e => handleInputChange('follow_up', { ...formData.follow_up, reason: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* History Tab */}
                                {activeTab === 'history' && (
                                    <div className="space-y-6">
                                        {/* Previous Appointments */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                                                <History className="w-3.5 h-3.5 text-emerald-600" />
                                                Previous Appointments
                                            </p>
                                            {appointment.previous_appointments?.length > 0 ? (
                                                <div className="space-y-3">
                                                    {appointment.previous_appointments.map((pres, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                                            <button onClick={() => setExpandedPx(expandedPx === idx ? null : idx)}
                                                                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-100 transition-all">
                                                                <div className="text-left">
                                                                    <p className="text-sm font-semibold text-gray-800">{formatDate(pres.date)}</p>
                                                                    <p className="text-xs text-gray-400 mt-0.5">{pres.doctor_name}</p>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700">
                                                                        {pres.diagnosis}
                                                                    </span>
                                                                    {expandedPx === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                                </div>
                                                            </button>
                                                            {expandedPx === idx && (
                                                                <div className="px-5 pb-4 pt-3 border-t border-gray-100 bg-white">
                                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Prescribed Medicines</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {pres.prescriptions?.map((m, i) => (
                                                                            <span key={i} className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg font-medium text-gray-600">
                                                                                {m}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                    <p className="text-sm text-gray-400">No previous appointments found</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Medical History */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                                                <Brain className="w-3.5 h-3.5 text-emerald-600" />
                                                Medical History Questions
                                            </p>
                                            <div className="space-y-3">
                                                {Object.entries(appointment.medical_history || {}).map(([key, value], idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                                <Brain className="w-4 h-4 text-emerald-700" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</p>
                                                                <p className="text-sm text-gray-500 mt-0.5">{value || 'Not recorded'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Documents Tab */}
                                {activeTab === 'documents' && (
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                                <FileHeart className="w-3.5 h-3.5 text-emerald-600" />
                                                Medical Records
                                            </p>
                                            <label className="cursor-pointer">
                                                <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-md"
                                                    style={{ background: '#0D614E' }}>
                                                    <Upload className="w-4 h-4" /> Upload Document
                                                </span>
                                                <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                                            </label>
                                        </div>

                                        {uploading && (
                                            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                                <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0D614E', borderTopColor: 'transparent' }} />
                                                <span className="text-sm text-emerald-700">Uploading document(s)...</span>
                                            </div>
                                        )}

                                        {documents.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {documents.map(doc => (
                                                    <div key={doc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:shadow-md transition-all">
                                                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                                            {doc.type?.startsWith('image/') ?
                                                                <Image className="w-5 h-5 text-gray-500" /> :
                                                                <FileText className="w-5 h-5 text-gray-500" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(doc.upload_date).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link to={doc.url} target="_blank" className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                                                                <Eye size={16} />
                                                            </Link>
                                                            <button onClick={() => handleRemoveDocument(doc.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <FileHeart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                <p className="text-sm font-medium text-gray-400">No documents uploaded</p>
                                                <p className="text-xs text-gray-300 mt-1">Upload reports, prescriptions, or medical records</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Billing Tab */}
                                {activeTab === 'billing' && (
                                    <div className="space-y-5">
                                        {/* Payment Summary */}
                                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                                                    Payment Summary
                                                </p>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                <div className="flex justify-between px-6 py-4">
                                                    <span className="text-sm text-gray-600">Consultation Fee</span>
                                                    <span className="text-sm font-semibold text-gray-800">₹{appointment.amount}</span>
                                                </div>
                                                <div className="flex justify-between px-6 py-4">
                                                    <span className="text-sm text-gray-600">Platform Fee</span>
                                                    <span className="text-sm text-gray-600">Included</span>
                                                </div>
                                                <div className="flex justify-between px-6 py-4 bg-emerald-50/30">
                                                    <span className="font-bold text-gray-800">Total Amount</span>
                                                    <span className="text-xl font-bold text-emerald-700">₹{appointment.amount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Details */}
                                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                                                    Payment Details
                                                </p>
                                            </div>
                                            <div className="px-6 py-4 space-y-3">
                                                <InfoRow label="Status" value={
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${appointment.payment_id ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {appointment.payment_id ? '✓ Paid' : 'Pending'}
                                                    </span>
                                                } />
                                                {appointment.payment_id && <InfoRow label="Payment ID" value={appointment.payment_id} mono />}
                                                {appointment.payment_method && <InfoRow label="Payment Method" value={appointment.payment_method?.toUpperCase()} />}
                                                {appointment.transaction_id && <InfoRow label="Transaction ID" value={appointment.transaction_id} mono />}
                                            </div>
                                        </div>

                                        {/* Insurance Details */}
                                        {(patient?.insurance_provider || patient?.insurance_policy_number) && (
                                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 overflow-hidden">
                                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                                        Insurance Information
                                                    </p>
                                                </div>
                                                <div className="px-6 py-4">
                                                    <InfoRow label="Provider" value={patient?.insurance_provider || 'Not available'} />
                                                    <InfoRow label="Policy Number" value={patient?.insurance_policy_number || 'Not available'} mono />
                                                    <InfoRow label="Valid Through" value={patient?.insurance_valid_thru ? formatDate(patient.insurance_valid_thru) : 'Not available'} />
                                                </div>
                                            </div>
                                        )}

                                        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all">
                                            <Download className="w-4 h-4" /> Download Invoice
                                        </button>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetail;