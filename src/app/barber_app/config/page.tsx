"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Palette, Save } from "lucide-react";
import Link from "next/link";

export default function ConfigPage() {
  const [colors, setColors] = useState({
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#3b82f6",
    backgroundColor: "#f9fafb",
    textColor: "#111827",
  });

  // Carregar cores atuais da barbearia
  useEffect(() => {
    const loadColors = async () => {
      try {
        const response = await fetch("/api/get-colors", {
          credentials: "include", // Incluir cookies de autenticação
        });
        if (response.ok) {
          const data = await response.json();
          if (data.barbershop) {
            setColors({
              primaryColor: data.barbershop.primaryColor || "#000000",
              secondaryColor: data.barbershop.secondaryColor || "#ffffff",
              accentColor: data.barbershop.accentColor || "#3b82f6",
              backgroundColor: data.barbershop.backgroundColor || "#f9fafb",
              textColor: data.barbershop.textColor || "#111827",
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar cores:", error);
      }
    };

    loadColors();
  }, []);

  const handleColorChange = (field: string, value: string) => {
    setColors((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/update-colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Incluir cookies de autenticação
        body: JSON.stringify(colors),
      });

      if (response.ok) {
        alert("Cores atualizadas com sucesso!");
      } else {
        alert("Erro ao atualizar cores");
      }
    } catch (error) {
      alert("Erro ao salvar configurações");
    }
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/barber_app">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.textColor }}
          >
            Configurações
          </h1>
          <p className="text-sm text-gray-600">
            Personalize as cores do seu app
          </p>
        </div>
      </div>

      {/* Configurações de Cores */}
      <div className="max-w-2xl mx-auto space-y-6">
        <Card style={{ backgroundColor: colors.secondaryColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personalização de Cores
            </CardTitle>
            <CardDescription>
              Escolha as cores que melhor representam sua barbearia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cor Primária */}
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Primária</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={colors.primaryColor}
                  onChange={(e) =>
                    handleColorChange("primaryColor", e.target.value)
                  }
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={colors.primaryColor}
                  onChange={(e) =>
                    handleColorChange("primaryColor", e.target.value)
                  }
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-gray-600">
                Usada para botões principais e textos importantes
              </p>
            </div>

            {/* Cor Secundária */}
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={colors.secondaryColor}
                  onChange={(e) =>
                    handleColorChange("secondaryColor", e.target.value)
                  }
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={colors.secondaryColor}
                  onChange={(e) =>
                    handleColorChange("secondaryColor", e.target.value)
                  }
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-gray-600">
                Usada para fundos de cards e elementos secundários
              </p>
            </div>

            {/* Cor de Destaque */}
            <div className="space-y-2">
              <Label htmlFor="accentColor">Cor de Destaque</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={colors.accentColor}
                  onChange={(e) =>
                    handleColorChange("accentColor", e.target.value)
                  }
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={colors.accentColor}
                  onChange={(e) =>
                    handleColorChange("accentColor", e.target.value)
                  }
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-gray-600">
                Usada para links e elementos interativos
              </p>
            </div>

            {/* Cor de Fundo */}
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={colors.backgroundColor}
                  onChange={(e) =>
                    handleColorChange("backgroundColor", e.target.value)
                  }
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={colors.backgroundColor}
                  onChange={(e) =>
                    handleColorChange("backgroundColor", e.target.value)
                  }
                  placeholder="#f9fafb"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-gray-600">
                Cor principal de fundo do app
              </p>
            </div>

            {/* Cor do Texto */}
            <div className="space-y-2">
              <Label htmlFor="textColor">Cor do Texto</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={colors.textColor}
                  onChange={(e) =>
                    handleColorChange("textColor", e.target.value)
                  }
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={colors.textColor}
                  onChange={(e) =>
                    handleColorChange("textColor", e.target.value)
                  }
                  placeholder="#111827"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-gray-600">Cor principal dos textos</p>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="p-4 rounded-lg border"
                style={{ backgroundColor: colors.secondaryColor }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.primaryColor }}
                >
                  Título de Exemplo
                </h3>
                <p style={{ color: colors.textColor }}>
                  Este é um texto de exemplo para mostrar como ficará a
                  aparência do seu app.
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: colors.primaryColor,
                      color: colors.secondaryColor,
                    }}
                  >
                    Botão de Exemplo
                  </Button>
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <Button
              onClick={handleSave}
              className="w-full gap-2"
              style={{
                backgroundColor: colors.primaryColor,
                color: colors.secondaryColor,
              }}
            >
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
