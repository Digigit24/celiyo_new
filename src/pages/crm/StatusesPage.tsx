import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ClipboardList } from "lucide-react";

export default function StatusesPage() {
  return (
    <PlaceholderPage
      title="Lead Statuses"
      description="Manage lead status categories and stages."
      icon={<ClipboardList className="h-16 w-16 text-blue-600" />}
    />
  );
}
