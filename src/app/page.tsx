"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutUs } from "@/components/AboutUs";
import { ProductCategories } from "@/components/ProductCategories";
import { B2BBanner } from "@/components/B2BBanner";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Partners } from "@/components/Partners";
import { HomeGallery } from "@/components/HomeGallery";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { EnquiryModal } from "@/components/EnquiryModal";

export default function Home() {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Rice & Grains");

  const handleOpenEnquiry = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setIsEnquiryModalOpen(true);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navigation Header */}
      <Header onOpenEnquiry={() => handleOpenEnquiry()} />

      {/* Hero Section with Visual & Quick Categories */}
      <Hero
        onOpenEnquiry={() => handleOpenEnquiry()}
        onSelectCategory={(category) => {
          setSelectedCategory(category);
        }}
      />

      {/* About Us Section */}
      <AboutUs onLearnMore={() => handleOpenEnquiry()} />

      {/* Our Products Section */}
      <ProductCategories
        onSelectCategory={(category) => {
          setSelectedCategory(category);
        }}
        onEnquireProduct={(subject) => handleOpenEnquiry(subject)}
      />

      {/* B2B Promotional Banner */}
      <B2BBanner onShopNow={() => handleOpenEnquiry()} />

      {/* End-to-End Food Supply Services */}
      <Services onExploreServices={() => handleOpenEnquiry()} />

      {/* Why ABCO Food Supply? Strengths + Mission, Vision, Values */}
      <WhyChooseUs />

      {/* Clients & Hypermarket Partners */}
      <Partners />

      {/* Operational Showcase Gallery (Direct from DB) */}
      <HomeGallery />

      {/* Contact Section: Get In Touch, Jubail Map */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Interactive Quotation Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={handleCloseEnquiry}
        preselectedCategory={selectedCategory}
      />
    </main>
  );
}
