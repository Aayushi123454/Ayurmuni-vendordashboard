import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { vendorService } from "../../../services/vendorService";
import { exportToCsv } from "../../utils/exportHelpers";

const REPORT_TYPES = [
  { value: "orders", label: "Order Report", fetch: (params) => vendorService.getOrders(params) },
  { value: "sales", label: "Sales Report", fetch: (params) => vendorService.getFinanceTransactions(params) },
  { value: "products", label: "Product Report", fetch: () => vendorService.getProducts({ page: 1, page_size: 500 }) },
  { value: "inventory", label: "Inventory Report", fetch: () => vendorService.getInventory({ page: 1, page_size: 500 }) },
  { value: "revenue", label: "Revenue Report", fetch: (params) => vendorService.getFinanceMetrics(params) },
];

const Reports = () => {
  const [reportType, setReportType] = useState("orders");
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePreview = async () => {
    try {
      setLoading(true);
      const config = REPORT_TYPES.find((r) => r.value === reportType);
      const res = await config.fetch({ page: 1, page_size: 500 });
      const data = res.data?.data;
      const rows = data?.results || (Array.isArray(data) ? data : data ? [data] : []);
      setPreview(rows.slice(0, 10));
      toast.success(`Loaded ${rows.length} records`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      setLoading(true);
      const config = REPORT_TYPES.find((r) => r.value === reportType);
      const res = await config.fetch({ page: 1, page_size: 500 });
      const data = res.data?.data;
      const rows = data?.results || (Array.isArray(data) ? data : data ? [data] : []);
      if (!rows.length) {
        toast.error("No data to export");
        return;
      }
      const keys = Object.keys(rows[0]).slice(0, 8);
      exportToCsv(
        `${reportType}-report.csv`,
        rows,
        keys.map((k) => ({ key: k, label: k }))
      );
      toast.success("Report downloaded");
    } catch {
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Generate CSV exports from products, orders, inventory, and finance
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          PDF/Excel server export is not available yet. CSV uses your existing APIs.
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Report type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
            >
              {REPORT_TYPES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generatePreview}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D614E] text-white rounded-lg text-sm disabled:opacity-50"
            >
              <FileText size={16} />
              Preview
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>

        {preview.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 shadow-sm overflow-x-auto">
            <h3 className="font-semibold text-gray-800 mb-3">Preview (first 10 rows)</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">{JSON.stringify(preview, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
