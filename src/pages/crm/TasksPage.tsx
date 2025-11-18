import { PlaceholderPage } from "@/components/PlaceholderPage";
import { CheckSquare } from "lucide-react";

export default function TasksPage() {
  return (
    <PlaceholderPage
      title="CRM Tasks"
      description="Manage tasks and follow-ups for your leads."
      icon={<CheckSquare className="h-16 w-16 text-blue-600" />}
    />
  );
}
