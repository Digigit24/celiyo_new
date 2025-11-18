import { PlaceholderPage } from "@/components/PlaceholderPage";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <PlaceholderPage
      title="HMS Payments"
      description="Track payments, transactions, and accounting."
      icon={<CreditCard className="h-16 w-16 text-purple-600" />}
    />
  );
}
