// FinanceDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Wallet,
    CreditCard,
    Banknote,
    Receipt,
    FileText,
    PieChart,
    BarChart3,
    LineChart,
    Activity,
    Users,
    Calendar as CalendarIcon,
    ChevronDown,
    ChevronRight,
    MoreVertical,
    X,
    Printer,
    Mail,
    MessageCircle,
    Phone,
    MapPin,
    User,
    Building,
    Briefcase,
    Star,
    Award,
    TrendingUp as TrendingUpIcon,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Settings,
    Bell,
    Shield,
    Lock,
    Eye as EyeIcon,
    EyeOff,
    Copy,
    Check,
    Send,
    Upload,
    Download as DownloadIcon,
    Filter as FilterIcon,
    SortAsc,
    SortDesc,
    Grid3x3,
    List,
    FileJson,
    FileSpreadsheet,
    FileText as FileTextIcon,
    Printer as PrinterIcon,
    Share2,
    Link,
    QrCode,
    Wallet as WalletIcon,
    PiggyBank,
    Coins,
    Gem,
    Crown,
    Sparkles,
    Leaf,
    Heart,
    Brain,
    Wind,
    Sun,
    Moon,
    Gift,
    Pill,
    Info,
    Target
} from 'lucide-react';

const FinanceDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('month');
    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [chartView, setChartView] = useState('line');
    const [showBalance, setShowBalance] = useState(true);
    const [notification, setNotification] = useState(null);

    // Financial Statistics
    const [stats, setStats] = useState({
        totalRevenue: 284750,
        totalRevenueChange: '+18.5%',
        monthlyRevenue: 48250,
        monthlyRevenueChange: '+12.3%',
        pendingPayments: 12500,
        pendingChange: '-5.2%',
        totalExpenses: 42750,
        expensesChange: '+3.8%',
        netProfit: 242000,
        profitChange: '+22.1%',
        averageConsultationFee: 1450,
        totalConsultations: 196,
        patientSatisfaction: 4.8,
        collectionRate: 94.5
    });

    // Transactions Data
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            patientName: 'Priya Sharma',
            patientId: 1,
            amount: 1500,
            type: 'consultation',
            status: 'completed',
            date: '2024-01-15',
            time: '10:30 AM',
            paymentMethod: 'card',
            transactionId: 'TXN_001234',
            invoiceNumber: 'INV-2024-001',
            consultationType: 'Ayurvedic Consultation',
            doctor: 'Dr. Anand Sharma',
            duration: '45 min',
            notes: 'Initial consultation',
            receiptUrl: '#'
        },
        {
            id: 2,
            patientName: 'Rajesh Kumar',
            patientId: 2,
            amount: 2000,
            type: 'therapy',
            status: 'completed',
            date: '2024-01-15',
            time: '02:00 PM',
            paymentMethod: 'upi',
            transactionId: 'TXN_001235',
            invoiceNumber: 'INV-2024-002',
            consultationType: 'Panchakarma Session',
            doctor: 'Dr. Anand Sharma',
            duration: '60 min',
            notes: 'First therapy session',
            receiptUrl: '#'
        },
        {
            id: 3,
            patientName: 'Anita Desai',
            patientId: 3,
            amount: 1000,
            type: 'followup',
            status: 'completed',
            date: '2024-01-14',
            time: '11:00 AM',
            paymentMethod: 'cash',
            transactionId: 'TXN_001236',
            invoiceNumber: 'INV-2024-003',
            consultationType: 'Follow-up',
            doctor: 'Dr. Anand Sharma',
            duration: '30 min',
            notes: 'Follow-up consultation',
            receiptUrl: '#'
        },
        {
            id: 4,
            patientName: 'Vikram Singh',
            patientId: 4,
            amount: 2500,
            type: 'package',
            status: 'pending',
            date: '2024-01-14',
            time: '04:30 PM',
            paymentMethod: 'card',
            transactionId: 'TXN_001237',
            invoiceNumber: 'INV-2024-004',
            consultationType: 'Monthly Wellness Package',
            doctor: 'Dr. Priya Patel',
            duration: 'N/A',
            notes: '1 month package including 4 sessions',
            receiptUrl: '#'
        },
        {
            id: 5,
            patientName: 'Neha Gupta',
            patientId: 5,
            amount: 1500,
            type: 'consultation',
            status: 'completed',
            date: '2024-01-13',
            time: '09:30 AM',
            paymentMethod: 'card',
            transactionId: 'TXN_001238',
            invoiceNumber: 'INV-2024-005',
            consultationType: 'Ayurvedic Consultation',
            doctor: 'Dr. Anand Sharma',
            duration: '45 min',
            notes: 'Hormonal imbalance consultation',
            receiptUrl: '#'
        },
        {
            id: 6,
            patientName: 'Meera Patel',
            patientId: 6,
            amount: 3000,
            type: 'medicine',
            status: 'completed',
            date: '2024-01-12',
            time: '03:00 PM',
            paymentMethod: 'upi',
            transactionId: 'TXN_001239',
            invoiceNumber: 'INV-2024-006',
            consultationType: 'Medicine Purchase',
            doctor: 'Dr. Anand Sharma',
            duration: 'N/A',
            notes: 'Ayurvedic medicines for 1 month',
            receiptUrl: '#'
        },
        {
            id: 7,
            patientName: 'Amit Joshi',
            patientId: 7,
            amount: 5000,
            type: 'package',
            status: 'refunded',
            date: '2024-01-10',
            time: '11:30 AM',
            paymentMethod: 'card',
            transactionId: 'TXN_001240',
            invoiceNumber: 'INV-2024-007',
            consultationType: '3 Month Treatment Package',
            doctor: 'Dr. Anand Sharma',
            duration: 'N/A',
            notes: 'Package refunded due to travel',
            receiptUrl: '#'
        },
        {
            id: 8,
            patientName: 'Sunita Reddy',
            patientId: 8,
            amount: 1800,
            type: 'consultation',
            status: 'completed',
            date: '2024-01-09',
            time: '10:00 AM',
            paymentMethod: 'cash',
            transactionId: 'TXN_001241',
            invoiceNumber: 'INV-2024-008',
            consultationType: 'Ayurvedic Consultation',
            doctor: 'Dr. Priya Patel',
            duration: '45 min',
            notes: 'Weight management consultation',
            receiptUrl: '#'
        }
    ]);

    // Monthly Revenue Data
    const monthlyRevenue = [
        { month: 'Jan', revenue: 48250, consultations: 32, expenses: 7250, profit: 41000 },
        { month: 'Feb', revenue: 44500, consultations: 29, expenses: 6800, profit: 37700 },
        { month: 'Mar', revenue: 51200, consultations: 34, expenses: 7800, profit: 43400 },
        { month: 'Apr', revenue: 49800, consultations: 33, expenses: 7500, profit: 42300 },
        { month: 'May', revenue: 52300, consultations: 35, expenses: 8000, profit: 44300 },
        { month: 'Jun', revenue: 48700, consultations: 31, expenses: 7400, profit: 41300 },
        { month: 'Jul', revenue: 51500, consultations: 34, expenses: 7900, profit: 43600 },
        { month: 'Aug', revenue: 49600, consultations: 32, expenses: 7600, profit: 42000 },
        { month: 'Sep', revenue: 53400, consultations: 36, expenses: 8200, profit: 45200 },
        { month: 'Oct', revenue: 50800, consultations: 33, expenses: 7800, profit: 43000 },
        { month: 'Nov', revenue: 54500, consultations: 37, expenses: 8500, profit: 46000 },
        { month: 'Dec', revenue: 57800, consultations: 39, expenses: 8900, profit: 48900 }
    ];

    // Revenue by Type
    const revenueByType = {
        consultation: 98500,
        therapy: 76400,
        followup: 32800,
        package: 42500,
        medicine: 34550
    };

    // Payment Methods Distribution
    const paymentMethods = {
        card: { count: 45, amount: 67800, percentage: 42 },
        upi: { count: 38, amount: 54300, percentage: 34 },
        cash: { count: 22, amount: 32100, percentage: 20 },
        other: { count: 6, amount: 6400, percentage: 4 }
    };

    // Upcoming Payouts
    const upcomingPayouts = [
        { id: 1, date: '2024-01-20', amount: 15600, status: 'processing', description: 'Staff Salaries' },
        { id: 2, date: '2024-01-25', amount: 8500, status: 'scheduled', description: 'Supplier Payment' },
        { id: 3, date: '2024-01-30', amount: 4200, status: 'scheduled', description: 'Rent' }
    ];

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handle transaction status update
    const updateTransactionStatus = (id, newStatus) => {
        setTransactions(transactions.map(t =>
            t.id === id ? { ...t, status: newStatus } : t
        ));
        showNotification(`Transaction status updated to ${newStatus}`);
    };

    // Handle generate invoice
    const generateInvoice = (transaction) => {
        setSelectedTransaction(transaction);
        setShowInvoiceModal(true);
    };

    // Handle download report
    const downloadReport = (format = 'csv') => {
        const filteredData = filteredTransactions.map(t => ({
            'Date': t.date,
            'Patient': t.patientName,
            'Type': t.type,
            'Amount': t.amount,
            'Status': t.status,
            'Payment Method': t.paymentMethod,
            'Transaction ID': t.transactionId
        }));

        let blob;
        let filename;

        if (format === 'csv') {
            const headers = Object.keys(filteredData[0]);
            const csvData = filteredData.map(row => headers.map(h => row[h]).join(','));
            const csvContent = [headers.join(','), ...csvData].join('\n');
            blob = new Blob([csvContent], { type: 'text/csv' });
            filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        } else if (format === 'json') {
            blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
            filename = `transactions_${new Date().toISOString().split('T')[0]}.json`;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showNotification(`Report downloaded as ${format.toUpperCase()}`);
    };

    // Filter and sort transactions
    const filteredTransactions = transactions
        .filter(t => {
            const matchesSearch = t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || t.type === filterType;
            const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
            if (sortBy === 'amount') return b.amount - a.amount;
            if (sortBy === 'patient') return a.patientName.localeCompare(b.patientName);
            return 0;
        });

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Completed' };
            case 'pending':
                return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' };
            case 'refunded':
                return { color: 'bg-rose-100 text-rose-700', icon: XCircle, label: 'Refunded' };
            default:
                return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: status };
        }
    };

    // Get type badge
    const getTypeBadge = (type) => {
        switch (type) {
            case 'consultation':
                return { color: 'bg-blue-100 text-blue-700', icon: User, label: 'Consultation' };
            case 'therapy':
                return { color: 'bg-purple-100 text-purple-700', icon: Activity, label: 'Therapy' };
            case 'followup':
                return { color: 'bg-emerald-100 text-emerald-700', icon: Calendar, label: 'Follow-up' };
            case 'package':
                return { color: 'bg-orange-100 text-orange-700', icon: Gift, label: 'Package' };
            case 'medicine':
                return { color: 'bg-rose-100 text-rose-700', icon: Pill, label: 'Medicine' };
            default:
                return { color: 'bg-gray-100 text-gray-700', icon: CreditCard, label: type };
        }
    };

    // Get payment method icon
    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'card': return <CreditCard size={14} />;
            case 'upi': return <QrCode size={14} />;
            case 'cash': return <Banknote size={14} />;
            default: return <Wallet size={14} />;
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate total for filtered transactions
    const totalFilteredAmount = filteredTransactions.reduce((sum, t) =>
        t.status === 'completed' ? sum + t.amount : sum, 0
    );

    return (
        <div className="min-h-screen bg-gray-50">
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

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Finance & Earnings</h1>
                            <p className="text-gray-500 mt-1">Track revenue, payments, and financial insights</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setDateRange('week')}
                                    className={`px-3 py-1 rounded-md text-sm transition-all ${dateRange === 'week' ? 'bg-[#0D614E] text-white' : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setDateRange('month')}
                                    className={`px-3 py-1 rounded-md text-sm transition-all ${dateRange === 'month' ? 'bg-[#0D614E] text-white' : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Month
                                </button>
                                <button
                                    onClick={() => setDateRange('year')}
                                    className={`px-3 py-1 rounded-md text-sm transition-all ${dateRange === 'year' ? 'bg-[#0D614E] text-white' : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Year
                                </button>
                            </div>
                            <button
                                onClick={() => setShowPayoutModal(true)}
                                className="px-4 py-2 bg-[#0D614E] text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition-all hover:shadow-md"
                            >
                                <Wallet size={16} />
                                <span>Request Payout</span>
                            </button>
                            <button
                                onClick={() => setShowTransactionModal(true)}
                                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-all"
                            >
                                <Plus size={16} />
                                <span>Add Transaction</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue Card */}
                    <div className="bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] rounded-xl text-white p-6 shadow-lg hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-100 text-sm ">Total Revenue</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-3xl font-bold text-white">
                                        {showBalance ? formatCurrency(stats.totalRevenue) : '••••••'}
                                    </p>
                                    <button onClick={() => setShowBalance(!showBalance)} className="p-1 hover:bg-white hover:bg-opacity-20 rounded">
                                        {showBalance ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                                    </button>
                                </div>
                                <div className="flex items-center space-x-1 mt-2">
                                    <TrendingUp size={14} />
                                    <span className="text-sm">{stats.totalRevenueChange} from last year</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Monthly Revenue Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Monthly Revenue</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {showBalance ? formatCurrency(stats.monthlyRevenue) : '••••••'}
                                </p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <ArrowUp size={12} className="text-emerald-600" />
                                    <span className="text-xs text-emerald-600">{stats.monthlyRevenueChange}</span>
                                    <span className="text-xs text-gray-400">vs last month</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <TrendingUpIcon size={20} className="text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    {/* Pending Payments Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Pending Payments</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {showBalance ? formatCurrency(stats.pendingPayments) : '••••••'}
                                </p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <ArrowDown size={12} className="text-emerald-600" />
                                    <span className="text-xs text-emerald-600">{stats.pendingChange}</span>
                                    <span className="text-xs text-gray-400">from last month</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    {/* Net Profit Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Net Profit</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {showBalance ? formatCurrency(stats.netProfit) : '••••••'}
                                </p>
                                <div className="flex items-center space-x-1 mt-2">
                                    <ArrowUp size={12} className="text-emerald-600" />
                                    <span className="text-xs text-emerald-600">{stats.profitChange}</span>
                                    <span className="text-xs text-gray-400">profit margin</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <PiggyBank size={20} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500">Avg. Consultation Fee</p>
                                <p className="text-lg font-bold text-gray-800">{formatCurrency(stats.averageConsultationFee)}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Receipt size={14} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500">Total Consultations</p>
                                <p className="text-lg font-bold text-gray-800">{stats.totalConsultations}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Users size={14} className="text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500">Patient Satisfaction</p>
                                <p className="text-lg font-bold text-gray-800">{stats.patientSatisfaction} ★</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Star size={14} className="text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500">Collection Rate</p>
                                <p className="text-lg font-bold text-gray-800">{stats.collectionRate}%</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Target size={14} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-1.5 bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
                                <p className="text-sm text-gray-500">Monthly revenue and consultation trends</p>
                            </div>
                        </div>
                        <div className="h-80">
                            <div className="w-full h-full flex items-end space-x-2">
                                {monthlyRevenue.slice(0, 6).map((data, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center">
                                        <div className="w-full relative group">
                                            <div
                                                className="w-full bg-[#0D614E] rounded-t-lg transition-all duration-500 hover:bg-opacity-80 cursor-pointer"
                                                style={{ height: `${(data.revenue / 60000) * 200}px` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {formatCurrency(data.revenue)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-[#0D614E] rounded"></div>
                                    <span>Revenue</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 bg-emerald-400 rounded"></div>
                                    <span>Consultations</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <TrendingUpIcon size={12} className="text-emerald-600" />
                                <span className="text-xs text-emerald-600">+23% growth</span>
                            </div>
                        </div>
                    </div>
                    {/* Revenue Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Type</h3>
                        <div className="space-y-4">
                            {Object.entries(revenueByType).map(([type, amount]) => {
                                const typeInfo = getTypeBadge(type);
                                const percentage = (amount / stats.totalRevenue * 100).toFixed(1);
                                return (
                                    <div key={type}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <div className="flex items-center space-x-2">
                                                <typeInfo.icon size={14} className={typeInfo.color.split(' ')[1]} />
                                                <span className="text-gray-600">{typeInfo.label}</span>
                                            </div>
                                            <span className="font-medium text-gray-800">{formatCurrency(amount)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%`, backgroundColor: '#0D614E' }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{percentage}% of total</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Upcoming Payouts</h3>
                            <button className="text-sm text-[#0D614E] hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            {upcomingPayouts.map((payout) => (
                                <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Clock size={18} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{payout.description}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Calendar size={12} className="text-gray-400" />
                                                <span className="text-xs text-gray-500">{payout.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">{formatCurrency(payout.amount)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${payout.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {payout.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Methods & Upcoming Payouts */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
                        <div className="space-y-4">
                            {Object.entries(paymentMethods).map(([method, data]) => (
                                <div key={method}>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center space-x-2">
                                            {getPaymentMethodIcon(method)}
                                            <span className="text-sm text-gray-600 capitalize">{method}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-gray-800">{formatCurrency(data.amount)}</span>
                                            <span className="text-xs text-gray-400 ml-2">({data.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${data.percentage}%`, backgroundColor: '#0D614E' }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{data.count} transactions</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Upcoming Payouts</h3>
                            <button className="text-sm text-[#0D614E] hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            {upcomingPayouts.map((payout) => (
                                <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Clock size={18} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{payout.description}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Calendar size={12} className="text-gray-400" />
                                                <span className="text-xs text-gray-500">{payout.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">{formatCurrency(payout.amount)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${payout.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {payout.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-sm">
                    {/* Table Header with Filters */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Transactions</h3>
                                <p className="text-sm text-gray-500 mt-1">View and manage all financial transactions</p>
                            </div>
                            <div className="flex  gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E] w-64"
                                    />
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                >
                                    <option value="all">All Types</option>
                                    <option value="consultation">Consultation</option>
                                    <option value="therapy">Therapy</option>
                                    <option value="followup">Follow-up</option>
                                    <option value="package">Package</option>
                                    <option value="medicine">Medicine</option>
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="amount">Sort by Amount</option>
                                    <option value="patient">Sort by Patient</option>
                                </select>
                                <button
                                    onClick={() => downloadReport('csv')}
                                    className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                                >
                                    <DownloadIcon size={16} />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTransactions.map((transaction) => {
                                    const statusInfo = getStatusBadge(transaction.status);
                                    const StatusIcon = statusInfo.icon;
                                    const typeInfo = getTypeBadge(transaction.type);
                                    const TypeIcon = typeInfo.icon;
                                    return (
                                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{transaction.transactionId}</p>
                                                    <p className="text-xs text-gray-400">{transaction.invoiceNumber}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D614E] to-[#0a4d3e] flex items-center justify-center text-white text-xs font-semibold">
                                                        {transaction.patientName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{transaction.patientName}</p>
                                                        <p className="text-xs text-gray-500">ID: {transaction.patientId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm text-gray-800">{transaction.date}</p>
                                                    <p className="text-xs text-gray-400">{transaction.time}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                                    <TypeIcon size={12} />
                                                    <span>{typeInfo.label}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-gray-800">{formatCurrency(transaction.amount)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-1">
                                                    {getPaymentMethodIcon(transaction.paymentMethod)}
                                                    <span className="text-sm text-gray-600 capitalize">{transaction.paymentMethod}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon size={12} />
                                                    <span>{statusInfo.label}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => generateInvoice(transaction)}
                                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Invoice"
                                                    >
                                                        <Receipt size={16} className="text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedTransaction(transaction)}
                                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} className="text-gray-500" />
                                                    </button>
                                                    <select
                                                        value={transaction.status}
                                                        onChange={(e) => updateTransactionStatus(transaction.id, e.target.value)}
                                                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                                                    >
                                                        <option value="completed">Completed</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="refunded">Refunded</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Showing {filteredTransactions.length} of {transactions.length} transactions
                            </p>
                            <p className="text-sm font-medium text-gray-800">
                                Total: {formatCurrency(totalFilteredAmount)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Details Modal */}
            {selectedTransaction && !showInvoiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Transaction Details</h3>
                                <p className="text-sm text-gray-500 mt-1">Complete transaction information</p>
                            </div>
                            <button onClick={() => setSelectedTransaction(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Transaction ID</p>
                                        <p className="font-semibold text-gray-800">{selectedTransaction.transactionId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Invoice Number</p>
                                        <p className="font-semibold text-gray-800">{selectedTransaction.invoiceNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Date & Time</p>
                                        <p className="font-semibold text-gray-800">{selectedTransaction.date} at {selectedTransaction.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Amount</p>
                                        <p className="text-2xl font-bold text-[#0D614E]">{formatCurrency(selectedTransaction.amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Patient Name</p>
                                        <p className="font-semibold text-gray-800">{selectedTransaction.patientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Doctor</p>
                                        <p className="font-semibold text-gray-800">{selectedTransaction.doctor}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Consultation Type</p>
                                        <p className="font-semibold text-gray-800">{selectedTransaction.consultationType}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Duration</p>
                                        <p className="font-semibold text-gray-800">{selectedTransaction.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Payment Method</p>
                                        <div className="flex items-center space-x-1">
                                            {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                                            <p className="font-semibold text-gray-800 capitalize">{selectedTransaction.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedTransaction.status).color}`}>
                                            {/* {getStatusBadge(selectedTransaction.status).icon && <getStatusBadge(selectedTransaction.status).icon size={12} />} */}
                                            <span>{getStatusBadge(selectedTransaction.status).label}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                                    <p className="text-sm text-gray-700">{selectedTransaction.notes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setSelectedTransaction(null);
                                    setShowInvoiceModal(true);
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                            >
                                <Printer size={16} />
                                <span>Print Invoice</span>
                            </button>
                            <button
                                onClick={() => {
                                    showNotification('Invoice sent to patient email');
                                    setSelectedTransaction(null);
                                }}
                                className="px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90 flex items-center space-x-2"
                            >
                                <Send size={16} />
                                <span>Send Invoice</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Modal */}
            {showInvoiceModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Invoice</h3>
                                <p className="text-sm text-gray-500 mt-1">{selectedTransaction.invoiceNumber}</p>
                            </div>
                            <button onClick={() => setShowInvoiceModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            {/* Invoice Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-[#0D614E] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Leaf size={32} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">AyurMuni</h2>
                                <p className="text-gray-500">Ayurvedic Health Center</p>
                                <p className="text-xs text-gray-400 mt-2">123 Wellness Street, Mumbai - 400001</p>
                            </div>

                            {/* Invoice Details */}
                            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500">Bill To:</p>
                                    <p className="font-semibold text-gray-800">{selectedTransaction.patientName}</p>
                                    <p className="text-sm text-gray-600">Patient ID: {selectedTransaction.patientId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Invoice Date:</p>
                                    <p className="font-semibold text-gray-800">{selectedTransaction.date}</p>
                                    <p className="text-sm text-gray-600">Transaction ID: {selectedTransaction.transactionId}</p>
                                </div>
                            </div>

                            {/* Invoice Items */}
                            <table className="w-full mb-6">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Rate</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-4 py-3 text-sm text-gray-800">{selectedTransaction.consultationType}</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">1</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">{formatCurrency(selectedTransaction.amount)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800">{formatCurrency(selectedTransaction.amount)}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-right font-semibold text-gray-800">Subtotal:</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrency(selectedTransaction.amount)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-right font-semibold text-gray-800">Tax (18% GST):</td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrency(selectedTransaction.amount * 0.18)}</td>
                                    </tr>
                                    <tr className="text-lg">
                                        <td colSpan="3" className="px-4 py-3 text-right font-bold text-gray-800">Total:</td>
                                        <td className="px-4 py-3 text-right font-bold text-[#0D614E]">{formatCurrency(selectedTransaction.amount * 1.18)}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* Footer */}
                            <div className="text-center pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Thank you for choosing AyurMuni</p>
                                <p className="text-xs text-gray-400 mt-1">For any queries, please contact support@ayurmuni.com</p>
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                            >
                                <Printer size={16} />
                                <span>Print</span>
                            </button>
                            <button
                                onClick={() => {
                                    showNotification('Invoice downloaded');
                                    setShowInvoiceModal(false);
                                }}
                                className="px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90 flex items-center space-x-2"
                            >
                                <Download size={16} />
                                <span>Download PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Transaction Modal */}
            {showTransactionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Add Transaction</h3>
                            <button onClick={() => setShowTransactionModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                <input type="text" placeholder="Search patient..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input type="number" placeholder="Enter amount" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                    <option>Consultation</option>
                                    <option>Therapy</option>
                                    <option>Follow-up</option>
                                    <option>Package</option>
                                    <option>Medicine</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>UPI</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]" />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button onClick={() => setShowTransactionModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90">
                                Add Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payout Request Modal */}
            {showPayoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Request Payout</h3>
                            <button onClick={() => setShowPayoutModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input type="number" placeholder="Enter amount" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]">
                                    <option>XXXX-XXXX-1234 (HDFC Bank)</option>
                                    <option>XXXX-XXXX-5678 (ICICI Bank)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <textarea rows="3" placeholder="Any additional information..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]" />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button onClick={() => setShowPayoutModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-opacity-90">
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
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
        </div>
    );
};

export default FinanceDashboard;