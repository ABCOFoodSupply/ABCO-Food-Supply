"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  ExternalLink,
  Plus,
  Minus,
  X,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    productInterest: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [isMapCardVisible, setIsMapCardVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please provide a valid business email address.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please provide a contact phone number.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Enquiry Sent Successfully!", {
        description: `Thank you ${formData.fullName}. Our Jubail commercial sales team will reach out at ${formData.email} within 24 hours.`,
        duration: 5000,
      });

      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        productInterest: "",
        message: "",
      });
    }, 1000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied ${label}`, {
      description: text,
    });
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-slate-50/60 border-t border-slate-200/60">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Get In Touch */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Get In Touch
              </h2>
              <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
                We&apos;re here to support your food supply needs. Send us an enquiry and our team will get back to you shortly.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-4 pt-2">
              {/* Phone */}
              <div
                onClick={() => handleCopy("+966 50 123 4567", "Phone Number")}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Direct Phone</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors">
                    +966 5X XXX XXXX
                  </p>
                </div>
              </div>

              {/* Email */}
              <div
                onClick={() => handleCopy("info@abcofoodsupply.com", "Email Address")}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Email Inquiries</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors break-all">
                    info@abcofoodsupply.com
                  </p>
                </div>
              </div>

              {/* Location */}
              <div
                onClick={() => handleCopy("Jubail, Kingdom of Saudi Arabia", "Location")}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Headquarters</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-brand-red transition-colors">
                    Jubail, Kingdom of Saudi Arabia
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="pt-4 flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>

              {/* Facebook */}
              <button
                onClick={() => toast.info("Opening Facebook page")}
                className="w-10 h-10 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* Instagram */}
              <button
                onClick={() => toast.info("Opening Instagram profile")}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => toast.info("Opening LinkedIn profile")}
                className="w-10 h-10 rounded-full bg-[#0a66c2] hover:bg-[#095196] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Column 2: Send Us an Enquiry Form */}
          <div id="enquiry" className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-900 mb-5">
              Send Us an Enquiry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-800">
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your name"
                    className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-800">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter company name"
                    className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-800">
                    Email Address <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-800">
                    Phone Number <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Product Interest Dropdown */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-800">
                  Product Interest
                </label>
                <select
                  value={formData.productInterest}
                  onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none bg-white text-slate-800 transition-colors"
                >
                  <option value="">Select Product Category</option>
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

              {/* Message */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-800">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us your procurement specifications, bulk volume, or questions..."
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red outline-none resize-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 rounded-xl font-bold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>Send Enquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Column 3: Our Location */}
          <div className="lg:col-span-4">
            {isMapCardVisible ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                {/* Header with Close */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-none">
                        Our Location
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Jubail, Kingdom of Saudi Arabia
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMapCardVisible(false);
                      toast.info("Location card minimized", {
                        action: {
                          label: "Restore",
                          onClick: () => setIsMapCardVisible(true),
                        },
                      });
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    aria-label="Close location card"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Stylized Interactive Map Preview */}
                <div className="relative h-64 sm:h-72 bg-[#e8ecef] overflow-hidden">
                  {/* Map Graphic Layer */}
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{ transform: `scale(${mapZoom})` }}
                  >
                    {/* SVG Map of Jubail Coastline */}
                    <svg
                      viewBox="0 0 400 300"
                      className="w-full h-full object-cover"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Arabian Gulf Water */}
                      <rect width="400" height="300" fill="#cbe6f7" />

                      {/* Land Mass */}
                      <path
                        d="M 0,0 L 260,0 C 250,50 230,120 280,180 C 310,220 340,250 400,270 L 400,300 L 0,300 Z"
                        fill="#f3f4ee"
                        stroke="#e2e8f0"
                      />

                      {/* Major Highways */}
                      <path
                        d="M 50,300 L 220,130 L 280,30"
                        stroke="#fbbf24"
                        strokeWidth="5"
                        fill="none"
                      />
                      <path
                        d="M 0,220 L 180,160 L 320,80"
                        stroke="#ffffff"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        d="M 120,0 L 200,140 L 220,300"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Jubail Industrial City Area */}
                      <circle cx="230" cy="110" r="45" fill="#fef08a" opacity="0.3" />

                      <text x="70" y="270" fill="#94a3b8" fontSize="14" fontWeight="600">
                        EASTERN PROVINCE
                      </text>
                      <text x="240" y="70" fill="#3b82f6" fontSize="13" fontWeight="600">
                        Arabian Gulf
                      </text>
                    </svg>

                    {/* Central Pin */}
                    <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-brand-red shadow-lg flex items-center justify-center animate-bounce">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-2.5 h-1 bg-black/30 rounded-full mx-auto mt-1 blur-xs" />
                      </div>
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                        ABCO HQ Jubail
                      </span>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute right-3 top-3 flex flex-col gap-1 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setMapZoom((z) => Math.min(z + 0.2, 1.8))}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
                      aria-label="Zoom in"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-[1px] bg-slate-200" />
                    <button
                      onClick={() => setMapZoom((z) => Math.max(z - 0.2, 0.8))}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
                      aria-label="Zoom out"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom View Larger Map Button */}
                <div className="p-3 bg-white text-center border-t border-slate-100">
                  <a
                    href="https://maps.google.com/?q=Jubail,Saudi+Arabia"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs hover:underline"
                  >
                    <span>View Larger Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-dashed border-slate-300 text-center">
                <MapPin className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">Location Map Hidden</p>
                <button
                  onClick={() => setIsMapCardVisible(true)}
                  className="mt-3 text-xs bg-brand-red text-white px-4 py-1.5 rounded-full font-semibold"
                >
                  Show Location Map
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
