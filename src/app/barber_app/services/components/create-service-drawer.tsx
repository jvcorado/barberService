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
import { createService } from "@/src/actions/create-service";
import { useState, useTransition } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Preço deve ser maior que 0"),
  imageUrl: z.string().url("URL inválida").optional(),
  duration: z.coerce.number().min(1, "Duração deve ser positiva").optional(),
});

interface CreateServiceDrawerProps {
  onServiceCreated?: () => void;
}

export default function CreateServiceDrawer({
  onServiceCreated,
}: CreateServiceDrawerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
    },
  });

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
      alert("Erro ao fazer upload da imagem");
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!imageFile) {
      alert("Envie uma imagem antes de registrar.");
      return;
    }

    const uploadedUrl = await uploadImage(imageFile);
    if (!uploadedUrl) return;

    startTransition(() => {
      createService({
        name: values.name,
        description: values.description,
        price: values.price,
        imageUrl: uploadedUrl,
        duration: values.duration,
      })
        .then(() => {
          setOpen(false);
          form.reset();
          setImageFile(null);
          onServiceCreated?.();
        })
        .catch((error) => {
          console.error("Erro ao criar serviço", error);
        });
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 text-white border-slate-700">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-white">
            Cadastrar Novo Serviço
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
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
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
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
                          className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
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
                          className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
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
                    id="image-upload-create"
                  />
                  <label
                    htmlFor="image-upload-create"
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

                {/* Preview da imagem selecionada */}
                {imageFile && (
                  <div className="space-y-2">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-blue-500">
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Imagem selecionada"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-blue-400 font-medium">
                        Imagem selecionada:
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
                  className="flex-1 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={isPending}
                >
                  {isPending ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
