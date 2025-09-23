"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import CreateServiceDrawer from "./create-service-drawer";
import { Button } from "@/components/ui/button";

interface ServicesPageClientProps {
  children: React.ReactNode;
}

export default function ServicesPageClient({
  children,
}: ServicesPageClientProps) {
  const router = useRouter();

  const handleServiceCreated = () => {
    router.refresh();
  };

  const handleServiceUpdated = () => {
    router.refresh();
  };

  const handleServiceDeleted = () => {
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Header */}
      <div className="bg-transparent px-4 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Serviços</h1>
            <p className="text-sm text-white/70">Gerencie seus serviços</p>
          </div>
          <CreateServiceDrawer onServiceCreated={handleServiceCreated} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">{children}</div>
    </div>
  );
}
