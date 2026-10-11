"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  Minus,
  X,
  MessageCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

export const ContactSection: React.FC = () => {
  const [mapZoom, setMapZoom] = useState(1);
  const [isMapCardVisible, setIsMapCardVisible] = useState(true);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`Copied ${label}`, { description: text });
  };

  const contactItems = [
    {
      icon: <Phone className="w-5 h-5 text-white" />,
      label: "Direct Phone",
      value: "+966 57 299 5987",
      action: () => handleCopy("+966 57 299 5987", "Phone Number"),
      hint: "Tap to copy",
    },
    {
      icon: <Mail className="w-5 h-5 text-white" />,
      label: "Email Inquiries",
      value: "abcofoodsupply@gmail.com",
      action: () => handleCopy("abcofoodsupply@gmail.com", "Email Address"),
      hint: "Tap to copy",
    },
    {
      icon: <MapPin className="w-5 h-5 text-white" />,
      label: "Headquarters",
      value: "Jubail Industrial City, KSA",
      action: () => handleCopy("Jubail, Kingdom of Saudi Arabia", "Location"),
      hint: "Tap to copy",
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      label: "Working Hours",
      value: "Sun – Thu  8:00 AM – 6:00 PM",
      action: undefined,
      hint: "",
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-white border-t border-slate-200/60 overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">

        {/* Section Label */}
        <div className="mb-10">
          <span className="inline-block text-xs font-black tracking-widest text-brand-red uppercase mb-3">
            GET IN TOUCH
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-xl">
              We&apos;re Based in{" "}
              <span className="text-brand-red">Jubail,</span>{" "}
              Saudi Arabia
            </h2>
            <a
              href="https://wa.me/966572995987?text=Hello%20ABCO%20Food%20Supply,%20I%20would%20like%20to%20enquire%20about%20your%20products."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fa855] text-white font-bold px-6 py-3 rounded-full text-sm shadow-md transition-all shrink-0 self-start lg:self-auto"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Chat on WhatsApp
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Contact cards */}
          <div className="flex flex-col gap-4">
            {/* Contact detail cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactItems.map((item, i) => (
                <div
                  key={i}
                  onClick={item.action}
                  className={`group relative bg-slate-50 hover:bg-white border border-slate-200 hover:border-brand-red/40 rounded-2xl p-5 transition-all shadow-xs hover:shadow-md ${item.action ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-brand-red transition-colors leading-snug break-all">
                        {item.value}
                      </p>
                      {item.hint && (
                        <p className="text-[10px] text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                          {item.hint}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social / CTA strip */}
            <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-white">Follow ABCO Food Supply</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Stay updated on wholesale deals & arrivals</p>
              </div>
              <div className="flex items-center gap-3">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/966572995987"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#1fa855] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
                {/* Facebook */}
                <button
                  onClick={() => toast.info("Opening Facebook page")}
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                {/* Instagram */}
                <button
                  onClick={() => toast.info("Opening Instagram profile")}
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
                {/* LinkedIn */}
                <button
                  onClick={() => toast.info("Opening LinkedIn profile")}
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#0a66c2] hover:bg-[#095196] text-white flex items-center justify-center shadow transition-transform hover:scale-110"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Map */}
          <div>
            {isMapCardVisible ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden h-full min-h-[380px] flex flex-col">
                {/* Map Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-red/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-none">Our Location</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Jubail, Kingdom of Saudi Arabia</p>
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
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Close location card"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Map Graphic */}
                <div className="relative flex-1 bg-[#e8ecef] overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{ transform: `scale(${mapZoom})` }}
                  >
                    <svg
                      viewBox="0 0 400 300"
                      className="w-full h-full object-cover"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="400" height="300" fill="#cbe6f7" />
                      <path
                        d="M 0,0 L 260,0 C 250,50 230,120 280,180 C 310,220 340,250 400,270 L 400,300 L 0,300 Z"
                        fill="#f3f4ee"
                        stroke="#e2e8f0"
                      />
                      <path d="M 50,300 L 220,130 L 280,30" stroke="#fbbf24" strokeWidth="5" fill="none" />
                      <path d="M 0,220 L 180,160 L 320,80" stroke="#ffffff" strokeWidth="3" fill="none" />
                      <path d="M 120,0 L 200,140 L 220,300" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                      <circle cx="230" cy="110" r="45" fill="#fef08a" opacity="0.3" />
                      <text x="70" y="270" fill="#94a3b8" fontSize="14" fontWeight="600">EASTERN PROVINCE</text>
                      <text x="240" y="70" fill="#3b82f6" fontSize="13" fontWeight="600">Arabian Gulf</text>
                    </svg>
                    {/* Pin */}
                    <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-brand-red shadow-lg flex items-center justify-center animate-bounce">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-2.5 h-1 bg-black/30 rounded-full mx-auto mt-1 blur-xs" />
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                        ABCO HQ Jubail
                      </span>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute right-3 top-3 flex flex-col gap-0 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setMapZoom((z) => Math.min(z + 0.2, 1.8))}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
                      aria-label="Zoom in"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-px bg-slate-200" />
                    <button
                      onClick={() => setMapZoom((z) => Math.max(z - 0.2, 0.8))}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
                      aria-label="Zoom out"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* View Larger */}
                <div className="p-3 bg-white text-center border-t border-slate-100">
                  <a
                    href="https://maps.google.com/?q=Jubail,Saudi+Arabia"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-red font-bold text-xs hover:underline"
                  >
                    View Larger Map
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center h-full flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-sm font-bold text-slate-800">Location Map Hidden</p>
                <button
                  onClick={() => setIsMapCardVisible(true)}
                  className="text-xs bg-brand-red text-white px-5 py-2 rounded-full font-bold shadow hover:bg-red-700 transition-colors"
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
