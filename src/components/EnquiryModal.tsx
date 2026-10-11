"use client";

import React, { useState } from "react";
import { X, Send, Sparkles, CheckCircle2 } from "lucide-react";
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
    volume: "Bulk Container",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields (*).");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Procurement Quotation Request Received!", {
        description: `Thank you ${formData.name}. Our wholesale manager for ${formData.category} will prepare a price list for ${formData.company || "your business"}.`,
        duration: 5000,
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-red to-brand-red-dark text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs uppercase tracking-wider font-bold text-red-100">
              Commercial Food Supply
            </span>
          </div>
          <h3 className="text-xl font-black">Request a Wholesale Quotation</h3>
          <p className="text-xs text-red-100 mt-1">
            Serving HORECA, retail chains, and catering contractors in Saudi Arabia.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name <span className="text-brand-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ahmed Al-Ghamdi"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Saudi Catering Co."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address <span className="text-brand-red">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="procurement@company.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone Number <span className="text-brand-red">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+966 5X XXX XXXX"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Product Interest
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red outline-none bg-white text-slate-800"
              >
                <option value="Rice & Grains">Rice & Grains</option>
                <option value="Fresh Meat">Meat</option>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Estimated Volume
              </label>
              <select
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-red outline-none bg-white text-slate-800"
              >
                <option value="Pallet Quantity">Pallet Quantity (1 - 5 Pallets)</option>
                <option value="Half Truckload">Half Truckload</option>
                <option value="Full Truckload">Full Truckload (FTL)</option>
                <option value="Bulk Container">20ft / 40ft Reefer Container</option>
                <option value="Periodic Contract">Weekly / Monthly Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Requisition Details
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Brands, cuts, specifications, or preferred delivery schedule in Jubail / Dammam / Riyadh..."
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-red outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
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
