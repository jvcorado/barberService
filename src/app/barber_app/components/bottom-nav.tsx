"use client";

import { Calendar, Users, FileText, Zap } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useBarbershopColors();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-6">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl p-4 backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-2xl">
          <div className="flex justify-around items-center">
            {/* Agenda */}
            <div
              className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => router.push("/barber_app")}
            >
              <div
                className={`p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10 ${
                  pathname === "/barber_app" ? "bg-blue-600/20" : "bg-white/5"
                }`}
              >
                <Calendar
                  className={`h-5 w-5 ${
                    pathname === "/barber_app"
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  pathname === "/barber_app" ? "text-white" : "text-gray-300"
                }`}
              >
                Agenda
              </span>
            </div>

            {/* Clientes */}
            <div
              className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => router.push("/barber_app/clients")}
            >
              <div
                className={`p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10 ${
                  pathname?.startsWith("/barber_app/clients")
                    ? "bg-blue-600/20"
                    : "bg-white/5"
                }`}
              >
                <Users
                  className={`h-5 w-5 ${
                    pathname?.startsWith("/barber_app/clients")
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  pathname?.startsWith("/barber_app/clients")
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                Clientes
              </span>
            </div>

            {/* Faturas */}
            <div
              className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => router.push("/barber_app/invoices")}
            >
              <div
                className={`p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10 ${
                  pathname?.startsWith("/barber_app/invoices")
                    ? "bg-blue-600/20"
                    : "bg-white/5"
                }`}
              >
                <FileText
                  className={`h-5 w-5 ${
                    pathname?.startsWith("/barber_app/invoices")
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  pathname?.startsWith("/barber_app/invoices")
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                Faturamento
              </span>
            </div>

            {/* Serviços */}
            <div
              className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => router.push("/barber_app/services")}
            >
              <div
                className={`p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10 ${
                  pathname?.startsWith("/barber_app/services")
                    ? "bg-blue-600/20"
                    : "bg-white/5"
                }`}
              >
                <Zap
                  className={`h-5 w-5 ${
                    pathname?.startsWith("/barber_app/services")
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  pathname?.startsWith("/barber_app/services")
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                Serviços
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
