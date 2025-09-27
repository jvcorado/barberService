"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkingHoursForm from "./working-hours-form";

interface SchedulePageClientProps {
  barbershop: {
    id: string;
    name: string;
    workingDays: number[];
    openingTime: string;
    closingTime: string;
    appointmentInterval: number;
  };
}

export default function SchedulePageClient({
  barbershop,
}: SchedulePageClientProps) {
  const router = useRouter();

  const handleScheduleUpdated = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 py-4">
        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xs text-white/60 mb-1">Dias</p>
              <p className="text-sm font-bold text-white">
                {barbershop.workingDays.length}
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-xs text-white/60 mb-1">Horário</p>
              <p className="text-xs font-bold text-white">
                {barbershop.openingTime} - {barbershop.closingTime}
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Settings className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xs text-white/60 mb-1">Intervalo</p>
              <p className="text-sm font-bold text-white">
                {barbershop.appointmentInterval}min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <WorkingHoursForm
          barbershop={barbershop}
          onScheduleUpdated={handleScheduleUpdated}
        />
      </div>
    </div>
  );
}
