"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateService } from "@/src/actions/update-service";
import { useState, useTransition, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Edit } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Preço deve ser maior que 0"),
  imageUrl: z.string().optional().or(z.literal("")),
  duration: z.coerce.number().min(1, "Duração deve ser positiva").optional(),
});

interface EditServiceDrawerProps {
  service: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    duration?: number | null;
  };
}

export default function EditServiceDrawer({ service }: EditServiceDrawerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service.name,
      description: service.description || "",
      price: service.price,
      duration: service.duration || 30,
      imageUrl: service.imageUrl || "",
    },
  });

  // Atualizar o formulário quando o serviço mudar
  useEffect(() => {
    form.reset({
      name: service.name,
      description: service.description || "",
      price: service.price,
      duration: service.duration || 30,
      imageUrl: service.imageUrl || "",
    });
  }, [service, form]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    } else {
      toast.error("Erro ao fazer upload da imagem");
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Iniciando atualização do serviço...", values);

      let imageUrl = values.imageUrl || service.imageUrl;

      // Se uma nova imagem foi selecionada, fazer upload
      if (imageFile) {
        console.log("Fazendo upload da nova imagem...");
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) {
          toast.error("Erro ao fazer upload da imagem");
          return;
        }
        imageUrl = uploadedUrl;
        console.log("Upload concluído:", imageUrl);
      }

      console.log("Dados para atualização:", {
        serviceId: service.id,
        name: values.name,
        description: values.description,
        price: values.price,
        imageUrl: imageUrl,
        duration: values.duration,
      });

      startTransition(() => {
        updateService({
          serviceId: service.id,
          name: values.name,
          description: values.description,
          price: values.price,
          imageUrl: imageUrl || undefined,
          duration: values.duration,
        })
          .then(() => {
            console.log("Serviço atualizado com sucesso!");
            setOpen(false);
            setImageFile(null);
            toast.success("Serviço atualizado com sucesso!");
          })
          .catch((error) => {
            console.error("Erro ao atualizar serviço:", error);
            toast.error(
              `Erro ao atualizar serviço: ${error.message || "Erro desconhecido"}`,
            );
          });
      });
    } catch (error) {
      console.error("Erro na função onSubmit:", error);
      toast.error("Erro ao processar formulário");
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white border-white/10">
          <DrawerHeader className="border-b border-white/10">
            <DrawerTitle className="text-xl font-bold text-white text-center">
              Editar Serviço
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-6 max-h-[80vh] overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Corte masculino"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-white/20"
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
                      <FormLabel className="text-white">Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição do serviço"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-white/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-white">Preço (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-white/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="text-white">
                          Duração (min)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-white/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel className="text-white text-sm font-medium">
                    Imagem do Serviço
                  </FormLabel>

                  {/* Preview da imagem atual */}
                  {service.imageUrl && !imageFile && (
                    <div className="space-y-2">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-600">
                        <img
                          src={service.imageUrl}
                          alt="Imagem atual"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-slate-400">Imagem atual</p>
                    </div>
                  )}

                  {/* Área de upload customizada */}
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImageFile(file ?? null);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800/70 hover:border-slate-500 transition-all duration-200 group"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-2 text-slate-400 group-hover:text-slate-300 transition-colors"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                          <span className="font-semibold">
                            Clique para escolher
                          </span>{" "}
                          uma imagem
                        </p>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                          PNG, JPG ou WEBP (máx. 10MB)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Preview da nova imagem selecionada */}
                  {imageFile && (
                    <div className="space-y-2">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-blue-500">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Nova imagem"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-blue-400 font-medium">
                          Nova imagem selecionada:
                        </p>
                        <p className="text-sm text-slate-300 truncate max-w-32">
                          {imageFile.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl"
                    disabled={isPending}
                  >
                    {isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
