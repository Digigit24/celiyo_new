import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <PlaceholderPage
      title="CRM Leads"
      description="Manage your sales leads and prospects."
      icon={<Users className="h-16 w-16 text-blue-600" />}
    />
  );
}
