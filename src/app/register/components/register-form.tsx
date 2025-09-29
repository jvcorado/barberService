import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerFormSchema } from "../types";
import type { FormData } from "../types";
import { ImageUpload } from "./image-upload";
import { Separator } from "@/components/ui/separator";

interface RegisterFormProps {
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  onSuccess: () => void;
}

// Função para aplicar máscara de telefone
const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Aplica a máscara (XX) XXXXX-XXXX
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

export function RegisterForm({
  imageFile,
  onImageChange,
  onSuccess,
}: RegisterFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phones: "",
      description: "",
      instagram: "",
      facebook: "",
      tiktok: "",
    },
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      console.log("Fazendo upload da imagem:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Upload bem-sucedido:", data.url);
        return data.url;
      } else {
        const errorData = await res.json();
        console.error("Erro no upload:", errorData);
        alert(
          `Erro ao fazer upload da imagem: ${errorData.error || "Erro desconhecido"}`,
        );
        return null;
      }
    } catch (error) {
      console.error("Erro na requisição de upload:", error);
      alert("Erro de conexão ao fazer upload da imagem");
      return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!imageFile) {
      alert("Envie uma imagem antes de registrar.");
      return;
    }

    const uploadedUrl = await uploadImage(imageFile);
    if (!uploadedUrl) return;

    startTransition(async () => {
      const res = await fetch("/api/register-barbershop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          imageUrl: uploadedUrl,
          phones: data.phones.split(",").map((p) => p.trim()),
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const { error } = await res.json();
        alert(error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="space-y-6"
      >
        {/* Image Upload Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Imagem da Barbearia
          </h3>
          <ImageUpload imageFile={imageFile} onImageChange={onImageChange} />
        </div>

        <Separator className="bg-border" />

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Informações Básicas
          </h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Nome da Barbearia
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Barbearia do Zé"
                    {...field}
                    className="h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Endereço
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua Exemplo, 123"
                    {...field}
                    className="h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phones"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Telefone
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 99999-9999"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const maskedValue = applyPhoneMask(e.target.value);
                      field.onChange(maskedValue);
                    }}
                    maxLength={15}
                    className="h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Descrição
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Cortes modernos e clássicos"
                    {...field}
                    className="h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="bg-border" />

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Redes Sociais
          </h3>
          <p className="text-muted-foreground text-sm">
            Adicione suas redes sociais para conectar com os clientes
          </p>

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Instagram
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://instagram.com/sua_barbearia"
                    {...field}
                    className="h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Facebook
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://facebook.com/sua_barbearia"
                    {...field}
                    className="h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  TikTok
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://tiktok.com/@sua_barbearia"
                    {...field}
                    className="h-11 border-border focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="bg-border" />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              Registrando...
            </div>
          ) : (
            "Registrar Barbearia"
          )}
        </Button>
      </form>
    </Form>
  );
}
