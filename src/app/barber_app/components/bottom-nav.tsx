"use client";

import { Calendar, Users, FileText, Zap, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";

export default function BottomNav() {
  const router = useRouter();
  const { colors } = useBarbershopColors();
  return (
    <div className="p-2 bg-white flex justify-center">
      <div
        className="rounded-2xl p-4 backdrop-blur-xl  w-full max-w-md"
        style={{
          backgroundColor: `${colors.secondaryColor}80`,
          borderColor: `${colors.primaryColor}30`,
          boxShadow: `0 8px 32px ${colors.primaryColor}15`,
        }}
      >
        <div className="flex justify-around items-center">
          {/* Agenda */}
          <div
            className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110"
            onClick={() => router.push("/barber_app")}
          >
            <div
              className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
              style={{ backgroundColor: colors.primaryColor + "20" }}
            >
              <Calendar
                className="h-5 w-5"
                style={{ color: colors.primaryColor }}
              />
            </div>
            <span
              className="text-xs mt-2 font-medium"
              style={{ color: colors.primaryColor }}
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
              className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
              style={{ backgroundColor: colors.textColor + "15" }}
            >
              <Users className="h-5 w-5" style={{ color: colors.textColor }} />
            </div>
            <span
              className="text-xs mt-2 font-medium"
              style={{ color: colors.textColor }}
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
              className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
              style={{ backgroundColor: colors.textColor + "15" }}
            >
              <FileText
                className="h-5 w-5"
                style={{ color: colors.textColor }}
              />
            </div>
            <span
              className="text-xs mt-2 font-medium"
              style={{ color: colors.textColor }}
            >
              Faturas
            </span>
          </div>

          {/* Serviços */}
          <div
            className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110"
            onClick={() => router.push("/barber_app/services")}
          >
            <div
              className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
              style={{ backgroundColor: colors.textColor + "15" }}
            >
              <Zap className="h-5 w-5" style={{ color: colors.textColor }} />
            </div>
            <span
              className="text-xs mt-2 font-medium"
              style={{ color: colors.textColor }}
            >
              Serviços
            </span>
          </div>

          {/* Loja */}
          {/* <div
            className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110"
            onClick={() => router.push("/barber_app/store")}
          >
            <div
              className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
              style={{ backgroundColor: colors.textColor + "15" }}
            >
              <ShoppingBag
                className="h-5 w-5"
                style={{ color: colors.textColor }}
              />
            </div>
            <span
              className="text-xs mt-2 font-medium"
              style={{ color: colors.textColor }}
            >
              Loja
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
