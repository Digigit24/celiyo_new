import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function ContactsPage() {
  return (
    <PlaceholderPage
      title="WhatsApp Contacts"
      description="Manage your WhatsApp contacts and contact lists."
      icon={<Users className="h-16 w-16 text-green-600" />}
    />
  );
}
