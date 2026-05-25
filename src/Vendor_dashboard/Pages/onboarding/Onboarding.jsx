// VendorOnboarding.jsx - Complete Fixed Version
import React, { useState, useRef, useEffect } from 'react';
import {
    Building,
    Store,
    Package,
    MapPin,
    FileText,
    Upload,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Trash2,
    Eye,
    Award,
    Shield,
    Sparkles,
    Gift,
    RefreshCw,
    X,
    ArrowLeft,
    ArrowRight,
    Info,
    Banknote,
    FileCheck,
    Calendar
} from 'lucide-react';

const VendorOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [showCelebration, setShowCelebration] = useState(false);
    const fileInputRefs = useRef({});
    const [errors, setErrors] = useState({});

    // Form Data State
    const [formData, setFormData] = useState({
        businessInfo: {
            businessName: '',
            legalName: '',
            businessType: '',
            gstNumber: '',
            panNumber: '',
            yearEstablished: '',
            employeeCount: '',
            website: '',
            businessEmail: '',
            businessPhone: '',
            alternatePhone: '',
            description: '',
            ayushLicenseNumber: '',
            fssaiNumber: ''
        },
        contactInfo: {
            address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            },
            contactPerson: {
                name: '',
                designation: '',
                email: '',
                phone: '',
                alternatePhone: ''
            }
        },
        productInfo: {
            productCategories: [],
            productTypes: [],
            primaryProducts: [],
            certifications: [],
            qualityAssurance: '',
            deliveryTimeline: '',
            minimumOrderQuantity: '',
            sampleAvailable: false,
            returnPolicy: '',
            warrantyInfo: ''
        },
        bankInfo: {
            accountHolderName: '',
            accountNumber: '',
            confirmAccountNumber: '',
            ifscCode: '',
            bankName: '',
            branchName: '',
            upiId: '',
            paymentTerms: 'net30'
        },
        documents: {
            gstCertificate: null,
            panCard: null,
            shopEstablishment: null,
            fssaiLicense: null,
            ayurvedicLicense: null,
            bankStatement: null,
            cancelledCheque: null,
            productCatalog: null,
            logo: null
        },
        agreements: {
            termsAccepted: false,
            privacyAccepted: false,
            vendorAgreementAccepted: false,
            signature: '',
            agreeDate: new Date().toISOString().split('T')[0]
        }
    });

    // Options Lists
    const businessTypes = [
        'Proprietorship', 'Partnership', 'Private Limited', 'Public Limited',
        'LLP', 'Trust', 'Society', 'Co-operative', 'Individual'
    ];

    const productCategories = [
        'Ayurvedic Medicines', 'Herbal Supplements', 'Personal Care', 'Skin Care',
        'Hair Care', 'Health Drinks', 'Essential Oils', 'Incense & Aromatherapy',
        'Ayurvedic Books', 'Panchakarma Equipment', 'Herbal Teas', 'Organic Products'
    ];

    const productTypes = [
        'Tablets/Capsules', 'Powders', 'Liquids/Syrups', 'Oils', 'Creams/Ointments',
        'Raw Herbs', 'Churnas', 'Vatis', 'Asavas/Arishtas', 'Lehyams', 'Rasayanas'
    ];

    const certifications = [
        'GMP Certified', 'ISO Certified', 'USDA Organic', 'India Organic',
        'Halal Certified', 'Kosher Certified', 'Non-GMO', 'Vegan Certified',
        'Ayush Premium Mark', 'WHO-GMP'
    ];

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        // Clear error for this field on change
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
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
        // Clear error for this field on change
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleArrayAdd = (section, field, value) => {
        if (value && !formData[section][field].includes(value)) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: [...prev[section][field], value]
                }
            }));
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 1000);
        }
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

    const handleFileUpload = (section, field, file) => {
        if (file) {
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
                            size: file.size
                        }
                    }
                }));
                setUploadProgress(prev => ({ ...prev, [`${section}.${field}`]: 100 }));
                setTouchedFields(prev => ({ ...prev, [`${section}.${field}`]: true }));
                // Clear error for this field on change
                if (errors[field]) {
                    setErrors(prev => ({
                        ...prev,
                        [field]: ''
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

        // switch (currentStep) {
        //     case 1: {
        //         if (!formData.businessInfo.businessName?.trim()) {
        //             newErrors.businessName = "Business name is required";
        //         }
        //         if (!formData.businessInfo.businessType?.trim()) {
        //             newErrors.businessType = "Business type is required";
        //         }
        //         if (!formData.businessInfo.gstNumber?.trim()) {
        //             newErrors.gstNumber = "GST number is required";
        //         } else if (!gstRegex.test(formData.businessInfo.gstNumber)) {
        //             newErrors.gstNumber = "Invalid GST number format";
        //         }
        //         if (!formData.businessInfo.panNumber?.trim()) {
        //             newErrors.panNumber = "PAN number is required";
        //         } else if (!panRegex.test(formData.businessInfo.panNumber)) {
        //             newErrors.panNumber = "Invalid PAN number format";
        //         }
        //         if (!formData.businessInfo.businessEmail?.trim()) {
        //             newErrors.businessEmail = "Email is required";
        //         } else if (!emailRegex.test(formData.businessInfo.businessEmail)) {
        //             newErrors.businessEmail = "Invalid email format";
        //         }
        //         if (!formData.businessInfo.businessPhone?.trim()) {
        //             newErrors.businessPhone = "Phone number is required";
        //         } else if (!phoneRegex.test(formData.businessInfo.businessPhone)) {
        //             newErrors.businessPhone = "Invalid phone number";
        //         }
        // if (!formData.businessInfo.fssaiNumber?.trim()) {
        //     newErrors.fssaiNumber = "FSSAI number is required";
        // } else if (!/^\d{14}$/.test(formData.businessInfo.fssaiNumber)) {
        //     newErrors.fssaiNumber = "FSSAI number must be 14 digits";
        // }

        // if (!formData.businessInfo.ayushLicenseNumber?.trim()) {
        //     newErrors.ayushLicenseNumber = "AYUSH license number is required";
        // } else if (
        //     !/^[A-Z0-9\/-]{6,30}$/i.test(
        //         formData.businessInfo.ayushLicenseNumber
        //     )
        // ) {
        //     newErrors.ayushLicenseNumber =
        //         "Invalid AYUSH license number format";
        // }
        //         break;
        //     }

        //     case 2: {
        //         if (!formData.contactInfo.address?.city?.trim()) {
        //             newErrors.city = "City is required";
        //         }
        //         if (!formData.contactInfo.address?.state?.trim()) {
        //             newErrors.state = "State is required";
        //         }
        //         if (!formData.contactInfo.address?.pincode?.trim()) {
        //             newErrors.pincode = "Pincode is required";
        //         } else if (!pincodeRegex.test(formData.contactInfo.address.pincode)) {
        //             newErrors.pincode = "Invalid pincode";
        //         }
        //         if (!formData.contactInfo.contactPerson?.name?.trim()) {
        //             newErrors.contactName = "Contact person name is required";
        //         }
        //         if (!formData.contactInfo.contactPerson?.email?.trim()) {
        //             newErrors.contactEmail = "Email is required";
        //         } else if (!emailRegex.test(formData.contactInfo.contactPerson.email)) {
        //             newErrors.contactEmail = "Invalid email format";
        //         }
        //         if (!formData.contactInfo.contactPerson?.phone?.trim()) {
        //             newErrors.contactPhone = "Phone is required";
        //         } else if (!phoneRegex.test(formData.contactInfo.contactPerson.phone)) {
        //             newErrors.contactPhone = "Invalid phone number";
        //         }
        //         break;
        //     }

        //     case 3: {
        //         if (!formData.productInfo.productCategories?.length) {
        //             newErrors.productCategories = "Select at least one category";
        //         }
        //         if (!formData.productInfo.productTypes?.length) {
        //             newErrors.productTypes = "Select at least one product type";
        //         }
        //         if (!formData.productInfo.minimumOrderQuantity) {
        //             newErrors.minimumOrderQuantity = "Minimum order quantity required";
        //         }
        //         break;
        //     }

        //     case 4: {
        //         if (!formData.bankInfo.accountHolderName?.trim()) {
        //             newErrors.accountHolderName = "Account holder name is required";
        //         }
        //         if (!formData.bankInfo.accountNumber?.trim()) {
        //             newErrors.accountNumber = "Account number is required";
        //         }
        //         if (!formData.bankInfo.confirmAccountNumber?.trim()) {
        //             newErrors.confirmAccountNumber = "Confirm account number is required";
        //         } else if (formData.bankInfo.accountNumber !== formData.bankInfo.confirmAccountNumber) {
        //             newErrors.confirmAccountNumber = "Account numbers do not match";
        //         }
        //         if (!formData.bankInfo.ifscCode?.trim()) {
        //             newErrors.ifscCode = "IFSC code is required";
        //         } else if (!ifscRegex.test(formData.bankInfo.ifscCode)) {
        //             newErrors.ifscCode = "Invalid IFSC code";
        //         }
        //         break;
        //     }

        //     case 5: {
        //         if (!formData.documents.gstCertificate) {
        //             newErrors.gstCertificate = "GST certificate required";
        //         }
        //         if (!formData.documents.panCard) {
        //             newErrors.panCard = "PAN card required";
        //         }
        //         if (!formData.documents.cancelledCheque) {
        //             newErrors.cancelledCheque = "Cancelled cheque required";
        //         }
        //         break;
        //     }

        //     case 6: {
        //         if (!formData.agreements.termsAccepted) {
        //             newErrors.termsAccepted = "Accept terms & conditions";
        //         }
        //         if (!formData.agreements.privacyAccepted) {
        //             newErrors.privacyAccepted = "Accept privacy policy";
        //         }
        //         if (!formData.agreements.vendorAgreementAccepted) {
        //             newErrors.vendorAgreementAccepted = "Accept vendor agreement";
        //         }
        ////         if (!formData.agreements.signature?.trim()) {
        ////             newErrors.signature = "Signature is required";
        //  //       }
        //         break;
        //     }

        //     default:
        //         break;
        // }

        return newErrors;
    };

    const nextStep = () => {
        const stepErrors = validateStep();

        if (Object.keys(stepErrors).length === 0) {
            setErrors({});
            setCurrentStep((prev) => Math.min(prev + 1, 5));
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            setErrors(stepErrors);
            const firstField = Object.keys(stepErrors)[0];
            const el = document.querySelector(`[name="${firstField}"]`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus();
            }
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalErrors = validateStep();
        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        }, 2000);
    };

    const getStepStatus = (step) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'current';
        return 'pending';
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const documentRequirements = {
        gstCertificate: { label: 'GST Certificate', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 5, errorKey: 'gstCertificate' },
        panCard: { label: 'PAN Card', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2, errorKey: 'panCard' },
        shopEstablishment: { label: 'Shop & Establishment Certificate', required: false, accepted: ['PDF'], maxSize: 5, errorKey: 'shopEstablishment' },
        fssaiLicense: { label: 'FSSAI License', required: false, accepted: ['PDF'], maxSize: 5, errorKey: 'fssaiLicense' },
        ayurvedicLicense: { label: 'Ayurvedic Manufacturing License', required: false, accepted: ['PDF'], maxSize: 5, errorKey: 'ayurvedicLicense' },
        bankStatement: { label: 'Bank Statement (Last 6 months)', required: false, accepted: ['PDF'], maxSize: 10, errorKey: 'bankStatement' },
        cancelledCheque: { label: 'Cancelled Cheque', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2, errorKey: 'cancelledCheque' },
        productCatalog: { label: 'Product Catalog/Brochure', required: false, accepted: ['PDF'], maxSize: 20, errorKey: 'productCatalog' },
        logo: { label: 'Company Logo', required: false, accepted: ['JPG', 'PNG'], maxSize: 1, errorKey: 'logo' }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} className="text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Vendor Registration Successful! 🎉</h3>
                        <p className="text-gray-500 mb-4">Your application has been submitted successfully. Our team will review your details and contact you within 48 hours.</p>
                        <div className="bg-emerald-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-emerald-800">Vendor ID: AYURVEN{Math.floor(Math.random() * 100000)}</p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-3 bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Celebration Particles */}
            {showCelebration && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="absolute animate-float" style={{ left: `${Math.random() * 100}%`, top: '50%', animationDelay: `${Math.random() * 2}s` }}>
                            <Sparkles size={16 + Math.random() * 16} className="text-emerald-500" />
                        </div>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] text-white pb-12">
                <div className="max-w-6xl mx-auto px-8 py-12">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
                            <Store size={40} />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 text-white">Partner with AyurMuni</h1>
                        <p className="text-emerald-100 text-lg">Join India's fastest growing Ayurvedic marketplace</p>

                        <div className="mt-6 flex justify-center space-x-8">
                            <div className="text-center"><p className="text-2xl font-bold text-white">200+</p><p className="text-xs text-emerald-100">Active Vendors</p></div>
                            <div className="text-center"><p className="text-2xl font-bold text-white">50k+</p><p className="text-xs text-emerald-100">Products Sold</p></div>
                            <div className="text-center"><p className="text-2xl font-bold text-white">1M+</p><p className="text-xs text-emerald-100">Happy Customers</p></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-6xl mx-auto px-8 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex justify-between items-center relative">
                        {[1, 2, 3, 4, 5].map((step) => {
                            const status = getStepStatus(step);
                            return (
                                <div key={step} className="flex-1 text-center relative">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mx-auto mb-2 transition-all z-10 relative ${status === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white' :
                                        status === 'current' ? 'border-[#0D614E] bg-[#0D614E] text-white shadow-lg ring-4 ring-emerald-100' :
                                            'border-gray-300 bg-white text-gray-400'
                                        }`}>
                                        {status === 'completed' ? <CheckCircle size={20} /> : step}
                                    </div>
                                    <div className={`text-xs font-medium ${status === 'current' ? 'text-[#0D614E]' : 'text-gray-500'}`}>
                                        {step === 1 && 'Business'}
                                        {step === 2 && 'Contact'}
                                        {/* {step === 3 && 'Products'} */}
                                        {step === 3 && 'Bank'}
                                        {step === 4 && 'Documents'}
                                        {step === 5 && 'Agreement'}
                                    </div>
                                    {step < 5 && (
                                        <div className={`absolute top-6 left-1/2 w-full h-0.5 -z-0 ${step < currentStep ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-6xl mx-auto px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-8">
                            {/* Step 1: Business Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Building size={20} className="text-[#0D614E]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Business Information</h2>
                                                <p className="text-gray-500 mt-1">Tell us about your business</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Business Name */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Business Name <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="businessName"
                                                value={formData.businessInfo.businessName}
                                                onChange={(e) => handleInputChange('businessInfo', 'businessName', e.target.value)}
                                                placeholder="Enter registered business name"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.businessName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.businessName && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.businessName}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Legal Name */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Legal Name (as per PAN)
                                            </label>
                                            <input
                                                type="text"
                                                name="legalName"
                                                value={formData.businessInfo.legalName}
                                                onChange={(e) => handleInputChange('businessInfo', 'legalName', e.target.value)}
                                                placeholder="Enter legal name"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Business Type */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Business Type <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                name="businessType"
                                                value={formData.businessInfo.businessType}
                                                onChange={(e) => handleInputChange('businessInfo', 'businessType', e.target.value)}
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.businessType ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            >
                                                <option value="">Select Business Type</option>
                                                {businessTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            {errors.businessType && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.businessType}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* GST Number */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                GST Number <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="gstNumber"
                                                value={formData.businessInfo.gstNumber}
                                                onChange={(e) => handleInputChange('businessInfo', 'gstNumber', e.target.value.toUpperCase())}
                                                placeholder="22AAAAA0000A1Z"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.gstNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.gstNumber && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.gstNumber}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* PAN Number */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                PAN Number <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="panNumber"
                                                value={formData.businessInfo.panNumber}
                                                onChange={(e) => handleInputChange('businessInfo', 'panNumber', e.target.value.toUpperCase())}
                                                placeholder="AAAAA0000A"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.panNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.panNumber && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.panNumber}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* AYUSH License Number */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">AYUSH License Number <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                name="ayushLicenseNumber"
                                                value={formData.businessInfo.ayushLicenseNumber}
                                                onChange={(e) => handleInputChange('businessInfo', 'ayushLicenseNumber', e.target.value)}
                                                placeholder="123456..."
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.ayushLicenseNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.ayushLicenseNumber && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.ayushLicenseNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                        {/* FSSAI Number*/}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI Number <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                name="fssaiNumber"
                                                value={formData.businessInfo.fssaiNumber}
                                                onChange={(e) => handleInputChange('businessInfo', 'fssaiNumber', e.target.value)}
                                                placeholder="1234567..."
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.fssaiNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.fssaiNumber && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.fssaiNumber}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Year Established */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                                            <input
                                                type="number"
                                                name="yearEstablished"
                                                value={formData.businessInfo.yearEstablished}
                                                onChange={(e) => handleInputChange('businessInfo', 'yearEstablished', e.target.value)}
                                                placeholder="YYYY"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Employee Count */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                                            <input
                                                type="number"
                                                name="employeeCount"
                                                value={formData.businessInfo.employeeCount}
                                                onChange={(e) => handleInputChange('businessInfo', 'employeeCount', e.target.value)}
                                                placeholder="Number of employees"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Business Email */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Business Email <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="businessEmail"
                                                value={formData.businessInfo.businessEmail}
                                                onChange={(e) => handleInputChange('businessInfo', 'businessEmail', e.target.value)}
                                                placeholder="contact@yourbusiness.com"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.businessEmail ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.businessEmail && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.businessEmail}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Business Phone */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Business Phone <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="businessPhone"
                                                value={formData.businessInfo.businessPhone}
                                                onChange={(e) => handleInputChange('businessInfo', 'businessPhone', e.target.value)}
                                                placeholder="9876543210"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.businessPhone ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.businessPhone && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.businessPhone}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Alternate Phone */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                                            <input
                                                type="tel"
                                                name="alternatePhone"
                                                value={formData.businessInfo.alternatePhone}
                                                onChange={(e) => handleInputChange('businessInfo', 'alternatePhone', e.target.value)}
                                                placeholder="Optional"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Website */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                            <input
                                                type="text"
                                                name="website"
                                                value={formData.businessInfo.website}
                                                onChange={(e) => handleInputChange('businessInfo', 'website', e.target.value)}
                                                placeholder="https://yourwebsite.com"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Business Description */}
                                        <div className="md:col-span-2">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.businessInfo.description}
                                                    onChange={(e) => handleInputChange('businessInfo', 'description', e.target.value)}
                                                    placeholder="Tell us about your business, products, and values..."
                                                    className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contact Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <MapPin size={20} className="text-[#0D614E]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
                                                <p className="text-gray-500 mt-1">Business address and contact person details</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Street Address */}
                                        <div className="md:col-span-2">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={formData.contactInfo.address.street}
                                                    onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'street', e.target.value)}
                                                    placeholder="House No, Building, Street"
                                                    className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.contactInfo.address.city}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'city', e.target.value)}
                                                placeholder="Enter city"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.city ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.city && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.city}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* State */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.contactInfo.address.state}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'state', e.target.value)}
                                                placeholder="Enter state"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.state ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.state && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.state}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Pincode */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Pincode <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.contactInfo.address.pincode}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'pincode', e.target.value)}
                                                placeholder="6 digit pincode"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.pincode ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.pincode && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.pincode}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contact Person Section Header */}
                                        <div className="md:col-span-2 border-t border-gray-200 pt-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Primary Contact Person</h3>
                                        </div>

                                        {/* Contact Person Name */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contact Person Name <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="contactName"
                                                value={formData.contactInfo.contactPerson.name}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'name', e.target.value)}
                                                placeholder="Full name"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.contactName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.contactName && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.contactName}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Designation */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={formData.contactInfo.contactPerson.designation}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'designation', e.target.value)}
                                                placeholder="e.g., Owner, Manager"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Contact Email */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="contactEmail"
                                                value={formData.contactInfo.contactPerson.email}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'email', e.target.value)}
                                                placeholder="contact@yourbusiness.com"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.contactEmail ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.contactEmail && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.contactEmail}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contact Phone */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="contactPhone"
                                                value={formData.contactInfo.contactPerson.phone}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'phone', e.target.value)}
                                                placeholder="9876543210"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.contactPhone ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.contactPhone && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.contactPhone}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contact Alternate Phone */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                                            <input
                                                type="tel"
                                                name="contactAlternatePhone"
                                                value={formData.contactInfo.contactPerson.alternatePhone}
                                                onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'alternatePhone', e.target.value)}
                                                placeholder="Optional"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Product Information */}
                            {/* {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Package size={20} className="text-[#0D614E]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Product Information</h2>
                                                <p className="text-gray-500 mt-1">Tell us about your products</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Categories <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.productInfo.productCategories.map((cat, idx) => (
                                                    <span key={idx} className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                                        <Package size={12} />
                                                        <span>{cat}</span>
                                                        <button type="button" onClick={() => handleArrayRemove('productInfo', 'productCategories', idx)} className="ml-1 hover:text-emerald-900">
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleArrayAdd('productInfo', 'productCategories', e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.productCategories ? 'border-rose-500 focus:ring-rose-500' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                value=""
                                            >
                                                <option value="">Select Category</option>
                                                {productCategories.filter(c => !formData.productInfo.productCategories.includes(c)).map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            {errors.productCategories && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.productCategories}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Types <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.productInfo.productTypes.map((type, idx) => (
                                                    <span key={idx} className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                        <span>{type}</span>
                                                        <button type="button" onClick={() => handleArrayRemove('productInfo', 'productTypes', idx)} className="ml-1 hover:text-blue-900">
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleArrayAdd('productInfo', 'productTypes', e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.productTypes ? 'border-rose-500 focus:ring-rose-500' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                                value=""
                                            >
                                                <option value="">Select Product Type</option>
                                                {productTypes.filter(t => !formData.productInfo.productTypes.includes(t)).map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            {errors.productTypes && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.productTypes}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Products</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.productInfo.primaryProducts.map((product, idx) => (
                                                    <span key={idx} className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                        <span>{product}</span>
                                                        <button type="button" onClick={() => handleArrayRemove('productInfo', 'primaryProducts', idx)} className="ml-1 hover:text-purple-900">
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const value = e.target.value.trim();
                                                        if (value && !formData.productInfo.primaryProducts.includes(value)) {
                                                            handleArrayAdd('productInfo', 'primaryProducts', value);
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                                placeholder="Type product name and press Enter"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {formData.productInfo.certifications.map((cert, idx) => (
                                                    <span key={idx} className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm">
                                                        <Award size={12} />
                                                        <span>{cert}</span>
                                                        <button type="button" onClick={() => handleArrayRemove('productInfo', 'certifications', idx)} className="ml-1 hover:text-amber-900">
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleArrayAdd('productInfo', 'certifications', e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                value=""
                                            >
                                                <option value="">Select Certification</option>
                                                {certifications.filter(c => !formData.productInfo.certifications.includes(c)).map(cert => (
                                                    <option key={cert} value={cert}>{cert}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Minimum Order Quantity <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="minimumOrderQuantity"
                                                value={formData.productInfo.minimumOrderQuantity}
                                                onChange={(e) => handleInputChange('productInfo', 'minimumOrderQuantity', e.target.value)}
                                                placeholder="Minimum quantity for order"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.minimumOrderQuantity ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.minimumOrderQuantity && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.minimumOrderQuantity}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Timeline (days)</label>
                                            <input
                                                type="text"
                                                name="deliveryTimeline"
                                                value={formData.productInfo.deliveryTimeline}
                                                onChange={(e) => handleInputChange('productInfo', 'deliveryTimeline', e.target.value)}
                                                placeholder="e.g., 5-7 business days"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Assurance Process</label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.productInfo.qualityAssurance}
                                                    onChange={(e) => handleInputChange('productInfo', 'qualityAssurance', e.target.value)}
                                                    placeholder="Describe your quality control measures..."
                                                    className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.productInfo.returnPolicy}
                                                    onChange={(e) => handleInputChange('productInfo', 'returnPolicy', e.target.value)}
                                                    placeholder="Describe your return and refund policy..."
                                                    className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            {/* Step 4: Bank Details */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Banknote size={20} className="text-[#0D614E]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
                                                <p className="text-gray-500 mt-1">Payment settlement information</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Account Holder Name */}
                                        <div className="md:col-span-2">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Account Holder Name <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="accountHolderName"
                                                    value={formData.bankInfo.accountHolderName}
                                                    onChange={(e) => handleInputChange('bankInfo', 'accountHolderName', e.target.value)}
                                                    placeholder="As per bank records"
                                                    className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.accountHolderName ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                        }`}
                                                />
                                                {errors.accountHolderName && (
                                                    <div className="flex items-center space-x-1 mt-1">
                                                        <AlertCircle size={12} className="text-rose-500" />
                                                        <p className="text-xs text-rose-500">{errors.accountHolderName}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Account Number */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Account Number <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={formData.bankInfo.accountNumber}
                                                onChange={(e) => handleInputChange('bankInfo', 'accountNumber', e.target.value)}
                                                placeholder="Enter account number"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.accountNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.accountNumber && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.accountNumber}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm Account Number */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm Account Number <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="confirmAccountNumber"
                                                value={formData.bankInfo.confirmAccountNumber}
                                                onChange={(e) => handleInputChange('bankInfo', 'confirmAccountNumber', e.target.value)}
                                                placeholder="Re-enter account number"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.confirmAccountNumber ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.confirmAccountNumber && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.confirmAccountNumber}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* IFSC Code */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                IFSC Code <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="ifscCode"
                                                value={formData.bankInfo.ifscCode}
                                                onChange={(e) => handleInputChange('bankInfo', 'ifscCode', e.target.value.toUpperCase())}
                                                placeholder="SBIN0001234"
                                                className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.ifscCode ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                    }`}
                                            />
                                            {errors.ifscCode && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <AlertCircle size={12} className="text-rose-500" />
                                                    <p className="text-xs text-rose-500">{errors.ifscCode}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bank Name */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={formData.bankInfo.bankName}
                                                onChange={(e) => handleInputChange('bankInfo', 'bankName', e.target.value)}
                                                placeholder="Name of bank"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Branch Name */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                            <input
                                                type="text"
                                                name="branchName"
                                                value={formData.bankInfo.branchName}
                                                onChange={(e) => handleInputChange('bankInfo', 'branchName', e.target.value)}
                                                placeholder="Branch name"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* UPI ID */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                                            <input
                                                type="text"
                                                name="upiId"
                                                value={formData.bankInfo.upiId}
                                                onChange={(e) => handleInputChange('bankInfo', 'upiId', e.target.value)}
                                                placeholder="yourname@upi"
                                                className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                            />
                                        </div>

                                        {/* Payment Terms */}
                                        <div className="md:col-span-2">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                                                <select
                                                    name="paymentTerms"
                                                    value={formData.bankInfo.paymentTerms}
                                                    onChange={(e) => handleInputChange('bankInfo', 'paymentTerms', e.target.value)}
                                                    className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                >
                                                    <option value="net15">Net 15 days</option>
                                                    <option value="net30">Net 30 days</option>
                                                    <option value="net45">Net 45 days</option>
                                                    <option value="net60">Net 60 days</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Document Upload */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <FileText size={20} className="text-[#0D614E]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Document Upload</h2>
                                                <p className="text-gray-500 mt-1">Upload required documents for verification</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Object.entries(documentRequirements).map(([key, req]) => {
                                            const doc = formData.documents[key];
                                            const error = errors[req.errorKey];
                                            return (
                                                <div key={key} className={`border-2 rounded-xl p-4 transition-all ${error ? 'border-rose-300 bg-rose-50' : 'border-gray-200 hover:border-[#0D614E]'}`}>
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
                                                                <div><p className="text-sm font-medium text-gray-800">{doc.name}</p><p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p></div>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button type="button" onClick={() => window.open(doc.preview, '_blank')} className="p-1 hover:bg-emerald-200 rounded"><Eye size={16} /></button>
                                                                <button type="button" onClick={() => handleInputChange('documents', key, null)} className="p-1 hover:bg-emerald-200 rounded"><Trash2 size={16} className="text-rose-600" /></button>
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
                                                    {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-blue-50 rounded-xl p-4 mt-4">
                                        <div className="flex items-start space-x-3">
                                            <Info size={20} className="text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">Document Guidelines</p>
                                                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                                                    <li>• All documents should be clear and legible</li>
                                                    <li>• PDF documents preferred for certificates</li>
                                                    <li>• Maximum file size: 10MB per document</li>
                                                    <li>• Accepted formats: PDF, JPG, PNG</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Agreement */}
                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Shield size={20} className="text-[#0D614E]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">Terms & Agreement</h2>
                                                <p className="text-gray-500 mt-1">Review and accept the terms</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Gift size={24} className="text-yellow-600" />
                                            <h3 className="font-bold text-gray-800">Why partner with AyurMuni?</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-emerald-600" /><span>Reach 1M+ health-conscious customers</span></li>
                                            <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-emerald-600" /><span>Dedicated vendor support team</span></li>
                                            <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-emerald-600" /><span>Fast and secure payment settlements</span></li>
                                            <li className="flex items-center space-x-2"><CheckCircle size={16} className="text-emerald-600" /><span>Marketing and visibility boost</span></li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6 h-48 overflow-y-auto">
                                        <h3 className="font-bold text-gray-800 mb-4">Vendor Agreement</h3>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <p>1. Vendor agrees to provide authentic and high-quality products as per Ayurvedic standards.</p>
                                            <p>2. All products must comply with applicable laws and regulations.</p>
                                            <p>3. Vendor is responsible for timely order fulfillment and shipping.</p>
                                            <p>4. Quality checks may be conducted by AyurMuni team.</p>
                                            <p>5. Payment terms will be as per the agreed settlement schedule.</p>
                                            <p>6. Vendor must maintain product inventory and pricing updates.</p>
                                            <p>7. Any violation of terms may lead to account suspension.</p>
                                            <p>8. Commission rates and fees will be communicated separately.</p>
                                        </div>
                                    </div>

                                    <div className="">
                                        <label className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                            <input type="checkbox" checked={formData.agreements.termsAccepted} onChange={(e) => handleInputChange('agreements', 'termsAccepted', e.target.checked)} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]" />
                                            <span className="text-gray-700">I have read and agree to the <button type="button" className="text-[#0D614E] font-medium hover:underline">Terms of Service</button></span>
                                        </label>
                                        {errors.termsAccepted && <p className="text-xs text-rose-500 ml-8">{errors.termsAccepted}</p>}

                                        <label className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                            <input type="checkbox" checked={formData.agreements.privacyAccepted} onChange={(e) => handleInputChange('agreements', 'privacyAccepted', e.target.checked)} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]" />
                                            <span className="text-gray-700">I have read and agree to the <button type="button" className="text-[#0D614E] font-medium hover:underline">Privacy Policy</button></span>
                                        </label>
                                        {errors.privacyAccepted && <p className="text-xs text-rose-500 ml-8">{errors.privacyAccepted}</p>}

                                        <label className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                            <input type="checkbox" checked={formData.agreements.vendorAgreementAccepted} onChange={(e) => handleInputChange('agreements', 'vendorAgreementAccepted', e.target.checked)} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]" />
                                            <span className="text-gray-700">I agree to the <button type="button" className="text-[#0D614E] font-medium hover:underline">Vendor Agreement</button> and Code of Conduct</span>
                                        </label>
                                        {errors.vendorAgreementAccepted && <p className="text-xs text-rose-500 ml-8">{errors.vendorAgreementAccepted}</p>}
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                            {/* <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Digital Signature <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="signature"
                                                    value={formData.agreements.signature}
                                                    onChange={(e) => handleInputChange('agreements', 'signature', e.target.value)}
                                                    placeholder="Type your full name as signature"
                                                    className={`auth-card__input w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.signature ? 'border-rose-500 focus:ring-rose-500 bg-rose-50' : 'border-gray-200 focus:ring-[#0D614E]'
                                                        }`}
                                                />
                                                {errors.signature && (
                                                    <div className="flex items-center space-x-1 mt-1">
                                                        <AlertCircle size={12} className="text-rose-500" />
                                                        <p className="text-xs text-rose-500">{errors.signature}</p>
                                                    </div>
                                                )}
                                            </div> */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    name="agreeDate"
                                                    value={formData.agreements.agreeDate}
                                                    onChange={(e) => handleInputChange('agreements', 'agreeDate', e.target.value)}
                                                    className="auth-card__input w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center px-8 py-6 bg-gray-50 border-t border-gray-200 mt-8 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={prevStep}
                                className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl transition-all ${currentStep > 1 ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md' : 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'}`}
                                disabled={currentStep === 1}
                            >
                                <ArrowLeft size={18} /><span>Back</span>
                            </button>

                            {currentStep < 6 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    <span>Continue</span><ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-2 px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                                >
                                    {isSubmitting ? (<><RefreshCw size={18} className="animate-spin" /><span>Submitting...</span></>) : (<><Sparkles size={18} /><span>Submit Application</span></>)}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scale-up { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 1; } 50% { transform: translateY(-50px) translateX(20px); opacity: 0; } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-fade-in { animation: fade-in 0.4s ease-out; }
                .animate-scale-up { animation: scale-up 0.3s ease-out; }
                .animate-float { animation: float 2s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounce 2s infinite; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default VendorOnboarding;