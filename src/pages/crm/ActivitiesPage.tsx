import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Activity } from "lucide-react";

export default function ActivitiesPage() {
  return (
    <PlaceholderPage
      title="CRM Activities"
      description="Track and manage lead activities and interactions."
      icon={<Activity className="h-16 w-16 text-blue-600" />}
    />
  );
}
