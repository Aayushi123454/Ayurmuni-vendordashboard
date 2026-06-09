// DoctorProfile.jsx - Optimized & Scalable Version
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    User, Mail, Phone, MapPin, Calendar, FileText, Edit, Save, X,
    Camera, Stethoscope, Award, Clock, Users, Star, CheckCircle, AlertCircle,
    Globe, Building, CreditCard,
    Shield, ChevronRight, Trash2, AlertTriangle, Eye, EyeOff,
    Upload, FileCheck, GraduationCap, Briefcase, Heart, Brain,
    Activity, Pill, Syringe, Clipboard, DollarSign, Percent, ShieldCheck,
    Smartphone, Monitor, Wifi, Moon, Sun, Bell, Settings, HelpCircle,
    TrendingUp, CalendarDays, ClockIcon, Zap, Sparkles, Leaf,
    Lock,
    icons
} from 'lucide-react';
import { doctorService } from '../../../services/doctorService';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BsBank, BsGenderNeuter, BsInstagram, BsTwitter } from 'react-icons/bs';
import { IconBase } from 'react-icons';
import { LiaLinkedin } from 'react-icons/lia';
import { FaFacebook } from 'react-icons/fa';

// ==================== CONSTANTS ====================
const TITLES = ['Dr.', 'Prof.', 'Dr. (Prof.)'];
const GENDERS = ['male', 'female', 'other'];
const LANGUAGES_LIST = ['English', 'Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Marathi', 'Bengali', 'Punjabi'];
const THERAPIES_LIST = ['Abhyanga', 'Shirodhara', 'Pizhichil', 'Njavarakizhi', 'Elakizhi', 'Udvartanam', 'Vasti', 'Nasya', 'Raktamokshana', 'Lepanam', 'Dhara'];
const CONSULTATION_MODES_LIST = ['video', 'chat'];
const STATUS_TABS = ['profile', 'documents', 'bank', 'settings'];

