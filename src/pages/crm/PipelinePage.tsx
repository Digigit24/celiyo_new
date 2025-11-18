import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Kanban } from "lucide-react";

export default function PipelinePage() {
  return (
    <PlaceholderPage
      title="Sales Pipeline"
      description="Visualize and manage your sales pipeline."
      icon={<Kanban className="h-16 w-16 text-blue-600" />}
    />
  );
}
