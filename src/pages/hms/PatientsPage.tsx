import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function PatientsPage() {
  return (
    <PlaceholderPage
      title="HMS Patients"
      description="Manage patient records, vitals, and medical history."
      icon={<Users className="h-16 w-16 text-purple-600" />}
    />
  );
}