const DOCUMENT_REQUIREMENTS = {
    medical_degree_certificate: { label: 'Medical Degree Certificate', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 5 },
    registration_certificate: { label: 'Registration Certificate', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 5 },
    identity_proof: { label: 'Identity Proof (Aadhar/PAN)', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
    address_proof: { label: 'Address Proof', required: false, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
    passport_photo: { label: 'Passport Size Photo', required: true, accepted: ['JPG', 'PNG'], maxSize: 1 },
    signature: { label: 'Signature', required: true, accepted: ['JPG', 'PNG'], maxSize: 1 },
    experience_certificate: { label: 'Experience Certificate', required: true, accepted: ['PDF'], maxSize: 5 },
    pan_card: { label: 'PAN Card', required: false, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
    gst_certificate: { label: 'GST Certificate', required: false, accepted: ['PDF'], maxSize: 5 },
    cancelled_cheque_or_bank_statement: { label: 'Cancelled Cheque/Bank Statement', required: false, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 }
};

const INITIAL_BANK_STATE = {
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
    branch_name: "",
    upi_id: "",
    payment_terms: "monthly"
};

// ==================== HELPER FUNCTIONS ====================
const getStatusBadge = (isActive, isVerified) => {
    if (isActive && isVerified) return 'bg-emerald-100 text-emerald-700';
    if (!isActive && !isVerified) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
};

const getStatusText = (isActive, isVerified) => {
    if (isActive && isVerified) return 'Active';
    if (!isActive && !isVerified) return 'Pending Verification';
    return 'Inactive';
};

// ==================== REUSABLE COMPONENTS ====================
const StatCard = ({ value, label, icon: Icon, iconColor }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <div className="flex items-center justify-center gap-0.5">
            {icons === Star && <Star size={16} className="text-amber-500 fill-amber-500" />}
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>
);

const InfoRow = ({ icon: Icon, value, className = "" }) => (
    <div className={`flex items-center gap-1.5 ${className}`}>
        <Icon size={15} className="text-[#0D614E]" />
        <span className="text-sm">{value}</span>
    </div>
);

const FormInput = ({ label, value, onChange, disabled, type = "text", placeholder = "", required = false, icon: Icon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center">
            {/* {Icon && <Icon size={18} className="text-gray-400" />} */}
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className="auth-card__input flex-1 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E] disabled:bg-gray-50"
            />
        </div>
    </div>
);

const FormSelect = ({ label, name, value, onChange, disabled, options, placeholder = "" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E] disabled:bg-gray-50"
        >
            <option value="">{placeholder || `Select ${label}`}</option>
            {
                (name === "primaryDosha")
                    ? options?.map((opt) => (
                        <option
                            key={typeof opt === "string" ? opt : opt.id}
                            value={typeof opt === "string" ? opt : opt.name}
                        >
                            {typeof opt === "string" ? opt : opt.name}
                        </option>
                    ))
                    : options.map((opt) => (
                        <option
                            key={typeof opt === "string" ? opt : opt.value}
                            value={typeof opt === "string" ? opt : opt.value}
                        >
                            {typeof opt === "string" ? opt : opt.label}
                        </option>
                    ))
            }
        </select>
    </div>
);

const FormTextArea = ({ label, value, onChange, disabled, rows = 4, placeholder = "" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            rows={rows}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E] disabled:bg-gray-50"
        />
    </div>
);

const SectionHeader = ({ title }) => (
    <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    </div>
);

const ChipInput = ({ items, name, onAdd, onRemove, options, disabled, placeholder = "Add item", colorClass = "bg-emerald-100 text-emerald-700" }) => (
    <div className="md:col-span-2">
        <div className="flex flex-wrap gap-2 mb-2">
            {items.map((item, idx) => {
                let selectedOption = ""
                if (name && name === "primaryDisease") {
                    selectedOption = options.find((data) => data.id === item);
                }
                return selectedOption != "" ? (
                    <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                        <span>{selectedOption.name}</span>

                        {
                            !disabled &&
                            <button
                                type="button"
                                onClick={() => onRemove(idx)}
                                className="ml-1 hover:text-emerald-900"
                            >
                                <X size={14} />
                            </button>
                        }
                    </span>
                ) : <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                >
                    <span>{item}</span>

                    {
                        !disabled &&
                        <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="ml-1 hover:text-emerald-900"
                        >
                            <X size={14} />
                        </button>
                    }
                </span>;
            })}

        </div>
        {
            !disabled && (
                (name && name === "primaryDisease")
                    ?
                    <select onChange={(e) => { if (e.target.value) { onAdd(e.target.value); e.target.value = ''; } }}
                        className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                        <option value="">{placeholder}</option>
                        {options?.filter(opt => !items.includes(opt.id)).map(opt => (
                            <option key={opt} value={opt.id}>{opt.name}</option>
                        ))}
                    </select> : <select onChange={(e) => { if (e.target.value) { onAdd(e.target.value); e.target.value = ''; } }}
                        className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                        <option value="">{placeholder}</option>
                        {options.filter(opt => !items.includes(opt)).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
            )
        }
    </div >
);

const CheckboxOption = ({ label, checked, onChange, disabled }) => (
    <label className="flex items-center">
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
            className="rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E] w-[20px]" />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

const DocumentCard = ({ docKey, docUrl, req, onView, onUpload }) => (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
                <FileText size={20} className="text-gray-500" />
            </div>
            <div>
                <p className="font-medium text-gray-800 capitalize text-sm">{req.label}</p>
                <p className={"text-xs " + (docUrl ? 'text-[#0D614E]' : 'text-gray-400')}>
                    {docUrl ? docUrl.split('/').pop() : 'Not uploaded'}
                </p>
            </div>
        </div>
        <div className="flex items-center">
            {docUrl && (
                <button onClick={() => onView(docUrl)} className="p-1.5 text-gray-500 hover:text-[#0D614E] transition">
                    <Eye size={16} />
                </button>
            )}
            <button onClick={() => onUpload(docKey)} className="text-[#0D614E] hover:text-emerald-700 text-xs flex items-center gap-1">
                <Upload size={12} /><span>Upload</span>
            </button>
        </div>
    </div>
);

const BankCard = ({ data, index, isEditing, editIndex, onPrimaryChange, onEdit, onInputChange, onSave, onCancel }) => {
    const isSelected = data.is_selected;
    const isEditMode = editIndex === index;

    return (
        <div className={`relative rounded-2xl p-5 text-white shadow-xl transition-all duration-300 ${isSelected ? "border-[#0D614E] border-2 bg-[#0D614E]/10" : "bg-gradient-to-r from-gray-300/50 to-gray-400/50 backdrop-blur-sm"
            }`}>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{data.bank_name || "Your Bank"}</h2>
                <input type="radio" name="selectedBank" disabled={!isEditing} checked={isSelected}
                    onChange={() => onPrimaryChange(index, !isSelected)} className="w-5 h-5 accent-white" />
                {isSelected && (
                    <span className="absolute -top-2 -right-2 bg-[#0D614E] text-white px-2 py-0.5 rounded-full text-xs">Primary</span>
                )}
            </div>

            <p className="mt-2 text-xl tracking-widest font-mono text-black">
                **** **** **** {data.account_number?.slice(-4) || "0000"}
            </p>

            <div className="flex justify-between mt-2 text-sm">
                <div><p className="opacity-70 text-sm">Holder</p><p className="font-medium text-black">{data.account_holder_name}</p></div>
                <div><p className="opacity-70 text-sm">IFSC</p><p className="font-medium text-black">{data.ifsc_code}</p></div>
            </div>

            <div className="mt-4">
                {data.is_verified ? (
                    <span className="px-2 py-1 rounded text-xs bg-[#0D614E]">✔ Verified</span>
                ) : (
                    <span className="bg-yellow-300 text-black px-2 py-1 rounded text-xs">Pending</span>
                )}
            </div>

            {isEditing && !isEditMode && (
                <div className="flex gap-2 mt-5">
                    <button onClick={() => onEdit(index)} className="bg-[#0D614E] px-3 py-1 rounded text-sm hover:bg-[#0D614E]/80 transition">Edit</button>
                </div>
            )}

            {isEditMode && (
                <div className="mt-5 bg-white text-black p-4 rounded-xl">
                    <h4 className="font-semibold text-sm mb-3">Edit Bank Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={data.account_holder_name} onChange={(e) => onInputChange(index, "account_holder_name", e.target.value)}
                            className="input px-3 py-2 border rounded" placeholder="Account Holder Name" />
                        <input value={data.account_number} onChange={(e) => onInputChange(index, "account_number", e.target.value)}
                            className="input px-3 py-2 border rounded" placeholder="Account Number" />
                        <input value={data.ifsc_code} onChange={(e) => onInputChange(index, "ifsc_code", e.target.value.toUpperCase())}
                            className="input px-3 py-2 border rounded" placeholder="IFSC" />
                        <input value={data.bank_name} onChange={(e) => onInputChange(index, "bank_name", e.target.value)}
                            className="input px-3 py-2 border rounded" placeholder="Bank Name" />
                        <input value={data.branch_name} onChange={(e) => onInputChange(index, "branch_name", e.target.value)}
                            className="input px-3 py-2 border rounded" placeholder="Branch" />
                        <input value={data.upi_id} onChange={(e) => onInputChange(index, "upi_id", e.target.value)}
                            className="input px-3 py-2 border rounded" placeholder="UPI ID" />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
                        <button onClick={() => onSave(index)} className="px-3 py-1 bg-[#0D614E] text-white rounded">Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0D614E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
    </div>
);

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
                </div>
                {children}
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
const DoctorProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [prakritiAndDiseases, setprakritiAndDiseases] = useState({})
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);

    const [newBank, setNewBank] = useState(INITIAL_BANK_STATE);

    const [doctorData, setDoctorData] = useState({
        id: "", title: "Dr.", first_name: "", last_name: "", email: "", secondary_number: "",
        dob: "", gender: "", nationality: "Indian", languages_spoken: [], bio: "",
        address_line: "", city: "", state: "", pincode: "", country: "India",
        emergency_contact_name: "", emergency_contact_relation: "", emergency_contact_phone: "",
        specializations: [], experience_years: "", qualification: "", registration_number: "",
        registration_council: "", registration_year: "", consultation_fee: "", followup_fee: "",
        consultation_modes: [], average_consultation_time: 0, max_patients_per_day: 0, years_of_practice: "",
        primary_dosha_expertise: "", health_diseases: [], specialized_therapies: [], is_panchakarma_certified: false,
        ayurveda_practice_years: "", ayurvedic_council_id: "", practicing_since: "",
        linkedin_url: "", twitter_url: "", facebook_url: "", instagram_url: "",
        bank_details: [{ account_holder_name: "", account_number: "", ifsc_code: "", bank_name: "", branch_name: "", upi_id: "", payment_terms: "monthly", is_verified: false, is_selected: false }],
        documents: { medical_degree_certificate: null, registration_certificate: null, identity_proof: null, address_proof: null, passport_photo: null, signature: null, experience_certificate: null, pan_card: null, gst_certificate: null, cancelled_cheque_or_bank_statement: null, is_verified: false, verified_at: null },
        terms_of_service: false, privacy_policy: false, communication_accepted: false,
        is_active: true, is_deleted: false, is_verified: false, verified_at: null,
        created_at: "", updated_at: "", user: "",
        stats: { totalPatients: 0, totalConsultations: 0, averageRating: 0, totalReviews: 0, completionRate: 0, responseTime: 0, thisMonthEarnings: 0, lifetimeEarnings: 0, upcomingAppointments: 0 },
        settings: { emailNotifications: true, smsAlerts: false, appointmentReminders: true, showInDirectory: true, allowReviews: true }
    });

    // ==================== API CALLS ====================
    const fetchDoctorProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await doctorService.getProfile();
            const profile = response?.data?.data;
            if (profile?.approval_status === 'approved') {
                let data = sessionStorage.getItem('profile');
                sessionStorage.setItem('profile', JSON.stringify({ ...JSON.parse(data), verify: true })); // Store the entire profile data in sessionStorage
            }
            setDoctorData(prev => ({
                ...prev,
                ...profile,
                bank_details: profile?.bank_details && Array.isArray(profile.bank_details) ? profile.bank_details : [{
                    account_holder_name: profile?.account_holder_name || "",
                    account_number: profile?.account_number || "",
                    ifsc_code: profile?.ifsc_code || "",
                    bank_name: profile?.bank_name || "",
                    branch_name: profile?.branch_name || "",
                    upi_id: profile?.upi_id || "",
                    payment_terms: profile?.payment_terms || "monthly"
                }],
                languages_spoken: profile?.languages_spoken || [],
                specialized_therapies: profile?.specialized_therapies || [],
                consultation_modes: profile?.consultation_modes || ['video', 'chat'],
                is_active: profile?.is_active ?? true
            }));
        } catch (error) {
            toast.error('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctorProfile();
    }, [fetchDoctorProfile]);

    const handleInputChange = useCallback((field, value) => {
        setDoctorData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleArrayAdd = useCallback((field, value) => {
        if (value && !doctorData[field]?.includes(value)) {
            setDoctorData(prev => ({ ...prev, [field]: [...(prev[field] || []), value] }));
        }
    }, [doctorData]);

    const handleArrayRemove = useCallback((field, index) => {
        setDoctorData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await doctorService.getPrakritiAndDiseases();
                setprakritiAndDiseases(data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSaveProfile = useCallback(async () => {
        setIsSaving(true);
        try {
            const updateData = {
                title: doctorData.title, first_name: doctorData.first_name, last_name: doctorData.last_name,
                email: doctorData.email, secondary_number: doctorData.secondary_number, dob: doctorData.dob,
                gender: doctorData.gender, nationality: doctorData.nationality, languages_spoken: doctorData.languages_spoken,
                bio: doctorData.bio, address_line: doctorData.address_line, city: doctorData.city, state: doctorData.state,
                pincode: doctorData.pincode, country: doctorData.country, emergency_contact_name: doctorData.emergency_contact_name,
                emergency_contact_relation: doctorData.emergency_contact_relation, emergency_contact_phone: doctorData.emergency_contact_phone,
                qualification: doctorData.qualification, registration_number: doctorData.registration_number,
                registration_council: doctorData.registration_council, registration_year: doctorData.registration_year,
                experience_years: doctorData.experience_years, consultation_fee: doctorData.consultation_fee,
                followup_fee: doctorData.followup_fee, consultation_modes: doctorData.consultation_modes,
                average_consultation_time: doctorData.average_consultation_time, max_patients_per_day: doctorData.max_patients_per_day,
                primary_dosha_expertise: doctorData.primary_dosha_expertise, health_diseases: doctorData.health_diseases, specialized_therapies: doctorData.specialized_therapies,
                is_panchakarma_certified: doctorData.is_panchakarma_certified, ayurveda_practice_years: doctorData.ayurveda_practice_years,
                ayurvedic_council_id: doctorData.ayurvedic_council_id, practicing_since: doctorData.practicing_since,
                linkedin_url: doctorData.linkedin_url, twitter_url: doctorData.twitter_url, facebook_url: doctorData.facebook_url,
                instagram_url: doctorData.instagram_url
            };
            await doctorService.updateProfile(updateData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            await fetchDoctorProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    }, [doctorData, fetchDoctorProfile]);

    const updateBankDetails = useCallback((index, field, value) => {
        setDoctorData(prev => {
            const updated = [...prev.bank_details];
            if (field === "is_selected") {
                updated.forEach((bank, i) => { updated[i] = { ...bank, is_selected: i === index ? value : false }; });
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            return { ...prev, bank_details: updated };
        });
    }, []);

    const updateBankDetailsByApi = useCallback(async (index) => {
        const updatedBank = doctorData.bank_details[index];
        try {
            await doctorService.updatebankDetails(updatedBank.id, updatedBank);
            toast.success('Bank details updated successfully!');
            await fetchDoctorProfile();
        } catch (err) {
            toast.error('Failed to update bank details');
        }
        setEditIndex(null);
    }, [doctorData.bank_details, fetchDoctorProfile]);

    const handleAddBank = useCallback(async () => {
        try {
            const res = await doctorService.submitBankDetails(newBank);
            setDoctorData(prev => ({ ...prev, bank_details: [...prev.bank_details, res.data] }));
            toast.success('Bank details added successfully!');
            setShowBankModal(false);
            setNewBank(INITIAL_BANK_STATE);
        } catch (err) {
            console.error(err);
            toast.error('Failed to add bank details');
        }
    }, [newBank]);

    const handleDocumentUpload = useCallback(async () => {
        if (!selectedFile || !selectedDocument) return;
        try {
            const response = await doctorService.uploadDocuments(selectedDocument, selectedFile);
            setDoctorData(prev => ({
                ...prev,
                documents: { ...prev.documents, [selectedDocument]: response.url }
            }));
            toast.success(`${selectedDocument.replace(/_/g, ' ')} uploaded successfully!`);
            setShowDocumentModal(false);
            setSelectedDocument(null);
            setSelectedFile(null);
            await fetchDoctorProfile();
        } catch (error) {
            toast.error('Failed to upload document', error.response?.data?.message);
        }
    }, [selectedFile, selectedDocument, fetchDoctorProfile]);

    const handlePhotoUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Profile photo must be less than 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            setDoctorData(prev => ({ ...prev, profile_image: reader.result }));
            const interval = setInterval(() => setUploadProgress(p => p >= 100 ? 100 : p + 20), 200);
            try {
                const response = await doctorService.updateDocuments("profile_image", file);
                toast.success('Profile photo updated!');
                await fetchDoctorProfile();
            } catch (error) {
                toast.error('Failed to upload photo');
            } finally {
                clearInterval(interval);
                setTimeout(() => setUploadProgress(0), 1000);
            }
        };
        reader.readAsDataURL(file);
    }, [fetchDoctorProfile]);

    const handlePasswordChange = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        if (newPassword !== confirmPassword) return toast.error('New passwords do not match');
        if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
        try {
            await doctorService.changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully!');
            setShowPasswordModal(false);
            e.target.reset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    }, []);

    const handleDeleteAccount = useCallback(async () => {
        try {
            await doctorService.deleteprofile();
            toast.success('Account deleted successfully');
            sessionStorage.clear();
            navigate('/login');
        } catch (error) {
            toast.error('Failed to delete account');
        } finally {
            setShowDeleteModal(false);
        }
    }, [navigate]);

    // ==================== MEMOIZED VALUES ====================
    const statusBadge = useMemo(() => getStatusBadge(doctorData.is_active, doctorData.is_verified), [doctorData.is_active, doctorData.is_verified]);
    const statusText = useMemo(() => getStatusText(doctorData.is_active, doctorData.is_verified), [doctorData.is_active, doctorData.is_verified]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen pb-10 mt-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] relative">
                        <Link to="/dashboard" className="flex items-center max-w-[200px] space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-white absolute top-4 right-4 hover:text-white z-10">
                            <ChevronRight size={18} /><span>Dashboard</span>
                        </Link>
                        <div className="absolute -bottom-14 left-8">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                                    {doctorData.profile_image ? (
                                        <img src={doctorData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                                            <User size={44} className="text-[#0D614E]" />
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-1.5 bg-[#0D614E] text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-110">
                                    <Camera size={14} />
                                    <input disabled={!isEditing} onChange={handlePhotoUpload} type="file" accept="image/*" className="absolute left-0 top-0 w-[24px] h-[24px] cursor-pointer opacity-0" />
                                </button>
                            </div>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="absolute -bottom-6 left-0 w-28">
                                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0D614E] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-16 pl-8 pr-8 pb-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {doctorData.title} {doctorData.first_name} {doctorData.last_name}
                                    </h2>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge}`}>{statusText}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-gray-500 flex-wrap">
                                    <InfoRow icon={Stethoscope} value={doctorData.qualification || 'Ayurvedic Doctor'} />
                                    <InfoRow icon={Award} value={`${doctorData.experience_years}+ Years Experience`} />
                                    <InfoRow icon={MapPin} value={doctorData.city || 'Location not set'} />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center px-5 py-2.5 bg-[#0D614E] text-white rounded-xl hover:bg-[#0D614E]/90 transition-all shadow-md hover:shadow-lg">
                                        <Edit size={18} /><span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => {
                                            setIsEditing(false)
                                            fetchDoctorProfile()
                                        }} className="flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
                                            <X size={18} /><span>Cancel</span>
                                        </button>
                                        <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center px-5 py-2.5 bg-[#0D614E] text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                                            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6 pt-6 border-t border-gray-100">
                            <StatCard value={doctorData.stats.totalPatients} label="Total Patients" icon={null} />
                            <StatCard value={doctorData.stats.totalConsultations} label="Consultations" icon={null} />
                            <StatCard value={doctorData.stats.averageRating} label={`(${doctorData.stats.totalReviews} reviews)`} icon={Star} />
                            <StatCard value={`${doctorData.stats.completionRate}%`} label="Completion" icon={null} />
                            <StatCard value={doctorData.stats.responseTime} label="Response (min)" icon={null} />
                            <StatCard value={`₹${doctorData.stats.thisMonthEarnings?.toLocaleString()}`} label="This Month" icon={null} />
                            <StatCard value={doctorData.stats.upcomingAppointments} label="Upcoming" icon={null} />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6">
                    <div className="border-b border-gray-200 bg-white rounded-t-xl">
                        <nav className="flex flex-wrap gap-1 px-4">
                            {STATUS_TABS.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`flex items-center py-3 px-5 text-sm font-medium border-b-2 transition-all capitalize ${activeTab === tab
                                        ? 'border-[#0D614E] text-[#0D614E]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}>
                                    {tab === 'profile' && <User size={16} />}
                                    {tab === 'documents' && <FileText size={16} />}
                                    {tab === 'bank' && <CreditCard size={16} />}
                                    {tab === 'settings' && <Settings size={16} />}
                                    <span>{tab === 'profile' ? 'Profile Information' : tab === 'bank' ? 'Bank Details' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="bg-white rounded-b-xl shadow-sm p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <SectionHeader title="Personal Information" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormSelect label="Title" value={doctorData.title} onChange={(e) => handleInputChange('title', e.target.value)} disabled={!isEditing} options={TITLES} />
                                    <FormInput label="First Name" value={doctorData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} disabled={!isEditing} required />
                                    <FormInput label="Last Name" value={doctorData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} disabled={!isEditing} required />
                                    <FormInput label="Date of Birth" value={doctorData.dob?.split('T')[0] || doctorData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} disabled={!isEditing} type="date" />
                                    <FormSelect label="Gender" value={doctorData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} disabled={!isEditing} options={GENDERS} icon={BsGenderNeuter} />
                                    <FormInput label="Nationality" value={doctorData.nationality} onChange={(e) => handleInputChange('nationality', e.target.value)} disabled={!isEditing} />
                                    <ChipInput items={doctorData.languages_spoken || []} onAdd={(val) => handleArrayAdd('languages_spoken', val)}
                                        onRemove={(idx) => handleArrayRemove('languages_spoken', idx)} options={LANGUAGES_LIST} disabled={!isEditing} />
                                </div>

                                <SectionHeader title="Contact Information" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormInput label="Email Address" value={doctorData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing} type="email" icon={Mail} />
                                    <FormInput label="Phone Number" value={doctorData.secondary_number} onChange={(e) => handleInputChange('secondary_number', e.target.value)} disabled={!isEditing} type="tel" icon={Phone} />
                                    <div className="md:col-span-2">
                                        <FormInput label="Street Address" value={doctorData.address_line} onChange={(e) => handleInputChange('address_line', e.target.value)} disabled={!isEditing} icon={MapPin} />
                                    </div>
                                    <FormInput label="City" value={doctorData.city} onChange={(e) => handleInputChange('city', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="State" value={doctorData.state} onChange={(e) => handleInputChange('state', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Pincode" value={doctorData.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Country" value={doctorData.country} onChange={(e) => handleInputChange('country', e.target.value)} disabled={!isEditing} />
                                </div>

                                <SectionHeader title="Emergency Contact" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormInput label="Contact Name" value={doctorData.emergency_contact_name} onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Relationship" value={doctorData.emergency_contact_relation} onChange={(e) => handleInputChange('emergency_contact_relation', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Phone Number" value={doctorData.emergency_contact_phone} onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)} disabled={!isEditing} type="tel" />
                                </div>

                                <SectionHeader title="Professional Details" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormInput label="Qualifications" value={doctorData.qualification} onChange={(e) => handleInputChange('qualification', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Registration Number" value={doctorData.registration_number} onChange={(e) => handleInputChange('registration_number', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Registration Council" value={doctorData.registration_council} onChange={(e) => handleInputChange('registration_council', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Registration Year" value={doctorData.registration_year} onChange={(e) => handleInputChange('registration_year', e.target.value)} disabled={!isEditing} type="number" />
                                    <FormInput label="Experience (Years)" value={doctorData.experience_years} onChange={(e) => handleInputChange('experience_years', e.target.value)} disabled={!isEditing} type="number" />
                                    <FormInput label="Consultation Fee (₹)" value={doctorData.consultation_fee} onChange={(e) => handleInputChange('consultation_fee', e.target.value)} disabled={!isEditing} type="number" />
                                    <FormInput label="Follow-up Fee (₹)" value={doctorData.followup_fee} onChange={(e) => handleInputChange('followup_fee', e.target.value)} disabled={!isEditing} type="number" />
                                    <FormInput label="Average Consultation Time (min)" value={doctorData.average_consultation_time} onChange={(e) => handleInputChange('average_consultation_time', e.target.value)} disabled={!isEditing} type="number" />
                                    <FormInput label="Max Patients Per Day" value={doctorData.max_patients_per_day} onChange={(e) => handleInputChange('max_patients_per_day', e.target.value)} disabled={!isEditing} type="number" />
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Modes</label>
                                        <div className="flex flex-wrap gap-4">
                                            {CONSULTATION_MODES_LIST.map(mode => (
                                                <label key={mode} className="flex items-center">
                                                    <input type="checkbox" checked={doctorData.consultation_modes?.includes(mode)}
                                                        onChange={(e) => {
                                                            const current = doctorData.consultation_modes || [];
                                                            handleInputChange('consultation_modes', e.target.checked ? [...current, mode] : current.filter(m => m !== mode));
                                                        }} disabled={!isEditing} className="rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]" />
                                                    <span className="text-sm text-gray-700 capitalize">{mode}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <SectionHeader title="Ayurvedic Information" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* <FormInput label="Primary Dosha Expertise" value={doctorData.primary_dosha_expertise} onChange={(e) => handleInputChange('primary_dosha_expertise', e.target.value)} disabled={!isEditing} placeholder="Vata/Pitta/Kapha" /> */}
                                    {/* <FormInput label="Primary Dosha Expertise" value={doctorData.health_diseases} onChange={(e) => handleInputChange('health_diseases', e.target.value)} disabled={!isEditing} placeholder="Vata/Pitta/Kapha" /> */}
                                    {
                                        prakritiAndDiseases?.diseases?.data &&
                                        <ChipInput name="primaryDisease" items={doctorData.health_diseases || []} onAdd={(val) => handleInputChange('health_diseases', [...(doctorData.health_diseases || []), val])}
                                            onRemove={(idx) => handleInputChange('health_diseases', doctorData.health_diseases.filter((_, i) => i !== idx))}
                                            options={prakritiAndDiseases?.diseases?.data} disabled={!isEditing} colorClass="bg-purple-100 text-purple-700" />
                                    }

                                    <FormSelect name="primaryDosha" label="Primary Dosha Expertise" value={doctorData.primary_dosha_expertise} onChange={(e) => handleInputChange('primary_dosha_expertise', e.target.value)} disabled={!isEditing} options={prakritiAndDiseases?.prakriti?.data} />


                                    <FormInput label="Years in Ayurveda" value={doctorData.ayurveda_practice_years} onChange={(e) => handleInputChange('ayurveda_practice_years', e.target.value)} disabled={!isEditing} type="number" />
                                    <FormInput label="Ayurvedic Council ID" value={doctorData.ayurvedic_council_id} onChange={(e) => handleInputChange('ayurvedic_council_id', e.target.value)} disabled={!isEditing} />
                                    <FormInput label="Practicing Since" value={doctorData.practicing_since?.split('T')[0] || doctorData.practicing_since} onChange={(e) => handleInputChange('practicing_since', e.target.value)} disabled={!isEditing} type="date" />
                                    <div className="md:col-span-2">
                                        <CheckboxOption label="Panchakarma Certified" checked={doctorData.is_panchakarma_certified} onChange={(e) => handleInputChange('is_panchakarma_certified', e.target.checked)} disabled={!isEditing} />
                                    </div>
                                    <ChipInput items={doctorData.specialized_therapies || []} onAdd={(val) => handleInputChange('specialized_therapies', [...(doctorData.specialized_therapies || []), val])}
                                        onRemove={(idx) => handleInputChange('specialized_therapies', doctorData.specialized_therapies.filter((_, i) => i !== idx))}
                                        options={THERAPIES_LIST} disabled={!isEditing} colorClass="bg-purple-100 text-purple-700" />
                                </div>

                                <SectionHeader title="Professional Bio" />
                                <FormTextArea value={doctorData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} disabled={!isEditing} placeholder="Tell us about your professional journey, expertise, and philosophy..." />

                                <SectionHeader title="Social Media Profiles" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormInput label="LinkedIn" value={doctorData.linkedin_url} onChange={(e) => handleInputChange('linkedin_url', e.target.value)} disabled={!isEditing} placeholder="https://linkedin.com/in/username" icon={LiaLinkedin} />
                                    <FormInput label="Twitter" value={doctorData.twitter_url} onChange={(e) => handleInputChange('twitter_url', e.target.value)} disabled={!isEditing} placeholder="https://twitter.com/username" icon={BsTwitter} />
                                    <FormInput label="Facebook" value={doctorData.facebook_url} onChange={(e) => handleInputChange('facebook_url', e.target.value)} disabled={!isEditing} placeholder="https://facebook.com/username" icon={FaFacebook} />
                                    <FormInput label="Instagram" value={doctorData.instagram_url} onChange={(e) => handleInputChange('instagram_url', e.target.value)} disabled={!isEditing} placeholder="https://instagram.com/username" icon={BsInstagram} />
                                </div>
                            </div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(DOCUMENT_REQUIREMENTS).map(([key, req]) => {
                                        const docUrl = doctorData.documents?.[key];
                                        return (
                                            <DocumentCard
                                                key={key}
                                                docKey={key}
                                                docUrl={docUrl}
                                                req={req}
                                                onView={(url) => window.open(url, '_blank')}
                                                onUpload={(docKey) => { setSelectedDocument(docKey); setShowDocumentModal(true); }}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-800">Document Verification</p>
                                            <p className="text-xs text-amber-700">Documents are typically verified within 24-48 hours. Please ensure all uploaded documents are clear and legible.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bank Tab */}
                        {activeTab === 'bank' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Bank Accounts</h3>
                                    <button onClick={() => setShowBankModal(true)} className="px-4 py-2 bg-[#0D614E] text-white rounded-xl hover:bg-[#0D614E]/90 transition">
                                        + Add Bank Account
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {doctorData.bank_details.map((data, index) => (
                                        <BankCard
                                            key={index}
                                            data={data}
                                            index={index}
                                            isEditing={isEditing}
                                            editIndex={editIndex}
                                            onPrimaryChange={updateBankDetails}
                                            onEdit={setEditIndex}
                                            onInputChange={updateBankDetails}
                                            onSave={updateBankDetailsByApi}
                                            onCancel={() => setEditIndex(null)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="border border-rose-200 rounded-xl p-5 bg-rose-50/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <AlertTriangle size={18} className="text-rose-600" />
                                        <h4 className="font-medium text-rose-800">Delete Account</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition">Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal show={showDocumentModal} onClose={() => { setShowDocumentModal(false); setSelectedFile(null); }} title={`Upload ${selectedDocument?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`}>
                <p className="text-gray-500 text-sm mb-4">Upload clear document (PDF, JPG, PNG, max 5MB)</p>
                <div className="w-full border border-gray-200 rounded-lg relative">
                    {selectedFile ? (
                        <div className="flex items-center gap-3 p-4"><FileText size={20} className="text-gray-500" /><span className="text-sm text-gray-700">{selectedFile.name}</span></div>
                    ) : (
                        <>
                            <input ref={docInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            <div className="flex items-center justify-center gap-2 p-6 text-gray-500 hover:text-[#0D614E] transition cursor-pointer"><Upload size={20} /><span className="text-sm">Click to select file</span></div>
                        </>
                    )}
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={() => { setShowDocumentModal(false); setSelectedFile(null); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                    <button onClick={handleDocumentUpload} disabled={!selectedFile} className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300">Upload</button>
                </div>
            </Modal>

            <Modal show={showBankModal} onClose={() => setShowBankModal(false)} title="Add New Bank Account">
                <p className="text-gray-500 text-sm mb-4">Enter your bank account details for payment settlements</p>
                <div className="space-y-4">
                    <FormInput label="Account Holder Name" value={newBank.account_holder_name} onChange={(e) => setNewBank({ ...newBank, account_holder_name: e.target.value })} required />
                    <FormInput label="Account Number" value={newBank.account_number} onChange={(e) => setNewBank({ ...newBank, account_number: e.target.value })} required />
                    <FormInput label="IFSC Code" value={newBank.ifsc_code} onChange={(e) => setNewBank({ ...newBank, ifsc_code: e.target.value.toUpperCase() })} required />
                    <FormInput label="Bank Name" value={newBank.bank_name} onChange={(e) => setNewBank({ ...newBank, bank_name: e.target.value })} />
                    <FormInput label="Branch Name" value={newBank.branch_name} onChange={(e) => setNewBank({ ...newBank, branch_name: e.target.value })} />
                    <FormInput label="UPI ID" value={newBank.upi_id} onChange={(e) => setNewBank({ ...newBank, upi_id: e.target.value })} />
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowBankModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                    <button onClick={handleAddBank} className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-emerald-700">Save</button>
                </div>
            </Modal>

            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
                <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4"><AlertTriangle size={24} className="text-rose-600" /></div>
                <p className="text-gray-500 text-center mb-6">Are you sure? All your data will be permanently removed.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                    <button onClick={handleDeleteAccount} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Delete</button>
                </div>
            </Modal>

            <Modal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
                <form onSubmit={handlePasswordChange}>
                    <div className="space-y-4">
                        <FormInput label="Current Password" type="password" name="currentPassword" required />
                        <FormInput label="New Password" type="password" name="newPassword" required />
                        <FormInput label="Confirm Password" type="password" name="confirmPassword" required />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-emerald-700">Update</button>
                    </div>
                </form>
            </Modal>

            <style jsx>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default DoctorProfile;