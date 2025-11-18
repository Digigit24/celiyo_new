import { Construction } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function PlaceholderPage({
  title,
  description = "This page is under construction and will be available soon.",
  icon
}: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {icon || <Construction className="h-16 w-16 text-muted-foreground" />}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            We're working on bringing you this feature. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
