import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function GroupsPage() {
  return (
    <PlaceholderPage
      title="WhatsApp Groups"
      description="Manage your WhatsApp groups and group members."
      icon={<Users className="h-16 w-16 text-green-600" />}
    />
  );
}
