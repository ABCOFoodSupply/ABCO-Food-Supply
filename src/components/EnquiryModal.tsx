"use client";

import React, { useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  preselectedCategory = "",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: preselectedCategory || "Rice & Grains",
    volume: "20ft / 40ft Reefer Container",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all required fields (*).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "wholesale_quotation_modal",
          clientName: formData.name,
          companyName: formData.company || "Independent Buyer",
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          requestedVolume: formData.volume,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.success) {
        throw new Error(data.error || "Failed to submit quotation request");
      }

      toast.success("Procurement Quotation Request Received!", {
        description: `Thank you ${formData.name}. Reference #${data.data?.id || "AFS-RFQ"}. Our team will prepare a formal price quote.`,
        duration: 5000,
      });

      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        category: "Rice & Grains",
        volume: "20ft / 40ft Reefer Container",
        notes: "",
      });

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Unable to submit quotation. Please try again or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-brand-red to-brand-red-dark text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-red-100">
              Commercial Food Supply
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black leading-tight">Request a Wholesale Quotation</h3>
          <p className="text-xs text-red-100 mt-1">
            Serving HORECA, retail chains, and catering contractors in Saudi Arabia.
          </p>
        </div>

        {/* Form Body - Scrollable on small screens */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Full Name <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ahmed Al-Ghamdi"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Saudi Catering Co."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Email Address <span className="text-brand-red">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="procurement@company.com"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Phone Number <span className="text-brand-red">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+966 5X XXX XXXX"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Product Interest
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red outline-none bg-white text-slate-800 transition-colors"
              >
                <option value="Rice & Grains">Rice & Grains</option>
                <option value="Meat">Meat</option>
                <option value="Seafood">Seafood</option>
                <option value="Poultry">Poultry</option>
                <option value="Dairy Products">Dairy Products</option>
                <option value="Edible Oils">Edible Oils</option>
                <option value="Food Ingredients">Food Ingredients</option>
                <option value="Beverages">Beverages</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Canned & Packaged">Canned & Packaged</option>
                <option value="Frozen Foods">Frozen Foods</option>
                <option value="Bakery & Confectionery">Bakery & Confectionery</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Estimated Volume
              </label>
              <select
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red outline-none bg-white text-slate-800 transition-colors"
              >
                <option value="20ft / 40ft Reefer Container">20ft / 40ft Reefer Container</option>
                <option value="Pallet Quantity (1 - 5 Pallets)">Pallet Quantity (1 - 5 Pallets)</option>
                <option value="Half Truckload">Half Truckload</option>
                <option value="Full Truckload (FTL)">Full Truckload (FTL)</option>
                <option value="Weekly / Monthly Contract">Weekly / Monthly Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Requisition Details
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Brands, cuts, specifications, or preferred delivery schedule in Jubail / Dammam / Riyadh..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red outline-none resize-none transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-red hover:bg-brand-red-dark text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span>Submit Request</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

