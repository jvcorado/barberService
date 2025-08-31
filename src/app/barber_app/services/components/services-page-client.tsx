"use client";

import { useRouter } from "next/navigation";
import CreateServiceDrawer from "./create-service-drawer";

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

  return (
    <div className="flex flex-col gap-6 px-4 bg-gray-50 min-h-screen">
      {/* Fixed Header */}
      <div className="flex flex-col gap-4 bg-white pt-6 pb-4 px-4 border-b border-gray-100 fixed top-0 left-0 right-0 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Serviços</h1>
          <CreateServiceDrawer onServiceCreated={handleServiceCreated} />
        </div>
      </div>

      {/* Content with top margin to account for fixed header */}
      <div className="mt-24 space-y-6 pb-6">{children}</div>
    </div>
  );
}
