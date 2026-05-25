// VendorProfile.jsx - Complete Vendor Profile with Multiple Bank Details
import React, { useState, useEffect, useRef } from 'react';
import {
    Building, Store, Package, MapPin, FileText, Upload, CheckCircle, AlertCircle,
    ChevronRight, Trash2, Eye, Award, Shield, Sparkles, Gift, RefreshCw, X,
    Banknote, FileCheck, Calendar, Edit, Save, Plus, User, Phone, Mail,
    Globe, CreditCard, Home, Briefcase, Star, Clock, Truck, ShieldCheck,
    TrendingUp, Users, Info, Camera, Linkedin, Twitter, Facebook, Instagram,
    Settings, Bell, Lock, AlertTriangle, DollarSign, Percent
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VendorProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('business');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editBankIndex, setEditBankIndex] = useState(null);
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);

    // New Bank Form State
    const [newBank, setNewBank] = useState({
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        bank_name: "",
        branch_name: "",
        upi_id: "",
        payment_terms: "net30",
        is_selected: false,
        is_verified: false
    });

    // Vendor Profile Data - Matching Onboarding Structure
    const [vendorData, setVendorData] = useState({
        id: "",
        vendorId: "AYURVEN" + Math.floor(Math.random() * 100000),
        status: "active",
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString(),
        profileImage: null,

        // Business Information
        businessInfo: {
            businessName: "AyurHerbal Pvt Ltd",
            legalName: "AyurHerbal Private Limited",
            businessType: "Private Limited",
            gstNumber: "22AAAAA1234A1Z",
            panNumber: "ABCDE1234F",
            yearEstablished: "2015",
            employeeCount: "50",
            website: "https://ayurherbal.com",
            businessEmail: "contact@ayurherbal.com",
            businessPhone: "9876543210",
            alternatePhone: "9876501234",
            description: "Leading manufacturer of authentic Ayurvedic products using traditional methods and high-quality herbs.",
            ayushLicenseNumber: "AYUSH/MP/2021/123456",
            fssaiNumber: "12345678901234"
        },

        // Contact Information
        contactInfo: {
            address: {
                street: "123, Ayurvedic Lane, Kottakkal",
                city: "Malappuram",
                state: "Kerala",
                pincode: "676503",
                country: "India"
            },
            contactPerson: {
                name: "Dr. Rajesh Kumar",
                designation: "Managing Director",
                email: "rajesh@ayurherbal.com",
                phone: "9988776655",
                alternatePhone: "9876543210"
            }
        },

        // Product Information
        productInfo: {
            productCategories: ["Ayurvedic Medicines", "Herbal Supplements", "Personal Care"],
            productTypes: ["Tablets/Capsules", "Oils", "Churnas"],
            primaryProducts: ["Triphala Churna", "Ashwagandha Capsules", "Brahmi Oil"],
            certifications: ["GMP Certified", "ISO Certified", "Ayush Premium Mark"],
            qualityAssurance: "We follow strict GMP guidelines and conduct in-house lab testing for all products.",
            deliveryTimeline: "5-7 business days",
            minimumOrderQuantity: "5000",
            sampleAvailable: true,
            returnPolicy: "Returns accepted within 7 days for defective products.",
            warrantyInfo: "6 months warranty on manufacturing defects.",
            totalProducts: 156
        },

        // Bank Details - Array for multiple banks
        bank_details: [
            {
                id: 1,
                account_holder_name: "AyurHerbal Private Limited",
                account_number: "123456789012",
                ifsc_code: "SBIN0001234",
                bank_name: "State Bank of India",
                branch_name: "Kottakkal Branch",
                upi_id: "ayurherbal@okhdfcbank",
                payment_terms: "net30",
                is_selected: true,
                is_verified: true
            },
            {
                id: 2,
                account_holder_name: "AyurHerbal Private Limited",
                account_number: "987654321098",
                ifsc_code: "HDFC0005678",
                bank_name: "HDFC Bank",
                branch_name: "Kottakkal Main",
                upi_id: "ayurherbal@hdfcbank",
                payment_terms: "net30",
                is_selected: false,
                is_verified: false
            }
        ],

        // Documents
        documents: {
            gstCertificate: { name: "GST_Certificate.pdf", size: 450000, preview: "#", uploadedAt: "2023-06-01", verified: true },
            panCard: { name: "PAN_Card.pdf", size: 320000, preview: "#", uploadedAt: "2023-06-01", verified: true },
            shopEstablishment: null,
            fssaiLicense: { name: "FSSAI_License.pdf", size: 180000, preview: "#", uploadedAt: "2023-06-01", verified: false },
            ayurvedicLicense: { name: "AYUSH_License.pdf", size: 250000, preview: "#", uploadedAt: "2023-06-01", verified: true },
            bankStatement: null,
            cancelledCheque: { name: "cancelled_cheque.jpg", size: 210000, preview: "#", uploadedAt: "2023-06-01", verified: true },
            productCatalog: null,
            logo: null
        },

        // Agreements
        agreements: {
            termsAccepted: true,
            privacyAccepted: true,
            vendorAgreementAccepted: true,
            signature: "Dr. Rajesh Kumar",
            agreeDate: "2023-06-15"
        },

        // Performance Stats
        stats: {
            totalProducts: 156,
            totalOrders: 3450,
            totalRevenue: 12500000,
            averageRating: 4.7,
            onTimeDelivery: 98,
            returnRate: 2.5,
            customerSatisfaction: 94,
            thisMonthEarnings: 850000,
            lifetimeEarnings: 12500000,
            pendingOrders: 23,
            activeListings: 142
        },

        // Settings
        settings: {
            emailNotifications: true,
            smsAlerts: false,
            orderReminders: true,
            showInDirectory: true,
            allowBulkOrders: true,
            autoAcceptOrders: false
        }
    });

    useEffect(() => {
        fetchVendorProfile();
    }, []);

    const fetchVendorProfile = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            toast.error('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (section, field, value) => {
        setVendorData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedInputChange = (section, nested, field, value) => {
        setVendorData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [nested]: {
                    ...prev[section][nested],
                    [field]: value
                }
            }
        }));
    };

    const handleArrayAdd = (section, field, value) => {
        if (value && !vendorData[section][field].includes(value)) {
            setVendorData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: [...prev[section][field], value]
                }
            }));
            toast.success(`${value} added`);
        }
    };

    const handleArrayRemove = (section, field, index) => {
        setVendorData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: prev[section][field].filter((_, i) => i !== index)
            }
        }));
    };

    // Bank Details CRUD Operations
    const updateBankDetails = (index, field, value) => {
        setVendorData(prev => {
            const updatedBanks = [...prev.bank_details];
            if (field === "is_selected") {
                // If selecting this bank, unselect all others
                updatedBanks.forEach((bank, i) => {
                    updatedBanks[i] = {
                        ...bank,
                        is_selected: i === index ? value : false
                    };
                });
            } else {
                updatedBanks[index] = {
                    ...updatedBanks[index],
                    [field]: value
                };
            }
            return {
                ...prev,
                bank_details: updatedBanks
            };
        });
    };

    const addBankDetail = () => {
        if (!newBank.account_holder_name || !newBank.account_number || !newBank.ifsc_code) {
            toast.error('Please fill required fields (Account Holder, Account Number, IFSC)');
            return;
        }

        const newBankEntry = {
            id: Date.now(),
            ...newBank,
            is_verified: false,
            is_selected: vendorData.bank_details.length === 0 // If first bank, make it selected
        };

        setVendorData(prev => ({
            ...prev,
            bank_details: [...prev.bank_details, newBankEntry]
        }));

        toast.success('Bank account added successfully!');
        setShowBankModal(false);
        setNewBank({
            account_holder_name: "",
            account_number: "",
            ifsc_code: "",
            bank_name: "",
            branch_name: "",
            upi_id: "",
            payment_terms: "net30",
            is_selected: false,
            is_verified: false
        });
    };

    const updateBankDetail = (index) => {
        const updatedBank = vendorData.bank_details[index];
        if (!updatedBank.account_holder_name || !updatedBank.account_number || !updatedBank.ifsc_code) {
            toast.error('Please fill required fields');
            return;
        }
        toast.success('Bank details updated successfully!');
        setEditBankIndex(null);
    };

    const removeBankDetail = (index) => {
        const bankToRemove = vendorData.bank_details[index];
        if (bankToRemove.is_selected && vendorData.bank_details.length > 1) {
            toast.error('Cannot delete primary bank. Please select another bank as primary first.');
            return;
        }
        setVendorData(prev => ({
            ...prev,
            bank_details: prev.bank_details.filter((_, i) => i !== index)
        }));
        toast.success('Bank account removed successfully!');
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Profile photo must be less than 2MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setVendorData(prev => ({ ...prev, profileImage: reader.result }));
            toast.success('Profile photo updated!');
        };
        reader.readAsDataURL(file);
    };

    const handleDocumentUpload = async () => {
        if (!selectedFile || !selectedDocument) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setVendorData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [selectedDocument]: {
                        name: selectedFile.name,
                        size: selectedFile.size,
                        preview: reader.result,
                        uploadedAt: new Date().toISOString().split('T')[0],
                        verified: false
                    }
                }
            }));
            toast.success(`${selectedDocument.replace(/_/g, ' ')} uploaded successfully!`);
            setShowDocumentModal(false);
            setSelectedDocument(null);
            setSelectedFile(null);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Account deleted successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to delete account');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Password changed successfully!');
            setShowPasswordModal(false);
            e.target.reset();
        } catch (error) {
            toast.error('Failed to change password');
        }
    };

    const getStatusBadge = () => {
        const status = vendorData.status;
        if (status === 'active') return 'bg-emerald-100 text-emerald-700';
        if (status === 'pending') return 'bg-amber-100 text-amber-700';
        return 'bg-red-100 text-red-700';
    };

    const getStatusText = () => {
        const status = vendorData.status;
        if (status === 'active') return 'Active Vendor';
        if (status === 'pending') return 'Pending Verification';
        return 'Suspended';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const documentRequirements = {
        gstCertificate: { label: 'GST Certificate', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 5 },
        panCard: { label: 'PAN Card', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
        shopEstablishment: { label: 'Shop & Establishment Certificate', required: false, accepted: ['PDF'], maxSize: 5 },
        fssaiLicense: { label: 'FSSAI License', required: false, accepted: ['PDF'], maxSize: 5 },
        ayurvedicLicense: { label: 'Ayurvedic Manufacturing License', required: false, accepted: ['PDF'], maxSize: 5 },
        bankStatement: { label: 'Bank Statement (Last 6 months)', required: false, accepted: ['PDF'], maxSize: 10 },
        cancelledCheque: { label: 'Cancelled Cheque', required: true, accepted: ['PDF', 'JPG', 'PNG'], maxSize: 2 },
        productCatalog: { label: 'Product Catalog/Brochure', required: false, accepted: ['PDF'], maxSize: 20 },
        logo: { label: 'Company Logo', required: false, accepted: ['JPG', 'PNG'], maxSize: 1 }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-10 mt-10">
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
                                    {vendorData.profileImage ? (
                                        <img src={vendorData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                                            <Store size={44} className="text-emerald-600" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-110">
                                        <Camera size={14} />
                                        <input onChange={handlePhotoUpload} type="file" accept="image/*" className="absolute left-0 top-0 w-[24px] h-[24px] cursor-pointer opacity-0" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 pl-8 pr-8 pb-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {vendorData.businessInfo.businessName}
                                    </h2>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}>
                                        {getStatusText()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-gray-500 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <Building size={15} className="text-emerald-600" />
                                        <span className="text-sm">{vendorData.businessInfo.businessType}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Award size={15} className="text-emerald-600" />
                                        <span className="text-sm">Since {vendorData.businessInfo.yearEstablished}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Package size={15} className="text-emerald-600" />
                                        <span className="text-sm">{vendorData.stats.totalProducts} Products</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">Vendor ID: {vendorData.vendorId} • Joined: {formatDate(vendorData.joinedDate)}</p>
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
                                <p className="text-2xl font-bold text-gray-800">{vendorData.stats.totalProducts}</p>
                                <p className="text-xs text-gray-500">Total Products</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{vendorData.stats.totalOrders}</p>
                                <p className="text-xs text-gray-500">Orders</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-0.5">
                                    <Star size={16} className="text-amber-500 fill-amber-500" />
                                    <p className="text-2xl font-bold text-gray-800">{vendorData.stats.averageRating}</p>
                                </div>
                                <p className="text-xs text-gray-500">Rating</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{vendorData.stats.onTimeDelivery}%</p>
                                <p className="text-xs text-gray-500">On-Time</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-600">₹{(vendorData.stats.thisMonthEarnings / 100000).toFixed(1)}L</p>
                                <p className="text-xs text-gray-500">This Month</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{vendorData.stats.pendingOrders}</p>
                                <p className="text-xs text-gray-500">Pending Orders</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{vendorData.stats.activeListings}</p>
                                <p className="text-xs text-gray-500">Live Listings</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6">
                    <div className="border-b border-gray-200 bg-white rounded-t-xl">
                        <nav className="flex flex-wrap gap-1 px-4">
                            {['business', 'contact', 'documents', 'bank', 'settings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 py-3 px-5 text-sm font-medium border-b-2 transition-all capitalize ${activeTab === tab
                                        ? 'border-emerald-600 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab === 'business' && <Building size={16} />}
                                    {tab === 'contact' && <MapPin size={16} />}
                                    {tab === 'bank' && <Banknote size={16} />}
                                    {tab === 'documents' && <FileText size={16} />}
                                    {tab === 'settings' && <Settings size={16} />}
                                    <span className="capitalize">{tab}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-b-xl shadow-sm p-6">

                        {/* Business Tab */}
                        {activeTab === 'business' && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name <span className="text-red-500">*</span></label>
                                            <input type="text" value={vendorData.businessInfo.businessName} onChange={(e) => handleInputChange('businessInfo', 'businessName', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Legal Name</label>
                                            <input type="text" value={vendorData.businessInfo.legalName} onChange={(e) => handleInputChange('businessInfo', 'legalName', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                            <select value={vendorData.businessInfo.businessType} onChange={(e) => handleInputChange('businessInfo', 'businessType', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50">
                                                <option>Proprietorship</option>
                                                <option>Partnership</option>
                                                <option>Private Limited</option>
                                                <option>Public Limited</option>
                                                <option>LLP</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                            <input type="text" value={vendorData.businessInfo.gstNumber} onChange={(e) => handleInputChange('businessInfo', 'gstNumber', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                            <input type="text" value={vendorData.businessInfo.panNumber} onChange={(e) => handleInputChange('businessInfo', 'panNumber', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">AYUSH License Number</label>
                                            <input type="text" value={vendorData.businessInfo.ayushLicenseNumber} onChange={(e) => handleInputChange('businessInfo', 'ayushLicenseNumber', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI Number</label>
                                            <input type="text" value={vendorData.businessInfo.fssaiNumber} onChange={(e) => handleInputChange('businessInfo', 'fssaiNumber', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                                            <input type="text" value={vendorData.businessInfo.yearEstablished} onChange={(e) => handleInputChange('businessInfo', 'yearEstablished', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                                            <input type="text" value={vendorData.businessInfo.employeeCount} onChange={(e) => handleInputChange('businessInfo', 'employeeCount', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                                            <input type="email" value={vendorData.businessInfo.businessEmail} onChange={(e) => handleInputChange('businessInfo', 'businessEmail', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                                            <input type="tel" value={vendorData.businessInfo.businessPhone} onChange={(e) => handleInputChange('businessInfo', 'businessPhone', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                                            <input type="tel" value={vendorData.businessInfo.alternatePhone} onChange={(e) => handleInputChange('businessInfo', 'alternatePhone', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                            <input type="url" value={vendorData.businessInfo.website} onChange={(e) => handleInputChange('businessInfo', 'website', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                                            <textarea rows="4" value={vendorData.businessInfo.description} onChange={(e) => handleInputChange('businessInfo', 'description', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                            <input type="text" value={vendorData.contactInfo.address.street} onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'street', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input type="text" value={vendorData.contactInfo.address.city} onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'city', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <input type="text" value={vendorData.contactInfo.address.state} onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'state', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                            <input type="text" value={vendorData.contactInfo.address.pincode} onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'pincode', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <input type="text" value={vendorData.contactInfo.address.country} onChange={(e) => handleNestedInputChange('contactInfo', 'address', 'country', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Primary Contact Person</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
                                            <input type="text" value={vendorData.contactInfo.contactPerson.name} onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'name', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                            <input type="text" value={vendorData.contactInfo.contactPerson.designation} onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'designation', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input type="email" value={vendorData.contactInfo.contactPerson.email} onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'email', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input type="tel" value={vendorData.contactInfo.contactPerson.phone} onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'phone', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                                            <input type="tel" value={vendorData.contactInfo.contactPerson.alternatePhone} onChange={(e) => handleNestedInputChange('contactInfo', 'contactPerson', 'alternatePhone', e.target.value)} disabled={!isEditing} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(documentRequirements).map(([key, req]) => {
                                        const doc = vendorData.documents[key];
                                        return (
                                            <div key={key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-gray-100">
                                                        <FileText size={20} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 capitalize text-sm">{req.label}</p>
                                                        <p className={"text-xs " + (doc ? 'text-emerald-600' : 'text-gray-400')}>{doc ? doc.name : 'Not uploaded'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {doc && <button onClick={() => window.open(doc.preview, '_blank')} className="p-1.5 text-gray-500 hover:text-emerald-600 transition"><Eye size={16} /></button>}
                                                    {doc?.verified ? (
                                                        <span className="flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle size={12} />Verified</span>
                                                    ) : doc ? (
                                                        <span className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                                                    ) : (
                                                        <button onClick={() => { setSelectedDocument(key); setShowDocumentModal(true); }} className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center gap-1"><Upload size={12} />Upload</button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                    <div className="flex items-start gap-3"><AlertCircle size={18} className="text-amber-600 mt-0.5" /><div><p className="text-sm font-medium text-amber-800">Document Verification</p><p className="text-xs text-amber-700">Documents are typically verified within 24-48 hours. Please ensure all uploaded documents are clear and legible.</p></div></div>
                                </div>
                            </div>
                        )}

                        {/* Bank Tab - Multiple Bank Details */}
                        {activeTab === 'bank' && (
                            <div className="space-y-6">
                                {/* Add Bank Button */}
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Bank Accounts</h3>
                                    <button
                                        onClick={() => setShowBankModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#0D614E] text-white rounded-xl hover:bg-[#0D614E]/90 transition shadow-md"
                                    >
                                        <Plus size={18} />
                                        <span>Add Bank Account</span>
                                    </button>
                                </div>

                                {/* Bank Cards Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vendorData.bank_details.map((data, index) => (
                                        <div
                                            key={data.id || index}
                                            className={`relative rounded-2xl p-5 shadow-xl transition-all duration-300 ${data.is_selected
                                                    ? "border-2 border-[#0D614E] bg-gradient-to-br from-emerald-50 to-teal-50"
                                                    : "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
                                                }`}
                                        >
                                            {/* Top Row */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-800">
                                                        {data.bank_name || "Your Bank"}
                                                    </h2>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {data.branch_name || "Branch not specified"}
                                                    </p>
                                                </div>
                                                {isEditing && (
                                                    <input
                                                        type="radio"
                                                        name="selectedBank"
                                                        checked={data.is_selected === true}
                                                        onChange={() => updateBankDetails(index, "is_selected", true)}
                                                        className="w-4 h-4 accent-[#0D614E]"
                                                    />
                                                )}
                                                {data.is_selected && (
                                                    <span className="absolute -top-2 -right-2 bg-[#0D614E] text-white px-2 py-0.5 rounded-full text-xs">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>

                                            {/* Card Number */}
                                            <p className="mt-3 text-xl tracking-widest font-mono text-gray-800">
                                                **** **** **** {data.account_number?.slice(-4) || "0000"}
                                            </p>

                                            {/* Account Holder */}
                                            <p className="mt-2 text-sm text-gray-600 truncate">
                                                {data.account_holder_name}
                                            </p>

                                            {/* Bottom Info */}
                                            <div className="flex justify-between mt-3 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-400">IFSC</p>
                                                    <p className="font-medium text-gray-700 text-xs">{data.ifsc_code}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400">UPI ID</p>
                                                    <p className="font-medium text-gray-700 text-xs truncate max-w-[100px]">{data.upi_id || "N/A"}</p>
                                                </div>
                                            </div>

                                            {/* Payment Terms */}
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-400">Payment Terms</p>
                                                <p className="text-xs text-gray-700 capitalize">{data.payment_terms?.replace('net', 'Net ') || "Net 30"}</p>
                                            </div>

                                            {/* Status */}
                                            <div className="mt-3">
                                                {data.is_verified ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                                                        <CheckCircle size={12} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                                        <AlertCircle size={12} /> Pending
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            {isEditing && (
                                                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                                                    <button
                                                        onClick={() => setEditBankIndex(index)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0D614E] text-white rounded-lg text-xs hover:bg-[#0D614E]/80 transition"
                                                    >
                                                        <Edit size={12} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => removeBankDetail(index)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs hover:bg-rose-600 transition"
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            )}

                                            {/* Edit Form Inside Card */}
                                            {editBankIndex === index && (
                                                <div className="mt-4 bg-white text-black p-4 rounded-xl shadow-lg border border-gray-200">
                                                    <h4 className="font-semibold text-sm mb-3">Edit Bank Details</h4>
                                                    <div className="space-y-3">
                                                        <input
                                                            value={data.account_holder_name}
                                                            onChange={(e) => updateBankDetails(index, "account_holder_name", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                            placeholder="Account Holder Name"
                                                        />
                                                        <input
                                                            value={data.account_number}
                                                            onChange={(e) => updateBankDetails(index, "account_number", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                                            placeholder="Account Number"
                                                        />
                                                        <input
                                                            value={data.ifsc_code}
                                                            onChange={(e) => updateBankDetails(index, "ifsc_code", e.target.value.toUpperCase())}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                                            placeholder="IFSC Code"
                                                        />
                                                        <input
                                                            value={data.bank_name}
                                                            onChange={(e) => updateBankDetails(index, "bank_name", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                                            placeholder="Bank Name"
                                                        />
                                                        <input
                                                            value={data.branch_name}
                                                            onChange={(e) => updateBankDetails(index, "branch_name", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                                            placeholder="Branch Name"
                                                        />
                                                        <input
                                                            value={data.upi_id}
                                                            onChange={(e) => updateBankDetails(index, "upi_id", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                                            placeholder="UPI ID"
                                                        />
                                                        <select
                                                            value={data.payment_terms}
                                                            onChange={(e) => updateBankDetails(index, "payment_terms", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                                                        >
                                                            <option value="net15">Net 15 days</option>
                                                            <option value="net30">Net 30 days</option>
                                                            <option value="net45">Net 45 days</option>
                                                            <option value="net60">Net 60 days</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex justify-end gap-2 mt-4">
                                                        <button
                                                            onClick={() => setEditBankIndex(null)}
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                updateBankDetail(index);
                                                                setEditBankIndex(null);
                                                            }}
                                                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {vendorData.bank_details.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <Banknote size={48} className="mx-auto text-gray-400 mb-3" />
                                        <p className="text-gray-500">No bank accounts added yet</p>
                                        <button
                                            onClick={() => setShowBankModal(true)}
                                            className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                        >
                                            + Add your first bank account
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="border border-rose-200 rounded-xl p-5 bg-rose-50/30">
                                    <div className="flex items-center gap-3 mb-3"><AlertTriangle size={18} className="text-rose-600" /><h4 className="font-medium text-rose-800">Delete Account</h4></div>
                                    <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition">Delete Account</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Bank Modal */}
            {showBankModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Add New Bank Account</h3>
                            <button onClick={() => setShowBankModal(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Enter your bank account details for payment settlements</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name <span className="text-red-500">*</span></label>
                                <input
                                    placeholder="As per bank records"
                                    value={newBank.account_holder_name}
                                    onChange={(e) => setNewBank({ ...newBank, account_holder_name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number <span className="text-red-500">*</span></label>
                                <input
                                    placeholder="Enter account number"
                                    value={newBank.account_number}
                                    onChange={(e) => setNewBank({ ...newBank, account_number: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code <span className="text-red-500">*</span></label>
                                <input
                                    placeholder="SBIN0001234"
                                    value={newBank.ifsc_code}
                                    onChange={(e) => setNewBank({ ...newBank, ifsc_code: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                <input
                                    placeholder="Name of bank"
                                    value={newBank.bank_name}
                                    onChange={(e) => setNewBank({ ...newBank, bank_name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                <input
                                    placeholder="Branch name"
                                    value={newBank.branch_name}
                                    onChange={(e) => setNewBank({ ...newBank, branch_name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                                <input
                                    placeholder="yourname@bank"
                                    value={newBank.upi_id}
                                    onChange={(e) => setNewBank({ ...newBank, upi_id: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                                <select
                                    value={newBank.payment_terms}
                                    onChange={(e) => setNewBank({ ...newBank, payment_terms: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="net15">Net 15 days</option>
                                    <option value="net30">Net 30 days</option>
                                    <option value="net45">Net 45 days</option>
                                    <option value="net60">Net 60 days</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowBankModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button onClick={addBankDetail} className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-[#0D614E]/90 transition">
                                Add Bank Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Upload Modal */}
            {showDocumentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Upload {selectedDocument?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                            <button onClick={() => setShowDocumentModal(false)}><X size={24} /></button>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Upload clear document (PDF, JPG, PNG, max 5MB)</p>
                        <div className="w-full border border-gray-200 rounded-lg relative">
                            {selectedFile ? (
                                <div className="flex items-center gap-3 p-4"><FileText size={20} className="text-gray-500" /><span className="text-sm text-gray-700">{selectedFile.name}</span></div>
                            ) : (
                                <>
                                    <input ref={docInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                    <div className="flex items-center justify-center gap-2 p-6 text-gray-500 hover:text-emerald-600 transition cursor-pointer"><Upload size={20} /><span className="text-sm">Click to select file</span></div>
                                </>
                            )}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setShowDocumentModal(false); setSelectedFile(null); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                            <button onClick={handleDocumentUpload} disabled={!selectedFile} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300">Upload</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4"><AlertTriangle size={24} className="text-rose-600" /></div>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Account</h3>
                        <p className="text-gray-500 text-center mb-6">Are you sure? All your data will be permanently removed.</p>
                        <div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button><button onClick={handleDeleteAccount} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Delete</button></div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800">Change Password</h3><button onClick={() => setShowPasswordModal(false)}><X size={24} /></button></div>
                        <form onSubmit={handlePasswordChange}>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label><input type="password" name="currentPassword" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" name="newPassword" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><input type="password" name="confirmPassword" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                            </div>
                            <div className="flex gap-3 mt-6"><button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Update</button></div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .toggle-checkbox:checked { right: 0; border-color: #0D614E; }
                .toggle-checkbox:checked + .toggle-label { background-color: #0D614E; }
                .toggle-checkbox { right: 0; transition: all 0.3s; }
                .toggle-label { transition: background-color 0.3s; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default VendorProfile;