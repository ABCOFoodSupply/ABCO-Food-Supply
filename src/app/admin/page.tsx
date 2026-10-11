"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Inbox, 
  TrendingUp, 
  Truck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  Search, 
  Eye, 
  Database, 
  CloudLightning, 
  Sparkles,
  Phone
} from "lucide-react";
import { MOCK_ADMIN_RFQS, MOCK_ADMIN_STATS, AdminRfqItem } from "@/data/adminMock";
import { CATEGORIES } from "@/data/products";

export default function AdminDashboardPage() {
  const [rfqList, setRfqList] = useState<AdminRfqItem[]>(MOCK_ADMIN_RFQS);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRfq, setSelectedRfq] = useState<AdminRfqItem | null>(null);

  // Filter RFQs based on status & search
  const filteredRfqs = rfqList.filter((item) => {
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesSearch =
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: AdminRfqItem["status"]) => {
    setRfqList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedRfq && selectedRfq.id === id) {
      setSelectedRfq({ ...selectedRfq, status: newStatus });
    }
  };

  const getStatusBadge = (status: AdminRfqItem["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200 font-bold";
      case "Under Review":
        return "bg-blue-50 text-blue-800 border-blue-200 font-bold";
      case "Quoted":
        return "bg-purple-50 text-purple-800 border-purple-200 font-bold";
      case "Fulfilled":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 font-bold";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome & Action Banner - White Card with Red Accents */}
      <div className="relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-red" />
              <span>Eastern Province Operations Depot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Executive Supply Chain Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time monitoring of wholesale procurement RFQs, SFDA logistics, and category inventories across the Kingdom of Saudi Arabia.
            </p>
          </div>

          {/* Action Buttons: RED with White text */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-red/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add New SKU</span>
            </Link>

            <Link
              href="/admin/media"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 hover:text-brand-red px-5 py-3 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <CloudLightning className="w-4 h-4 text-cyan-600" />
              <span>ImageKit CDN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards - Clean White Cards with Crisp Black Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-red/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Active SKUs</span>
            <div className="p-2.5 rounded-xl bg-red-50 text-brand-red border border-red-100">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{MOCK_ADMIN_STATS.totalSkus}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-2 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+18 SKUs added this quarter</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-red/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pending Wholesale RFQs</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{MOCK_ADMIN_STATS.pendingReview}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 mt-2 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Requires response within 2 hrs</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-red/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Monthly Volume Dispatched</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{MOCK_ADMIN_STATS.totalVolumeMonthMT}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-2 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+12.4% vs previous month</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-red/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Cold-Chain SLA</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{MOCK_ADMIN_STATS.slaDeliveryRate}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-2 font-medium">
            <span>SFDA temperature compliance</span>
          </div>
        </div>
      </div>

      {/* Integration Status Badges */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Supabase Cloud Database & Storage</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Target instance: <code className="text-slate-800 font-mono">exrgcryuyhkwpqsyciif.supabase.co</code> (Connected)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-slate-800 block">ImageKit CDN</span>
            <span className="text-[11px] text-cyan-700 font-mono font-medium">ik.imagekit.io/wg5w5t4nz</span>
          </div>
          <div className="p-2 bg-cyan-50 rounded-xl border border-cyan-200 text-cyan-600">
            <CloudLightning className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Wholesale RFQs Management Section */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Table Header Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <Inbox className="w-5 h-5 text-brand-red" />
              <span>Wholesale Quotation Requests (RFQs)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Client procurement inquiries submitted via web portal and WhatsApp catalog.
            </p>
          </div>

          {/* Filters & Search: Text black, when in particular active tag -> RED with WHITE text */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by company, city, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red w-48 sm:w-60 font-medium"
              />
            </div>

            {/* Status Tabs: Text black when unselected, White when in particular active tag */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs gap-1">
              {["All", "Pending", "Under Review", "Quoted", "Fulfilled"].map((status) => {
                const isSelected = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-red text-white font-bold shadow-xs"
                        : "text-slate-900 hover:text-black hover:bg-slate-200 font-semibold"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">RFQ ID & Date</th>
                <th className="py-3.5 px-4">Client / Organization</th>
                <th className="py-3.5 px-4">Category & Product</th>
                <th className="py-3.5 px-4">Volume Required</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Instant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRfqs.length > 0 ? (
                filteredRfqs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRfq(rfq)}
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-mono font-bold text-slate-900 text-xs">{rfq.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{rfq.date}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{rfq.companyName}</div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                        <span>{rfq.clientName}</span>
                        <span>•</span>
                        <span className="text-slate-500">{rfq.city}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{rfq.category}</div>
                      {rfq.productName && (
                        <div className="text-[11px] text-brand-red font-semibold truncate max-w-[180px]">
                          {rfq.productName}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {rfq.requestedVolume}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border ${getStatusBadge(
                          rfq.status
                        )}`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Action: Red/Green */}
                        <a
                          href={`https://wa.me/${rfq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${rfq.clientName}, regarding your wholesale RFQ (${rfq.id}) with ABCO Food Supply...`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        {/* View Modal */}
                        <button
                          onClick={() => setSelectedRfq(rfq)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                          title="View Inquiry Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                    No quotation requests found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-red" />
            <span>Active Supply Categories Catalog</span>
          </h2>
          <Link
            href="/admin/categories"
            className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
          >
            <span>Manage All 12 Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.slug}
              className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-brand-red/40 hover:shadow-xs transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <span className="text-lg font-black text-brand-red">
                  {cat.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-brand-red transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {cat.skuCount || "24+ Items"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RFQ Details Modal - Clean White */}
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
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Contact Person</span>
                  <span className="font-bold text-slate-900">{selectedRfq.clientName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">CR Registration</span>
                  <span className="font-bold text-slate-900">{selectedRfq.crNumber || "N/A"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone / Mobile</span>
                  <span className="font-bold text-slate-900">{selectedRfq.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span>
                  <span className="font-bold text-slate-900">{selectedRfq.city}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                  Requested Supply Specifications
                </span>
                <div className="text-slate-900 font-bold text-sm">{selectedRfq.category}</div>
                {selectedRfq.productName && (
                  <div className="text-brand-red font-bold text-xs mt-0.5">{selectedRfq.productName}</div>
                )}
                <div className="text-slate-700 font-bold mt-1">Volume: {selectedRfq.requestedVolume}</div>
                {selectedRfq.notes && (
                  <p className="mt-2 text-slate-600 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200 italic">
                    &quot;{selectedRfq.notes}&quot;
                  </p>
                )}
              </div>

              {/* Status Updater: Button in particular tag is RED with WHITE text */}
              <div>
                <label className="block text-slate-700 text-[10px] uppercase font-bold mb-2">
                  Update RFQ Pipeline Status
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
                    `Hello ${selectedRfq.clientName}, regarding your wholesale inquiry ${selectedRfq.id} for ${selectedRfq.productName || selectedRfq.category}...`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-brand-red hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-brand-red/20"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Reply to Client on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
