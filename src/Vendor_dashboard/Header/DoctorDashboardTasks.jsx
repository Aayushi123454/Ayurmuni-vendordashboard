import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Upload,
  MessageSquare,
  User,
  Calendar,
  Tag,
  Flag,
  MoreVertical,
  Copy,
  Link,
  Send,
  FileText,
  Activity,
  Heart,
  Users,
  DollarSign,
  HelpCircle,
  Settings,
  CalendarDays,
  Stethoscope,
  FileCheck,
  Mail,
  BarChart3,
  Phone,
  Video,
  Pill,
  ClipboardList,
  CreditCard,
  Shield,
  Bell,
  Star,
  TrendingUp,
  Award
} from "lucide-react";

export default function DoctorDashboardTasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRemark, setNewRemark] = useState("");

  // Complete Task Data Structure
  const [tasks, setTasks] = useState([
    // DASHBOARD Module
    {
      id: 1,
      module: "Dashboard",
      feature: "Analytics Overview",
      task: "Implement patient visit statistics chart",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "API integrated successfully",
      assignTo: "Frontend Team",
      editDate: "2024-01-15",
      priority: "High",
      startDate: "2024-01-01",
      dueDate: "2024-01-20",
      progress: 100
    },
    {
      id: 2,
      module: "Dashboard",
      feature: "Revenue Widget",
      task: "Display monthly earnings with graph",
      frontendStatus: "In Progress",
      backendStatus: "Completed",
      remark: "Backend API ready, frontend integration ongoing",
      assignTo: "FullStack Dev",
      editDate: "2024-01-18",
      priority: "High",
      startDate: "2024-01-10",
      dueDate: "2024-01-25",
      progress: 60
    },
    {
      id: 3,
      module: "Dashboard",
      feature: "Upcoming Appointments",
      task: "Show next 5 appointments with patient details",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Real-time updates working",
      assignTo: "Backend Team",
      editDate: "2024-01-12",
      priority: "Medium",
      startDate: "2024-01-05",
      dueDate: "2024-01-18",
      progress: 100
    },
    {
      id: 4,
      module: "Dashboard",
      feature: "Patient Alerts",
      task: "Critical patient notifications and reminders",
      frontendStatus: "Pending",
      backendStatus: "In Progress",
      remark: "Design completed, waiting for backend",
      assignTo: "UI/UX Team",
      editDate: "2024-01-20",
      priority: "High",
      startDate: "2024-01-15",
      dueDate: "2024-01-30",
      progress: 30
    },

    // AVAILABILITY Module
    {
      id: 5,
      module: "Availability",
      feature: "Time Slots Management",
      task: "Create/Edit/Delete availability slots",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "CRUD operations working",
      assignTo: "FullStack Dev",
      editDate: "2024-01-10",
      priority: "High",
      startDate: "2024-01-01",
      dueDate: "2024-01-15",
      progress: 100
    },
    {
      id: 6,
      module: "Availability",
      feature: "Recurring Schedule",
      task: "Set weekly recurring availability pattern",
      frontendStatus: "In Progress",
      backendStatus: "Pending",
      remark: "UI design ready, backend development started",
      assignTo: "Backend Team",
      editDate: "2024-01-19",
      priority: "Medium",
      startDate: "2024-01-10",
      dueDate: "2024-01-28",
      progress: 45
    },
    {
      id: 7,
      module: "Availability",
      feature: "Break/Holiday Management",
      task: "Mark unavailable dates and holidays",
      frontendStatus: "Pending",
      backendStatus: "Pending",
      remark: "Requirements gathering phase",
      assignTo: "Product Manager",
      editDate: "2024-01-21",
      priority: "Low",
      startDate: "2024-01-20",
      dueDate: "2024-02-10",
      progress: 10
    },
    {
      id: 8,
      module: "Availability",
      feature: "Real-time Sync",
      task: "Sync availability across all devices",
      frontendStatus: "Not Started",
      backendStatus: "Not Started",
      remark: "Planning phase - Q2 2024",
      assignTo: "DevOps Team",
      editDate: "2024-01-22",
      priority: "Low",
      startDate: "2024-02-01",
      dueDate: "2024-03-15",
      progress: 0
    },

    // APPOINTMENT Module
    {
      id: 9,
      module: "Appointment",
      feature: "Booking System",
      task: "Patient self-booking interface",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Live on production",
      assignTo: "Frontend Team",
      editDate: "2024-01-08",
      priority: "High",
      startDate: "2024-01-01",
      dueDate: "2024-01-12",
      progress: 100
    },
    {
      id: 10,
      module: "Appointment",
      feature: "Video Consultation",
      task: "Integrate video calling SDK (Zoom/WebRTC)",
      frontendStatus: "In Progress",
      backendStatus: "Completed",
      remark: "Testing integration",
      assignTo: "Video Team",
      editDate: "2024-01-17",
      priority: "High",
      startDate: "2024-01-05",
      dueDate: "2024-01-25",
      progress: 75
    },
    {
      id: 11,
      module: "Appointment",
      feature: "Appointment Reminders",
      task: "SMS/Email/WhatsApp notifications",
      frontendStatus: "Completed",
      backendStatus: "In Progress",
      remark: "SMS working, email in development",
      assignTo: "Backend Team",
      editDate: "2024-01-16",
      priority: "Medium",
      startDate: "2024-01-08",
      dueDate: "2024-01-22",
      progress: 70
    },
    {
      id: 12,
      module: "Appointment",
      feature: "Queue Management",
      task: "Digital waiting room with queue position",
      frontendStatus: "Pending",
      backendStatus: "Pending",
      remark: "Design phase",
      assignTo: "UI/UX Team",
      editDate: "2024-01-20",
      priority: "Medium",
      startDate: "2024-01-15",
      dueDate: "2024-02-05",
      progress: 20
    },

    // PATIENTS Module
    {
      id: 13,
      module: "Patients",
      feature: "Patient Records",
      task: "Complete patient profile with history",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "All features implemented",
      assignTo: "FullStack Dev",
      editDate: "2024-01-14",
      priority: "High",
      startDate: "2024-01-01",
      dueDate: "2024-01-18",
      progress: 100
    },
    {
      id: 14,
      module: "Patients",
      feature: "Medical History",
      task: "Track past diagnoses, prescriptions, allergies",
      frontendStatus: "In Progress",
      backendStatus: "Completed",
      remark: "Backend API ready, frontend UI in progress",
      assignTo: "Frontend Team",
      editDate: "2024-01-19",
      priority: "High",
      startDate: "2024-01-10",
      dueDate: "2024-01-26",
      progress: 55
    },
    {
      id: 15,
      module: "Patients",
      feature: "Document Management",
      task: "Upload/view reports, prescriptions, scans",
      frontendStatus: "Pending",
      backendStatus: "In Progress",
      remark: "Storage solution being finalized",
      assignTo: "Backend Team",
      editDate: "2024-01-18",
      priority: "Medium",
      startDate: "2024-01-12",
      dueDate: "2024-01-30",
      progress: 25
    },
    {
      id: 16,
      module: "Patients",
      feature: "Patient Communication",
      task: "In-app chat and messaging system",
      frontendStatus: "Not Started",
      backendStatus: "Pending",
      remark: "Research phase",
      assignTo: "Product Manager",
      editDate: "2024-01-21",
      priority: "Low",
      startDate: "2024-02-01",
      dueDate: "2024-03-01",
      progress: 5
    },

    // MESSAGE Module
    {
      id: 17,
      module: "Message",
      feature: "Secure Messaging",
      task: "HIPAA-compliant chat between doctor-patient",
      frontendStatus: "In Progress",
      backendStatus: "In Progress",
      remark: "Encryption implemented, UI ongoing",
      assignTo: "Security Team",
      editDate: "2024-01-17",
      priority: "High",
      startDate: "2024-01-05",
      dueDate: "2024-01-28",
      progress: 50
    },
    {
      id: 18,
      module: "Message",
      feature: "Notification System",
      task: "Push notifications for new messages",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Working across all platforms",
      assignTo: "Frontend Team",
      editDate: "2024-01-13",
      priority: "Medium",
      startDate: "2024-01-08",
      dueDate: "2024-01-20",
      progress: 100
    },
    {
      id: 19,
      module: "Message",
      feature: "File Sharing",
      task: "Share images, documents in chat",
      frontendStatus: "Pending",
      backendStatus: "Completed",
      remark: "API ready, waiting for frontend",
      assignTo: "Frontend Team",
      editDate: "2024-01-19",
      priority: "Low",
      startDate: "2024-01-15",
      dueDate: "2024-01-29",
      progress: 40
    },

    // ASSESSMENTS Module
    {
      id: 20,
      module: "Assessments",
      feature: "Patient Forms",
      task: "Pre-consultation questionnaires",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Dynamic forms working",
      assignTo: "FullStack Dev",
      editDate: "2024-01-11",
      priority: "Medium",
      startDate: "2024-01-01",
      dueDate: "2024-01-16",
      progress: 100
    },
    {
      id: 21,
      module: "Assessments",
      feature: "Clinical Assessments",
      task: "Standardized medical assessment tools",
      frontendStatus: "In Progress",
      backendStatus: "Pending",
      remark: "Integrating PHQ-9, GAD-7 scales",
      assignTo: "Medical Team",
      editDate: "2024-01-20",
      priority: "High",
      startDate: "2024-01-10",
      dueDate: "2024-02-05",
      progress: 35
    },
    {
      id: 22,
      module: "Assessments",
      feature: "Automated Scoring",
      task: "Auto-calculate assessment results",
      frontendStatus: "Pending",
      backendStatus: "In Progress",
      remark: "Scoring algorithms being developed",
      assignTo: "Backend Team",
      editDate: "2024-01-18",
      priority: "Medium",
      startDate: "2024-01-12",
      dueDate: "2024-01-31",
      progress: 15
    },

    // EARNINGS Module
    {
      id: 23,
      module: "Earnings",
      feature: "Revenue Dashboard",
      task: "Daily/weekly/monthly earnings overview",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Real-time data aggregation",
      assignTo: "FullStack Dev",
      editDate: "2024-01-09",
      priority: "High",
      startDate: "2024-01-01",
      dueDate: "2024-01-14",
      progress: 100
    },
    {
      id: 24,
      module: "Earnings",
      feature: "Payment Gateway",
      task: "Stripe/Razorpay integration",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Production ready",
      assignTo: "Backend Team",
      editDate: "2024-01-07",
      priority: "High",
      startDate: "2024-01-01",
      dueDate: "2024-01-10",
      progress: 100
    },
    {
      id: 25,
      module: "Earnings",
      feature: "Invoice Generation",
      task: "Auto-generate PDF invoices",
      frontendStatus: "In Progress",
      backendStatus: "Completed",
      remark: "Backend generates, frontend preview pending",
      assignTo: "Frontend Team",
      editDate: "2024-01-19",
      priority: "Medium",
      startDate: "2024-01-10",
      dueDate: "2024-01-24",
      progress: 65
    },
    {
      id: 26,
      module: "Earnings",
      feature: "Payout Management",
      task: "Doctor payout history and scheduling",
      frontendStatus: "Pending",
      backendStatus: "In Progress",
      remark: "Being tested",
      assignTo: "Finance Team",
      editDate: "2024-01-20",
      priority: "High",
      startDate: "2024-01-15",
      dueDate: "2024-02-01",
      progress: 30
    },

    // HELP & SUPPORT Module
    {
      id: 27,
      module: "Help & Support",
      feature: "Knowledge Base",
      task: "FAQs, tutorials, documentation",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Content being added",
      assignTo: "Content Team",
      editDate: "2024-01-15",
      priority: "Low",
      startDate: "2024-01-10",
      dueDate: "2024-01-25",
      progress: 80
    },
    {
      id: 28,
      module: "Help & Support",
      feature: "Ticket System",
      task: "Submit and track support tickets",
      frontendStatus: "In Progress",
      backendStatus: "Completed",
      remark: "API ready, UI development",
      assignTo: "Frontend Team",
      editDate: "2024-01-18",
      priority: "Medium",
      startDate: "2024-01-12",
      dueDate: "2024-01-26",
      progress: 60
    },
    {
      id: 29,
      module: "Help & Support",
      feature: "Live Chat",
      task: "Real-time support chat",
      frontendStatus: "Pending",
      backendStatus: "Pending",
      remark: "Third-party integration planned",
      assignTo: "Product Manager",
      editDate: "2024-01-21",
      priority: "Low",
      startDate: "2024-02-01",
      dueDate: "2024-02-28",
      progress: 0
    },

    // SETTINGS Module
    {
      id: 30,
      module: "Settings",
      feature: "Profile Management",
      task: "Doctor profile, specialty, clinic info",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "Fully functional",
      assignTo: "FullStack Dev",
      editDate: "2024-01-10",
      priority: "High",
      startDate: "2024-01-01",
      dueDate: "2024-01-15",
      progress: 100
    },
    {
      id: 31,
      module: "Settings",
      feature: "Notification Preferences",
      task: "Configure email/SMS/push alerts",
      frontendStatus: "Completed",
      backendStatus: "Completed",
      remark: "User settings saving correctly",
      assignTo: "Frontend Team",
      editDate: "2024-01-14",
      priority: "Medium",
      startDate: "2024-01-08",
      dueDate: "2024-01-19",
      progress: 100
    },
    {
      id: 32,
      module: "Settings",
      feature: "Security & Privacy",
      task: "2FA, data export, privacy controls",
      frontendStatus: "In Progress",
      backendStatus: "In Progress",
      remark: "2FA implemented, data export pending",
      assignTo: "Security Team",
      editDate: "2024-01-19",
      priority: "High",
      startDate: "2024-01-10",
      dueDate: "2024-01-30",
      progress: 55
    },
    {
      id: 33,
      module: "Settings",
      feature: "Integration Management",
      task: "Connect external services (EHR, labs)",
      frontendStatus: "Pending",
      backendStatus: "In Progress",
      remark: "API development ongoing",
      assignTo: "Backend Team",
      editDate: "2024-01-20",
      priority: "Medium",
      startDate: "2024-01-15",
      dueDate: "2024-02-10",
      progress: 25
    }
  ]);

  // Get all unique assignees for filter
  const assignees = useMemo(() => {
    const unique = [...new Set(tasks.map(t => t.assignTo))];
    return ["all", ...unique];
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filterModule !== "all") {
      filtered = filtered.filter(t => t.module === filterModule);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter(t => t.frontendStatus === filterStatus || t.backendStatus === filterStatus);
    }
    if (filterAssignee !== "all") {
      filtered = filtered.filter(t => t.assignTo === filterAssignee);
    }
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.feature.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, filterModule, filterStatus, filterAssignee, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Not Started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  // Get module icon
  const getModuleIcon = (module) => {
    const icons = {
      "Dashboard": <Activity className="h-4 w-4" />,
      "Availability": <CalendarDays className="h-4 w-4" />,
      "Appointment": <Stethoscope className="h-4 w-4" />,
      "Patients": <Users className="h-4 w-4" />,
      "Message": <Mail className="h-4 w-4" />,
      "Assessments": <ClipboardList className="h-4 w-4" />,
      "Earnings": <DollarSign className="h-4 w-4" />,
      "Help & Support": <HelpCircle className="h-4 w-4" />,
      "Settings": <Settings className="h-4 w-4" />
    };
    return icons[module] || <FileText className="h-4 w-4" />;
  };

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.frontendStatus === "Completed" && t.backendStatus === "Completed").length,
    inProgress: tasks.filter(t => t.frontendStatus === "In Progress" || t.backendStatus === "In Progress").length,
    pending: tasks.filter(t => t.frontendStatus === "Pending" || t.backendStatus === "Pending").length,
    highPriority: tasks.filter(t => t.priority === "High" && t.frontendStatus !== "Completed").length
  };

  // Modules list for filter
  const modules = ["all", ...new Set(tasks.map(t => t.module))];
  const statuses = ["all", "Completed", "In Progress", "Pending", "Not Started"];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard - Task Management</h1>
          <p className="text-gray-500 mt-1">Track all features, tasks, and development progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Flag className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <select
              value={filterModule}
              onChange={(e) => {
                setFilterModule(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {modules.map(module => (
                <option key={module} value={module}>
                  {module === "all" ? "All Modules" : module}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status}
                </option>
              ))}
            </select>
            <select
              value={filterAssignee}
              onChange={(e) => {
                setFilterAssignee(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>
                  {assignee === "all" ? "All Assignees" : assignee}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setFilterModule("all");
                setFilterStatus("all");
                setFilterAssignee("all");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Module</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Feature</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Frontend Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Backend Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Remark</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assign To</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Edit Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getModuleIcon(task.module)}
                        <span className="text-sm font-medium">{task.module}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{task.feature}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-900">{task.task}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Due: {format(new Date(task.dueDate), "dd MMM yyyy")}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(task.frontendStatus)}`}>
                        {task.frontendStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(task.backendStatus)}`}>
                        {task.backendStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-600 max-w-[200px] truncate">{task.remark}</p>
                        <button 
                          onClick={() => {
                            setSelectedTask(task);
                            setShowRemarkModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm">{task.assignTo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm">{format(new Date(task.editDate), "dd MMM yyyy")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{task.progress}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setSelectedTask(task);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded" title="Copy">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-2 rounded bg-blue-600 text-white text-sm">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export to Excel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Task
          </button>
        </div>
      </div>

      {/* Remark Modal */}
      {showRemarkModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowRemarkModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Update Remark</h3>
            <p className="text-sm text-gray-600 mb-2">Task: {selectedTask.task}</p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              rows="3"
              placeholder="Enter remark..."
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowRemarkModal(false)} className="px-3 py-1 border rounded text-sm">Cancel</button>
              <button 
                onClick={() => {
                  const updatedTasks = tasks.map(t => 
                    t.id === selectedTask.id ? { ...t, remark: newRemark, editDate: new Date().toISOString().split('T')[0] } : t
                  );
                  setTasks(updatedTasks);
                  setShowRemarkModal(false);
                  setNewRemark("");
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Save Remark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Frontend Status</label>
                <select 
                  className="w-full border rounded-lg p-2 text-sm"
                  value={selectedTask.frontendStatus}
                  onChange={(e) => setSelectedTask({...selectedTask, frontendStatus: e.target.value})}
                >
                  <option>Not Started</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Backend Status</label>
                <select 
                  className="w-full border rounded-lg p-2 text-sm"
                  value={selectedTask.backendStatus}
                  onChange={(e) => setSelectedTask({...selectedTask, backendStatus: e.target.value})}
                >
                  <option>Not Started</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Priority</label>
                <select 
                  className="w-full border rounded-lg p-2 text-sm"
                  value={selectedTask.priority}
                  onChange={(e) => setSelectedTask({...selectedTask, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Assign To</label>
                <input 
                  type="text"
                  className="w-full border rounded-lg p-2 text-sm"
                  value={selectedTask.assignTo}
                  onChange={(e) => setSelectedTask({...selectedTask, assignTo: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Progress (%)</label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                  value={selectedTask.progress}
                  onChange={(e) => setSelectedTask({...selectedTask, progress: parseInt(e.target.value)})}
                />
                <span className="text-xs">{selectedTask.progress}%</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowEditModal(false)} className="px-3 py-1 border rounded text-sm">Cancel</button>
              <button 
                onClick={() => {
                  const updatedTasks = tasks.map(t => 
                    t.id === selectedTask.id ? { ...selectedTask, editDate: new Date().toISOString().split('T')[0] } : t
                  );
                  setTasks(updatedTasks);
                  setShowEditModal(false);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}