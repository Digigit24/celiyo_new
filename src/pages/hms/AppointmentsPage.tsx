import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Calendar } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <PlaceholderPage
      title="HMS Appointments"
      description="Schedule and manage patient appointments."
      icon={<Calendar className="h-16 w-16 text-purple-600" />}
    />
  );
}
