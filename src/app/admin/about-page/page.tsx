"use client";

import { Info } from "lucide-react";
import { SectionsAdminPage } from "@/components/admin/SectionsAdminPage";

export default function AdminAboutPageEditor() {
  return (
    <SectionsAdminPage
      icon={Info}
      title="About Page Manager"
      description="Edit every section of the public About Us page. Click Save Changes to publish."
      previewHref="/about"
      tabs={[
        { id: "hero", label: "Top Banner", sections: ["aboutHero"] },
        { id: "stats", label: "Stats Bar", sections: ["aboutStats"] },
        { id: "story", label: "Our Story", sections: ["aboutStory"] },
        { id: "pillars", label: "Excellence Cards", sections: ["aboutPillars"] },
        { id: "values", label: "Mission & Values", sections: ["aboutValues"] },
        { id: "milestones", label: "Journey", sections: ["aboutMilestones"] },
        { id: "cta", label: "Bottom Banner", sections: ["aboutCta"] },
      ]}
    />
  );
}
