import { PlaceholderPage } from "@/components/PlaceholderPage";
import { FileText } from "lucide-react";

export default function TemplatesPage() {
  return (
    <PlaceholderPage
      title="WhatsApp Templates"
      description="Create and manage WhatsApp message templates."
      icon={<FileText className="h-16 w-16 text-green-600" />}
    />
  );
}
