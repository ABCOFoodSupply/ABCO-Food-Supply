"use client";

import { Contact } from "lucide-react";
import { SectionsAdminPage } from "@/components/admin/SectionsAdminPage";

export default function AdminContactSettingsPage() {
  return (
    <SectionsAdminPage
      icon={Contact}
      title="Contact & Social"
      description="One place for phone, WhatsApp, email, address, map and social media links. Every page of the website uses these."
      previewHref="/contact"
      tabs={[
        { id: "contact", label: "Contact Details", sections: ["contact"] },
        { id: "social", label: "Social Media", sections: ["social"] },
      ]}
    />
  );
}
