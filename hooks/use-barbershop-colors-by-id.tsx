import { useState, useEffect } from "react";

interface BarbershopColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

interface UseBarbershopColorsByIdReturn {
  colors: BarbershopColors;
  isLoading: boolean;
  error: string | null;
  refreshColors: () => void;
}

const defaultColors: BarbershopColors = {
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  accentColor: "#3b82f6",
  backgroundColor: "#f9fafb",
  textColor: "#111827",
};

export function useBarbershopColorsById(
  barbershopId: string | null,
): UseBarbershopColorsByIdReturn {
  const [colors, setColors] = useState<BarbershopColors>(defaultColors);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = async () => {
    if (!barbershopId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/get-colors/${barbershopId}`);
      if (response.ok) {
        const data = await response.json();
        setColors(data.barbershop);
      } else {
        setError("Erro ao carregar cores");
      }
    } catch (err) {
      setError("Erro ao carregar cores");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshColors = () => {
    fetchColors();
  };

  useEffect(() => {
    if (barbershopId) {
      fetchColors();
    } else {
      setIsLoading(false);
    }
  }, [barbershopId]);

  return {
    colors,
    isLoading,
    error,
    refreshColors,
  };
}
