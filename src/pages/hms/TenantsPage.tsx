import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Server } from "lucide-react";

export default function TenantsPage() {
  return (
    <PlaceholderPage
      title="HMS Tenants"
      description="Manage multi-tenant configurations and settings."
      icon={<Server className="h-16 w-16 text-purple-600" />}
    />
  );
}
