import { PlaceholderPage } from "@/components/PlaceholderPage";
import { MessageCircle } from "lucide-react";

export default function ChatsPage() {
  return (
    <PlaceholderPage
      title="WhatsApp Chats"
      description="View and manage your WhatsApp conversations."
      icon={<MessageCircle className="h-16 w-16 text-green-600" />}
    />
  );
}
