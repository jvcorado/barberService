import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface BarbershopColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

interface UseBarbershopColorsReturn {
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

export function useBarbershopColors(): UseBarbershopColorsReturn {
  const { data: session, status } = useSession();
  const [colors, setColors] = useState<BarbershopColors>(defaultColors);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = async () => {
    if (!session?.user?.admin) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/get-colors");
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
    if (status === "authenticated") {
      fetchColors();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [session, status]);

  return {
    colors,
    isLoading,
    error,
    refreshColors,
  };
}
