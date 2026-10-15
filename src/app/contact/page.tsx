"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  ChevronRight,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Sparkles,
  FileText,
  Truck,
  ShieldCheck,
  Headphones
} from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";
import { useSection } from "@/components/SiteSectionsProvider";
import { phoneDigits } from "@/lib/siteSections";

export default function ContactPage() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const contact = useSection("contact");

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    crNumber: "",
    businessType: "HORECA & Hospitality",
    city: "Jubail",
    volume: "Weekly Pallet Delivery",
    message: "",
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Rice & Grains",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const availableCategories = [
    "Rice & Grains",
    "Meat",
    "Seafood",
    "Poultry",
    "Dairy Products",
    "Edible Oils",
    "Food Ingredients",
    "Beverages",
    "Fruits & Vegetables",
    "Canned & Packaged",
    "Frozen Foods",
    "Bakery & Confectionery",
  ];

  const faqs = [
    {
      q: "What is your typical delivery SLA across Saudi Arabia?",
      a: "For the Eastern Province (Jubail, Dammam, Khobar), standard orders are fulfilled within 24 hours. For Riyadh and Central Region, delivery is completed within 24-48 hours. Scheduled weekly and multi-drop delivery cadences are customized during contract setup."
    },
    {
      q: "Are all meat, poultry, and food imports SFDA certified?",
      a: "Yes. 100% of our products undergo mandatory Saudi Food and Drug Authority (SFDA) inspection, customs microbiological clearance, and Halal slaughter certification prior to release from port quarantine."
    },
    {
      q: "What is the Minimum Order Quantity (MOQ) for wholesale supply?",
      a: "MOQs depend on the product category. For rice and grains, minimums typically start at 500kg (25 bags). For chilled meat and poultry, minimums start from 200kg. For mixed pallet HORECA supplies, we offer consolidated shipments."
    },
    {
      q: "Do you offer credit payment facilities for registered Saudi companies?",
      a: "Yes. After completing initial trade references and Commercial Registration (CR) verification, we extend 30 to 60-day credit facilities for certified hypermarket chains, catering contractors, and hotels."
    },
    {
      q: "Can ABCO handle customized portioning or private institutional packaging?",
      a: "Absolutely. We provide private label bagging, custom meat portioning, and industrial bulk container sizing (such as 18L tins or 1 MT jumbo totes) tailored to institutional requirements."
    }
  ];

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.company.trim()) {
      toast.error("Please fill in all required fields (*).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact_page_formal_rfq",
          clientName: formData.name,
          companyName: formData.company,
          crNumber: formData.crNumber,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          businessType: formData.businessType,
          category: selectedCategories.join(", "),
          requestedVolume: formData.volume,
          notes: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.success) {
        throw new Error(data.error || "Failed to submit RFQ");
      }

      toast.success("Inquiry & RFQ Transmitted Successfully!", {
        description: `Reference #${data.data?.id || "AFS-RFQ"}. Our Jubail commercial sales desk will contact you within 2 hours.`,
        duration: 5000,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        crNumber: "",
        businessType: "HORECA & Hospitality",
        city: "Jubail Industrial City",
        volume: "Weekly Pallet Delivery",
        message: "",
      });
      setSelectedCategories(["Rice & Grains"]);
    } catch (err) {
      console.error(err);
      toast.error("Unable to transmit quotation request. Please try again or reach us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      <Header onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-brand-red transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Contact Us & RFQ</span>
        </div>
      </div>

      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/90 py-10 sm:py-14 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
              COMMERCIAL INQUIRIES & CONTRACT SUPPLY
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Connect with ABCO Food Supply
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              Whether you require recurring bulk food distribution, customs clearance coordination, or tender contract pricing, our commercial team in Jubail is ready to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section: Form + Contact Details */}
      <section className="py-12 sm:py-16 w-full flex-1">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Columns: RFQ Interactive Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-red-50 text-brand-red px-3 py-1 rounded-full text-xs font-black uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>WHOLESALE INQUIRY & RFQ</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Request a Formal B2B Quotation
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Provide your business details and required product specifications. We will prepare custom tier pricing and delivery schedules.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name & Work Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Abdulrahman Al-Harbi"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red/30 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red/30 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Phone & Company Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 5X XXX XXXX"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red/30 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Al-Bustan Catering LLC"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red/30 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: CR Number & Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Commercial Registration (CR) # (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.crNumber}
                      onChange={(e) => setFormData({ ...formData, crNumber: e.target.value })}
                      placeholder="10-digit Saudi CR"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red/30 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Business Sector
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white outline-none"
                    >
                      <option>HORECA & Hospitality</option>
                      <option>Hypermarket / Retail Chain</option>
                      <option>Industrial Catering Contractor</option>
                      <option>Wholesale Food Trader</option>
                      <option>Food Processing & Manufacturing</option>
                      <option>Government / Institutional</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: City Destination & Estimated Volume */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Delivery Destination (City)
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white outline-none"
                    >
                      <option>Jubail Industrial City</option>
                      <option>Dammam / Khobar</option>
                      <option>Riyadh Central</option>
                      <option>Jeddah & Western Province</option>
                      <option>Makkah & Madinah</option>
                      <option>Al-Ahsa & Eastern Border</option>
                      <option>Tabuk & Neom Region</option>
                      <option>GCC Cross-Border Delivery</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                      Expected Order Volume / Frequency
                    </label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white outline-none"
                    >
                      <option>Weekly Pallet Delivery</option>
                      <option>Daily Chilled Scheduled Supply</option>
                      <option>Monthly Full Container Load (FCL)</option>
                      <option>One-Off Bulk Tender Order</option>
                      <option>Contract Annual Retainer</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Product Categories Multi-Select Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Product Categories Required (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-brand-red text-white shadow-xs"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 6: Detailed Message / Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Specific Order Requirements or Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="List desired SKUs, brand preferences, packaging sizes (e.g., 20kg bags, 18L tins), or delivery schedules..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red/30 outline-none transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Transmitting Request...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Commercial Quotation Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right 5 Columns: Headquarters Details & Direct Channels */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Info Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-red">
                    HEADQUARTERS & DEPOT
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Jubail Operations Center
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Warehouse & Office Address</p>
                      <p className="text-slate-600">{contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Telephone Inquiries</p>
                      <p className="text-slate-600">
                        <a href={`tel:+${phoneDigits(contact.phone)}`} className="hover:text-brand-red hover:underline">
                          {contact.phone}
                        </a>
                      </p>
                      {contact.phone2 && (
                        <p className="text-slate-600">
                          <a href={`tel:+${phoneDigits(contact.phone2)}`} className="hover:text-brand-red hover:underline">
                            {contact.phone2}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Department Inboxes</p>
                      <p className="text-slate-600">
                        Sales: <a href={`mailto:${contact.email}`} className="text-brand-red hover:underline">{contact.email}</a>
                      </p>
                      {contact.email2 && (
                        <p className="text-slate-600">
                          Business Development: <a href={`mailto:${contact.email2}`} className="text-brand-red hover:underline">{contact.email2}</a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Operating Schedule</p>
                      <p className="text-slate-600">{contact.hours}</p>
                      {contact.hoursNote && <p className="text-slate-500 text-xs font-semibold">{contact.hoursNote}</p>}
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Action Card */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${phoneDigits(contact.whatsapp || contact.phone)}?text=${encodeURIComponent(
                      "Hello ABCO Food Supply, I would like to request a commercial quotation."
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span>Instant WhatsApp Procurement Desk</span>
                  </a>
                </div>
              </div>

              {/* Geographic Hub Connectivity Card */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-brand-red text-xs font-black uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>STRATEGIC LOGISTICS REACH</span>
                </div>
                <h4 className="text-lg font-black text-white">
                  Fast Arterial Highway Transit
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span>King Abdulaziz Port (Dammam):</span>
                    <strong className="text-white">85 km (~1 hr)</strong>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span>King Fahd International Airport:</span>
                    <strong className="text-white">75 km (~50 mins)</strong>
                  </div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span>Riyadh Logistics Corridor:</span>
                    <strong className="text-white">410 km (Direct Highway)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bahrain Causeway / GCC:</span>
                    <strong className="text-white">140 km</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Saudi Food Supply FAQ Accordion */}
      <section className="py-16 bg-white border-t border-slate-200/90 w-full">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs sm:text-sm font-black tracking-wider text-brand-red uppercase">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Institutional Food Procurement FAQs
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-brand-red transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand-red" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        preselectedCategory="Contract Supply Inquiries"
      />
    </main>
  );
}
