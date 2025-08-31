"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Search, MessageSquare } from "lucide-react";

export interface Client {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role: "sender" | "receiver";
  code: string;
}

export default function ClientsList({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 px-4  min-h-screen">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => router.push("/barber_app/clients/add")}
        >
          <Plus className="w-4 h-4" />
          Add new client
        </Button>
      </div> */}

      {/* Tabs */}
      {/* <Tabs value={tab} onValueChange={(v) => setTab(v)} className="w-full">
        <TabsList className="w-full bg-white rounded-lg p-1 shadow-sm">
          <TabsTrigger
            value="all"
            className="flex-1 text-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium"
          >
            All Clients ({clients.length})
          </TabsTrigger>
          <TabsTrigger
            value="senders"
            className="flex-1 text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium"
          >
            Senders ({countSenders})
          </TabsTrigger>
          <TabsTrigger
            value="receivers"
            className="flex-1 text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium"
          >
            Receivers ({countReceivers})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="senders" />
        <TabsContent value="receivers" />
      </Tabs> */}
      <div className="flex flex-col gap-4 bg-white pt-6 pb-4 px-4 border-b border-gray-100 fixed top-0 left-0 right-0 z-20">
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquise aqui"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 py-3 bg-white border border-gray-200 placeholder:text-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-32 pb-6">
        {filtered.map((client) => (
          <Card
            key={client.id}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6"
          >
            <div className="flex flex-col space-y-4">
              {/* Client Info */}
              <div className="flex items-center space-x-4">
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
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {client.name}
                  </h3>
                  <Badge
                    className={`mt-1 text-xs px-2 py-1 rounded-full ${
                      client.role === "sender"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                    variant="secondary"
                  >
                    {client.role === "sender" ? "Cliente" : "Cliente"}
                  </Badge>
                </div>
              </div>

              {/* ID Number */}
              {/* <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Id number:</span>
                <span className="font-semibold text-gray-900">
                  {client.code}
                </span>
              </div> */}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {/* <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center gap-2"
                  onClick={() =>
                    router.push(`/barber_app/clients/${client.id}`)
                  }
                >
                  <User className="w-4 h-4" />
                  Visit Profile
                </Button> */}
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center gap-2"
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
            <p className="text-gray-500 text-sm">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
