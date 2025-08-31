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
    <div className="flex flex-col gap-6 p-4 bg-white text-black min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <CreateServiceDrawer onServiceCreated={handleServiceCreated} />
      </div>
      {children}
    </div>
  );
}
