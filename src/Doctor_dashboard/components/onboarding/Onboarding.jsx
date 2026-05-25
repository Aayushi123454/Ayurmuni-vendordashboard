// DoctorOnboarding.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Plus,
    Minus,
    Trash2,
    Eye,
    Download,
    Star,
    Award,
    Clock,
    Users,
    Stethoscope,
    GraduationCap,
    Briefcase,
    Heart,
    Brain,
    Activity,
    Pill,
    Syringe,
    Clipboard,
    FileCheck,
    CreditCard,
    Banknote,
    Building,
    Home,
    Globe,
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Mail as MailIcon,
    Phone as PhoneIcon,
    MapPin as MapPinIcon,
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    DollarSign,
    Percent,
    Shield,
    Lock,
    Eye as EyeIcon,
    EyeOff,
    Camera,
    CameraOff,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    Smartphone,
    Tablet,
    Laptop,
    Wifi,
    Bluetooth,
    Printer,
    Scanner,
    HardDrive,
    Cpu,
    Server,
    Cloud,
    Database,
    Shield as ShieldIcon,
    Award as AwardIcon,
    Target,
    Zap,
    Sparkles,
    Leaf,
    Heart as HeartIcon,
    Brain as BrainIcon,
    Wind,
    Sun,
    Moon,
    Droplet,
    Thermometer,
    Weight,
    Ruler,
    Activity as ActivityIcon,
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    TrendingDown,
    Users as UsersIcon,
    CalendarDays,
    Clock as ClockIconAlt,
    MoreVertical,
    X,
    Menu,
    Grid,
    List,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    ArrowRight,
    Save,
    Send,
    RefreshCw,
    Settings,
    Bell,
    HelpCircle,
    Info,
    AlertTriangle
} from 'lucide-react';
import { doctorService } from '../../../services/doctorService';
import toast from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';

const DoctorOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRefs = useRef({});
    const [errors, setErrors] = useState({});

    // Form Data State
    const [formData, setFormData] = useState({
        // Personal Information
        personalInfo: {
            title: 'Dr.',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            // bloodGroup: '',
            nationality: 'Indian',
            languages: ['English', 'Hindi'],
            bio: '',
            profilePhoto: null,
            // signature: null
        },

        // Contact Information
        contactInfo: {
            email: '',
            phone: '',
            alternatePhone: '',
            address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            },
            emergencyContact: {
                name: '',
                relationship: '',
                phone: ''
            }
        },

        // Professional Details
        professionalInfo: {
            // specialization: [],
            experience: '',
            qualifications: '',
            registrationNumber: '',
            registrationCouncil: '',
            registrationYear: '',
            consultationFee: '',
            followUpFee: '',
            consultationMode: ['video', 'chat'],
            averageConsultationTime: 30,
            maxPatientsPerDay: 10,
            yearsOfPractice: ''
        },

        // Ayurvedic Specialization
        ayurvedicInfo: {
            primaryDosha: '',
            specializations: [],
            therapies: [],
            panchakarmaCertified: false,
            yearsInAyurveda: '',
            ayurvedicCouncilId: '',
            practicingSince: ''
        },

        // Documents
        documents: {
            medicalDegree: null,
            registrationCertificate: null,
            identityProof: null,
            addressProof: null,
            passportPhoto: null,
            signature: null,
            experienceCertificate: null,
            panCard: null,
            gstCertificate: null,
            bankDetails: null
        },

        // Bank Details
        bankInfo: {
            accountHolderName: '',
            accountNumber: '',
            confirmAccountNumber: '',
            ifscCode: '',
            bankName: '',
            branchName: '',
            upiId: '',
            paymentTerms: ''
        },

        // Clinic/Hospital Information
        socialMedia: {
            // clinicAddress: '',
            // clinicPhone: '',
            // clinicEmail: '',
            // website: '',
            socialMedia: {
                linkedin: '',
                twitter: '',
                facebook: '',
                instagram: ''
            }
        },

        // Terms & Agreements
        agreements: {
            termsAccepted: false,
            privacyAccepted: false,
            communicationAccepted: false,
            agreeDate: new Date().toISOString().split('T')[0]
        }
    });

    // Specializations List
    const ayurvedicSpecializations = [
        'Panchakarma', 'Rasayana', 'Vajikarana', 'Kaya Chikitsa', 'Shalya Tantra',
        'Shalakya Tantra', 'Kaumarbhritya', 'Agada Tantra', 'Bhuta Vidya',
        'Swasthavritta', 'Prasuti Tantra', 'Stri Roga'
    ];

    const therapies = [
        'Abhyanga', 'Shirodhara', 'Pizhichil', 'Njavarakizhi', 'Elakizhi',
        'Udvartanam', 'Vasti', 'Nasya', 'Raktamokshana', 'Lepanam', 'Dhara'
    ];

    const languages = ['English', 'Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Marathi', 'Bengali'];

    // Handle input changes
    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setErrors(prev => ({
            ...prev,
            [field]: '' // Clear error for this field on change
        }));
    };

    const handleNestedInputChange = (section, nested, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [nested]: {
                    ...prev[section][nested],
                    [field]: value
                }
            }
        }));
        setErrors(prev => ({
            ...prev,
            [field]: '' // Clear error for this field on change
        }));
    };

    // Handle file upload
    const handleFileUpload = (section, field, file) => {
        if (file) {
            // Check document size maximum 2 MB
            const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
            if (file.size > maxSize) {
                setErrors(prev => ({
                    ...prev,
                    [field]: 'File size exceeds 2 MB limit'
                }));
                return;
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: {
                            file: file,
                            preview: reader.result,
                            name: file.name,
                            size: file.size,
                            type: file.type
                        }
                    }
                }));

                // Simulate upload progress
                setUploadProgress(prev => ({
                    ...prev,
                    [`${section}.${field}`]: 100
                }));
            };
            reader.readAsDataURL(file);
        }
        setErrors(prev => ({
            ...prev,
            [field]: '' // Clear error for this field on change
        }));
    };

    // Handle array fields (specializations, languages, etc.)
    const handleArrayAdd = (section, field, value) => {
        if (value && !formData[section][field].includes(value)) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: [...prev[section][field], value]
                }
            }));
        }
        setErrors(prev => ({
            ...prev,
            [field]: '' // Clear error for this field on change
        }));
    };

    const handleArrayRemove = (section, field, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: prev[section][field].filter((_, i) => i !== index)
            }
        }));
    };

    // Validate current step
    const validateStep = () => {
        const errors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;

        switch (currentStep) {
            // ✅ STEP 1 – PERSONAL
            case 1: {
                const p = formData.personalInfo;
                const social = formData.socialMedia.socialMedia;

                if (!p.firstName?.trim()) errors.firstName = "First name is required";
                if (!p.lastName?.trim()) errors.lastName = "Last name is required";
                if (!p.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
                if (!p.gender) errors.gender = "Gender is required";

                if (social.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(social.linkedin)) {
                    errors.linkedin = "Invalid LinkedIn URL";
                }
                if (social.twitter && !/^https?:\/\/(www\.)?twitter\.com\/.*$/.test(social.twitter)) {
                    errors.twitter = "Invalid Twitter URL";
                }
                if (social.facebook && !/^https?:\/\/(www\.)?facebook\.com\/.*$/.test(social.facebook)) {
                    errors.facebook = "Invalid Facebook URL";
                }
                if (social.instagram && !/^https?:\/\/(www\.)?instagram\.com\/.*$/.test(social.instagram)) {
                    errors.instagram = "Invalid Instagram URL";
                }

                break;
            }

            // ✅ STEP 2 – CONTACT
            case 2: {
                const c = formData.contactInfo;

                if (!c.email?.trim()) {
                    errors.email = "Email is required";
                } else if (!emailRegex.test(c.email)) {
                    errors.email = "Invalid email format";
                }

                if (!c.phone?.trim()) {
                    errors.phone = "Phone number is required";
                } else if (!phoneRegex.test(c.phone)) {
                    errors.phone = "Invalid phone number";
                }

                if (!c.address?.street?.trim()) errors.street = "Street is required";
                if (!c.address?.city?.trim()) errors.city = "City is required";
                if (!c.address?.state?.trim()) errors.state = "State is required";

                if (!c.address?.pincode?.trim()) {
                    errors.pincode = "Pincode is required";
                } else if (!pincodeRegex.test(c.address.pincode)) {
                    errors.pincode = "Invalid pincode";
                }

                break;
            }

            // ✅ STEP 3 – PROFESSIONAL
            case 3: {
                const p = formData.professionalInfo;

                //         if (!p.specialization?.length) {
                //        errors.specialization = "Select at least one specialization";
                //  }

                if (!p.qualifications?.trim()) {
                    errors.qualifications = "Qualifications are required";
                }

                if (!p.registrationNumber?.trim()) {
                    errors.registrationNumber = "Registration number is required";
                }

                if (!p.experience?.toString().trim()) {
                    errors.experience = "Experience is required";
                }

                if (!formData.ayurvedicInfo.primaryDosha) {
                    errors.primaryDosha = "Primary dosha is required";
                }

                if (!p.consultationFee) {
                    errors.consultationFee = "Consultation fee is required";
                } else if (Number(p.consultationFee) <= 0) {
                    errors.consultationFee = "Enter valid fee";
                }

                break;
            }

            // ✅ STEP 4 – AYURVEDIC
            // case 4: {
            //     const a = formData.ayurvedicInfo;

            //     if (!a.primaryDosha) {
            //         errors.primaryDosha = "Primary dosha is required";
            //     }

            //     // if (!a.yearsInAyurveda) {
            //     //     errors.yearsInAyurveda = "Experience is required";
            //     // }

            //     break;
            // }

            // ✅ STEP 5 – DOCUMENTS
            case 5: {
                const d = formData.documents;

                if (!d.medicalDegree) {
                    errors.medicalDegree = "Medical degree required";
                }

                if (!d.registrationCertificate) {
                    errors.registrationCertificate = "Registration certificate required";
                }

                if (!d.identityProof) {
                    errors.identityProof = "Identity proof required";
                }

                if (!d.signature) {
                    errors.signature = "Signature required";
                }
                if (!d.experienceCertificate) {
                    errors.experienceCertificate = "Experience certificate required";
                }

                break;
            }

            // ✅ STEP 6 – BANK
            case 6: {
                const b = formData.bankInfo;

                if (!b.accountHolderName?.trim()) {
                    errors.accountHolderName = "Account holder name required";
                }

                if (!b.accountNumber?.trim()) {
                    errors.accountNumber = "Account number required";
                }

                if (!b.confirmAccountNumber?.trim()) {
                    errors.confirmAccountNumber = "Confirm account number required";
                } else if (b.accountNumber !== b.confirmAccountNumber) {
                    errors.confirmAccountNumber = "Account numbers do not match";
                }

                if (!b.ifscCode?.trim()) {
                    errors.ifscCode = "IFSC required";
                } else if (!ifscRegex.test(b.ifscCode)) {
                    errors.ifscCode = "Invalid IFSC code";
                }

                break;
            }

            // ✅ STEP 7 – AGREEMENT
            case 7: {
                const a = formData.agreements;

                if (!a.termsAccepted) {
                    errors.termsAccepted = "Accept terms & conditions";
                }

                if (!a.privacyAccepted) {
                    errors.privacyAccepted = "Accept privacy policy";
                }

                if (!a.comunicationAccepted) {
                    errors.comunicationAccepted = "Accept communication policy";
                }


                break;
            }

            default:
                break;
        }

        return errors;
    };



    // Handle next step
    const nextStep = () => {
        const errors = validateStep();

        if (Object.keys(errors).length === 0) {
            setErrors({});
            setCurrentStep((prev) => Math.min(prev + 1, 6));
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            setErrors(errors);
            const firstErrorKey = Object.keys(errors)[0];
            const element = document.querySelector(`[name="${firstErrorKey}"]`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.focus();
            }
        }
    };

    // Handle previous step
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (
            !formData.agreements.termsAccepted ||
            !formData.agreements.privacyAccepted ||
            !formData.agreements.communicationAccepted
        ) {
            toast.error("Please accept all agreements");
            return;
        }

        if (!validateStep()) {
            toast.error("Please complete all required fields");
            return;
        }

        setIsSubmitting(true);

        // const retryApi = async (apiCall, retries = 2) => {
        //     for (let i = 0; i <= retries; i++) {
        //         try {
        //             return await apiCall();
        //         } catch (err) {
        //             if (i === retries) throw err;
        //             console.warn(`Retrying API... attempt ${i + 1}`);
        //         }
        //     }
        // };

        try {
            // ✅ 1. Create Doctor
            // await retryApi(() =>
            let response = await doctorService.createOnboarding({
                // Personal Info
                title: formData.personalInfo.title,
                first_name: formData.personalInfo.firstName,
                last_name: formData.personalInfo.lastName,
                dob: formData.personalInfo.dateOfBirth,
                gender: formData.personalInfo.gender,
                nationality: formData.personalInfo.nationality,
                bio: formData.personalInfo.bio,
                // profile_image: formData.personalInfo.profilePhoto, // ⚠️ file case
                languages_spoken: formData.personalInfo.languages,

                // Contact Info
                email: formData.contactInfo.email,
                secondary_number: formData.contactInfo.alternatePhone,
                address_line: formData.contactInfo.address.street,
                city: formData.contactInfo.address.city,
                state: formData.contactInfo.address.state,
                pincode: formData.contactInfo.address.pincode,
                country: formData.contactInfo.address.country,

                emergency_contact_name: formData.contactInfo.emergencyContact.name,
                emergency_contact_relation: formData.contactInfo.emergencyContact.relationship,
                emergency_contact_phone: formData.contactInfo.emergencyContact.phone,

                // Professional Info
                experience_years: Number(formData.professionalInfo.experience || 0),
                qualification: formData.professionalInfo.qualifications,
                registration_number: formData.professionalInfo.registrationNumber,
                registration_council: formData.professionalInfo.registrationCouncil,
                registration_year: Number(formData.professionalInfo.registrationYear || 0),

                consultation_fee: Number(formData.professionalInfo.consultationFee || 0),
                followup_fee: Number(formData.professionalInfo.followUpFee || 0),

                consultation_modes: formData.professionalInfo.consultationMode,
                average_consultation_time: Number(formData.professionalInfo.averageConsultationTime),
                max_patients_per_day: Number(formData.professionalInfo.maxPatientsPerDay),
                years_of_practice: Number(formData.professionalInfo.experience || 0),

                // Ayurvedic Info
                primary_dosha_expertise: formData.ayurvedicInfo.primaryDosha,
                specialized_therapies: formData.ayurvedicInfo.therapies,
                is_panchakarma_certified: formData.ayurvedicInfo.panchakarmaCertified,
                ayurveda_practice_years: Number(formData.ayurvedicInfo.yearsInAyurveda || 0),
                ayurvedic_council_id: formData.ayurvedicInfo.ayurvedicCouncilId,
                practicing_since: formData.ayurvedicInfo.practicingSince,

                // Social Media
                linkedin_url: formData.socialMedia.socialMedia.linkedin,
                twitter_url: formData.socialMedia.socialMedia.twitter,
                facebook_url: formData.socialMedia.socialMedia.facebook,
                instagram_url: formData.socialMedia.socialMedia.instagram,

                // Agreements
                terms_of_service: formData.agreements.termsAccepted,
                privacy_policy: formData.agreements.privacyAccepted,
                communication_accepted: formData.agreements.communicationAccepted,


                medical_degree: formData.documents.medicalDegree,
                registration_certificate: formData.documents.registrationCertificate,
                identity_proof: formData.documents.identityProof,
                address_proof: formData.documents.addressProof,
                passport_photo: formData.documents.passportPhoto,
                signature: formData.documents.signature,
                experience_certificate: formData.documents.experienceCertificate,
                pan_card: formData.documents.panCard,
                gst_certificate: formData.documents.gstCertificate,
                cancelled_cheque_or_bank_statement: formData.documents.bankDetails,

                bank_name: formData.bankInfo.bankName,
                account_number: formData.bankInfo.accountNumber,
                ifsc_code: formData.bankInfo.ifscCode,
                account_holder_name: formData.bankInfo.accountHolderName,
                branch_name: formData.bankInfo.branchName,
                upi_id: formData.bankInfo.upiId,
                payment_terms: formData.bankInfo.paymentTerms,
                is_selected: true
            })
            // );

            // ✅ 2. Upload Documents (FormData FIX)
            // await retryApi(() => {
            //     return doctorService.uploadDocuments({
            //         medical_degree: formData.documents.medicalDegree,
            //         registration_certificate: formData.documents.registrationCertificate,
            //         identity_proof: formData.documents.identityProof,
            //         address_proof: formData.documents.addressProof,
            //         passport_photo: formData.documents.passportPhoto,
            //         signature: formData.documents.signature,
            //         experience_certificate: formData.documents.experienceCertificate,
            //         pan_card: formData.documents.panCard,
            //         gst_certificate: formData.documents.gstCertificate,
            //         cancelled_cheque_or_bank_statement: formData.documents.bankDetails
            //     });
            // });

            // // ✅ 3. Bank Details
            // await retryApi(() =>
            //     doctorService.submitBankDetails({
            //         bank_name: formData.bankInfo.bankName,
            //         account_number: formData.bankInfo.accountNumber,
            //         ifsc_code: formData.bankInfo.ifscCode,
            //         account_holder_name: formData.bankInfo.accountHolderName,
            //         branch_name: formData.bankInfo.branchName,
            //         upi_id: formData.bankInfo.upiId,
            //         payment_terms: formData.bankInfo.paymentTerms,
            //         is_selected: true
            //     })
            // );

            console.log(response);
            if (response?.data?.success) {
                let localdata = {
                    "phone_number": formData?.contactInfo?.phone,
                    "email": formData?.contactInfo?.email,
                    "first_name": formData?.personalInfo?.firstName,
                    "last_name": formData?.personalInfo?.last_name
                }
                sessionStorage.setItem("profile", JSON.stringify(localdata))
                toast.success("All steps completed successfully 🎉");
                setShowSuccess(true);
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || "Submission failed, Reretry"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get step status
    const getStepStatus = (step) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        return 'pending';
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Document requirements
    const documentRequirements = {
        medicalDegree: { label: 'Medical Degree Certificate', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 5 },
        registrationCertificate: { label: 'Registration Certificate', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 5 },
        identityProof: { label: 'Identity Proof (Aadhar/PAN)', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
        addressProof: { label: 'Address Proof', required: false, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
        passportPhoto: { label: 'Passport Size Photo', required: true, accepted: ['JPG', 'PNG'], maxSize: 1 },
        signature: { label: 'Signature', required: true, accepted: ['JPG', 'PNG'], maxSize: 1 },
        experienceCertificate: { label: 'Experience Certificate', required: true, accepted: ['PDF'], maxSize: 5 },
        panCard: { label: 'PAN Card', required: false, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
        gstCertificate: { label: 'GST Certificate', required: false, accepted: ['PDF'], maxSize: 5 },
        bankDetails: { label: 'Cancelled Cheque/Bank Statement', required: false, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} className="text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Onboarding Successful!</h3>
                        <p className="text-gray-500 mb-4">Your application has been submitted successfully. Our team will review your details and contact you within 48 hours.</p>
                        {/* <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-emerald-800">Application ID: AYURDOC{Math.floor(Math.random() * 100000)}</p>
                        </div> */}
                        <br />
                        <Link to="/dashboard" className="w-full px-6 py-3 bg-[#0D614E] text-white rounded-lg font-medium hover:bg-opacity-90 hover:text-white transition-all">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] text-white backimg pb-10">
                <div className="max-w-6xl mx-auto px-8 py-12">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 animate-bounce-slow">
                            <Stethoscope size={40} />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 text-white">Join Our Healing Community</h1>
                        <p className="text-emerald-100 text-lg">Become a part of India's largest Ayurvedic platform</p>

                        {/* Fun Fact Counter */}
                        <div className="mt-6 flex justify-center space-x-8">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">500+</p>
                                <p className="text-xs text-emerald-100">Active Doctors</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">10k+</p>
                                <p className="text-xs text-emerald-100">Happy Patients</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">24/7</p>
                                <p className="text-xs text-emerald-100">Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-6xl mx-auto px-8 -mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center relative">
                        {[1, 2, 3, 4, 5, 6].map((step) => {
                            const status = getStepStatus(step);
                            return (
                                <div key={step} className="flex-1 text-center relative">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto mb-2 transition-all z-10 relative ${status === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white' :
                                        status === 'current' ? 'border-[#0D614E] bg-[#0D614E] text-white shadow-lg ring-4 ring-emerald-100' :
                                            'border-gray-300 bg-white text-gray-400'
                                        }`}>
                                        {status === 'completed' ? <CheckCircle size={20} /> : step}
                                    </div>
                                    <div className={`text-xs font-medium ${status === 'current' ? 'text-[#0D614E]' : 'text-gray-500'
                                        }`}>
                                        {step === 1 && 'Personal'}
                                        {step === 2 && 'Contact'}
                                        {step === 3 && 'Professional'}
                                        {/* {step === 4 && 'Ayurvedic'} */}
                                        {step === 4 && 'Documents'}
                                        {step === 5 && 'Bank'}
                                        {/* {step === 7 && 'Clinic'} */}
                                        {step === 6 && 'Agreement'}
                                    </div>
                                    {step < 6 && (
                                        <div className={`absolute top-5 left-1/2 w-full h-0.5 z-1 ${step < currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-6xl mx-auto px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="p-8">
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                                        <p className="text-gray-500 mt-1">Tell us about yourself</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <select
                                                value={formData.personalInfo.title}
                                                onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                                                className="auth-card__input  w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            >
                                                <option>Dr.</option>
                                                <option>Prof.</option>
                                                <option>Dr. (Prof.)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.personalInfo.firstName}
                                                onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.firstName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`} placeholder="Enter first name"
                                            />
                                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.personalInfo.lastName}
                                                onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.lastName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`} placeholder="Enter last name"
                                            />
                                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-rose-500">*</span></label>
                                            <input
                                                type="date"
                                                value={formData.personalInfo.dateOfBirth}
                                                onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.dateOfBirth ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 25))
                                                    .toISOString()
                                                    .split("T")[0]} />
                                            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-rose-500">*</span></label>
                                            <select
                                                value={formData.personalInfo.gender}
                                                onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.gender ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                        </div>

                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                            <select
                                                value={formData.personalInfo.bloodGroup}
                                                onChange={(e) => handleInputChange('personalInfo', 'bloodGroup', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.bloodGroup ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option>A+</option>
                                                <option>A-</option>
                                                <option>B+</option>
                                                <option>B-</option>
                                                <option>O+</option>
                                                <option>O-</option>
                                                <option>AB+</option>
                                                <option>AB-</option>
                                            </select>
                                            {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
                                        </div> */}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                            <input
                                                type="text"
                                                value={formData.personalInfo.nationality}
                                                onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.nationality ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.personalInfo.languages.map((lang, idx) => (
                                                    <span key={idx} className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                                        <span>{lang}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleArrayRemove('personalInfo', 'languages', idx)}
                                                            className="ml-1 hover:text-emerald-900"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleArrayAdd('personalInfo', 'languages', e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.languages ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            >
                                                <option value="">Add Language</option>
                                                {languages.filter(l => !formData.personalInfo.languages.includes(l)).map(lang => (
                                                    <option key={lang} value={lang}>{lang}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Professional Summary</label>
                                            <textarea
                                                rows="4"
                                                value={formData.personalInfo.bio}
                                                onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.bio ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="Tell us about your professional journey, expertise, and philosophy..."
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Profiles</h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                            <input
                                                type="url"
                                                placeholder='https://www.linkedin.com/in/username...'
                                                value={formData.socialMedia.socialMedia.linkedin}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'linkedin', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.linkedin ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`} />
                                            {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}

                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                            <input
                                                type="url"
                                                placeholder='https://www.twitter.com/username...'
                                                value={formData.socialMedia.socialMedia.twitter}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'twitter', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.twitter ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}

                                            />
                                            {errors.twitter && <p className="text-red-500 text-sm mt-1">{errors.twitter}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                            <input
                                                type="url"
                                                placeholder='https://www.facebook.com/username...'
                                                value={formData.socialMedia.socialMedia.facebook}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'facebook', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.facebook ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.facebook && <p className="text-red-500 text-sm mt-1">{errors.facebook}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                            <input
                                                type="url"
                                                placeholder='https://www.instagram.com/username...'
                                                value={formData.socialMedia.socialMedia.instagram}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'instagram', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.instagram ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contact Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
                                        <p className="text-gray-500 mt-1">How can we reach you?</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-rose-500">*</span></label>
                                            <input
                                                type="email"
                                                value={formData.contactInfo.email}
                                                onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.email ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="doctor@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-rose-500">*</span></label>
                                            <input
                                                type="tel"
                                                value={formData.contactInfo.phone}
                                                onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.phone ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="+91 XXXXXXXXXX"
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                                            <input
                                                placeholder="+91 XXXXXXXXXX"
                                                type="tel"
                                                value={formData.contactInfo.alternatePhone}
                                                onChange={(e) => handleInputChange('contactInfo', 'alternatePhone', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.alternatePhone ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="Optional"
                                            />
                                            {errors.alternatePhone && <p className="text-red-500 text-sm mt-1">{errors.alternatePhone}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.contactInfo.address.street}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'street', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.street ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="House No, Building, Street"
                                            />
                                            {errors?.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Enter city"
                                                value={formData.contactInfo.address.city}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'city', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.city ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors?.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Enter state"
                                                value={formData.contactInfo.address.state}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'state', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.state ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors?.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Enter pincode"
                                                value={formData.contactInfo.address.pincode}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'pincode', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.pincode ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors?.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <input
                                                type="text"
                                                placeholder="Enter country"
                                                value={formData.contactInfo.address.country}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'country', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.country ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors?.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                        </div>

                                        <div className="md:col-span-2 border-t border-gray-200 pt-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter emergency contact name"
                                                value={formData.contactInfo.emergencyContact.name}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'name', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.emergencyContact?.name ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.emergencyContact?.name && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                            <input
                                                type="text"
                                                placeholder="Enter relationship"
                                                value={formData.contactInfo.emergencyContact.relationship}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'relationship', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.emergencyContact?.relationship ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.emergencyContact?.relationship && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.relationship}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                                            <input
                                                type="tel"
                                                placeholder="Enter emergency phone"
                                                value={formData.contactInfo.emergencyContact.phone}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'phone', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.emergencyContact?.phone ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.emergencyContact?.phone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.phone}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Professional Information */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Professional Information</h2>
                                        <p className="text-gray-500 mt-1">Tell us about your medical practice</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations <span className="text-rose-500">*</span></label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.professionalInfo.specialization.map((spec, idx) => (
                                                    <span key={idx} className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                                        <span>{spec}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleArrayRemove('professionalInfo', 'specialization', idx)}
                                                            className="ml-1 hover:text-emerald-900"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleArrayAdd('professionalInfo', 'specialization', e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="auth-card__input  w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            >
                                                <option value="">Add Specialization</option>
                                                {ayurvedicSpecializations.filter(s => !formData.professionalInfo.specialization.includes(s)).map(spec => (
                                                    <option key={spec} value={spec}>{spec}</option>
                                                ))}
                                            </select>
                                            {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                                        </div> */}


                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.professionalInfo.qualifications}
                                                onChange={(e) => handleInputChange('professionalInfo', 'qualifications', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.qualifications ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="Qualifications (e.g. BAMS, MD Ayurveda, etc.)"
                                            />
                                            {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                value={formData.professionalInfo.experience}
                                                onChange={(e) => handleInputChange('professionalInfo', 'experience', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.experience ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="Years"
                                            />
                                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.professionalInfo.registrationNumber}
                                                onChange={(e) => handleInputChange('professionalInfo', 'registrationNumber', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.registrationNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="Medical Council Registration Number"
                                            />
                                            {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Year</label>
                                            <input
                                                type="number"
                                                placeholder="Year of registration with medical council"
                                                value={formData.professionalInfo.registrationYear}
                                                onChange={(e) => handleInputChange('professionalInfo', 'registrationYear', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.registrationYear ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.registrationYear && <p className="text-red-500 text-sm mt-1">{errors.registrationYear}</p>}
                                        </div>
                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Council</label>
                                            <input
                                                type="text"
                                                placeholder="Name of Medical Council (e.g. MCI, State Medical Council)"
                                                value={formData.professionalInfo.registrationCouncil}
                                                onChange={(e) => handleInputChange('professionalInfo', 'registrationCouncil', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.registrationCouncil ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.registrationCouncil && <p className="text-red-500 text-sm mt-1">{errors.registrationCouncil}</p>}
                                        </div> */}



                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Dosha Expertise <span className="text-rose-500">*</span></label>
                                            <select
                                                value={formData.ayurvedicInfo.primaryDosha}
                                                onChange={(e) => handleInputChange('ayurvedicInfo', 'primaryDosha', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.primaryDosha ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            >
                                                <option value="">Select Primary Dosha</option>
                                                <option>Vata</option>
                                                <option>Pitta</option>
                                                <option>Kapha</option>
                                                <option>Vata-Pitta</option>
                                                <option>Pitta-Kapha</option>
                                                <option>Vata-Kapha</option>
                                            </select>
                                            {errors.primaryDosha && <p className="text-red-500 text-sm mt-1">{errors.primaryDosha}</p>}
                                        </div>

                                        {/* <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Years in Ayurveda Practice <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                placeholder="Number of years practicing Ayurveda"
                                                value={formData.ayurvedicInfo.yearsInAyurveda}
                                                onChange={(e) => handleInputChange('ayurvedicInfo', 'yearsInAyurveda', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.yearsInAyurveda ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                            {errors.yearsInAyurveda && <p className="text-red-500 text-sm mt-1">{errors.yearsInAyurveda}</p>}
                                        </div> */}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ayurvedic Council ID</label>
                                            <input
                                                type="text"
                                                placeholder='Ayurvedic Council ID (if registered)'
                                                value={formData.ayurvedicInfo.ayurvedicCouncilId}
                                                onChange={(e) => handleInputChange('ayurvedicInfo', 'ayurvedicCouncilId', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.ayurvedicCouncilId ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                            {errors.ayurvedicCouncilId && <p className="text-red-500 text-sm mt-1">{errors.ayurvedicCouncilId}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Practicing Since</label>
                                            <input
                                                type="date"
                                                placeholder="Date you started practicing Ayurveda"
                                                value={formData.ayurvedicInfo.practicingSince}
                                                onChange={(e) => handleInputChange('ayurvedicInfo', 'practicingSince', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.practicingSince ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                            {errors.practicingSince && <p className="text-red-500 text-sm mt-1">{errors.practicingSince}</p>}
                                        </div>



                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹) <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                value={formData.professionalInfo.consultationFee}
                                                onChange={(e) => handleInputChange('professionalInfo', 'consultationFee', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.consultationFee ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="Amount in INR"
                                            />
                                            {errors.consultationFee && <p className="text-red-500 text-sm mt-1">{errors.consultationFee}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Fee (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.professionalInfo.followUpFee}
                                                onChange={(e) => handleInputChange('professionalInfo', 'followUpFee', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.followUpFee ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                placeholder="Amount in INR"
                                            />
                                            {errors.followUpFee && <p className="text-red-500 text-sm mt-1">{errors.followUpFee}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Average Consultation Time (minutes)</label>
                                            <input
                                                type="number"
                                                placeholder="Average time spent per consultation"
                                                value={formData.professionalInfo.averageConsultationTime}
                                                onChange={(e) => handleInputChange('professionalInfo', 'averageConsultationTime', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.averageConsultationTime ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.averageConsultationTime && <p className="text-red-500 text-sm mt-1">{errors.averageConsultationTime}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients Per Day</label>
                                            <input
                                                type="number"
                                                placeholder="Maximum number of patients you can see in a day"
                                                value={formData.professionalInfo.maxPatientsPerDay}
                                                onChange={(e) => handleInputChange('professionalInfo', 'maxPatientsPerDay', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.maxPatientsPerDay ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.maxPatientsPerDay && <p className="text-red-500 text-sm mt-1">{errors.maxPatientsPerDay}</p>}
                                        </div>

                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Mode</label>
                                            <div className="flex flex-wrap gap-4 pt-4">
                                                {[/*'in-person',*/ 'video', 'chat'].map(mode => (
                                                    <label key={mode} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            disabled
                                                            checked={formData.professionalInfo.consultationMode.includes(mode)}
                                                            onChange={(e) => {
                                                                const current = formData.professionalInfo.consultationMode;
                                                                if (e.target.checked) {
                                                                    handleInputChange('professionalInfo', 'consultationMode', [...current, mode]);
                                                                } else {
                                                                    handleInputChange('professionalInfo', 'consultationMode', current.filter(m => m !== mode));
                                                                }
                                                            }}
                                                            className={`rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E] ${errors?.consultationMode ? 'border-rose-500 focus:ring-rose-500' : ''}`}
                                                        />
                                                        <span className="text-sm text-gray-700 capitalize">{mode}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.ayurvedicInfo.panchakarmaCertified}
                                                    onChange={(e) => handleInputChange('ayurvedicInfo', 'panchakarmaCertified', e.target.checked)}
                                                    className={`rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E] w-4 h-4 ${errors?.panchakarmaCertified ? 'border-rose-500 focus:ring-rose-500' : ''}`}
                                                />
                                                <span className="text-sm text-gray-700">I am Panchakarma Certified</span>
                                            </label>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialized Therapies</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.ayurvedicInfo.therapies.map((therapy, idx) => (
                                                    <span key={idx} className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                        <span>{therapy}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = formData.ayurvedicInfo.therapies.filter((_, i) => i !== idx);
                                                                handleInputChange('ayurvedicInfo', 'therapies', updated);
                                                            }}
                                                            className="ml-1 hover:text-purple-900"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleInputChange('ayurvedicInfo', 'therapies', [...formData.ayurvedicInfo.therapies, e.target.value]);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.therapies ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            >
                                                <option value="">Add Therapy</option>
                                                {therapies.filter(t => !formData.ayurvedicInfo.therapies.includes(t)).map(therapy => (
                                                    <option key={therapy} value={therapy}>{therapy}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Ayurvedic Information */}
                            {/* {currentStep === 4 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Ayurvedic Information</h2>
                                        <p className="text-gray-500 mt-1">Your Ayurvedic practice details</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    </div>
                                </div>
                            )} */}

                            {/* Step 5: Document Upload */}
                            {currentStep === 4 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Document Upload</h2>
                                        <p className="text-gray-500 mt-1">Upload required documents for verification</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(documentRequirements).map(([key, req]) => {
                                            const doc = formData.documents[key];
                                            return (
                                                <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">{req.label}</h3>
                                                            <p className="text-xs text-gray-500">
                                                                {req.required ? 'Required' : 'Optional'} • {req.accepted.join(', ')} • Max {req.maxSize}MB
                                                            </p>
                                                        </div>
                                                        {req.required && <span className="text-xs text-rose-500">*</span>}
                                                    </div>

                                                    {doc ? (
                                                        <div className="bg-emerald-50 rounded-lg p-3 flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <FileCheck size={20} className="text-emerald-600" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                                                                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => window.open(doc.preview, '_blank')}
                                                                    className="p-1 hover:bg-emerald-200 rounded"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleInputChange('documents', key, null);
                                                                    }}
                                                                    className="p-1 hover:bg-emerald-200 rounded"
                                                                >
                                                                    <Trash2 size={16} className="text-rose-600" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRefs.current[key]?.click()}
                                                            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#0D614E] transition-colors group"
                                                        >
                                                            <Upload size={24} className="mx-auto text-gray-400 mb-2 group-hover:text-[#0D614E]" />
                                                            <p className="text-sm text-gray-500 group-hover:text-[#0D614E]">Click to upload</p>
                                                        </button>
                                                    )}
                                                    <input
                                                        ref={el => fileInputRefs.current[key] = el}
                                                        type="file"
                                                        accept={req.accepted.map(ext => `.${ext.toLowerCase()}`).join(',')}
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload('documents', key, e.target.files[0])}
                                                    />
                                                    {errors?.[key]  && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Bank Details */}
                            {currentStep === 5 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
                                        <p className="text-gray-500 mt-1">Payment settlement information</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Name as per bank records"
                                                value={formData.bankInfo.accountHolderName}
                                                onChange={(e) => handleInputChange('bankInfo', 'accountHolderName', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.accountHolderName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`} />
                                            {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Bank account number for settlements"
                                                value={formData.bankInfo.accountNumber}
                                                onChange={(e) => handleInputChange('bankInfo', 'accountNumber', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.accountNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Confirm your bank account number"
                                                value={formData.bankInfo.confirmAccountNumber}
                                                onChange={(e) => handleInputChange('bankInfo', 'confirmAccountNumber', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formData.bankInfo.confirmAccountNumber && formData.bankInfo.accountNumber !== formData.bankInfo.confirmAccountNumber
                                                    ? 'border-rose-500 focus:ring-rose-500 bg-rose-50'
                                                    : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {formData.bankInfo.confirmAccountNumber && formData.bankInfo.accountNumber !== formData.bankInfo.confirmAccountNumber && (
                                                <p className="text-xs text-rose-500 mt-1">Account numbers do not match</p>
                                            )}
                                            {errors.confirmAccountNumber && <p className="text-red-500 text-sm mt-1">{errors.confirmAccountNumber}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.bankInfo.ifscCode}
                                                onChange={(e) => handleInputChange('bankInfo', 'ifscCode', e.target.value.toUpperCase())}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.ifscCode ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                                placeholder="XXXX0000000"
                                            />
                                            {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                            <input
                                                type="text"
                                                placeholder='Bank Name...'
                                                value={formData.bankInfo.bankName}
                                                onChange={(e) => handleInputChange('bankInfo', 'bankName', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.bankName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                            <input
                                                type="text"
                                                placeholder='Branch Name...'
                                                value={formData.bankInfo.branchName}
                                                onChange={(e) => handleInputChange('bankInfo', 'branchName', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.branchName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                            {errors.branchName && <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                                            <input
                                                type="text"
                                                value={formData.bankInfo.upiId}
                                                onChange={(e) => handleInputChange('bankInfo', 'upiId', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.upiId ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                                placeholder="yourname@upi"
                                            />
                                            {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms & Conditions</label>
                                            <select
                                                value={formData.bankInfo.paymentTerms}
                                                onChange={(e) => handleInputChange('bankInfo', 'paymentTerms', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.paymentTerms ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            >
                                                <option value="">Select Payment Terms</option>
                                                <option value="weekly">Weekly Settlement</option>
                                                <option value="bi-weekly">Bi-Weekly Settlement</option>
                                                <option value="monthly">Monthly Settlement</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 7: Clinic Information */}
                            {/* {currentStep === 7 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Clinic/Hospital Information</h2>
                                        <p className="text-gray-500 mt-1">Your practice location details</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic/Hospital Name</label>
                                            <input
                                                type="text"
                                                value={formData.socialMedia.clinicName}
                                                onChange={(e) => handleInputChange('socialMedia', 'clinicName', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.clinicName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
                                            <textarea
                                                rows="3"
                                                value={formData.socialMedia.clinicAddress}
                                                onChange={(e) => handleInputChange('socialMedia', 'clinicAddress', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.clinicAddress ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.socialMedia.clinicPhone}
                                                onChange={(e) => handleInputChange('socialMedia', 'clinicPhone', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.clinicPhone ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Email</label>
                                            <input
                                                type="email"
                                                value={formData.socialMedia.clinicEmail}
                                                onChange={(e) => handleInputChange('socialMedia', 'clinicEmail', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.clinicEmail ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                            <input
                                                type="url"
                                                value={formData.socialMedia.website}
                                                onChange={(e) => handleInputChange('socialMedia', 'website', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.website ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                                placeholder="https://"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Profiles</h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                            <input
                                                type="url"
                                                value={formData.socialMedia.socialMedia.linkedin}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'linkedin', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.linkedin ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                            <input
                                                type="url"
                                                value={formData.socialMedia.socialMedia.twitter}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'twitter', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.twitter ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                            <input
                                                type="url"
                                                value={formData.socialMedia.socialMedia.facebook}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'facebook', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.facebook ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                            <input
                                                type="url"
                                                value={formData.socialMedia.socialMedia.instagram}
                                                onChange={(e) => handleNestedInputChange('socialMedia', 'socialMedia', 'instagram', e.target.value)}
                                                className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.instagram ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            {/* Step 8: Agreement */}
                            {currentStep === 6 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Terms & Agreement</h2>
                                        <p className="text-gray-500 mt-1">Review and accept the terms</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6 h-64 overflow-y-auto">
                                        <h3 className="font-bold text-gray-800 mb-4">Terms of Service</h3>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <p>1. The doctor agrees to provide accurate and truthful information during the onboarding process.</p>
                                            <p>2. All medical certificates and documents submitted must be genuine and valid.</p>
                                            <p>3. The doctor must adhere to the professional code of conduct as per medical council guidelines.</p>
                                            <p>4. AyurMuni reserves the right to verify all submitted documents.</p>
                                            <p>5. The doctor is responsible for maintaining patient confidentiality and data privacy.</p>
                                            <p>6. Consultation fees and revenue sharing terms will be as per the agreement.</p>
                                            <p>7. The doctor must inform AyurMuni of any changes to their registration or practice status.</p>
                                            <p>8. AyurMuni may suspend or terminate the account if terms are violated.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreements.termsAccepted}
                                                onChange={(e) => handleInputChange('agreements', 'termsAccepted', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]"
                                            />
                                            <span className="text-gray-700">I have read and agree to the <button type="button" className="text-[#0D614E] hover:underline">Terms of Service</button></span>
                                        </label>

                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreements.privacyAccepted}
                                                onChange={(e) => handleInputChange('agreements', 'privacyAccepted', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]"
                                            />
                                            <span className="text-gray-700">I have read and agree to the <button type="button" className="text-[#0D614E] hover:underline">Privacy Policy</button></span>
                                        </label>

                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreements.communicationAccepted}
                                                onChange={(e) => handleInputChange('agreements', 'communicationAccepted', e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]"
                                            />
                                            <span className="text-gray-700">I agree to receive communication from AyurMuni regarding my application and platform updates</span>
                                        </label>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                            {/* <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Digital Signature</label>
                                                <input
                                                    type="text"
                                                    value={formData.agreements.signature}
                                                    onChange={(e) => handleInputChange('agreements', 'signature', e.target.value)}
                                                    className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.signature ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                        }`}
                                                    placeholder="Type your full name as signature"
                                                />
                                                {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature}</p>}
                                            </div> */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.agreements.agreeDate}
                                                    disabled
                                                    onChange={(e) => handleInputChange('agreements', 'agreeDate', e.target.value)}
                                                    className={`auth-card__input  w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors?.agreeDate ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                        }`}
                                                />
                                                {errors.agreeDate && <p className="text-red-500 text-sm mt-1">{errors.agreeDate}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center px-8 py-6 bg-gray-50 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={prevStep}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${currentStep > 1
                                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    : 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                                    }`}
                                disabled={currentStep === 1}
                            >
                                <ChevronLeft size={18} />
                                <span>Previous</span>
                            </button>

                            {currentStep < 6 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center space-x-2 px-6 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90 transition-all"
                                >
                                    <span>Next</span>
                                    <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-2 px-8 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <RefreshCw size={18} className="animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} />
                                            <span>Submit Application</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                .animate-bounce-slow { animation: bounce 2s infinite; }
            `}</style>
        </div>
    );
};

export default DoctorOnboarding;