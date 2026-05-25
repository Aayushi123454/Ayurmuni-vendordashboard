// DoctorProfile.jsx - Complete working version with corrected state keys
import React, { useState, useEffect, useRef } from 'react';
import {
    User, Mail, Phone, MapPin, Calendar, FileText, Edit, Save, X,
    Camera, Stethoscope, Award, Clock, Users, Star, CheckCircle, AlertCircle,
    Linkedin, Twitter, Facebook, Instagram, Globe, Building, CreditCard,
    Shield, ChevronRight, Trash2, AlertTriangle, Eye, EyeOff,
    Upload, FileCheck, GraduationCap, Briefcase, Heart, Brain,
    Activity, Pill, Syringe, Clipboard, DollarSign, Percent, ShieldCheck,
    Smartphone, Monitor, Wifi, Moon, Sun, Bell, Settings, HelpCircle,
    TrendingUp, CalendarDays, Clock as ClockIcon, Zap, Sparkles, Leaf,
    Lock
} from 'lucide-react';
import { doctorService } from '../../../services/doctorService';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BsBank, BsGenderNeuter } from 'react-icons/bs';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showBankModal, setShowBankModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [newBank, setNewBank] = useState({
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        bank_name: "",
        branch_name: "",
        upi_id: "",
        payment_terms: "monthly"
    });
    // Complete Doctor Profile Data - Keys match API response
    const [doctorData, setDoctorData] = useState({
        id: "",
        title: "Dr.",
        first_name: "",
        last_name: "",
        email: "",
        secondary_number: "",
        dob: "",
        gender: "",
        nationality: "Indian",
        languages_spoken: [],
        bio: "",
        profile_image: "",

        // Address
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",

        // Emergency
        emergency_contact_name: "",
        emergency_contact_relation: "",
        emergency_contact_phone: "",

        // Professional
        specializations: [],
        experience_years: "",
        qualification: "",
        registration_number: "",
        registration_council: "",
        registration_year: "",
        consultation_fee: "",
        followup_fee: "",
        consultation_modes: [],
        average_consultation_time: 0,
        max_patients_per_day: 0,
        years_of_practice: "",

        // Ayurvedic
        primary_dosha_expertise: "",
        specialized_therapies: [],
        is_panchakarma_certified: false,
        ayurveda_practice_years: "",
        ayurvedic_council_id: "",
        practicing_since: "",

        // Social
        linkedin_url: "",
        twitter_url: "",
        facebook_url: "",
        instagram_url: "",

        // Bank Details - Array
        bank_details: [
            {
                account_holder_name: "",
                account_number: "",
                ifsc_code: "",
                bank_name: "",
                branch_name: "",
                upi_id: "",
                payment_terms: "monthly",
                is_verified: false,
                is_selected: false
            }
        ],

        // Documents
        documents: {
            medical_degree_certificate: null,
            registration_certificate: null,
            identity_proof: null,
            address_proof: null,
            passport_photo: null,
            signature: null,
            experience_certificate: null,
            pan_card: null,
            gst_certificate: null,
            cancelled_cheque_or_bank_statement: null,
            is_verified: false,
            verified_at: null
        },

        // Flags
        terms_of_service: false,
        privacy_policy: false,
        communication_accepted: false,

        is_active: true,
        is_deleted: false,
        is_verified: false,
        verified_at: null,

        created_at: "",
        updated_at: "",
        user: "",

        // Additional stats for UI (not from API)
        stats: {
            totalPatients: 0,
            totalConsultations: 0,
            averageRating: 0,
            totalReviews: 0,
            completionRate: 0,
            responseTime: 0,
            thisMonthEarnings: 0,
            lifetimeEarnings: 0,
            upcomingAppointments: 0
        },

        // Settings for UI
        settings: {
            emailNotifications: true,
            smsAlerts: false,
            appointmentReminders: true,
            showInDirectory: true,
            allowReviews: true
        }
    });



    // Helper to update bank details
    const updateBankDetails = (index, field, value) => {
        setDoctorData((prev) => {
            const updated = [...prev.bank_details];
            if (field === "is_selected") {
                // If selecting this bank, unselect others
                updated.forEach((bank, i) => {
                    updated[i] = {
                        ...bank,
                        is_selected: i === index ? value : false
                    };
                });
            } else {
                updated[index] = {
                    ...updated[index],
                    [field]: value
                };
            }
            return {
                ...prev,
                bank_details: updated
            };
        });
    };

    const addBankDetail = () => {
        setDoctorData((prev) => ({
            ...prev,
            bank_details: [
                ...prev.bank_details,
                {
                    account_holder_name: "",
                    account_number: "",
                    confirm_account_number: "",
                    ifsc_code: "",
                    bank_name: "",
                    branch_name: "",
                    upi_id: "",
                    payment_terms: "monthly"
                }
            ]
        }));
    };

    const removeBankDetail = (index) => {
        setDoctorData((prev) => ({
            ...prev,
            bank_details: prev.bank_details.filter((_, i) => i !== index)
        }));
    };

    // Languages and Specializations lists
    const languagesList = ['English', 'Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Marathi', 'Bengali', 'Punjabi'];
    const therapiesList = ['Abhyanga', 'Shirodhara', 'Pizhichil', 'Njavarakizhi', 'Elakizhi', 'Udvartanam', 'Vasti', 'Nasya', 'Raktamokshana', 'Lepanam', 'Dhara'];
    const consultationModesList = ['video', 'chat'];

    useEffect(() => {
        fetchDoctorProfile();
    }, []);

    const fetchDoctorProfile = async () => {
        setIsLoading(true);
        try {
            const response = await doctorService.getProfile();
            const profile = response?.data?.data;
            setDoctorData(prev => ({
                ...prev,
                ...profile,
                // Ensure bank_details is an array
                bank_details: profile?.bank_details && Array.isArray(profile.bank_details)
                    ? profile.bank_details
                    : [{
                        account_holder_name: profile?.account_holder_name || "",
                        account_number: profile?.account_number || "",
                        ifsc_code: profile?.ifsc_code || "",
                        bank_name: profile?.bank_name || "",
                        branch_name: profile?.branch_name || "",
                        upi_id: profile?.upi_id || "",
                        payment_terms: profile?.payment_terms || "monthly"
                    }],
                // Ensure languages_spoken is array
                languages_spoken: profile?.languages_spoken || [],
                // Ensure specialized_therapies is array
                specialized_therapies: profile?.specialized_therapies || [],
                // Ensure consultation_modes is array
                consultation_modes: profile?.consultation_modes || ['video', 'chat'],
                // Map account status
                is_active: profile?.is_active ?? true
            }));
        } catch (error) {
            toast.error('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    // Generic input handler for simple fields
    const handleInputChange = (field, value) => {
        setDoctorData(prev => ({ ...prev, [field]: value }));
        console.log(doctorData);

    };

    // Array field handlers
    const handleArrayAdd = (field, value) => {
        if (value && !doctorData[field].includes(value)) {
            setDoctorData(prev => ({
                ...prev,
                [field]: [...prev[field], value]
            }));
        }
    };

    const handleArrayRemove = (field, index) => {
        setDoctorData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Profile photo upload
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Profile photo must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            setDoctorData(prev => ({ ...prev, profile_image: reader.result }));
            setUploadProgress(0);
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 20;
                });
            }, 200);

            try {
                const response = await doctorService.uploadProfilePhoto(file);
                toast.success('Profile photo updated!');
                setDoctorData(prev => ({ ...prev, profile_image: response.photoUrl }));
            } catch (error) {
                toast.error('Failed to upload photo');
            } finally {
                clearInterval(interval);
                setTimeout(() => setUploadProgress(0), 1000);
            }
        };
        reader.readAsDataURL(file);
    };

    // Document upload
    const handleDocumentUpload = async () => {
        const file = selectedFile;
        if (!file || !selectedDocument) return;

        try {
            const response = await doctorService.updateDocuments(selectedDocument, file);
            setDoctorData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [selectedDocument]: {
                        name: file.name,
                        url: response.url,
                        verified: false,
                        uploadedAt: new Date().toISOString().split('T')[0]
                    }
                }
            }));
            toast.success(`${selectedDocument.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} uploaded successfully!`);
            setShowDocumentModal(false);
            setSelectedDocument(null);
            setSelectedFile(null);
            await fetchDoctorProfile();
        } catch (error) {
            toast.error('Failed to upload document', error.response?.data?.message);
        }
    };

    // Save all profile changes
    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const updateData = {
                title: doctorData.title,
                first_name: doctorData.first_name,
                last_name: doctorData.last_name,
                email: doctorData.email,
                secondary_number: doctorData.secondary_number,
                dob: doctorData.dob,
                gender: doctorData.gender,
                nationality: doctorData.nationality,
                languages_spoken: doctorData.languages_spoken,
                bio: doctorData.bio,
                address_line: doctorData.address_line,
                city: doctorData.city,
                state: doctorData.state,
                pincode: doctorData.pincode,
                country: doctorData.country,
                emergency_contact_name: doctorData.emergency_contact_name,
                emergency_contact_relation: doctorData.emergency_contact_relation,
                emergency_contact_phone: doctorData.emergency_contact_phone,
                qualification: doctorData.qualification,
                registration_number: doctorData.registration_number,
                registration_council: doctorData.registration_council,
                registration_year: doctorData.registration_year,
                experience_years: doctorData.experience_years,
                consultation_fee: doctorData.consultation_fee,
                followup_fee: doctorData.followup_fee,
                consultation_modes: doctorData.consultation_modes,
                average_consultation_time: doctorData.average_consultation_time,
                max_patients_per_day: doctorData.max_patients_per_day,
                primary_dosha_expertise: doctorData.primary_dosha_expertise,
                specialized_therapies: doctorData.specialized_therapies,
                is_panchakarma_certified: doctorData.is_panchakarma_certified,
                ayurveda_practice_years: doctorData.ayurveda_practice_years,
                ayurvedic_council_id: doctorData.ayurvedic_council_id,
                practicing_since: doctorData.practicing_since,
                linkedin_url: doctorData.linkedin_url,
                twitter_url: doctorData.twitter_url,
                facebook_url: doctorData.facebook_url,
                instagram_url: doctorData.instagram_url,
                profile_image: doctorData?.profile_image
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
    };

    const handleAddBank = async () => {
        try {
            const res = await doctorService.submitBankDetails(newBank);

            setDoctorData((prev) => ({
                ...prev,
                bank_details: [...prev.bank_details, res.data]
            }));

            toast.success('Bank details added successfully!');

            setShowBankModal(false);
            setNewBank({
                account_holder_name: "",
                account_number: "",
                ifsc_code: "",
                bank_name: "",
                branch_name: "",
                upi_id: "",
                payment_terms: "monthly"
            });

        } catch (err) {
            console.error(err);
            toast.error('Failed to add bank details');
        }
    };

    const updateBankDetailsByApi = async (index) => {
        const updatedBank = doctorData.bank_details[index];
        try {
            await doctorService.updatebankDetails(updatedBank.id, updatedBank);
            toast.success('Bank details updated successfully!');
            setIsEditing(false);
            await fetchDoctorProfile();
        } catch (err) {
            toast.error('Failed to update bank details');
            console.error(err);
        }
    };

    const handleBankDelete = async (id) => {
        try {
            await doctorService.deleteBankDetails(id);
            await fetchDoctorProfile();
            toast.success('Bank details deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete bank details');
            console.error(err);
        }
    };

    // Password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await doctorService.changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully!');
            setShowPasswordModal(false);
            e.target.reset();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    // Account deletion
    const handleDeleteAccount = async () => {
        try {
            await doctorService.deleteprofile();
            toast.success('Account deleted successfully');
            sessionStorage.clear()
            navigate('/login');
        } catch (error) {
            toast.error('Failed to delete account');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const getStatusBadge = () => {
        const isActive = doctorData.is_active;
        const isVerified = doctorData.is_verified;

        if (isActive && isVerified) return 'bg-emerald-100 text-emerald-700';
        if (!isActive && !isVerified) return 'bg-amber-100 text-amber-700';
        return 'bg-gray-100 text-gray-700';
    };

    const getStatusText = () => {
        const isActive = doctorData.is_active;
        const isVerified = doctorData.is_verified;

        if (isActive && isVerified) return 'Active';
        if (!isActive && !isVerified) return 'Pending Verification';
        return 'Inactive';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    const documentRequirements = {
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

    return (
        <div className="min-h-screen pb-10 mt-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cover Section */}
                    <div className="h-32 bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] relative">
                        <Link to="/dashboard" className="flex items-center max-w-[200px] space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-white absolute top-4 right-4 hover:text-white z-10">
                            <ChevronRight size={18} />
                            <span>Dashboard</span>
                        </Link>

                        <div className="absolute -bottom-14 left-8">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                                    {doctorData.profile_image ? (
                                        <img src={doctorData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                                            <User size={44} className="text-emerald-600" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-110"
                                >
                                    <Camera size={14} />
                                    <input
                                        disabled={!isEditing}
                                        onChange={(e) => setDoctorData({ ...doctorData, profile_image: e.target.files[0] })} type="file" accept="image/*" className='absolute left-0 top-0 w-[24px] h-[24px] cursor-pointer opacity-0' />
                                </button>
                            </div>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="absolute -bottom-6 left-0 w-28">
                                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 pl-8 pr-8 pb-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {doctorData.title} {doctorData.first_name} {doctorData.last_name}
                                    </h2>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}>
                                        {getStatusText()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-gray-500 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <Stethoscope size={15} className="text-emerald-600" />
                                        <span className="text-sm">{doctorData.qualification || 'Ayurvedic Doctor'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Award size={15} className="text-emerald-600" />
                                        <span className="text-sm">{doctorData.experience_years}+ Years Experience</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={15} className="text-emerald-600" />
                                        <span className="text-sm">{doctorData.city || 'Location not set'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0D614E] text-white rounded-xl hover:bg-[#0D614E]/90 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <Edit size={18} />
                                        <span>Edit Profile</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                                        >
                                            <X size={18} />
                                            <span>Cancel</span>
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                        >
                                            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
                                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6 pt-6 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{doctorData.stats.totalPatients}</p>
                                <p className="text-xs text-gray-500">Total Patients</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{doctorData.stats.totalConsultations}</p>
                                <p className="text-xs text-gray-500">Consultations</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-0.5">
                                    <Star size={16} className="text-amber-500 fill-amber-500" />
                                    <p className="text-2xl font-bold text-gray-800">{doctorData.stats.averageRating}</p>
                                </div>
                                <p className="text-xs text-gray-500">({doctorData.stats.totalReviews} reviews)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{doctorData.stats.completionRate}%</p>
                                <p className="text-xs text-gray-500">Completion</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{doctorData.stats.responseTime}</p>
                                <p className="text-xs text-gray-500">Response (min)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-600">₹{doctorData.stats.thisMonthEarnings?.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">This Month</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{doctorData.stats.upcomingAppointments}</p>
                                <p className="text-xs text-gray-500">Upcoming</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6">
                    <div className="border-b border-gray-200 bg-white rounded-t-xl">
                        <nav className="flex flex-wrap gap-1 px-4">
                            {['profile', 'documents', 'bank', 'settings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 py-3 px-5 text-sm font-medium border-b-2 transition-all capitalize ${activeTab === tab
                                        ? 'border-emerald-600 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab === 'profile' && <User size={16} />}
                                    {tab === 'documents' && <FileText size={16} />}
                                    {tab === 'bank' && <CreditCard size={16} />}
                                    {tab === 'settings' && <Settings size={16} />}
                                    <span>{tab === 'profile' ? 'Profile Information' : tab === 'bank' ? 'Bank Details' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-b-xl shadow-sm p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <select
                                                value={doctorData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                disabled={!isEditing}
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                                            >
                                                <option>Dr.</option>
                                                <option>Prof.</option>
                                                <option>Dr. (Prof.)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={doctorData.first_name}
                                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                                disabled={!isEditing}
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={doctorData.last_name}
                                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                                disabled={!isEditing}
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={doctorData.dob?.split('T')[0] || doctorData.dob}
                                                onChange={(e) => handleInputChange('dob', e.target.value)}
                                                disabled={!isEditing}
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <div className="flex items-center gap-2">
                                                <BsGenderNeuter size={18} className="text-gray-400" />
                                                <select
                                                    value={doctorData.gender}
                                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                                    disabled={!isEditing}
                                                    className="auth-card__input flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                            <input
                                                type="text"
                                                value={doctorData.nationality}
                                                onChange={(e) => handleInputChange('nationality', e.target.value)}
                                                disabled={!isEditing}
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                                            {isEditing ? (
                                                <>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {doctorData.languages_spoken.map((lang, idx) => (
                                                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                                                {lang}
                                                                <button type="button" onClick={() => handleArrayRemove('languages_spoken', idx)} className="hover:text-emerald-900"><X size={14} /></button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <select
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleArrayAdd('languages_spoken', e.target.value);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                        className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    >
                                                        <option value="">Add Language</option>
                                                        {languagesList.filter(l => !doctorData.languages_spoken.includes(l)).map(lang => (
                                                            <option key={lang} value={lang}>{lang}</option>
                                                        ))}
                                                    </select>
                                                </>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {doctorData.languages_spoken.map((lang, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{lang}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <div className="flex items-center gap-2">
                                                <Mail size={18} className="text-gray-400" />
                                                <input type="email" value={doctorData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing} className="auth-card__input flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="flex items-center gap-2">
                                                <Phone size={18} className="text-gray-400" />
                                                <input type="tel" value={doctorData.secondary_number} onChange={(e) => handleInputChange('secondary_number', e.target.value)} disabled={!isEditing} className="auth-card__input flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={18} className="text-gray-400" />
                                                <input type="text" value={doctorData.address_line} onChange={(e) => handleInputChange('address_line', e.target.value)} disabled={!isEditing} className="auth-card__input flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                            </div>
                                        </div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={doctorData.city} onChange={(e) => handleInputChange('city', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={doctorData.state} onChange={(e) => handleInputChange('state', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label><input type="text" value={doctorData.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" value={doctorData.country} onChange={(e) => handleInputChange('country', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label><input type="text" value={doctorData.emergency_contact_name} onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label><input type="text" value={doctorData.emergency_contact_relation} onChange={(e) => handleInputChange('emergency_contact_relation', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input type="tel" value={doctorData.emergency_contact_phone} onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                    </div>
                                </div>

                                {/* Professional Details */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label><input type="text" value={doctorData.qualification} onChange={(e) => handleInputChange('qualification', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label><input type="text" value={doctorData.registration_number} onChange={(e) => handleInputChange('registration_number', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Council</label><input type="text" value={doctorData.registration_council} onChange={(e) => handleInputChange('registration_council', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Year</label><input type="number" value={doctorData.registration_year} onChange={(e) => handleInputChange('registration_year', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label><input type="number" value={doctorData.experience_years} onChange={(e) => handleInputChange('experience_years', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹)</label><input type="number" value={doctorData.consultation_fee} onChange={(e) => handleInputChange('consultation_fee', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Fee (₹)</label><input type="number" value={doctorData.followup_fee} onChange={(e) => handleInputChange('followup_fee', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Average Consultation Time (min)</label><input type="number" value={doctorData.average_consultation_time} onChange={(e) => handleInputChange('average_consultation_time', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Patients Per Day</label><input type="number" value={doctorData.max_patients_per_day} onChange={(e) => handleInputChange('max_patients_per_day', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Modes</label>
                                            <div className="flex flex-wrap gap-4">
                                                {consultationModesList.map(mode => (
                                                    <label key={mode} className="flex items-center gap-2">
                                                        <input type="checkbox" checked={doctorData.consultation_modes?.includes(mode)} onChange={(e) => {
                                                            const current = doctorData.consultation_modes || [];
                                                            if (e.target.checked) handleInputChange('consultation_modes', [...current, mode]);
                                                            else handleInputChange('consultation_modes', current.filter(m => m !== mode));
                                                        }} disabled={!isEditing} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                                        <span className="text-sm text-gray-700 capitalize">{mode}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ayurvedic Information */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ayurvedic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary Dosha Expertise</label><input type="text" value={doctorData.primary_dosha_expertise} onChange={(e) => handleInputChange('primary_dosha_expertise', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" placeholder="Vata/Pitta/Kapha" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Years in Ayurveda</label><input type="number" value={doctorData.ayurveda_practice_years} onChange={(e) => handleInputChange('ayurveda_practice_years', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Ayurvedic Council ID</label><input type="text" value={doctorData.ayurvedic_council_id} onChange={(e) => handleInputChange('ayurvedic_council_id', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Practicing Since</label><input type="date" value={doctorData.practicing_since?.split('T')[0] || doctorData.practicing_since} onChange={(e) => handleInputChange('practicing_since', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" /></div>
                                        <div className="md:col-span-2">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" checked={doctorData.is_panchakarma_certified} onChange={(e) => handleInputChange('is_panchakarma_certified', e.target.checked)} disabled={!isEditing} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-[20px]" />
                                                <span className="text-sm text-gray-700">Panchakarma Certified</span>
                                            </label>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialized Therapies</label>
                                            {isEditing ? (
                                                <>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {doctorData.specialized_therapies.map((therapy, idx) => (
                                                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                                {therapy}
                                                                <button type="button" onClick={() => {
                                                                    const updated = doctorData.specialized_therapies.filter((_, i) => i !== idx);
                                                                    handleInputChange('specialized_therapies', updated);
                                                                }}><X size={14} /></button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <select onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleInputChange('specialized_therapies', [...doctorData.specialized_therapies, e.target.value]);
                                                            e.target.value = '';
                                                        }
                                                    }} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                        <option value="">Add Therapy</option>
                                                        {therapiesList.filter(t => !doctorData.specialized_therapies.includes(t)).map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">{doctorData.specialized_therapies.map((t, i) => <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{t}</span>)}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Bio</h3>
                                    <textarea rows="4" value={doctorData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" placeholder="Tell us about your professional journey, expertise, and philosophy..." />
                                </div>

                                {/* Social Media */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Profiles</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label><input type="url" value={doctorData.linkedin_url} onChange={(e) => handleInputChange('linkedin_url', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" placeholder="https://linkedin.com/in/username" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label><input type="url" value={doctorData.twitter_url} onChange={(e) => handleInputChange('twitter_url', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" placeholder="https://twitter.com/username" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label><input type="url" value={doctorData.facebook_url} onChange={(e) => handleInputChange('facebook_url', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" placeholder="https://facebook.com/username" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label><input type="url" value={doctorData.instagram_url} onChange={(e) => handleInputChange('instagram_url', e.target.value)} disabled={!isEditing} className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" placeholder="https://instagram.com/username" /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {
                                        Object.entries(documentRequirements).map(([key, req]) => {
                                            const doc = doctorData.documents ? doctorData.documents[key] : null;
                                            return (
                                                <div key={req.key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-gray-100">
                                                            <FileText size={20} className="text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 capitalize text-sm">{req.label}</p>
                                                            <p className={"text-xs " + (doc ? 'text-emerald-600' : 'text-gray-400')}>{doc ? doc.split('/').pop() : 'Not uploaded'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {doc && <button onClick={() => window.open(doc, '_blank')} className="p-1.5 text-gray-500 hover:text-emerald-600 transition"><Eye size={16} /></button>}
                                                        {doc?.verified ?
                                                            <span className="flex items-center gap-1 text-emerald-600 text-xs bg-[#0D614E] px-2 py-1 rounded-full"><CheckCircle size={12} /><span>Verified</span></span>
                                                            : doc?.name ?
                                                                <span className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                                                                :
                                                                <button onClick={() => { setSelectedDocument(key); setShowDocumentModal(true); }} className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center gap-1"><Upload size={12} /><span>Upload</span></button>
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }

                                    {/* {doctorData.documents && Object.entries(doctorData.documents).map(([key, doc]) => {
                                        if (key === 'is_verified' || key === 'verified_at') return null;
                                        return (
                                            <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gray-100">
                                                        <FileText size={20} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 capitalize text-sm">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                                                        <p className="text-xs text-gray-400">{doc?.name || 'Not uploaded'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {doc?.url && <button onClick={() => window.open(doc.url, '_blank')} className="p-1.5 text-gray-500 hover:text-emerald-600 transition"><Eye size={16} /></button>}
                                                    {doc?.verified ?
                                                        <span className="flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle size={12} /><span>Verified</span></span>
                                                        : doc?.name ?
                                                            <span className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                                                            :
                                                            <button onClick={() => { setSelectedDocument(key); setShowDocumentModal(true); }} className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center gap-1"><Upload size={12} /><span>Upload</span></button>
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })} */}
                                </div>
                                <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                    <div className="flex items-start gap-3"><AlertCircle size={18} className="text-amber-600 mt-0.5" /><div><p className="text-sm font-medium text-amber-800">Document Verification</p><p className="text-xs text-amber-700">Documents are typically verified within 24-48 hours. Please ensure all uploaded documents are clear and legible.</p></div></div>
                                </div>
                            </div>
                        )}

                        {/* Bank Tab */}
                        {activeTab === 'bank' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setShowBankModal(true)}
                                    className="px-4 py-2 bg-[#0D614E] text-white rounded-xl hover:bg-[#0D614E]/90 transition"
                                >
                                    + Add Bank
                                </button>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {doctorData.bank_details.map((data, index) => (
                                        <div
                                            key={index}
                                            className={`relative rounded-2xl p-5 text-white shadow-xl transition-all duration-300 ${data.is_selected
                                                ? "border-[#0D614E] border-2 bg-[#0D614E]/10"
                                                : "bg-gradient-to-r  from-gray-300/50 to-gray-400/50 backdrop-blur-sm"
                                                }`}
                                        >
                                            {/* Top Row */}
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-lg font-semibold">
                                                    {data.bank_name || "Your Bank"}
                                                </h2>

                                                <input
                                                    type="radio"
                                                    name="selectedBank"
                                                    disabled={!isEditing}
                                                    checked={data.is_selected}
                                                    onChange={() => updateBankDetails(index, "is_selected", !data.is_selected)}
                                                    className="w-5 h-5 accent-white"
                                                />
                                                {
                                                    data.is_selected && (
                                                        <span className="absolute -top-2 -right-2 bg-[#0D614E] text-white px-2 py-1 rounded-full text-xs">
                                                            Primary
                                                        </span>
                                                    )
                                                }
                                            </div>

                                            {/* Card Number */}
                                            <p className="mt-2 text-xl tracking-widest font-mono text-black">
                                                **** **** **** {data.account_number?.slice(-4) || "0000"}
                                            </p>

                                            {/* Bottom Info */}
                                            <div className="flex justify-between mt-2 text-sm">
                                                <div>
                                                    <p className="opacity-70 text-sm">Holder</p>
                                                    <p className="font-medium text-black">{data.account_holder_name}</p>
                                                </div>

                                                <div>
                                                    <p className="opacity-70 text-sm">IFSC</p>
                                                    <p className="font-medium text-black">{data.ifsc_code}</p>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="mt-4">
                                                {data.is_verified ? (
                                                    <span className=" px-2 py-1 rounded text-xs bg-[#0D614E]">
                                                        ✔ Verified
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-300 text-black px-2 py-1 rounded text-xs">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            {isEditing && (
                                                <div className="flex gap-2 mt-5">
                                                    <button
                                                        onClick={() => setEditIndex(index)}
                                                        className="bg-[#0D614E] px-3 py-1 rounded text-sm hover:bg-[#0D614E]/80 transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            removeBankDetail(index);
                                                            data.id && handleBankDelete(data.id);
                                                        }}
                                                        className="bg-red-500 px-3 py-1 rounded text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}

                                            {/* 🔥 EDIT FORM (EXPAND INSIDE CARD) */}
                                            {editIndex === index && (
                                                <div className="mt-5 bg-white text-black p-4 rounded-xl">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                        <input
                                                            value={data.account_holder_name}
                                                            onChange={(e) =>
                                                                updateBankDetails(index, "account_holder_name", e.target.value)
                                                            }
                                                            className="input"
                                                            placeholder="Account Holder Name"
                                                        />

                                                        <input
                                                            value={data.account_number}
                                                            onChange={(e) =>
                                                                updateBankDetails(index, "account_number", e.target.value)
                                                            }
                                                            className="input"
                                                            placeholder="Account Number"
                                                        />

                                                        <input
                                                            value={data.ifsc_code}
                                                            onChange={(e) =>
                                                                updateBankDetails(index, "ifsc_code", e.target.value.toUpperCase())
                                                            }
                                                            className="input"
                                                            placeholder="IFSC"
                                                        />

                                                        <input
                                                            value={data.bank_name}
                                                            onChange={(e) =>
                                                                updateBankDetails(index, "bank_name", e.target.value)
                                                            }
                                                            className="input"
                                                            placeholder="Bank Name"
                                                        />

                                                        <input
                                                            value={data.branch_name}
                                                            onChange={(e) =>
                                                                updateBankDetails(index, "branch_name", e.target.value)
                                                            }
                                                            className="input"
                                                            placeholder="Branch"
                                                        />

                                                        <input
                                                            value={data.upi_id}
                                                            onChange={(e) =>
                                                                updateBankDetails(index, "upi_id", e.target.value)
                                                            }
                                                            className="input"
                                                            placeholder="UPI ID"
                                                        />
                                                    </div>

                                                    <div className="flex justify-end gap-3 mt-4">
                                                        <button
                                                            onClick={() => setEditIndex(null)}
                                                            className="px-3 py-1 border rounded"
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                updateBankDetailsByApi(index);
                                                                setEditIndex(null);
                                                            }}
                                                            className="px-3 py-1 bg-emerald-500 text-white rounded"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                {/* <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg"><Shield size={18} className="text-emerald-600" /></div>
                                        <div><h4 className="font-medium text-gray-800">Password Security</h4><p className="text-xs text-gray-500">Change your account password</p></div>
                                    </div>
                                    <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition">Update</button>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-4"><Bell size={18} className="text-emerald-600" /><h4 className="font-medium text-gray-800">Notification Preferences</h4></div>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Email Notifications</span><div className="relative inline-block w-10"><input type="checkbox" checked={doctorData.settings.emailNotifications} onChange={(e) => setDoctorData(prev => ({ ...prev, settings: { ...prev.settings, emailNotifications: e.target.checked } }))} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 appearance-none cursor-pointer" /><label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label></div></label>
                                        <label className="flex items-center justify-between"><span className="text-sm text-gray-700">SMS Alerts</span><div className="relative inline-block w-10"><input type="checkbox" checked={doctorData.settings.smsAlerts} onChange={(e) => setDoctorData(prev => ({ ...prev, settings: { ...prev.settings, smsAlerts: e.target.checked } }))} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 appearance-none cursor-pointer" /><label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label></div></label>
                                        <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Appointment Reminders</span><div className="relative inline-block w-10"><input type="checkbox" checked={doctorData.settings.appointmentReminders} onChange={(e) => setDoctorData(prev => ({ ...prev, settings: { ...prev.settings, appointmentReminders: e.target.checked } }))} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 appearance-none cursor-pointer" /><label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label></div></label>
                                    </div>
                                </div> */}

                                {/* <div className="bg-gray-50 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-4"><Lock size={18} className="text-emerald-600" /><h4 className="font-medium text-gray-800">Privacy Settings</h4></div>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Show my profile in doctor directory</span><div className="relative inline-block w-10"><input type="checkbox" checked={doctorData.settings.showInDirectory} onChange={(e) => setDoctorData(prev => ({ ...prev, settings: { ...prev.settings, showInDirectory: e.target.checked } }))} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 appearance-none cursor-pointer" /><label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label></div></label>
                                        <label className="flex items-center justify-between"><span className="text-sm text-gray-700">Allow patients to leave reviews</span><div className="relative inline-block w-10"><input type="checkbox" checked={doctorData.settings.allowReviews} onChange={(e) => setDoctorData(prev => ({ ...prev, settings: { ...prev.settings, allowReviews: e.target.checked } }))} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 appearance-none cursor-pointer" /><label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label></div></label>
                                    </div>
                                </div> */}

                                <div className="border border-rose-200 rounded-xl p-5 bg-rose-50/30">
                                    <div className="flex items-center gap-3 mb-3"><AlertTriangle size={18} className="text-rose-600" /><h4 className="font-medium text-rose-800">Delete Account</h4></div>
                                    <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition">Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            {/* Document Upload Modal */}
            {showDocumentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                Upload{" "}
                                {selectedDocument
                                    ?.replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </h3>

                            <button onClick={() => setShowDocumentModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-gray-500 text-sm mb-4">
                            Upload clear document (PDF, JPG, PNG, max 5MB)
                        </p>

                        {/* File Upload */}
                        <div className="w-full border border-gray-200 rounded-lg relative">

                            {selectedFile ? (
                                <div className="flex items-center gap-3 p-4">
                                    <FileText size={20} className="text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                        {selectedFile.name}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <input
                                        ref={docInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />

                                    <div className="flex items-center justify-center gap-2 p-6 text-gray-500 hover:text-emerald-600 transition cursor-pointer">
                                        <Upload size={20} />
                                        <span className="text-sm">Click to select file</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowDocumentModal(false);
                                    setSelectedFile(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleDocumentUpload(selectedFile)}
                                disabled={!selectedFile}
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300"
                            >
                                Upload
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {showBankModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-lg">

                        <h2 className="text-lg font-semibold mb-4">Add New Bank</h2>

                        <div className="space-y-4">

                            <input
                                placeholder="Account Holder Name"
                                value={newBank.account_holder_name}
                                onChange={(e) =>
                                    setNewBank({ ...newBank, account_holder_name: e.target.value })
                                }
                                className="input"
                            />

                            <input
                                placeholder="Account Number"
                                value={newBank.account_number}
                                onChange={(e) =>
                                    setNewBank({ ...newBank, account_number: e.target.value })
                                }
                                className="input"
                            />

                            <input
                                placeholder="IFSC Code"
                                value={newBank.ifsc_code}
                                onChange={(e) =>
                                    setNewBank({
                                        ...newBank,
                                        ifsc_code: e.target.value.toUpperCase()
                                    })
                                }
                                className="input"
                            />

                            <input
                                placeholder="Bank Name"
                                value={newBank.bank_name}
                                onChange={(e) =>
                                    setNewBank({ ...newBank, bank_name: e.target.value })
                                }
                                className="input"
                            />

                            <input
                                placeholder="Branch Name"
                                value={newBank.branch_name}
                                onChange={(e) =>
                                    setNewBank({ ...newBank, branch_name: e.target.value })
                                }
                                className="input"
                            />

                            <input
                                placeholder="UPI ID"
                                value={newBank.upi_id}
                                onChange={(e) =>
                                    setNewBank({ ...newBank, upi_id: e.target.value })
                                }
                                className="input"
                            />

                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowBankModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddBank}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {
                showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4"><AlertTriangle size={24} className="text-rose-600" /></div>
                            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Account</h3>
                            <p className="text-gray-500 text-center mb-6">Are you sure? All your data will be permanently removed.</p>
                            <div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button><button onClick={handleDeleteAccount} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Delete</button></div>
                        </div>
                    </div>
                )
            }

            {/* Change Password Modal */}
            {
                showPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800">Change Password</h3><button onClick={() => setShowPasswordModal(false)}><X size={24} /></button></div>
                            <form onSubmit={handlePasswordChange}>
                                <div className="space-y-4">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label><input type="password" name="currentPassword" required className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" name="newPassword" required className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><input type="password" name="confirmPassword" required className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                                </div>
                                <div className="flex gap-3 mt-6"><button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Update</button></div>
                            </form>
                        </div>
                    </div>
                )
            }

            <style jsx>{`
                .toggle-checkbox:checked { right: 0; border-color: #0D614E; }
                .toggle-checkbox:checked + .toggle-label { background-color: #0D614E; }
                .toggle-checkbox { right: 0; transition: all 0.3s; }
                .toggle-label { transition: background-color 0.3s; }
            `}</style>
        </div >
    );
};

export default DoctorProfile;