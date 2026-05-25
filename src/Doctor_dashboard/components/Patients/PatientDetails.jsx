// PatientDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Activity,
    Heart,
    Wind,
    Sun,
    Moon,
    Pill,
    FileText,
    Clock,
    MessageCircle,
    Star,
    Award,
    TrendingUp,
    TrendingDown,
    Edit,
    Printer,
    Share2,
    Download,
    X,
    CheckCircle,
    AlertCircle,
    HeartPulse,
    Thermometer,
    Weight,
    Ruler,
    Droplet,
    Sparkles,
    Leaf,
    CalendarDays,
    Clock as ClockIcon,
    Syringe,
    Clipboard,
    Scissors,
    Plus,
    ChevronRight,
    ChevronDown,
    Copy,
    Check,
    Send,
    Paperclip,
    MoreHorizontal,
    Video,
    PhoneCall,
    MessageSquare,
    Bell,
    Settings,
    Lock,
    Shield,
    Trash2,
    Upload,
    Eye,
    Download as DownloadIcon,
    XCircle,
    DollarSign,
    Menu,
    Grid3x3,
    List,
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp as TrendingUpIcon,
    Users,
    UserPlus,
    UserCheck,
    UserX,
    RefreshCw,
    Filter,
    Sliders,
    Maximize2,
    Minimize2,
    ExternalLink,
    Link,
    Facebook,
    Twitter,
    Linkedin,
    WhatsApp,
    Mail as MailIcon,
    Printer as PrinterIcon,
    FileJson,
    FilePdf,
    FileSpreadsheet,
    Camera,
    Mic,
    Volume2,
    Video as VideoIcon,
    Monitor,
    Smartphone,
    Tablet,
    Laptop,
    Wifi,
    Bluetooth,
    Battery,
    Volume,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Settings as SettingsIcon,
    HelpCircle,
    Info,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown,
    Smile,
    Frown,
    Meh,
    Zap,
    Gift,
    Coffee,
    Music,
    Film,
    Book,
    Globe,
    Cloud,
    Database,
    Server,
    Cpu,
    HardDrive,
    Monitor as MonitorIcon,
    Keyboard,
    Mouse,
    Headphones,
    Speaker,
    Microphone,
    Webcam,
    Printer as PrinterDevice,
    Scanner,
    Fax,
    Copy as CopyIcon,
    Paste,
    Cut,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    ListOrdered,
    ListUnordered,
    IndentIncrease,
    IndentDecrease,
    Undo,
    Redo,
    Save,
    Folder,
    FolderOpen,
    FolderPlus,
    File,
    FilePlus,
    FileMinus,
    Search,
    ZoomIn,
    ZoomOut,
    RotateCw,
    RotateCcw,
    Crop,
    Filter as FilterIcon,
    Image,
    Video as VideoFile,
    Music as MusicFile,
    Archive,
    Package,
    Truck,
    ShoppingCart,
    CreditCard,
    Wallet,
    Banknote,
    Bitcoin,
    DollarSign as DollarSignIcon,
    Euro,
    PoundSterling,
    Yen,
    Percent,
    Divide,
    Equal,
    Minus,
    Plus as PlusIcon,
    Multiply,
    Hash,
    AtSign,
    Asterisk,
    Slash,
    Backspace,
    Tab,
    CapsLock,
    Shift,
    Command,
    Option,
    Control,
    Alt,
    ArrowUp,
    ArrowDown as ArrowDownIcon,
    ArrowLeft as ArrowLeftIcon,
    ArrowRight,
    ChevronUp,
    ChevronDown as ChevronDownIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    CornerUpLeft,
    CornerUpRight,
    CornerDownLeft,
    CornerDownRight,
    Move,
    MoveHorizontal,
    MoveVertical,
    Maximize,
    Minimize,
    Square,
    Circle,
    Triangle,
    Pentagon,
    Hexagon,
    Octagon,
    Diamond,
    Cross,
    Shield as ShieldIcon,
    Award as AwardIcon,
    Medal,
    Trophy,
    Target,
    Flag,
    CheckSquare,
    Square as SquareIcon,
    Circle as CircleIcon,
    Heart as HeartIcon,
    ThumbsUp as ThumbsUpIcon,
    ThumbsDown as ThumbsDownIcon,
    Smile as SmileIcon,
    Frown as FrownIcon,
    Meh as MehIcon,
    Zap as ZapIcon,
    Gift as GiftIcon,
    Coffee as CoffeeIcon,
    Music as MusicIcon,
    Film as FilmIcon,
    Book as BookIcon,
    Globe as GlobeIcon,
    Cloud as CloudIcon,
    Database as DatabaseIcon,
    Server as ServerIcon,
    Cpu as CpuIcon,
    HardDrive as HardDriveIcon,
    Monitor as MonitorDeviceIcon,
    Keyboard as KeyboardIcon,
    Mouse as MouseIcon
} from 'lucide-react';

