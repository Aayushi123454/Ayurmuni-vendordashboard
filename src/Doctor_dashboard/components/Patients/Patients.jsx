import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Filter,
    Download,
    Upload,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Activity,
    Heart,
    Brain,
    Wind,
    Sun,
    Moon,
    Droplet,
    Stethoscope,
    Pill,
    FileText,
    Clock,
    MessageCircle,
    Star,
    Award,
    TrendingUp,
    TrendingDown,
    MoreVertical,
    X,
    CheckCircle,
    AlertCircle,
    UserCheck,
    UserX,
    Baby,
    Male,
    Female,
    CalendarDays,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    Printer,
    Share2,
    Link,
    QrCode,
    Shield,
    Lock,
    Bell,
    Settings,
    BarChart3,
    PieChart,
    LineChart,
    Activity as ActivityIcon,
    Clipboard,
    ClipboardList,
    Prescription,
    Syringe,
    Thermometer,
    Weight,
    Ruler,
    HeartPulse,
    Brain as BrainIcon,
    Sparkles,
    Leaf,
    Flower2,
    TreeDeciduous,
    XCircle,
    Grid3x3,
    User,
    Loader2
} from 'lucide-react';

// Import the PatientDetails component
import PatientDetails from './PatientDetails';

const PatientManagement = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientDetails, setShowPatientDetails] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDosha, setFilterDosha] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Sample patients data with enhanced details
    const [patients, setPatients] = useState([
        {
            id: 1,
            name: 'Priya Sharma',
            age: 34,
            gender: 'Female',
            dob: '1990-03-15',
            phone: '+91 98765 43210',
            email: 'priya.sharma@email.com',
            address: '123 Green Valley, Mumbai',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            dosha: 'Vata',
            constitution: 'Vata-Pitta',
            height: '5.4 ft',
            weight: '58 kg',
            bloodGroup: 'O+',
            occupation: 'Software Engineer',
            maritalStatus: 'Married',
            emergencyContact: '+91 98765 43211',
            emergencyName: 'Rahul Sharma',
            firstVisit: '2023-06-10',
            lastVisit: '2024-01-10',
            totalVisits: 8,
            status: 'active',
            healthScore: 85,
            concerns: ['Digestive Issues', 'Anxiety', 'Sleep Problems'],
            allergies: ['Dairy', 'Wheat'],
            currentMedications: ['Triphala', 'Ashwagandha'],
            pastTreatments: ['Panchakarma', 'Shirodhara'],
            lifestyle: {
                diet: 'Vegetarian',
                exercise: 'Yoga 3x/week',
                sleep: '7 hours',
                stress: 'Moderate',
                waterIntake: '2-3 liters',
                mealPattern: 'Regular'
            },
            vitals: {
                bloodPressure: '120/80',
                pulse: '72',
                respiration: '16',
                temperature: '98.6',
                bloodSugar: '95',
                cholesterol: '180'
            },
            notes: 'Patient responding well to treatment. Need to continue medication for 2 more weeks.',
            nextFollowUp: '2024-01-25',
            profileImage: null,
            insuranceInfo: 'Star Health - Policy No: SH123456',
            paymentHistory: [
                { date: '2024-01-10', amount: 1500, status: 'paid' },
                { date: '2023-12-25', amount: 1500, status: 'paid' }
            ]
        },
        {
            id: 2,
            name: 'Rajesh Kumar',
            age: 42,
            gender: 'Male',
            dob: '1982-08-22',
            phone: '+91 98765 43211',
            email: 'rajesh.k@email.com',
            address: '456 Palm Grove, Delhi',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            dosha: 'Pitta',
            constitution: 'Pitta-Kapha',
            height: '5.8 ft',
            weight: '78 kg',
            bloodGroup: 'B+',
            occupation: 'Business Owner',
            maritalStatus: 'Married',
            emergencyContact: '+91 98765 43212',
            emergencyName: 'Neha Kumar',
            firstVisit: '2023-08-15',
            lastVisit: '2024-01-12',
            totalVisits: 6,
            status: 'active',
            healthScore: 72,
            concerns: ['Joint Pain', 'Acidity', 'Stress'],
            allergies: ['None'],
            currentMedications: ['Yograj Guggul', 'Dashmool'],
            pastTreatments: ['Ayurvedic Massage'],
            lifestyle: {
                diet: 'Non-Vegetarian',
                exercise: 'Walking daily',
                sleep: '6 hours',
                stress: 'High',
                waterIntake: '1-2 liters',
                mealPattern: 'Irregular'
            },
            vitals: {
                bloodPressure: '130/85',
                pulse: '78',
                respiration: '18',
                temperature: '98.4',
                bloodSugar: '110',
                cholesterol: '210'
            },
            notes: 'Has chronic knee pain. Recommended regular oil massage.',
            nextFollowUp: '2024-01-20',
            profileImage: null,
            insuranceInfo: 'ICICI Lombard - Policy No: IL789012',
            paymentHistory: [
                { date: '2024-01-12', amount: 1500, status: 'paid' },
                { date: '2023-12-28', amount: 1500, status: 'paid' }
            ]
        }
        // ... more patients data
    ]);

    const [newPatient, setNewPatient] = useState({
        name: '',
        age: '',
        gender: 'Female',
        dob: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        dosha: 'Vata',
        constitution: 'Vata-Pitta',
        height: '',
        weight: '',
        bloodGroup: 'O+',
        occupation: '',
        maritalStatus: 'Single',
        emergencyContact: '',
        emergencyName: '',
        concerns: [],
        allergies: [],
        lifestyle: {
            diet: 'Vegetarian',
            exercise: '',
            sleep: '',
            stress: 'Moderate',
            waterIntake: '',
            mealPattern: ''
        },
        notes: ''
    });

    // Statistics
    const stats = {
        total: patients.length,
        active: patients.filter(p => p.status === 'active').length,
        inactive: patients.filter(p => p.status === 'inactive').length,
        newThisMonth: patients.filter(p => {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return new Date(p.firstVisit) > lastMonth;
        }).length,
        avgHealthScore: Math.round(patients.reduce((sum, p) => sum + p.healthScore, 0) / patients.length),
        doshaDistribution: {
            Vata: patients.filter(p => p.dosha === 'Vata').length,
            Pitta: patients.filter(p => p.dosha === 'Pitta').length,
            Kapha: patients.filter(p => p.dosha === 'Kapha').length,
            'Vata-Pitta': patients.filter(p => p.dosha === 'Vata-Pitta').length,
            'Pitta-Kapha': patients.filter(p => p.dosha === 'Pitta-Kapha').length,
            'Kapha-Vata': patients.filter(p => p.dosha === 'Kapha-Vata').length
        },
        totalRevenue: patients.reduce((sum, p) => sum + (p.totalVisits * 1500), 0)
    };

    // Filter and sort patients
    const filteredPatients = patients
        .filter(patient => {
            const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.phone.includes(searchTerm) ||
                patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (patient.concerns && patient.concerns.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));
            const matchesDosha = filterDosha === 'all' || patient.dosha === filterDosha;
            const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
            return matchesSearch && matchesDosha && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'age') return a.age - b.age;
            if (sortBy === 'lastVisit') return new Date(b.lastVisit) - new Date(a.lastVisit);
            if (sortBy === 'healthScore') return b.healthScore - a.healthScore;
            return 0;
        });

    // Get dosha icon and color
    const getDoshaInfo = (dosha) => {
        switch (dosha) {
            case 'Vata':
                return { icon: Wind, color: 'bg-purple-100 text-purple-700', bg: '#f3e8ff' };
            case 'Pitta':
                return { icon: Sun, color: 'bg-orange-100 text-orange-700', bg: '#ffedd5' };
            case 'Kapha':
                return { icon: Moon, color: 'bg-blue-100 text-blue-700', bg: '#dbeafe' };
            default:
                return { icon: Activity, color: 'bg-gray-100 text-gray-700', bg: '#f3f4f6' };
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        if (status === 'active') {
            return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Active' };
        }
        return { color: 'bg-gray-100 text-gray-700', icon: UserX, label: 'Inactive' };
    };

    // Handle view patient details
    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
        setShowPatientDetails(true);
    };

    // Handle edit from details page
    const handleEditFromDetails = (patient) => {
        setSelectedPatient(null);
        setShowPatientDetails(false);
        setEditingPatient(patient);
        setShowModal(true);
    };

    // CRUD Operations
    const handleAddPatient = () => {
        if (!newPatient.name || !newPatient.phone) {
            showToast('Please fill required fields', 'error');
            return;
        }

        const newId = Math.max(...patients.map(p => p.id), 0) + 1;
        const patient = {
            id: newId,
            ...newPatient,
            firstVisit: new Date().toISOString().split('T')[0],
            lastVisit: new Date().toISOString().split('T')[0],
            totalVisits: 1,
            status: 'active',
            healthScore: 75,
            vitals: {
                bloodPressure: '',
                pulse: '',
                respiration: '',
                temperature: '',
                bloodSugar: '',
                cholesterol: ''
            },
            paymentHistory: []
        };

        setPatients([...patients, patient]);
        setShowModal(false);
        resetNewPatientForm();
        showToast('Patient added successfully', 'success');
    };

    const handleUpdatePatient = () => {
        if (!editingPatient) return;

        setPatients(patients.map(p =>
            p.id === editingPatient.id ? editingPatient : p
        ));
        setEditingPatient(null);
        setShowModal(false);
        showToast('Patient updated successfully', 'success');
    };

    const handleDeletePatient = (id) => {
        setPatients(patients.filter(p => p.id !== id));
        setShowDeleteConfirm(null);
        setSelectedPatients(selectedPatients.filter(pid => pid !== id));
        showToast('Patient deleted successfully', 'success');
    };

    const handleBulkDelete = () => {
        setPatients(patients.filter(p => !selectedPatients.includes(p.id)));
        setSelectedPatients([]);
        setShowBulkActions(false);
        showToast(`${selectedPatients.length} patients deleted successfully`, 'success');
    };

    const handleToggleSelect = (id) => {
        if (selectedPatients.includes(id)) {
            setSelectedPatients(selectedPatients.filter(pid => pid !== id));
        } else {
            setSelectedPatients([...selectedPatients, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedPatients.length === filteredPatients.length) {
            setSelectedPatients([]);
        } else {
            setSelectedPatients(filteredPatients.map(p => p.id));
        }
    };

    const resetNewPatientForm = () => {
        setNewPatient({
            name: '',
            age: '',
            gender: 'Female',
            dob: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            dosha: 'Vata',
            constitution: 'Vata-Pitta',
            height: '',
            weight: '',
            bloodGroup: 'O+',
            occupation: '',
            maritalStatus: 'Single',
            emergencyContact: '',
            emergencyName: '',
            concerns: [],
            allergies: [],
            lifestyle: {
                diet: 'Vegetarian',
                exercise: '',
                sleep: '',
                stress: 'Moderate',
                waterIntake: '',
                mealPattern: ''
            },
            notes: ''
        });
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Name', 'Age', 'Gender', 'Phone', 'Email', 'Dosha', 'Status', 'Health Score', 'Total Visits', 'Last Visit'];
        const csvData = filteredPatients.map(p => [
            p.name,
            p.age,
            p.gender,
            p.phone,
            p.email,
            p.dosha,
            p.status,
            p.healthScore,
            p.totalVisits,
            p.lastVisit
        ]);

        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patients_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        showToast('Patients exported successfully', 'success');
    };

    // Show toast notification
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <>
            {!showPatientDetails && !selectedPatient && (
                <div className="min-h-screen ">
                    {/* Toast Notification */}
                    {toast && (
                        <div className="fixed top-4 right-4 z-50 animate-slide-in">
                            <div className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 ${toast.type === 'success' ? 'bg-emerald-500' :
                                toast.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                                } text-white`}>
                                {toast.type === 'success' ? <CheckCircle size={20} /> :
                                    toast.type === 'error' ? <XCircle size={20} /> : <AlertCircle size={20} />}
                                <span>{toast.message}</span>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="border-b border-gray-200 sticky top-0 z-20">
                        <div className="px-8 py-6 pt-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
                                    <p className="text-gray-500 mt-1">Manage and track all patient information</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingPatient(null);
                                        setShowModal(true);
                                    }}
                                    className="px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm hover:shadow-md transition-all"
                                    style={{ backgroundColor: '#0D614E', color: 'white' }}
                                >
                                    <Plus size={18} />
                                    <span>Add New Patient</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-8">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                            {/* Stats cards - same as before */}
                            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Patients</p>
                                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                        <div className="flex items-center space-x-1 mt-2">
                                            <TrendingUp size={12} className="text-emerald-600" />
                                            <span className="text-xs text-emerald-600">+{stats.newThisMonth} this month</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                        <Users size={20} style={{ color: '#0D614E' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm">Active Patients</p>
                                        <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
                                        <p className="text-xs text-gray-500 mt-2">{stats.inactive} inactive</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                        <UserCheck size={20} className="text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm">Avg. Health Score</p>
                                        <p className="text-2xl font-bold text-gray-800">{stats.avgHealthScore}</p>
                                        <div className="flex items-center space-x-1 mt-2">
                                            <Star size={12} className="text-yellow-400 fill-current" />
                                            <span className="text-xs text-gray-500">out of 100</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                                        <Activity size={20} className="text-yellow-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 mt-2">from consultations</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <DollarSign size={20} className="text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm">Dosha Distribution</p>
                                        <p className="text-sm font-semibold text-gray-800 mt-1">
                                            V: {stats.doshaDistribution.Vata} |
                                            P: {stats.doshaDistribution.Pitta} |
                                            K: {stats.doshaDistribution.Kapha}
                                        </p>
                                        <div className="w-full h-1 bg-gray-200 rounded-full mt-2 flex overflow-hidden">
                                            <div className="h-full bg-purple-500" style={{ width: `${(stats.doshaDistribution.Vata / stats.total) * 100}%` }}></div>
                                            <div className="h-full bg-orange-500" style={{ width: `${(stats.doshaDistribution.Pitta / stats.total) * 100}%` }}></div>
                                            <div className="h-full bg-blue-500" style={{ width: `${(stats.doshaDistribution.Kapha / stats.total) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <Wind size={20} className="text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters and Search */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex-1 min-w-[250px]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by name, phone, email, or concerns..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <select
                                        value={filterDosha}
                                        onChange={(e) => setFilterDosha(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                    >
                                        <option value="all">All Doshas</option>
                                        <option value="Vata">Vata</option>
                                        <option value="Pitta">Pitta</option>
                                        <option value="Kapha">Kapha</option>
                                        <option value="Vata-Pitta">Vata-Pitta</option>
                                        <option value="Pitta-Kapha">Pitta-Kapha</option>
                                        <option value="Kapha-Vata">Kapha-Vata</option>
                                    </select>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="age">Sort by Age</option>
                                        <option value="lastVisit">Sort by Last Visit</option>
                                        <option value="healthScore">Sort by Health Score</option>
                                    </select>

                                    <button
                                        onClick={exportToCSV}
                                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                    >
                                        <Download size={18} />
                                        <span>Export</span>
                                    </button>

                                    {selectedPatients.length > 0 && (
                                        <button
                                            onClick={() => setShowBulkActions(true)}
                                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-2"
                                        >
                                            <Trash2 size={18} />
                                            <span>Delete ({selectedPatients.length})</span>
                                        </button>
                                    )}


                                </div>
                            </div>
                        </div>

                        {/* Patients List View */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            {/* <th className="px-6 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]"
                                            />
                                        </th> */}
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Dosha</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Health Score</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredPatients.map((patient) => {
                                            const doshaInfo = getDoshaInfo(patient.dosha);
                                            const DoshaIcon = doshaInfo.icon;
                                            const statusInfo = getStatusBadge(patient.status);
                                            const StatusIcon = statusInfo.icon;
                                            return (
                                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                                    {/* <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPatients.includes(patient.id)}
                                                        onChange={() => handleToggleSelect(patient.id)}
                                                        className="rounded border-gray-300 text-[#0D614E] focus:ring-[#0D614E]"
                                                    />
                                                </td> */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white font-semibold">
                                                                {patient.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800">{patient.name}</p>
                                                                <p className="text-xs text-gray-500">{patient.age} yrs • {patient.gender}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col space-y-1">
                                                            <div className="flex items-center space-x-1">
                                                                <Phone size={12} className="text-gray-400" />
                                                                <span className="text-sm text-gray-600">{patient.phone}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Mail size={12} className="text-gray-400" />
                                                                <span className="text-xs text-gray-500">{patient.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${doshaInfo.color}`}>
                                                            <DoshaIcon size={12} />
                                                            <span>{patient.dosha}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                <div className="bg-emerald-500 rounded-full h-2" style={{ width: `${patient.healthScore}%` }}></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-800">{patient.healthScore}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                            <StatusIcon size={12} />
                                                            <span>{statusInfo.label}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600">{patient.lastVisit}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleViewPatient(patient)}
                                                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="View Full Details"
                                                            >
                                                                <Eye size={16} className="text-gray-500" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPatient(patient);
                                                                    setShowModal(true);
                                                                }}
                                                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit size={16} className="text-gray-500" />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(patient.id)}
                                                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} className="text-gray-500" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                                        <AlertCircle size={24} className="text-rose-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Delete Patient</h3>
                                </div>
                                <p className="text-gray-600 mb-6">Are you sure you want to delete this patient? This action cannot be undone.</p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleDeletePatient(showDeleteConfirm)}
                                        className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bulk Actions Modal */}
                    {showBulkActions && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                                        <AlertCircle size={24} className="text-rose-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Bulk Delete</h3>
                                </div>
                                <p className="text-gray-600 mb-6">Are you sure you want to delete {selectedPatients.length} patients? This action cannot be undone.</p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                                    >
                                        Delete All
                                    </button>
                                    <button
                                        onClick={() => setShowBulkActions(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add/Edit Patient Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingPatient(null);
                                            resetNewPatientForm();
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <form className="space-y-6">
                                        {/* Personal Information */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                                <User size={18} style={{ color: '#0D614E' }} />
                                                <span>Personal Information</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        value={editingPatient ? editingPatient.name : newPatient.name}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, name: e.target.value }) :
                                                            setNewPatient({ ...newPatient, name: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                                    <input
                                                        type="number"
                                                        value={editingPatient ? editingPatient.age : newPatient.age}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, age: e.target.value }) :
                                                            setNewPatient({ ...newPatient, age: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                                    <select
                                                        value={editingPatient ? editingPatient.gender : newPatient.gender}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, gender: e.target.value }) :
                                                            setNewPatient({ ...newPatient, gender: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    >
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        value={editingPatient ? editingPatient.dob : newPatient.dob}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, dob: e.target.value }) :
                                                            setNewPatient({ ...newPatient, dob: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                                    <input
                                                        type="tel"
                                                        value={editingPatient ? editingPatient.phone : newPatient.phone}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, phone: e.target.value }) :
                                                            setNewPatient({ ...newPatient, phone: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={editingPatient ? editingPatient.email : newPatient.email}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, email: e.target.value }) :
                                                            setNewPatient({ ...newPatient, email: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                                <MapPin size={18} style={{ color: '#0D614E' }} />
                                                <span>Address</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                    <input
                                                        type="text"
                                                        value={editingPatient ? editingPatient.address : newPatient.address}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, address: e.target.value }) :
                                                            setNewPatient({ ...newPatient, address: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                    <input
                                                        type="text"
                                                        value={editingPatient ? editingPatient.city : newPatient.city}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, city: e.target.value }) :
                                                            setNewPatient({ ...newPatient, city: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                    <input
                                                        type="text"
                                                        value={editingPatient ? editingPatient.state : newPatient.state}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, state: e.target.value }) :
                                                            setNewPatient({ ...newPatient, state: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                                    <input
                                                        type="text"
                                                        value={editingPatient ? editingPatient.pincode : newPatient.pincode}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, pincode: e.target.value }) :
                                                            setNewPatient({ ...newPatient, pincode: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ayurvedic Information */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                                <Leaf size={18} style={{ color: '#0D614E' }} />
                                                <span>Ayurvedic Information</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosha</label>
                                                    <select
                                                        value={editingPatient ? editingPatient.dosha : newPatient.dosha}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, dosha: e.target.value }) :
                                                            setNewPatient({ ...newPatient, dosha: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    >
                                                        <option>Vata</option>
                                                        <option>Pitta</option>
                                                        <option>Kapha</option>
                                                        <option>Vata-Pitta</option>
                                                        <option>Pitta-Kapha</option>
                                                        <option>Vata-Kapha</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Constitution</label>
                                                    <select
                                                        value={editingPatient ? editingPatient.constitution : newPatient.constitution}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, constitution: e.target.value }) :
                                                            setNewPatient({ ...newPatient, constitution: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    >
                                                        <option>Vata-Pitta</option>
                                                        <option>Pitta-Kapha</option>
                                                        <option>Kapha-Vata</option>
                                                        <option>Vata-Kapha</option>
                                                        <option>Pitta-Vata</option>
                                                        <option>Kapha-Pitta</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                                    <select
                                                        value={editingPatient ? editingPatient.bloodGroup : newPatient.bloodGroup}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, bloodGroup: e.target.value }) :
                                                            setNewPatient({ ...newPatient, bloodGroup: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    >
                                                        <option>A+</option>
                                                        <option>A-</option>
                                                        <option>B+</option>
                                                        <option>B-</option>
                                                        <option>O+</option>
                                                        <option>O-</option>
                                                        <option>AB+</option>
                                                        <option>AB-</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Emergency Contact */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                                <AlertCircle size={18} style={{ color: '#0D614E' }} />
                                                <span>Emergency Contact</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                                    <input
                                                        type="text"
                                                        value={editingPatient ? editingPatient.emergencyName : newPatient.emergencyName}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, emergencyName: e.target.value }) :
                                                            setNewPatient({ ...newPatient, emergencyName: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={editingPatient ? editingPatient.emergencyContact : newPatient.emergencyContact}
                                                        onChange={(e) => editingPatient ?
                                                            setEditingPatient({ ...editingPatient, emergencyContact: e.target.value }) :
                                                            setNewPatient({ ...newPatient, emergencyContact: e.target.value })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingPatient(null);
                                            resetNewPatientForm();
                                        }}
                                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingPatient ? handleUpdatePatient : handleAddPatient}
                                        className="px-4 py-2 rounded-lg text-white transition-colors"
                                        style={{ backgroundColor: '#0D614E' }}
                                    >
                                        {editingPatient ? 'Update Patient' : 'Add Patient'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Patient Details Modal/Page */}
            {showPatientDetails && selectedPatient && (
                <PatientDetails
                    patient={selectedPatient}
                    onClose={() => {
                        setSelectedPatient(null);
                        setShowPatientDetails(false);
                    }}
                    onEdit={(patient) => {
                        setEditingPatient(patient);
                        setShowModal(true);
                        setSelectedPatient(null);
                    }}
                    onDelete={(id) => {
                        setShowDeleteConfirm(id);
                        setSelectedPatient(null);
                    }}
                />
            )}

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default PatientManagement;