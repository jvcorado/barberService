"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ClientLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const barbershopId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para registro
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para mensagens
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user && barbershopId) {
      router.push(`/client?id=${barbershopId}`);
    }
  }, [session, status, barbershopId, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: `/client?id=${barbershopId}`,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      setMessage({ type: "error", text: "Erro ao fazer login com Google" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setMessage({ type: "error", text: "Email ou senha incorretos" });
      } else if (result?.ok) {
        setMessage({ type: "success", text: "Login realizado com sucesso!" });
        setTimeout(() => {
          router.push(`/client?id=${barbershopId}`);
        }, 1000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro interno do servidor" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (registerPassword !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não coincidem" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Conta criada com sucesso! Faça login para continuar.",
        });
        setActiveTab("login");
        setLoginEmail(registerEmail);
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPhone("");
        setRegisterPassword("");
        setConfirmPassword("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erro ao criar conta",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro interno do servidor" });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBarbershop = () => {
    if (barbershopId) {
      router.push(`/link-page/${barbershopId}`);
    } else {
      router.push("/");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3 px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToBarbershop}
            className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">Login do Cliente</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <div className="text-center text-white font-bold text-xs leading-tight">
                <div className="font-serif">BARBERAPP</div>
                <div className="text-[10px] mt-1">SUA RENOMARDA</div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Bem-vindo ao App do Cliente
            </CardTitle>
            <CardDescription className="text-gray-300">
              Faça login ou crie uma conta para acessar seus agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-xl p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 transition-all duration-200"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 transition-all duration-200"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Mensagens */}
              {message && (
                <div
                  className={`mt-4 p-4 rounded-xl text-sm backdrop-blur-sm border ${
                    message.type === "success"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Tab de Login */}
              <TabsContent value="login" className="space-y-6 mt-6">
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="login-email"
                      className="text-white font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="login-password"
                      className="text-white font-medium"
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="h-12 rounded-xl pr-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
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
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : null}
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-400">
                      ou
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-12 text-base rounded-xl bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                  variant="outline"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                  )}
                  {loading ? "Entrando..." : "Entrar com Google"}
                </Button>
              </TabsContent>

              {/* Tab de Registro */}
              <TabsContent value="register" className="space-y-6 mt-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="register-name"
                      className="text-white font-medium"
                    >
                      Nome Completo
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="register-email"
                      className="text-white font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="register-phone"
                      className="text-white font-medium"
                    >
                      Telefone
                    </Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="register-password"
                      className="text-white font-medium"
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-12 rounded-xl pr-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
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
                  <div className="space-y-3">
                    <Label
                      htmlFor="confirm-password"
                      className="text-white font-medium"
                    >
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-12 rounded-xl pr-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : null}
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center text-sm text-gray-400">
              <p>
                Ao fazer login, você concorda com nossos{" "}
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Política de Privacidade
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
