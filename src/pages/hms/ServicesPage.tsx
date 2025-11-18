import { PlaceholderPage } from "@/components/PlaceholderPage";
import { TestTube } from "lucide-react";

export default function ServicesPage() {
  return (
    <PlaceholderPage
      title="HMS Services"
      description="Manage diagnostic tests, nursing packages, and healthcare services."
      icon={<TestTube className="h-16 w-16 text-purple-600" />}
    />
  );
}
