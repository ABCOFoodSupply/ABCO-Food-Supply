"use client";

import React, { useState } from "react";
import { 
  Inbox, 
  Search, 
  Download, 
  MessageSquare, 
  Eye, 
  X
} from "lucide-react";
import { MOCK_ADMIN_RFQS, AdminRfqItem } from "@/data/adminMock";

export default function AdminRfqPage() {
  const [rfqs, setRfqs] = useState<AdminRfqItem[]>(MOCK_ADMIN_RFQS);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRfq, setSelectedRfq] = useState<AdminRfqItem | null>(null);

  const filteredRfqs = rfqs.filter((r) => {
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesSearch =
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: AdminRfqItem["status"]) => {
    setRfqs(rfqs.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    if (selectedRfq && selectedRfq.id === id) {
      setSelectedRfq({ ...selectedRfq, status: newStatus });
    }
  };

  const exportToCSV = () => {
    const headers = ["RFQ ID", "Date", "Company", "Client Name", "Phone", "Email", "City", "Category", "Product", "Volume", "Status", "Notes"];
    const rows = filteredRfqs.map((r) => [
      r.id,
      r.date,
      `"${r.companyName}"`,
      `"${r.clientName}"`,
      r.phone,
      r.email,
      r.city,
      r.category,
      `"${r.productName || ""}"`,
      `"${r.requestedVolume}"`,
      r.status,
      `"${r.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AFS_Wholesale_RFQs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Inbox className="w-7 h-7 text-brand-red" />
            <span>Wholesale RFQ Pipeline & Leads</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Track and process commercial purchase inquiries from institutional caterers and hypermarkets.
          </p>
        </div>

        {/* Red Action Button */}
        <button
          onClick={exportToCSV}
          className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-brand-red/25 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Search Bar: White background */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, client, city, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red font-medium"
          />
        </div>

        {/* Status filter: Inactive text black, Active in particular tag -> RED with WHITE text */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto w-full md:w-auto gap-1">
          {["All", "Pending", "Under Review", "Quoted", "Fulfilled"].map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-brand-red text-white font-bold shadow-xs"
                    : "text-slate-900 hover:text-black hover:bg-slate-200 font-semibold"
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* RFQ List Table: White card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Inquiry ID</th>
                <th className="py-3.5 px-4">Organization & Contact</th>
                <th className="py-3.5 px-4">Category & Product</th>
                <th className="py-3.5 px-4">Volume Required</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRfqs.map((rfq) => (
                <tr
                  key={rfq.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRfq(rfq)}
                >
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-mono font-bold text-slate-900 block">{rfq.id}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{rfq.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{rfq.companyName}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                      {rfq.clientName} • {rfq.city}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{rfq.category}</div>
                    {rfq.productName && (
                      <div className="text-[11px] text-brand-red font-bold">{rfq.productName}</div>
                    )}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {rfq.requestedVolume}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        rfq.status === "Pending"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : rfq.status === "Under Review"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : rfq.status === "Quoted"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {rfq.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${rfq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${rfq.clientName}, regarding your quotation request (${rfq.id}) with ABCO Food Supply...`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setSelectedRfq(rfq)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRfq && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRfq(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-brand-red">{selectedRfq.id}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedRfq.companyName}</h3>
              </div>
              <button
                onClick={() => setSelectedRfq(null)}
                className="text-slate-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Contact</span>
                  <span className="font-bold text-slate-900">{selectedRfq.clientName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">CR Number</span>
                  <span className="font-bold text-slate-900">{selectedRfq.crNumber || "N/A"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="font-bold text-slate-900">{selectedRfq.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Target City</span>
                  <span className="font-bold text-slate-900">{selectedRfq.city}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                  Requested Volume & Specifications
                </span>
                <div className="text-slate-900 font-bold text-sm">{selectedRfq.category}</div>
                {selectedRfq.productName && (
                  <div className="text-brand-red font-bold text-xs mt-0.5">{selectedRfq.productName}</div>
                )}
                <div className="text-slate-700 font-bold mt-1">Requested Volume: {selectedRfq.requestedVolume}</div>
                {selectedRfq.notes && (
                  <p className="mt-2 text-slate-600 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 italic">
                    &quot;{selectedRfq.notes}&quot;
                  </p>
                )}
              </div>

              {/* Status Updater: Button in particular tag is RED with WHITE text */}
              <div>
                <label className="block text-slate-700 text-[10px] uppercase font-bold mb-2">
                  Update Pipeline Status
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Pending", "Under Review", "Quoted", "Fulfilled"] as AdminRfqItem["status"][]).map(
                    (st) => {
                      const isMatch = selectedRfq.status === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedRfq.id, st)}
                          className={`py-2 px-1 text-[11px] rounded-lg border transition-all cursor-pointer ${
                            isMatch
                              ? "bg-brand-red text-white font-bold border-brand-red shadow-xs"
                              : "bg-slate-50 text-slate-900 font-semibold border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {st}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Red WhatsApp Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${selectedRfq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${selectedRfq.clientName}, regarding your wholesale quotation request (${selectedRfq.id}) for ${selectedRfq.productName || selectedRfq.category} with ABCO Food Supply...`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-brand-red hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-brand-red/25"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Send Quotation on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
