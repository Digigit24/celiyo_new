import { PlaceholderPage } from "@/components/PlaceholderPage";
import { UserCheck } from "lucide-react";

export default function DoctorsPage() {
  return (
    <PlaceholderPage
      title="HMS Doctors"
      description="Manage doctor profiles, schedules, and availability."
      icon={<UserCheck className="h-16 w-16 text-purple-600" />}
    />
  );
}
