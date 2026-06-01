// src/pages/admin/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Shield,
  Leaf,
  Truck,
  TrendingUp,
  Clock,
  Flame,
  Droplet,
  Sun,
  Moon,
  Wind,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  MoreVertical,
  Copy,
  Printer,
  Mail,
  RefreshCw,
  Settings,
  Bell,
  AlertCircle,
  Award,
  Sparkles
} from 'lucide-react';

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedProducts, setExpandedProducts] = useState({});

  // Sample product data with variants
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Organic Ashwagandha Capsules',
      category: 'Ayurvedic Herbs',
      brand: 'Botanical Gold',
      variants: [
        {
          id: 101,
          name: '60 Capsules Bottle',
          sku: 'ASHW-60-CAP',
          mrp: 1299,
          sellingPrice: 899,
          quantity: 450,
          status: 'In Stock',
          isActive: true
        },
        {
          id: 102,
          name: '120 Capsules Economy Pack',
          sku: 'ASHW-120-CAP',
          mrp: 2199,
          sellingPrice: 1699,
          quantity: 80,
          status: 'Low Stock',
          isActive: true
        }
      ],
      threshold: 25
    },
    {
      id: 2,
      name: 'Tulsi Holy Basil Herbal Tea',
      category: 'Beverages',
      brand: 'Botanical Gold',
      variants: [
        {
          id: 201,
          name: 'Loose Leaf Tin-100g',
          sku: 'TEA-TUL-100g',
          mrp: 450,
          sellingPrice: 399,
          quantity: 0,
          status: 'Out of Stock',
          isActive: true
        }
      ],
      threshold: 50
    },
    {
      id: 3,
      name: 'Ashwagandha Extract (Grade A)',
      category: 'Extracts',
      brand: 'Botanical Gold',
      variants: [
        {
          id: 301,
          name: 'Liquid Extract 50ml',
          sku: 'ASHW-EXT-50',
          mrp: 899,
          sellingPrice: 699,
          quantity: 4,
          status: 'Critical Stock',
          isActive: true
        }
      ],
      threshold: 25
    },
    {
      id: 4,
      name: 'Organic Brahmi Powder',
      category: 'Powders',
      brand: 'Botanical Gold',
      variants: [
        {
          id: 401,
          name: 'Powder 200g',
          sku: 'BRAH-200g',
          mrp: 599,
          sellingPrice: 449,
          quantity: 12,
          status: 'Low Stock',
          isActive: true
        }
      ],
      threshold: 50
    }
  ]);

  // Batch expiry data
  const batches = [
    { id: 1, name: 'Batch #BTH-9001', product: 'Ashwagandha Extract', expiryDate: '2024-07-15', daysLeft: 28, status: 'critical' },
    { id: 2, name: 'Batch #BTH-9002', product: 'Organic Brahmi Powder', expiryDate: '2024-08-20', daysLeft: 64, status: 'warning' },
    { id: 3, name: 'Batch #BTH-9003', product: 'Tulsi Tea', expiryDate: '2024-06-30', daysLeft: 13, status: 'critical' },
    { id: 4, name: 'Batch #BTH-9004', product: 'Ashwagandha Capsules', expiryDate: '2024-09-10', daysLeft: 85, status: 'normal' },
  ];

  // Low stock items
  const lowStockItems = [
    { name: 'Ashwagandha Extract (Grade A)', units: 4, min: 25, category: 'Extracts' },
    { name: 'Organic Brahmi Powder', units: 12, min: 50, category: 'Powders' },
  ];

  const toggleProductExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const getStatusBadge = (status) => {
    const config = {
      'In Stock': { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      'Low Stock': { color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
      'Out of Stock': { color: 'bg-rose-100 text-rose-700', icon: XCircle },
      'Critical Stock': { color: 'bg-red-100 text-red-700', icon: AlertCircle }
    };
    const item = config[status] || config['In Stock'];
    const Icon = item.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${item.color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getExpiryBadge = (daysLeft, status) => {
    if (status === 'critical') {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <Flame size={16} className="text-red-600" />
          <div>
            <p className="text-xs font-semibold text-red-700">Expiring in {daysLeft} days</p>
            <p className="text-xs text-red-600">Priority restock needed</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <Clock size={16} className="text-amber-600" />
        <div>
          <p className="text-xs font-semibold text-amber-700">Expiring in {daysLeft} days</p>
          <p className="text-xs text-amber-600">Plan for restock</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Vault</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your botanical stock with precision. Real-time expiry tracking and batch integrity for premium Ayurvedic distribution.
          </p>
        </div>

        {/* Alert Banner - Low Stock Items */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 mb-6 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">{lowStockItems.length} Items Below Safety Threshold</h3>
              <div className="mt-3 space-y-2">
                {lowStockItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.units} units left · Min: {item.min}</p>
                    </div>
                    <button className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* Batch Health Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Batch Health</h3>
              <Package size={18} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-3">Expiry Pipeline</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600">Expiring in 30 days</span>
                </div>
                <span className="text-sm font-semibold text-red-600">14 Batches</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-600">Expiring in 90 days</span>
                </div>
                <span className="text-sm font-semibold text-amber-600">42 Batches</span>
              </div>
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200 lg:col-span-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Award size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">PRO-TIP</p>
                <p className="text-sm text-gray-700 mt-1">
                  Ayurvedic oils have extended shelf life if stored in Level 3 darkness. Check temperature logs.
                </p>
              </div>
            </div>
          </div>

          {/* Batch Origin Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-emerald-600" />
              <h3 className="font-semibold text-gray-800">Batch Origin Integrity</h3>
            </div>
            <p className="text-xs text-gray-500">
              Every batch is tracked from its source farm in Kerala and Uttarakhand. High-resolution logs for temperature-sensitive extractions are available for QA audit.
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]"
                />
              </div>
              <div className="flex gap-3">
                <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E] bg-white">
                  <option>All Categories</option>
                  <option>Ayurvedic Herbs</option>
                  <option>Beverages</option>
                  <option>Extracts</option>
                  <option>Powders</option>
                </select>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product.id} className="hover:bg-gray-50 transition">
                {/* Product Header */}
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => toggleProductExpand(product.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {expandedProducts[product.id] ? (
                          <ChevronDown size={18} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-400" />
                        )}
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">Brand: {product.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{product.variants.length} variants available</p>
                    </div>
                  </div>
                </div>

                {/* Variants Table - Expanded View */}
                {expandedProducts[product.id] && (
                  <div className="px-5 pb-5">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Variant Name</th>
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">MRP</th>
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Selling Price</th>
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Active</th>
                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.variants.map((variant) => (
                            <tr key={variant.id} className="border-b border-gray-100 last:border-0">
                              <td className="py-3 text-sm text-gray-800">{variant.name}</td>
                              <td className="py-3 text-xs font-mono text-gray-500">{variant.sku}</td>
                              <td className="py-3 text-sm text-gray-500">{formatCurrency(variant.mrp)}</td>
                              <td className="py-3 text-sm font-medium text-gray-800">{formatCurrency(variant.sellingPrice)}</td>
                              <td className="py-3 text-sm">
                                <span className={`font-medium ${
                                  variant.quantity === 0 ? 'text-rose-600' :
                                  variant.quantity < product.threshold ? 'text-amber-600' : 'text-gray-800'
                                }`}>
                                  {variant.quantity} Units
                                </span>
                              </td>
                              <td className="py-3">{getStatusBadge(variant.status)}</td>
                              <td className="py-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={variant.isActive} className="sr-only peer" />
                                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D614E]"></div>
                                </label>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                                    <Eye size={16} className="text-gray-500" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                                    <Edit size={16} className="text-gray-500" />
                                  </button>
                                  <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                                    <Copy size={16} className="text-gray-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1 to 12 of 12 Products</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 bg-[#0D614E] text-white rounded-lg hover:bg-[#0a4d3e] transition">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Stock Intelligence Section */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-800">Stock Intelligence</h3>
              <p className="text-sm text-gray-700 mt-1">
                AI-driven demand forecasting predicts a <span className="font-bold text-indigo-700">15% surge</span> in Ashwagandha requirements for next quarter. 
                Prepare pre-orders for batch <span className="font-mono bg-indigo-100 px-1.5 py-0.5 rounded">#BTH-9000 series</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Expiry Tracking Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" />
              Expiring Soon - Critical
            </h3>
            <div className="space-y-3">
              {batches.filter(b => b.status === 'critical').map(batch => (
                <div key={batch.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-800">{batch.name}</p>
                    <p className="text-xs text-gray-500">{batch.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">{batch.daysLeft} days left</p>
                    <p className="text-xs text-gray-500">Expires: {batch.expiryDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              Expiring in 90 Days
            </h3>
            <div className="space-y-3">
              {batches.filter(b => b.status === 'warning').map(batch => (
                <div key={batch.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-medium text-gray-800">{batch.name}</p>
                    <p className="text-xs text-gray-500">{batch.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600">{batch.daysLeft} days left</p>
                    <p className="text-xs text-gray-500">Plan restock</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;