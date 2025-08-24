import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface PWAToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function PWAToast({
  message,
  type,
  duration = 3000,
  onClose,
}: PWAToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg ${getBgColor()} animate-in slide-in-from-right-4 duration-300`}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-sm font-medium text-gray-900">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
