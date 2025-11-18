import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Pill } from "lucide-react";

export default function PharmacyPage() {
  return (
    <PlaceholderPage
      title="HMS Pharmacy"
      description="Manage pharmacy inventory, products, and orders."
      icon={<Pill className="h-16 w-16 text-purple-600" />}
    />
  );
}
