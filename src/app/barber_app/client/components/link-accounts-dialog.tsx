"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Link } from "lucide-react";
import { useSession } from "next-auth/react";

interface LinkAccountsDialogProps {
  barbershopId: string;
}

export default function LinkAccountsDialog({
  barbershopId,
}: LinkAccountsDialogProps) {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLinkAccounts = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/link-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Contas vinculadas com sucesso!" });
        setEmail("");
        setPassword("");
        setIsOpen(false);
        // Atualizar a sessão
        await update();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erro ao vincular contas",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro interno do servidor" });
    } finally {
      setLoading(false);
    }
  };

  // Verificar se o usuário tem conta Google
  const hasGoogleAccount = session?.user && session.user.email;

  if (!hasGoogleAccount) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
          <Link className="h-4 w-4" />
          Vincular Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular Conta</DialogTitle>
          <DialogDescription>
            Adicione uma senha à sua conta Google para poder fazer login com
            email e senha também.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLinkAccounts} className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-xl text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="link-email">Email</Label>
            <Input
              id="link-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-password">Nova Senha</Label>
            <div className="relative">
              <Input
                id="link-password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-xl pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Vinculando..." : "Vincular"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
