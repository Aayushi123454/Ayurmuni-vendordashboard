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
    Building,
    Home,
    Shield,
    Eye
} from 'lucide-react';
import { BsPrescription } from 'react-icons/bs';

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

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
const SectionCard = ({ children, className = '' }) => (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm  ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ icon: Icon, title, action, badge }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e8f5f2' }}>
                <Icon className="w-4 h-4" style={{ color: '#0D614E' }} />
            </span>
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
            {badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{badge}</span>
            )}
        </div>
        {action}
    </div>
);

const InfoRow = ({ label, value, mono, highlight }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
        <span className={`text-sm font-semibold ${highlight ? 'text-[#0D614E]' : 'text-gray-700'} ${mono ? 'font-mono text-xs' : ''}`}>
            {value || '—'}
        </span>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: config.bg, color: config.color, borderColor: config.border }}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AppointmentDetail = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [updating, setUpdating] = useState(false);

    // Form state with dynamic defaults
    const [hpi, setHpi] = useState('');
    const [notes, setNotes] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [showAddMed, setShowAddMed] = useState(false);
    const [newMed, setNewMed] = useState({ medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' });
    const [followUp, setFollowUp] = useState({ schedule: false, date: '', reason: '', notes: '' });
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [expandedPx, setExpandedPx] = useState(null);
    const [healthScore, setHealthScore] = useState(0);

    // Medical history questions state
    const [medicalQuestions, setMedicalQuestions] = useState([
        { id: 1, question: "History of Hypertension?", answer: "", editable: false },
        { id: 2, question: "History of Diabetes?", answer: "", editable: false },
        { id: 3, question: "History of Heart Disease?", answer: "", editable: false },
        { id: 4, question: "History of Thyroid Issues?", answer: "", editable: false },
        { id: 5, question: "Previous Surgeries?", answer: "", editable: false },
        { id: 6, question: "Family History of Chronic Diseases?", answer: "", editable: false }
    ]);

    useEffect(() => {
        fetchAppointmentDetails();
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getAppointmentDetails?.(appointmentId);

            // Handle API response structure: { success, message, data }
            // const apiData = response?.data?.data || response?.data || response;
            const apiData = {
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
                    "profile_picture": "https://api.example.com/media/profiles/vikram.jpg",
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
                        "url": "https://api.example.com/media/reports/blood_report.pdf",
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
            }
            setAppointment(apiData);

            // Set form fields with fallbacks
            setDocuments(apiData?.documents || []);
            setNotes(apiData?.notes || '');
            setChiefComplaint(apiData?.concern || '');
            setHpi(apiData?.reschedule_reason || '');

            // Parse prescriptions if available (future API addition)
            if (apiData?.prescriptions) {
                setPrescriptions(apiData.prescriptions);
            }

            // Set medical questions answers if available (future API addition)
            if (apiData?.medical_history) {
                setMedicalQuestions(prev => prev.map(q => ({
                    ...q,
                    answer: apiData.medical_history[q.question.toLowerCase().replace(/\s/g, '_')] || 'Not recorded'
                })));
            }

            // Calculate health score based on available data (future enhancement)
            setHealthScore(apiData?.health_score || 75);

        } catch (err) {
            console.error('Error fetching appointment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMed = () => {
        if (!newMed.medicine_name.trim()) return;
        setPrescriptions(p => [...p, { ...newMed, id: Date.now() }]);
        setNewMed({ medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' });
        setShowAddMed(false);
    };

    const handleRemovePrescription = (id) => {
        setPrescriptions(p => p.filter(x => x.id !== id));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);
        setTimeout(() => {
            setDocuments(d => [...d, ...files.map(f => ({
                id: Date.now() + Math.random(),
                name: f.name,
                type: f.type,
                size: f.size,
                uploadDate: new Date().toISOString(),
                url: URL.createObjectURL(f)
            }))]);
            setUploading(false);
        }, 1200);
    };

    const handleRemoveDocument = (id) => {
        setDocuments(d => d.filter(x => x.id !== id));
    };

    const handleSaveAll = async () => {
        setUpdating(true);
        // Prepare save data matching backend expected format
        const saveData = {
            appointment_id: appointment?.id,
            notes: notes,
            concern: chiefComplaint,
            diagnosis: diagnosis,
            prescriptions: prescriptions,
            follow_up: followUp.schedule ? {
                date: followUp.date,
                reason: followUp.reason,
                notes: followUp.notes
            } : null
        };

        try {
            // await doctorService.updateAppointment(appointment?.id, saveData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saved:', saveData);
        } catch (err) {
            console.error('Save failed:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full border-[3px] border-t-transparent animate-spin"
                        style={{ borderColor: '#0D614E', borderTopColor: 'transparent' }} />
                    <p className="text-sm text-gray-500 font-medium">Loading appointment details...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Appointment Not Found</h2>
                    <p className="text-sm text-gray-500 mb-4">The appointment you're looking for doesn't exist.</p>
                    <button onClick={() => navigate('/doctor/appointments')}
                        className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
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
        { id: 'overview', label: 'Overview', icon: ClipboardList },
        { id: 'prescription', label: 'Prescription', icon: Pill },
        { id: 'history', label: 'History', icon: History },
        { id: 'documents', label: 'Documents', icon: FileHeart },
        { id: 'billing', label: 'Billing', icon: IndianRupee },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                            <StatusBadge status={appointment.status} />
                            <button onClick={handleSaveAll} disabled={updating}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg, #0D614E 0%, #0a4a3d 100%)' }}>
                                <Save className="w-4 h-4" />
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-3 space-y-4">

                        {/* Patient Profile Card */}
                        <SectionCard>
                            <div className="h-20 rounded-t-2xl" style={{ background: 'linear-gradient(135deg, #0D614E 0%, #0a4a3d 100%)' }} />
                            <div className="-mt-10 flex flex-col items-center px-6 pb-6">
                                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-white mb-3"
                                    style={{ background: '#0D614E' }}>
                                    {initials}
                                </div>
                                <h3 className="font-bold text-gray-900 text-base text-center">{appointment.patient_name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">ID: {patient?.id?.slice(0, 8)}...</p>
                                {appointment.prakriti && (
                                    <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{ background: '#e8f5f2', color: '#0D614E' }}>
                                        <Sparkles className="w-3 h-3" /> Prakriti: {appointment.prakriti}
                                    </span>
                                )}
                                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                                    <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80"
                                        style={{ background: '#e8f5f2', color: '#0D614E' }}>
                                        <MessageCircle className="w-3.5 h-3.5" /> Message
                                    </button>
                                    <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80"
                                        style={{ background: '#e8f5f2', color: '#0D614E' }}>
                                        <Phone className="w-3.5 h-3.5" /> Call
                                    </button>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Appointment Info */}
                        <SectionCard>
                            <SectionHeader icon={Calendar} title="Appointment Details" />
                            <div className="px-5 py-4">
                                <InfoRow label="Date" value={formatDate(appointment.appointment_date)} />
                                <InfoRow label="Time" value={`${formatTime(appointment.start_time)} – ${formatTime(appointment.end_time)}`} />
                                <InfoRow label="Type" value={
                                    <span className="flex items-center gap-1">
                                        <ConsultationIcon className="w-3 h-3" />
                                        {consultationLabel}
                                    </span>
                                } />
                                <InfoRow label="Amount" value={`₹${appointment.amount}`} highlight />
                                {appointment.cancellation_reason && (
                                    <InfoRow label="Cancel Reason" value={appointment.cancellation_reason} />
                                )}
                                {appointment.cancelled_by && (
                                    <InfoRow label="Cancelled By" value={appointment.cancelled_by} />
                                )}
                            </div>
                        </SectionCard>

                        {/* Patient Info */}
                        <SectionCard>
                            <SectionHeader icon={User} title="Patient Information" />
                            <div className="px-5 py-4">
                                <InfoRow label="Age" value={`${calculateAge(patient?.dob)} years`} />
                                <InfoRow label="Gender" value={patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'} />
                                <InfoRow label="Blood Group" value={patient?.blood_group || 'Not recorded'} />
                                <InfoRow label="Relation" value={patient?.relation ? patient.relation.charAt(0).toUpperCase() + patient.relation.slice(1) : 'Self'} />
                                <InfoRow label="Phone" value={patient?.phone_number || 'N/A'} />
                                <InfoRow label="Email" value={patient?.email || 'Not provided'} />
                            </div>
                        </SectionCard>

                        {/* Emergency Contact - Only show if data exists */}
                        {(patient?.emergency_contact_name || patient?.emergency_contact_phone) && (
                            <SectionCard>
                                <SectionHeader icon={Shield} title="Emergency Contact" />
                                <div className="px-5 py-4">
                                    {patient.emergency_contact_name && <InfoRow label="Name" value={patient.emergency_contact_name} />}
                                    {patient.emergency_contact_relation && <InfoRow label="Relation" value={patient.emergency_contact_relation} />}
                                    {patient.emergency_contact_phone && <InfoRow label="Phone" value={patient.emergency_contact_phone} />}
                                </div>
                            </SectionCard>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="lg:col-span-9 h-full">
                        <SectionCard>
                            {/* Tabs */}
                            <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-thin">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all
                                                    ${activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                                        style={activeTab === tab.id ? { background: '#0D614E' } : {}}>
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="p-6 space-y-5 max-h-[calc(100vh)] overflow-y-auto">

                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <AlertCircle className="w-3.5 h-3.5" style={{ color: '#0D614E' }} />
                                                Chief Complaint
                                            </label>
                                            <textarea rows={2} value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)}
                                                placeholder="Patient's main concern..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                                style={{ '--tw-ring-color': '#0D614E' }}
                                                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0D614E33'}
                                                onBlur={e => e.target.style.boxShadow = 'none'} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <History className="w-3.5 h-3.5" style={{ color: '#0D614E' }} />
                                                History of Present Illness
                                            </label>
                                            <textarea rows={4} value={hpi} onChange={e => setHpi(e.target.value)}
                                                placeholder="Describe progression of illness, associated symptoms, treatments tried..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                                style={{ '--tw-ring-color': '#0D614E' }}
                                                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0D614E33'}
                                                onBlur={e => e.target.style.boxShadow = 'none'} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <NotebookPen className="w-3.5 h-3.5" style={{ color: '#0D614E' }} />
                                                Clinical Notes
                                            </label>
                                            <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)}
                                                placeholder="Examination findings, clinical observations..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                                style={{ '--tw-ring-color': '#0D614E' }}
                                                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0D614E33'}
                                                onBlur={e => e.target.style.boxShadow = 'none'} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <Stethoscope className="w-3.5 h-3.5" style={{ color: '#0D614E' }} />
                                                Diagnosis
                                            </label>
                                            <textarea rows={3} value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                                                placeholder="Primary diagnosis and differential..."
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                                style={{ '--tw-ring-color': '#0D614E' }}
                                                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #0D614E33'}
                                                onBlur={e => e.target.style.boxShadow = 'none'} />
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-600">Health Score</span>
                                                <span className="text-2xl font-bold" style={{ color: '#0D614E' }}>{healthScore}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div className="h-2 rounded-full transition-all" style={{ width: `${healthScore}%`, background: '#0D614E' }}></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">{healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Prescription Tab */}
                                {activeTab === 'prescription' && (
                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                <Stethoscope className="w-3.5 h-3.5" style={{ color: '#0D614E' }} />
                                                Describe symptoms
                                            </label>
                                            <textarea label="Problem Description" icon={Stethoscope}
                                                value={hpi} onChange={e => setHpi(e.target.value)} rows={3}
                                                placeholder="Describe symptoms and current health status…"
                                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Prescribed Medicines</p>
                                                <button onClick={() => setShowAddMed(!showAddMed)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
                                                    style={{ background: '#0D614E' }}>
                                                    <Plus className="w-4 h-4" /> Add Medicine
                                                </button>
                                            </div>

                                            {showAddMed && (
                                                <div className="mb-4 p-4 bg-gray-50 rounded-2xl border-2 border-dashed space-y-3"
                                                    style={{ borderColor: '#0D614E44' }}>
                                                    <input type="text" placeholder="Medicine name *" value={newMed.medicine_name}
                                                        onChange={e => setNewMed({ ...newMed, medicine_name: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input type="text" placeholder="Dosage" value={newMed.dosage}
                                                            onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                                                            className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl" />
                                                        <input type="text" placeholder="Frequency" value={newMed.frequency}
                                                            onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                                                            className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl" />
                                                    </div>
                                                    <input type="text" placeholder="Duration" value={newMed.duration}
                                                        onChange={e => setNewMed({ ...newMed, duration: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl" />
                                                    <textarea placeholder="Instructions" rows={2} value={newMed.instructions}
                                                        onChange={e => setNewMed({ ...newMed, instructions: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl" />
                                                    <div className="flex gap-2">
                                                        <button onClick={handleAddMed} className="flex-1 py-2 rounded-xl text-white font-semibold" style={{ background: '#0D614E' }}>Add</button>
                                                        <button onClick={() => setShowAddMed(false)} className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700">Cancel</button>
                                                    </div>
                                                </div>
                                            )}

                                            {prescriptions.length > 0 ? (
                                                <div className="space-y-3">
                                                    {prescriptions.map(med => (
                                                        <div key={med.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#e8f5f2' }}>
                                                                <Pill className="w-5 h-5" style={{ color: '#0D614E' }} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-800">{med.medicine_name}</p>
                                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                                                                    {med.dosage && <span className="text-xs text-gray-500">Dose: {med.dosage}</span>}
                                                                    {med.frequency && <span className="text-xs text-gray-500">Freq: {med.frequency}</span>}
                                                                    {med.duration && <span className="text-xs text-gray-500">For: {med.duration}</span>}
                                                                </div>
                                                                {med.instructions && <p className="mt-2 text-xs text-gray-500 italic">💡 {med.instructions}</p>}
                                                            </div>
                                                            <button onClick={() => handleRemovePrescription(med.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                    <Pill className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                                    <p className="text-sm text-gray-400">No medicines prescribed yet</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" checked={followUp.schedule}
                                                    onChange={e => setFollowUp({ ...followUp, schedule: e.target.checked })}
                                                    className="w-4 h-4 rounded accent-[#0D614E]" />
                                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <CalendarDays className="w-4 h-4" style={{ color: '#0D614E' }} />
                                                    Schedule Follow-up
                                                </span>
                                            </label>
                                            {followUp.schedule && (
                                                <div className="mt-4 space-y-3 pl-7">
                                                    <input type="date" value={followUp.date} onChange={e => setFollowUp({ ...followUp, date: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl" />
                                                    <input type="text" placeholder="Reason" value={followUp.reason}
                                                        onChange={e => setFollowUp({ ...followUp, reason: e.target.value })}
                                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* History Tab */}
                                {activeTab === 'history' && (
                                    <div className="space-y-5">
                                        {/* Previous Prescriptions */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Previous Prescriptions</p>
                                            {appointment.previous_appointments?.length > 0 ? (
                                                <div className="space-y-2">
                                                    {appointment.previous_appointments.map((pres, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                                            <button onClick={() => setExpandedPx(expandedPx === idx ? null : idx)}
                                                                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-100 transition">
                                                                <div className="text-left">
                                                                    <p className="text-sm font-semibold text-gray-800">{pres.date}</p>
                                                                    <p className="text-xs text-gray-400">{pres.doctor_name}</p>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#e8f5f2', color: '#0D614E' }}>
                                                                        {pres.diagnosis}
                                                                    </span>
                                                                    {expandedPx === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                                </div>
                                                            </button>
                                                            {expandedPx === idx && (
                                                                <div className="px-5 pb-4 border-t border-gray-100">
                                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-2">Medicines</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {pres.prescriptions?.map((m, i) => (
                                                                            <span key={i} className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-medium text-gray-600">
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
                                                    <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                                    <p className="text-sm text-gray-400">No previous prescriptions found</p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Medical History Questions</p>
                                            <div className="space-y-2">
                                                {medicalQuestions.map((q, i) => (
                                                    <div key={q.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex items-start gap-3">
                                                            <Brain className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0D614E' }} />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">{q.question}</p>
                                                                <p className="text-sm text-gray-500 mt-0.5">{q.answer || 'Not recorded'}</p>
                                                            </div>
                                                        </div>
                                                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition">
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Documents Tab */}
                                {activeTab === 'documents' && (
                                    <div className="space-y-5">
                                        {/* <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Medical Records</p>
                                            <label className="cursor-pointer">
                                                <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
                                                    style={{ background: '#0D614E' }}>
                                                    <Upload className="w-4 h-4" /> Upload
                                                </span>
                                                <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                                            </label>
                                        </div> */}

                                        {uploading && (
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0D614E', borderTopColor: 'transparent' }} />
                                                <span className="text-sm text-gray-500">Uploading...</span>
                                            </div>
                                        )}

                                        {documents.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {documents.map(doc => (
                                                    <div key={doc.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                                                            {doc.type?.startsWith('image/') ? <Image className="w-5 h-5 text-gray-400" /> : <File className="w-5 h-5 text-gray-400" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                                                            <p className="text-xs text-gray-400">{new Date(doc.upload_date).toLocaleDateString()}</p>
                                                        </div>
                                                        <Link to={doc.url} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition">
                                                            <Eye size={16} className="text-gray-500" />
                                                        </Link>
                                                        {/* <button onClick={() => handleRemoveDocument(doc.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600">
                                                            <X className="w-4 h-4" />
                                                        </button> */}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <FileHeart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p className="text-sm font-medium text-gray-400">No documents uploaded</p>
                                                <p className="text-xs text-gray-300 mt-1">Upload reports, prescriptions, or medical records</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Billing Tab */}
                                {activeTab === 'billing' && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Payment Summary</p>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                <div className="flex justify-between px-5 py-3.5">
                                                    <span className="text-sm text-gray-600">Consultation Fee</span>
                                                    <span className="text-sm font-semibold text-gray-800">₹{appointment.amount}</span>
                                                </div>
                                                <div className="flex justify-between px-5 py-3.5">
                                                    <span className="text-sm text-gray-600">GST</span>
                                                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#e8f5f2', color: '#0D614E' }}>Included</span>
                                                </div>
                                                <div className="flex justify-between px-5 py-4 bg-white">
                                                    <span className="font-bold text-gray-800">Total (incl. GST)</span>
                                                    <span className="text-xl font-bold" style={{ color: '#0D614E' }}>₹{appointment.amount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Payment Details</p>
                                            </div>
                                            <div className="px-5 py-4">
                                                <InfoRow label="Status" value={
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${appointment.payment_id ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {appointment.payment_id ? 'Paid' : 'Pending'}
                                                    </span>
                                                } />
                                                {appointment.payment_id && <InfoRow label="Payment ID" value={appointment.payment_id} mono />}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                            <div className="px-5 py-4 border-b border-gray-100">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Insurance</p>
                                            </div>
                                            <div className="px-5 py-4">
                                                <InfoRow label="Provider" value={patient?.insurance_provider || 'Not available'} />
                                                <InfoRow label="Policy No." value={patient?.insurance_policy_number || 'Not available'} mono />
                                                <InfoRow label="Valid Thru" value={patient?.insurance_valid_thru || 'Not available'} />
                                            </div>
                                        </div>

                                        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">
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