const PatientDetails = ({ patient, onClose, onEdit, onDelete, onRefresh }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [newPrescription, setNewPrescription] = useState({
        medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [newNote, setNewNote] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        personalInfo: true,
        vitals: true,
        concerns: true,
        dosha: true
    });
    const [chartView, setChartView] = useState('line');
    const detailsRef = useRef(null);

    // Sample data - Enhanced with more details
    const [prescriptions, setPrescriptions] = useState([
        {
            id: 1,
            date: '2024-01-10',
            medicines: [
                { name: 'Triphala', dosage: '1 tsp', frequency: 'Twice daily', duration: '2 weeks', timing: 'After meals' },
                { name: 'Ashwagandha', dosage: '500mg', frequency: 'Once daily', duration: '1 month', timing: 'Before bed' }
            ],
            notes: 'Take after meals with warm water. Avoid cold drinks.',
            prescribedBy: 'Dr. Anand Sharma',
            status: 'active',
            refillRemaining: 2
        },
        {
            id: 2,
            date: '2024-01-01',
            medicines: [
                { name: 'Dashmool', dosage: '10ml', frequency: 'Twice daily', duration: '1 week', timing: 'Morning and Evening' }
            ],
            notes: 'For joint pain relief. Apply gently on affected areas.',
            prescribedBy: 'Dr. Anand Sharma',
            status: 'completed',
            refillRemaining: 0
        }
    ]);

    const [visitHistory, setVisitHistory] = useState([
        {
            date: '2024-01-10',
            type: 'Follow-up',
            concerns: ['Joint pain improved by 70%', 'Sleep quality better', 'Energy levels increased'],
            vitals: { bp: '120/80', pulse: '72', weight: '58 kg', temperature: '98.4', oxygen: '98%' },
            fee: 1000,
            doctor: 'Dr. Anand Sharma',
            notes: 'Patient showing good progress. Continue current medication.'
        },
        {
            date: '2024-01-01',
            type: 'Consultation',
            concerns: ['Severe joint pain', 'Difficulty sleeping', 'Low energy', 'Stress'],
            vitals: { bp: '130/85', pulse: '78', weight: '59 kg', temperature: '98.6', oxygen: '97%' },
            fee: 1500,
            doctor: 'Dr. Anand Sharma',
            notes: 'Initial consultation. Diagnosed with Vata imbalance.'
        },
        {
            date: '2023-12-20',
            type: 'Therapy',
            concerns: ['Panchakarma session 1', 'Oil massage', 'Steam therapy'],
            vitals: { bp: '125/82', pulse: '75', weight: '58.5 kg', temperature: '98.2', oxygen: '98%' },
            fee: 2000,
            doctor: 'Dr. Priya Patel',
            notes: 'First Panchakarma session. Patient responded well.'
        }
    ]);

    const [labReports, setLabReports] = useState([
        { id: 1, name: 'Complete Blood Count', date: '2024-01-05', type: 'PDF', size: '2.4 MB', status: 'Normal', category: 'Blood Test', doctor: 'Dr. Anand Sharma' },
        { id: 2, name: 'Thyroid Profile', date: '2024-01-05', type: 'PDF', size: '1.8 MB', status: 'Borderline', category: 'Hormone', doctor: 'Dr. Anand Sharma' },
        { id: 3, name: 'Lipid Profile', date: '2023-12-20', type: 'PDF', size: '1.5 MB', status: 'High', category: 'Cholesterol', doctor: 'Dr. Priya Patel' },
        { id: 4, name: 'Liver Function Test', date: '2023-12-20', type: 'PDF', size: '1.2 MB', status: 'Normal', category: 'Liver', doctor: 'Dr. Priya Patel' },
        { id: 5, name: 'Vitamin D', date: '2024-01-05', type: 'PDF', size: '1.1 MB', status: 'Deficient', category: 'Vitamins', doctor: 'Dr. Anand Sharma' }
    ]);

    const [messages, setMessages] = useState([
        { id: 1, sender: 'patient', name: 'Priya Sharma', message: 'Doctor, I\'ve been feeling much better after taking the medicines.', time: '2024-01-14 10:30 AM', read: true, avatar: 'PS' },
        { id: 2, sender: 'doctor', name: 'Dr. Anand Sharma', message: 'That\'s great to hear! Continue the medication as prescribed.', time: '2024-01-14 10:35 AM', read: true, avatar: 'DA' },
        { id: 3, sender: 'patient', name: 'Priya Sharma', message: 'Should I continue the same diet plan?', time: '2024-01-14 10:40 AM', read: false, avatar: 'PS' },
        { id: 4, sender: 'doctor', name: 'Dr. Anand Sharma', message: 'Yes, continue with the Vata-pacifying diet. Avoid cold and dry foods.', time: '2024-01-14 10:45 AM', read: false, avatar: 'DA' },
        { id: 5, sender: 'patient', name: 'Priya Sharma', message: 'Also, when should I schedule the next follow-up?', time: '2024-01-14 10:50 AM', read: false, avatar: 'PS' }
    ]);

    const [upcomingAppointments, setUpcomingAppointments] = useState([
        { id: 1, date: '2024-01-25', time: '10:00 AM', type: 'Follow-up', status: 'confirmed', doctor: 'Dr. Anand Sharma', duration: '30 min' },
        { id: 2, date: '2024-02-10', time: '02:30 PM', type: 'Therapy', status: 'pending', doctor: 'Dr. Priya Patel', duration: '60 min' }
    ]);

    const [healthMetrics, setHealthMetrics] = useState([
        { month: 'Sep', score: 68, visits: 2, satisfaction: 4.2 },
        { month: 'Oct', score: 72, visits: 1, satisfaction: 4.5 },
        { month: 'Nov', score: 75, visits: 2, satisfaction: 4.6 },
        { month: 'Dec', score: 80, visits: 1, satisfaction: 4.8 },
        { month: 'Jan', score: 85, visits: 2, satisfaction: 4.9 }
    ]);

    // Get dosha information
    const getDoshaInfo = (dosha) => {
        const doshaData = {
            Vata: {
                icon: Wind,
                color: 'text-purple-600',
                bg: 'bg-purple-100',
                border: 'border-purple-200',
                gradient: 'from-purple-500 to-purple-600',
                darkGradient: 'from-purple-600 to-purple-700',
                description: 'Air & Space elements. Creative, energetic, but prone to anxiety and digestive issues.',
                foods: ['Warm, cooked foods', 'Root vegetables', 'Healthy oils', 'Soups', 'Stews'],
                avoid: ['Cold drinks', 'Dry foods', 'Caffeine', 'Raw vegetables', 'Beans'],
                herbs: ['Ashwagandha', 'Dashmool', 'Bala', 'Shatavari'],
                yoga: ['Child pose', 'Forward bends', 'Seated twists', 'Sun salutations'],
                lifestyle: ['Regular routine', 'Warm oil massage', 'Adequate rest', 'Meditation']
            },
            Pitta: {
                icon: Sun,
                color: 'text-orange-600',
                bg: 'bg-orange-100',
                border: 'border-orange-200',
                gradient: 'from-orange-500 to-orange-600',
                darkGradient: 'from-orange-600 to-orange-700',
                description: 'Fire & Water elements. Ambitious, intelligent, but prone to inflammation and acidity.',
                foods: ['Cooling foods', 'Sweet fruits', 'Coconut water', 'Cucumber', 'Melons'],
                avoid: ['Spicy foods', 'Sour fruits', 'Alcohol', 'Fermented foods', 'Red meat'],
                herbs: ['Brahmi', 'Guduchi', 'Neem', 'Amalaki'],
                yoga: ['Moon salutations', 'Forward bends', 'Seated poses', 'Cooling breaths'],
                lifestyle: ['Cool environment', 'Avoid excessive sun', 'Calming activities', 'Swimming']
            },
            Kapha: {
                icon: Moon,
                color: 'text-blue-600',
                bg: 'bg-blue-100',
                border: 'border-blue-200',
                gradient: 'from-blue-500 to-blue-600',
                darkGradient: 'from-blue-600 to-blue-700',
                description: 'Earth & Water elements. Calm, loving, but prone to weight gain and congestion.',
                foods: ['Light, warm foods', 'Leafy greens', 'Spices', 'Legumes', 'Fruits'],
                avoid: ['Heavy, oily foods', 'Dairy', 'Sweet foods', 'Fried foods', 'Nuts'],
                herbs: ['Triphala', 'Guggul', 'Punarnava', 'Tulsi'],
                yoga: ['Sun salutations', 'Backbends', 'Dynamic poses', 'Heating breaths'],
                lifestyle: ['Regular exercise', 'Dry brushing', 'Variety in routine', 'Early rising']
            }
        };
        return doshaData[dosha] || doshaData.Vata;
    };

    const doshaInfo = getDoshaInfo(patient.dosha);
    const DoshaIcon = doshaInfo.icon;

    // Health score information
    const getHealthScoreInfo = (score) => {
        if (score >= 80) return { color: 'text-emerald-600 bg-emerald-100', message: 'Excellent Health', icon: Star, trend: '+12%', trendColor: 'text-emerald-600' };
        if (score >= 60) return { color: 'text-yellow-600 bg-yellow-100', message: 'Good Health', icon: TrendingUp, trend: '+5%', trendColor: 'text-yellow-600' };
        if (score >= 40) return { color: 'text-orange-600 bg-orange-100', message: 'Fair Health', icon: Activity, trend: '-3%', trendColor: 'text-orange-600' };
        return { color: 'text-rose-600 bg-rose-100', message: 'Needs Attention', icon: AlertCircle, trend: '-8%', trendColor: 'text-rose-600' };
    };

    const healthScoreInfo = getHealthScoreInfo(patient.healthScore);
    const HealthIcon = healthScoreInfo.icon;

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle send message
    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const newMsg = {
            id: messages.length + 1,
            sender: 'doctor',
            name: 'Dr. Anand Sharma',
            message: newMessage,
            time: new Date().toLocaleString(),
            read: true,
            avatar: 'DA'
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
        showNotification('Message sent successfully');
    };

    // Handle add prescription
    const handleAddPrescription = () => {
        const newPresc = {
            id: prescriptions.length + 1,
            ...newPrescription,
            prescribedBy: 'Dr. Anand Sharma',
            status: 'active',
            refillRemaining: 3
        };
        setPrescriptions([newPresc, ...prescriptions]);
        setShowPrescriptionModal(false);
        setNewPrescription({
            medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
            notes: '',
            date: new Date().toISOString().split('T')[0]
        });
        showNotification('Prescription added successfully');
    };

    // Handle add medicine field
    const addMedicineField = () => {
        setNewPrescription({
            ...newPrescription,
            medicines: [...newPrescription.medicines, { name: '', dosage: '', frequency: '', duration: '', timing: '' }]
        });
    };

    // Handle medicine change
    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...newPrescription.medicines];
        updatedMedicines[index][field] = value;
        setNewPrescription({ ...newPrescription, medicines: updatedMedicines });
    };

    // Handle remove medicine
    const removeMedicineField = (index) => {
        const updatedMedicines = newPrescription.medicines.filter((_, i) => i !== index);
        setNewPrescription({ ...newPrescription, medicines: updatedMedicines });
    };

    // Handle share patient data
    const handleShare = (method) => {
        const shareData = {
            patient: {
                name: patient.name,
                age: patient.age,
                dosha: patient.dosha,
                healthScore: patient.healthScore,
                lastVisit: patient.lastVisit,
                nextFollowUp: patient.nextFollowUp
            },
            prescriptions: prescriptions.length,
            visits: visitHistory.length,
            reports: labReports.length
        };

        if (method === 'copy') {
            navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            showNotification('Data copied to clipboard');
        } else if (method === 'email') {
            window.location.href = `mailto:?subject=Patient Report - ${patient.name}&body=${JSON.stringify(shareData, null, 2)}`;
        } else if (method === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(JSON.stringify(shareData, null, 2))}`, '_blank');
        }
        setShowShareModal(false);
    };

    // Handle download report
    const handleDownloadReport = (format = 'json') => {
        const reportData = {
            patient: patient,
            prescriptions: prescriptions,
            visitHistory: visitHistory,
            labReports: labReports,
            messages: messages,
            upcomingAppointments: upcomingAppointments,
            downloadDate: new Date().toISOString(),
            totalVisits: patient.totalVisits,
            totalSpent: patient.totalVisits * 1500
        };

        let blob;
        let filename;

        if (format === 'json') {
            blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            filename = `${patient.name.replace(' ', '_')}_report.json`;
        } else if (format === 'csv') {
            const csvData = visitHistory.map(v => `${v.date},${v.type},${v.fee},${v.doctor}`).join('\n');
            blob = new Blob(['Date,Type,Fee,Doctor\n' + csvData], { type: 'text/csv' });
            filename = `${patient.name.replace(' ', '_')}_visits.csv`;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showNotification(`Report downloaded as ${format.toUpperCase()}`);
        setShowExportModal(false);
    };

    

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            detailsRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    // Get status badge for upcoming appointments
    const getAppointmentStatusBadge = (status) => {
        switch (status) {
            case 'confirmed': return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle };
            case 'pending': return { color: 'bg-yellow-100 text-yellow-700', icon: ClockIcon };
            case 'cancelled': return { color: 'bg-rose-100 text-rose-700', icon: XCircle };
            default: return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
        }
    };

    return (
        <div ref={detailsRef} className=" inset-0 bg-gray-50 z-50 overflow-y-auto">
            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    .print-padding {
                        padding: 20px;
                    }
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
                .hover-scale {
                    transition: transform 0.2s;
                }
                .hover-scale:hover {
                    transform: scale(1.05);
                }
            `}</style>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-20 right-4 z-50 animate-slide-in">
                    <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${notification.type === 'success' ? 'bg-emerald-500' :
                            notification.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                        } text-white`}>
                        {notification.type === 'success' ? <CheckCircle size={20} /> :
                            notification.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Header with Gradient Background */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] text-white shadow-lg no-print">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold border-2 border-white">
                                    {patient.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{patient.name}</h1>
                                <div className="flex items-center space-x-3 mt-1 flex-wrap gap-y-1">
                                    <div className="flex items-center space-x-1">
                                        <User size={14} />
                                        <span className="text-sm">{patient.age} years • {patient.gender}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="flex items-center space-x-1">
                                        <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${doshaInfo.bg} ${doshaInfo.color}`}>
                                            <DoshaIcon size={12} />
                                            <span>{patient.dosha} Dosha</span>
                                        </div>
                                    </div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="flex items-center space-x-1">
                                        <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${healthScoreInfo.color}`}>
                                            <HealthIcon size={12} />
                                            <span>Health Score: {patient.healthScore}</span>
                                        </div>
                                    </div>
                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                    <div className="flex items-center space-x-1">
                                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900 bg-opacity-30">
                                            <Calendar size={12} />
                                            <span>Member since {new Date(patient.firstVisit).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                            >
                                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                title="Share"
                            >
                                <Share2 size={20} />
                            </button>
                            {/* <button
                                onClick={handlePrint}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                title="Print Report"
                            >
                                <Printer size={20} />
                            </button> */}
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                title="Export Data"
                            >
                                <Download size={20} />
                            </button>
                            {/* <button
                                onClick={() => onEdit(patient)}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                title="Edit Patient"
                            >
                                <Edit size={20} />
                            </button> */}
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
                                        onDelete(patient.id);
                                    }
                                }}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-rose-200 hover:text-white"
                                title="Delete Patient"
                            >
                                <Trash2 size={20} />
                            </button>
                            <div className="w-px h-8 bg-white bg-opacity-30"></div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10 shadow-sm no-print">
                <div className="px-6 py-3">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowAppointmentModal(true)}
                            className="px-4 py-2 bg-[#0D614E] text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition-all hover:shadow-md"
                        >
                            <Calendar size={16} />
                            <span>Schedule Appointment</span>
                        </button>
                        <button
                            onClick={() => setShowPrescriptionModal(true)}
                            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all hover:shadow-sm"
                        >
                            <Pill size={16} />
                            <span>New Prescription</span>
                        </button>
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all hover:shadow-sm"
                        >
                            <Upload size={16} />
                            <span>Upload Report</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('messages');
                                document.getElementById('message-input')?.focus();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all hover:shadow-sm"
                        >
                            <MessageSquare size={16} />
                            <span>Send Message</span>
                        </button>
                        <button
                            onClick={() => onRefresh && onRefresh()}
                            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all hover:shadow-sm"
                        >
                            <RefreshCw size={16} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto px-6 py-6">
                {/* Quick Stats Cards with Animations */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Visits</p>
                                <p className="text-2xl font-bold text-gray-800">{patient.totalVisits}</p>
                                <p className="text-xs text-emerald-600 mt-1">+2 this month</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Calendar size={18} className="text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Last Visit</p>
                                <p className="text-sm font-semibold text-gray-800">{patient.lastVisit}</p>
                                <p className="text-xs text-gray-500 mt-1">12 days ago</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <ClockIcon size={18} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Next Follow-up</p>
                                <p className="text-sm font-semibold text-gray-800">{patient.nextFollowUp}</p>
                                <p className="text-xs text-amber-600 mt-1">In 5 days</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <CalendarDays size={18} className="text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Total Spent</p>
                                <p className="text-xl font-bold text-gray-800">₹{(patient.totalVisits * 1500).toLocaleString()}</p>
                                <p className="text-xs text-emerald-600 mt-1">+15% vs last month</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <DollarSign size={18} className="text-amber-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Active Prescriptions</p>
                                <p className="text-2xl font-bold text-gray-800">{prescriptions.filter(p => p.status === 'active').length}</p>
                                <p className="text-xs text-emerald-600 mt-1">2 refills left</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                                <Pill size={18} className="text-rose-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Lab Reports</p>
                                <p className="text-2xl font-bold text-gray-800">{labReports.length}</p>
                                <p className="text-xs text-blue-600 mt-1">2 new this month</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                                <FileText size={18} className="text-cyan-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Score Trend Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Health Score Trend</h3>
                            <p className="text-sm text-gray-500">Last 5 months progress</p>
                        </div>
                        {/* <div className="flex space-x-2">
                            <button
                                onClick={() => setChartView('line')}
                                className={`p-2 rounded-lg transition-colors ${chartView === 'line' ? 'bg-[#0D614E] text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                <LineChart size={16} />
                            </button>
                            <button
                                onClick={() => setChartView('bar')}
                                className={`p-2 rounded-lg transition-colors ${chartView === 'bar' ? 'bg-[#0D614E] text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                <BarChart3 size={16} />
                            </button>
                        </div> */}
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                        {/* Chart placeholder - In real app, integrate a chart library like recharts */}
                        <div className="w-full">
                            <div className="flex justify-between items-end h-48">
                                {healthMetrics.map((metric, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1">
                                        <div className="text-center">
                                            <div
                                                className="w-12 bg-[#0D614E] rounded-t-lg transition-all duration-500 hover:bg-opacity-80 cursor-pointer group relative"
                                                style={{ height: `${metric.score * 0.6}px` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    Score: {metric.score}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2">{metric.month}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-[#0D614E] rounded"></div>
                                        <span className="text-xs text-gray-600">Health Score</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                                        <span className="text-xs text-gray-600">Avg: {Math.round(healthMetrics.reduce((sum, m) => sum + m.score, 0) / healthMetrics.length)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <TrendingUpIcon size={12} className="text-emerald-600" />
                                    <span className="text-xs text-emerald-600">+17% improvement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto px-4 scrollbar-thin scrollbar-thumb-gray-300">
                            {[
                                { id: 'overview', label: 'Overview', icon: User, count: null },
                                { id: 'medical', label: 'Medical History', icon: Clipboard, count: null },
                                { id: 'prescriptions', label: 'Prescriptions', icon: Pill, count: prescriptions.length },
                                { id: 'visits', label: 'Visit History', icon: ClockIcon, count: visitHistory.length },
                                { id: 'reports', label: 'Lab Reports', icon: FileText, count: labReports.length },
                                { id: 'messages', label: 'Messages', icon: MessageCircle, count: messages.filter(m => !m.read).length }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-4 border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                                ? 'border-[#0D614E] text-[#0D614E]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{tab.label}</span>
                                        {tab.count > 0 && (
                                            <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-[#0D614E] text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab Content - Enhanced */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Personal Info & Vitals */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Personal Information Card - Collapsible */}
                                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection('personalInfo')}
                                                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                                    <User size={20} style={{ color: '#0D614E' }} />
                                                    <span>Personal Information</span>
                                                </h3>
                                                <ChevronDown size={20} className={`transition-transform ${expandedSections.personalInfo ? '' : '-rotate-90'}`} />
                                            </button>
                                            {expandedSections.personalInfo && (
                                                <div className="p-4 pt-0 border-t border-gray-100 animate-fade-in">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-3">
                                                            <div className="group">
                                                                <p className="text-xs text-gray-500">Full Name</p>
                                                                <p className="font-medium text-gray-800 group-hover:text-[#0D614E] transition-colors">{patient.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Date of Birth</p>
                                                                <p className="font-medium text-gray-800">{patient.dob}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Age / Gender</p>
                                                                <p className="font-medium text-gray-800">{patient.age} years • {patient.gender}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Blood Group</p>
                                                                <p className="font-medium text-gray-800">{patient.bloodGroup}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs text-gray-500">Phone Number</p>
                                                                <div className="flex items-center space-x-2 group">
                                                                    <Phone size={14} className="text-gray-400 group-hover:text-[#0D614E]" />
                                                                    <p className="font-medium text-gray-800">{patient.phone}</p>
                                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#0D614E]">Copy</button>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Email Address</p>
                                                                <div className="flex items-center space-x-2">
                                                                    <Mail size={14} className="text-gray-400" />
                                                                    <p className="font-medium text-gray-800">{patient.email}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Address</p>
                                                                <div className="flex items-start space-x-2">
                                                                    <MapPin size={14} className="text-gray-400 mt-0.5" />
                                                                    <p className="font-medium text-gray-800">{patient.address}, {patient.city}, {patient.state} - {patient.pincode}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Vital Signs Card - Enhanced with Trends */}
                                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                                            <button
                                                onClick={() => toggleSection('vitals')}
                                                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                                    <HeartPulse size={20} style={{ color: '#0D614E' }} />
                                                    <span>Vital Signs</span>
                                                </h3>
                                                <ChevronDown size={20} className={`transition-transform ${expandedSections.vitals ? '' : '-rotate-90'}`} />
                                            </button>
                                            {expandedSections.vitals && (
                                                <div className="p-4 pt-0 border-t border-gray-100">
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                                        <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                                            <p className="text-xs text-gray-500">Blood Pressure</p>
                                                            <p className="text-lg font-bold text-gray-800">{patient.vitals?.bloodPressure || 'N/A'}</p>
                                                            <p className="text-xs text-green-600">Normal</p>
                                                        </div>
                                                        <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                                            <p className="text-xs text-gray-500">Pulse Rate</p>
                                                            <p className="text-lg font-bold text-gray-800">{patient.vitals?.pulse || 'N/A'} bpm</p>
                                                            <p className="text-xs text-green-600">Normal</p>
                                                        </div>
                                                        <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                                            <p className="text-xs text-gray-500">Respiration</p>
                                                            <p className="text-lg font-bold text-gray-800">{patient.vitals?.respiration || 'N/A'}/min</p>
                                                            <p className="text-xs text-green-600">Normal</p>
                                                        </div>
                                                        <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                                            <p className="text-xs text-gray-500">Temperature</p>
                                                            <p className="text-lg font-bold text-gray-800">{patient.vitals?.temperature || 'N/A'}°F</p>
                                                            <p className="text-xs text-green-600">Normal</p>
                                                        </div>
                                                        <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                                            <p className="text-xs text-gray-500">Blood Sugar</p>
                                                            <p className="text-lg font-bold text-gray-800">{patient.vitals?.bloodSugar || 'N/A'} mg/dL</p>
                                                            <p className="text-xs text-yellow-600">Borderline</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Upcoming Appointments */}
                                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                                            <div className="p-4 border-b border-gray-100">
                                                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                                                    <Calendar size={20} style={{ color: '#0D614E' }} />
                                                    <span>Upcoming Appointments</span>
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="space-y-3">
                                                    {upcomingAppointments.map((apt) => {
                                                        const statusBadge = getAppointmentStatusBadge(apt.status);
                                                        const StatusIcon = statusBadge.icon;
                                                        return (
                                                            <div key={apt.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                        <Calendar size={18} className="text-emerald-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-gray-800">{apt.type} with {apt.doctor}</p>
                                                                        <div className="flex items-center space-x-3 mt-1">
                                                                            <div className="flex items-center space-x-1">
                                                                                <Calendar size={12} className="text-gray-400" />
                                                                                <span className="text-xs text-gray-600">{apt.date}</span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-1">
                                                                                <Clock size={12} className="text-gray-400" />
                                                                                <span className="text-xs text-gray-600">{apt.time}</span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-1">
                                                                                <ClockIcon size={12} className="text-gray-400" />
                                                                                <span className="text-xs text-gray-600">{apt.duration}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                                        <StatusIcon size={10} />
                                                                        <span className="capitalize">{apt.status}</span>
                                                                    </span>
                                                                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                                                        <MoreHorizontal size={14} className="text-gray-400" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <button className="mt-4 w-full py-2 text-sm font-medium text-[#0D614E] border-t border-gray-100 pt-4 hover:bg-gray-50 rounded-lg transition-colors">
                                                    View All Appointments
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Dosha Analysis */}
                                    <div className="space-y-6">
                                        {/* Dosha Analysis Card - Enhanced */}
                                        <div className={`bg-gradient-to-br ${doshaInfo.gradient} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">Dosha Analysis</h3>
                                                    <p className="text-xs opacity-80">Ayurvedic Constitution</p>
                                                </div>
                                                <DoshaIcon size={32} className="opacity-90" />
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs opacity-80">Primary Dosha</p>
                                                    <p className="text-2xl font-bold">{patient.dosha}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs opacity-80">Constitution (Prakriti)</p>
                                                    <p className="font-semibold text-lg">{patient.constitution}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs opacity-80">Description</p>
                                                    <p className="text-sm leading-relaxed">{doshaInfo.description}</p>
                                                </div>
                                                <div className="pt-2">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Sparkles size={14} />
                                                        <p className="text-xs font-semibold">Recommended Actions</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {doshaInfo.lifestyle.slice(0, 2).map((item, idx) => (
                                                            <span key={idx} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">{item}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Diet Recommendations */}
                                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <div className="p-2 rounded-lg bg-emerald-50">
                                                    <Leaf size={18} style={{ color: '#0D614E' }} />
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Diet Recommendations</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 mb-2">FOODS TO PREFER</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {doshaInfo.foods.slice(0, 4).map((food, idx) => (
                                                            <span key={idx} className="inline-flex items-center space-x-1 text-sm text-gray-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                                <CheckCircle size={12} className="text-emerald-500" />
                                                                <span>{food}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 mb-2">FOODS TO AVOID</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {doshaInfo.avoid.slice(0, 4).map((food, idx) => (
                                                            <span key={idx} className="inline-flex items-center space-x-1 text-sm text-gray-600 bg-rose-50 px-2 py-1 rounded-full">
                                                                <X size={12} className="text-rose-500" />
                                                                <span>{food}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Herbal Recommendations */}
                                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <div className="p-2 rounded-lg bg-purple-50">
                                                    <Sparkles size={18} className="text-purple-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Herbal Recommendations</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {doshaInfo.herbs.map((herb, idx) => (
                                                    <span key={idx} className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors cursor-pointer">
                                                        {herb}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Yoga Recommendations */}
                                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <div className="p-2 rounded-lg bg-indigo-50">
                                                    <Activity size={18} className="text-indigo-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Yoga Recommendations</h3>
                                            </div>
                                            <div className="space-y-2">
                                                {doshaInfo.yoga.map((pose, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <ChevronRight size={12} className="text-indigo-500" />
                                                        <span>{pose}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Emergency Contact */}
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="p-1 rounded-full bg-amber-100">
                                                    <AlertCircle size={16} className="text-amber-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Emergency Contact</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Contact Person</span>
                                                    <span className="font-medium text-gray-800">{patient.emergencyName}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Relationship</span>
                                                    <span className="font-medium text-gray-800">Spouse</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Phone Number</span>
                                                    <span className="font-medium text-gray-800 flex items-center space-x-1">
                                                        <Phone size={12} />
                                                        <span>{patient.emergencyContact}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Medical History Tab - Enhanced */}
                        {activeTab === 'medical' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Current Medications */}
                                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                            <div className="p-1 rounded-lg bg-emerald-100">
                                                <Pill size={18} style={{ color: '#0D614E' }} />
                                            </div>
                                            <span>Current Medications</span>
                                        </h3>
                                        <div className="space-y-3">
                                            {patient.currentMedications?.map((med, idx) => (
                                                <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                            <Pill size={14} className="text-emerald-600" />
                                                        </div>
                                                        <span className="font-medium text-gray-800">{med}</span>
                                                    </div>
                                                    <button className="text-xs text-[#0D614E] hover:underline flex items-center space-x-1">
                                                        <Eye size={12} />
                                                        <span>Details</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Allergies */}
                                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                            <div className="p-1 rounded-lg bg-amber-100">
                                                <AlertCircle size={18} className="text-amber-600" />
                                            </div>
                                            <span>Allergies</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {patient.allergies?.map((allergy, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium flex items-center space-x-1">
                                                    <XCircle size={12} />
                                                    <span>{allergy}</span>
                                                </span>
                                            ))}
                                            {(!patient.allergies || patient.allergies.length === 0) && (
                                                <p className="text-sm text-gray-500">No known allergies</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Past Treatments - Enhanced */}
                                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                            <div className="p-1 rounded-lg bg-purple-100">
                                                <Scissors size={18} className="text-purple-600" />
                                            </div>
                                            <span>Past Treatments</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {patient.pastTreatments?.map((treatment, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors cursor-pointer">
                                                    {treatment}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Lifestyle - Enhanced */}
                                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                            <div className="p-1 rounded-lg bg-blue-100">
                                                <Heart size={18} className="text-blue-600" />
                                            </div>
                                            <span>Lifestyle Assessment</span>
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Diet</span>
                                                    <span className="font-medium text-gray-800">{patient.lifestyle?.diet}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Exercise</span>
                                                    <span className="font-medium text-gray-800">{patient.lifestyle?.exercise}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Sleep</span>
                                                    <span className="font-medium text-gray-800">{patient.lifestyle?.sleep}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Stress Level</span>
                                                    <div className="flex items-center space-x-1">
                                                        {patient.lifestyle?.stress === 'Low' && <Smile size={14} className="text-emerald-500" />}
                                                        {patient.lifestyle?.stress === 'Moderate' && <Meh size={14} className="text-yellow-500" />}
                                                        {patient.lifestyle?.stress === 'High' && <Frown size={14} className="text-rose-500" />}
                                                        <span className="font-medium text-gray-800">{patient.lifestyle?.stress}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Water Intake</span>
                                                    <span className="font-medium text-gray-800">{patient.lifestyle?.waterIntake || '7 glasses'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Meditation</span>
                                                    <span className="font-medium text-gray-800">{patient.lifestyle?.meditation || 'Not regular'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor's Notes - Enhanced */}
                                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                        <div className="p-1 rounded-lg bg-indigo-100">
                                            <Clipboard size={18} className="text-indigo-600" />
                                        </div>
                                        <span>Clinical Notes</span>
                                    </h3>
                                    <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-[#0D614E]">
                                        <p className="text-gray-700 text-sm leading-relaxed">{patient.notes}</p>
                                        <p className="text-xs text-gray-400 mt-2">Last updated: {patient.lastVisit}</p>
                                    </div>
                                    <textarea
                                        placeholder="Add a new clinical note..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E] resize-none transition-all"
                                        rows="3"
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            onClick={() => {
                                                if (newNote.trim()) {
                                                    showNotification('Note added successfully');
                                                    setNewNote('');
                                                }
                                            }}
                                            className="px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm hover:bg-opacity-90 transition-all flex items-center space-x-2"
                                        >
                                            <Plus size={14} />
                                            <span>Add Note</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Prescriptions Tab - Enhanced */}
                        {activeTab === 'prescriptions' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Prescription History</h3>
                                        <p className="text-sm text-gray-500">Manage and track all medications</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPrescriptionModal(true)}
                                        className="px-4 py-2 bg-[#0D614E] text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition-all hover:shadow-md"
                                    >
                                        <Plus size={16} />
                                        <span>New Prescription</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {prescriptions.map((prescription) => (
                                        <div key={prescription.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <Pill size={18} className="text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Prescribed on</p>
                                                        <p className="font-semibold text-gray-800">{prescription.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${prescription.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {prescription.status === 'active' ? 'Active' : 'Completed'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">By: {prescription.prescribedBy}</span>
                                                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                                                        <MoreHorizontal size={16} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {prescription.medicines.map((med, idx) => (
                                                    <div key={idx} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <p className="text-xs text-gray-500">Medicine</p>
                                                                <p className="font-semibold text-gray-800">{med.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Dosage</p>
                                                                <p className="font-medium text-gray-700">{med.dosage}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Frequency</p>
                                                                <p className="font-medium text-gray-700">{med.frequency}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Duration</p>
                                                                <p className="font-medium text-gray-700">{med.duration}</p>
                                                            </div>
                                                        </div>
                                                        {med.timing && (
                                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                                <p className="text-xs text-gray-500">Timing</p>
                                                                <p className="text-sm text-gray-700">{med.timing}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {prescription.notes && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex items-start space-x-2">
                                                        <Clipboard size={14} className="text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Instructions</p>
                                                            <p className="text-sm text-gray-700">{prescription.notes}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {prescription.refillRemaining > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <RefreshCw size={14} className="text-emerald-600" />
                                                            <span className="text-xs text-gray-600">Refills remaining: {prescription.refillRemaining}</span>
                                                        </div>
                                                        <button className="text-xs text-[#0D614E] hover:underline">Request Refill</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Visit History Tab - Enhanced Timeline */}
                        {activeTab === 'visits' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Visit History</h3>
                                        <p className="text-sm text-gray-500">Complete consultation timeline</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all">
                                        <Download size={16} />
                                        <span>Export Visits</span>
                                    </button>
                                </div>

                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0D614E] to-gray-300"></div>

                                    {visitHistory.map((visit, idx) => (
                                        <div key={idx} className="relative pl-14 pb-8 last:pb-0 group">
                                            {/* Timeline dot */}
                                            <div className="absolute left-4 top-0 w-4 h-4 rounded-full bg-[#0D614E] border-4 border-white shadow-lg group-hover:scale-125 transition-transform"></div>

                                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 hover:shadow-lg transition-all border border-gray-200">
                                                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                                                    <div>
                                                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${visit.type === 'Consultation' ? 'bg-blue-100 text-blue-700' :
                                                                    visit.type === 'Follow-up' ? 'bg-emerald-100 text-emerald-700' :
                                                                        'bg-purple-100 text-purple-700'
                                                                }`}>
                                                                {visit.type}
                                                            </span>
                                                            <span className="text-sm text-gray-500">by {visit.doctor}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-4 mt-2 flex-wrap gap-2">
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar size={14} className="text-gray-400" />
                                                                <span className="text-sm text-gray-600">{visit.date}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <DollarSign size={14} className="text-gray-400" />
                                                                <span className="text-sm text-gray-600">₹{visit.fee}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="text-[#0D614E] text-sm hover:underline flex items-center space-x-1">
                                                        <Eye size={12} />
                                                        <span>View Details</span>
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2">Concerns Discussed</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {visit.concerns.map((concern, cidx) => (
                                                                <span key={cidx} className="text-sm bg-white px-2 py-1 rounded-lg text-gray-700 shadow-sm">
                                                                    {concern}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                                                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                            <p className="text-xs text-gray-500">BP</p>
                                                            <p className="font-semibold text-gray-800">{visit.vitals.bp}</p>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                            <p className="text-xs text-gray-500">Pulse</p>
                                                            <p className="font-semibold text-gray-800">{visit.vitals.pulse} bpm</p>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                            <p className="text-xs text-gray-500">Weight</p>
                                                            <p className="font-semibold text-gray-800">{visit.vitals.weight}</p>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                            <p className="text-xs text-gray-500">Temp</p>
                                                            <p className="font-semibold text-gray-800">{visit.vitals.temperature}°F</p>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                            <p className="text-xs text-gray-500">Oxygen</p>
                                                            <p className="font-semibold text-gray-800">{visit.vitals.oxygen || '98%'}</p>
                                                        </div>
                                                    </div>

                                                    {visit.notes && (
                                                        <div className="bg-white rounded-lg p-3 mt-2">
                                                            <p className="text-xs text-gray-500 mb-1">Doctor's Notes</p>
                                                            <p className="text-sm text-gray-700">{visit.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Lab Reports Tab - Enhanced */}
                        {activeTab === 'reports' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Laboratory Reports</h3>
                                        <p className="text-sm text-gray-500">Test results and diagnostics</p>
                                    </div>
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="px-4 py-2 bg-[#0D614E] text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition-all hover:shadow-md"
                                    >
                                        <Upload size={16} />
                                        <span>Upload Report</span>
                                    </button>
                                </div>

                                {/* Report Categories */}
                                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                                    {['All', 'Blood Test', 'Hormone', 'Cholesterol', 'Liver', 'Vitamins'].map((cat) => (
                                        <button key={cat} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${cat === 'All' ? 'bg-[#0D614E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {labReports.map((report) => (
                                        <div key={report.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 hover:shadow-lg transition-all border border-gray-200 group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-12 h-12 rounded-lg bg-[#0D614E] bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <FileText size={24} style={{ color: '#0D614E' }} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 group-hover:text-[#0D614E] transition-colors">{report.name}</p>
                                                        <p className="text-xs text-gray-500">{report.category} • {report.date}</p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${report.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' :
                                                                    report.status === 'Borderline' ? 'bg-yellow-100 text-yellow-700' :
                                                                        report.status === 'High' ? 'bg-rose-100 text-rose-700' :
                                                                            'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                {report.status}
                                                            </span>
                                                            <span className="text-xs text-gray-400">{report.size}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">Ordered by: {report.doctor}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                                                        <DownloadIcon size={16} className="text-gray-500" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                                                        <Eye size={16} className="text-gray-500" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                                                        <Share2 size={16} className="text-gray-500" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Progress indicator */}
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-200 rounded-full h-1">
                                                    <div
                                                        className={`h-1 rounded-full ${report.status === 'Normal' ? 'bg-emerald-500' :
                                                                report.status === 'Borderline' ? 'bg-yellow-500' :
                                                                    'bg-rose-500'
                                                            }`}
                                                        style={{ width: '100%' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages Tab - Enhanced Chat */}
                        {activeTab === 'messages' && (
                            <div className="flex flex-col h-[550px]">
                                {/* Chat Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white font-semibold">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{patient.name}</p>
                                            <p className="text-xs text-green-600">Active now</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Video Call">
                                            <Video size={18} className="text-gray-600" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voice Call">
                                            <PhoneCall size={18} className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4 scrollbar-thin scrollbar-thumb-gray-300">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                        >
                                            <div className={`max-w-[70%] rounded-xl p-3 ${message.sender === 'doctor'
                                                    ? 'bg-gradient-to-r from-[#0D614E] to-[#0a4d3e] text-white'
                                                    : 'bg-gray-100 text-gray-800'
                                                } shadow-sm`}>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs font-medium opacity-80">{message.name}</span>
                                                    <span className="text-xs opacity-60">{message.time.split(' ')[1]}</span>
                                                </div>
                                                <p className="text-sm">{message.message}</p>
                                                {!message.read && message.sender === 'patient' && (
                                                    <div className="flex justify-end mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Paperclip size={18} className="text-gray-500" />
                                        </button>
                                        <input
                                            id="message-input"
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E] transition-all"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                            className="p-2 rounded-lg text-white transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: '#0D614E' }}
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                                        <Lock size={10} />
                                        <span>Messages are encrypted and secure</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Share Patient Data</h3>
                            <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleShare('copy')}
                                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <div className="flex items-center space-x-3">
                                    <Copy size={18} className="text-gray-500" />
                                    <span>Copy to Clipboard</span>
                                </div>
                                {copied && <Check size={18} className="text-emerald-500" />}
                            </button>
                            <button
                                onClick={() => handleShare('email')}
                                className="w-full flex items-center space-x-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <Mail size={18} className="text-gray-500" />
                                <span>Share via Email</span>
                            </button>
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="w-full flex items-center space-x-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <MessageCircle size={18} className="text-green-500" />
                                <span>Share via WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Export Patient Data</h3>
                            <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleDownloadReport('json')}
                                className="w-full flex items-center space-x-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <FileJson size={18} className="text-blue-500" />
                                <span>Export as JSON (Full Data)</span>
                            </button>
                            <button
                                onClick={() => handleDownloadReport('csv')}
                                className="w-full flex items-center space-x-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <FileSpreadsheet size={18} className="text-green-500" />
                                <span>Export Visits as CSV</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Prescription Modal - Enhanced */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto animate-fade-in">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">New Prescription</h3>
                                <p className="text-sm text-gray-500 mt-1">Add new medication for the patient</p>
                            </div>
                            <button onClick={() => setShowPrescriptionModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Date</label>
                                    <input
                                        type="date"
                                        value={newPrescription.date}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                                    {newPrescription.medicines.map((med, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Medicine name *"
                                                    value={med.name}
                                                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dosage (e.g., 1 tsp, 500mg)"
                                                    value={med.dosage}
                                                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Frequency (e.g., Twice daily)"
                                                    value={med.frequency}
                                                    onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Duration (e.g., 2 weeks)"
                                                    value={med.duration}
                                                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Timing (e.g., After meals)"
                                                    value={med.timing}
                                                    onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                                                    className="md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                />
                                            </div>
                                            {index > 0 && (
                                                <button
                                                    onClick={() => removeMedicineField(index)}
                                                    className="text-sm text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Remove medicine</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={addMedicineField}
                                        className="text-sm text-[#0D614E] hover:underline flex items-center space-x-1"
                                    >
                                        <Plus size={14} />
                                        <span>Add Another Medicine</span>
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Notes</label>
                                    <textarea
                                        rows="3"
                                        value={newPrescription.notes}
                                        onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                                        placeholder="Add instructions for the patient (e.g., Take with warm water, avoid cold drinks)"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPrescriptionModal(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPrescription}
                                className="px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90 transition-all hover:shadow-md"
                            >
                                Add Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Upload Lab Report</h3>
                                <p className="text-sm text-gray-500 mt-1">Add new test results</p>
                            </div>
                            <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Complete Blood Count"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                    <option>Blood Test</option>
                                    <option>Hormone Test</option>
                                    <option>Imaging</option>
                                    <option>Pathology</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0D614E] transition-colors cursor-pointer group">
                                    <Upload size={32} className="mx-auto text-gray-400 mb-2 group-hover:text-[#0D614E] transition-colors" />
                                    <p className="text-sm text-gray-500">Click or drag file to upload</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90 transition-all hover:shadow-md"
                            >
                                Upload Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Schedule Appointment</h3>
                                <p className="text-sm text-gray-500 mt-1">Book a new consultation</p>
                            </div>
                            <button onClick={() => setShowAppointmentModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                    <option>Consultation</option>
                                    <option>Follow-up</option>
                                    <option>Therapy Session</option>
                                    <option>Panchakarma</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                    <option>09:00 AM - 09:30 AM</option>
                                    <option>10:00 AM - 10:30 AM</option>
                                    <option>11:00 AM - 11:30 AM</option>
                                    <option>02:00 PM - 02:30 PM</option>
                                    <option>03:00 PM - 03:30 PM</option>
                                    <option>04:00 PM - 04:30 PM</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Consultation</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                    <option>In-person</option>
                                    <option>Video Call</option>
                                    <option>Phone Call</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                                <textarea
                                    rows="3"
                                    placeholder="Brief description of symptoms or concerns..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowAppointmentModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90 transition-all hover:shadow-md"
                            >
                                Schedule Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDetails;