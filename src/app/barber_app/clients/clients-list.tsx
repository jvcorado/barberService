"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Search, MessageSquare, Calendar, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Client {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  phone?: string | null;
  role: "sender" | "receiver" | "client";
  code: string;
  totalBookings?: number;
  lastBooking?: {
    id: string;
    date: Date;
    status: string;
    service: {
      name: string;
      price: number;
    };
  } | null;
}

export default function ClientsList({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  console.log(clients, "clients");

  const filtered = clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  console.log(filtered, "filtered");

  return (
    <div className="flex flex-col gap-6 px-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Pesquisar clientes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 py-3 bg-white/10 border border-white/20 placeholder:text-gray-400 text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 py-6">
        {filtered.map((client) => (
          <Card
            key={client.id}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl p-6"
          >
            <div className="flex flex-col space-y-4">
              {/* Client Info */}
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  {client.avatarUrl ? (
                    <AvatarImage src={client.avatarUrl} alt={client.name} />
                  ) : (
                    <AvatarFallback className="text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-lg truncate">
                    {client.name}
                  </h3>

                  {/* Contact Info */}
                  <div className="space-y-1 mt-2">
                    {client.email && (
                      <div className="flex items-center space-x-2 text-gray-300 text-sm">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center space-x-2 text-gray-300 text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Booking Stats */}
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge
                      className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-1"
                      variant="secondary"
                    >
                      {client.totalBookings || 0} agendamentos
                    </Badge>

                    {client.lastBooking && (
                      <div className="flex items-center space-x-1 text-gray-300 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Último:{" "}
                          {format(new Date(client.lastBooking.date), "dd/MM", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  onClick={() =>
                    router.push(`/barber_app/messages/${client.id}`)
                  }
                >
                  <MessageSquare className="w-4 h-4" />
                  Enviar Mensagem
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-300 text-sm">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
