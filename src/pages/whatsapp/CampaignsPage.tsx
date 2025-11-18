import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Send } from "lucide-react";

export default function CampaignsPage() {
  return (
    <PlaceholderPage
      title="WhatsApp Campaigns"
      description="Create and manage WhatsApp broadcast campaigns."
      icon={<Send className="h-16 w-16 text-green-600" />}
    />
  );
}
