"use client";

import { Briefcase } from "lucide-react";
import { SectionsAdminPage } from "@/components/admin/SectionsAdminPage";

export default function AdminServicesPageEditor() {
  return (
    <SectionsAdminPage
      icon={Briefcase}
      title="Services Page Manager"
      description="Edit every section of the public Services page. Click Save Changes to publish."
      previewHref="/services"
      tabs={[
        { id: "hero", label: "Top Banner", sections: ["servicesHero"] },
        { id: "services", label: "Services", sections: ["servicesList"] },
        { id: "process", label: "How It Works", sections: ["servicesProcess"] },
        { id: "industries", label: "Who We Serve", sections: ["servicesIndustries"] },
        { id: "faq", label: "FAQ", sections: ["servicesFaq"] },
        { id: "cta", label: "Bottom Banner", sections: ["servicesCta"] },
      ]}
    />
  );
}
