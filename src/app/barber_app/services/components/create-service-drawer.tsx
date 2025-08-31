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
import { PlusCircleIcon } from "lucide-react";

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
          variant="default"
          className="bg-white text-black border hover:bg-gray-50"
        >
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          Criar Serviço
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white text-black">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-black">
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
                    <FormLabel className="text-black">Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Corte masculino"
                        {...field}
                        className="bg-white border-gray-300 text-black"
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
                    <FormLabel className="text-black">Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do serviço"
                        {...field}
                        className="bg-white border-gray-300 text-black"
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
                      <FormLabel className="text-black">Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          className="bg-white border-gray-300 text-black"
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
                      <FormLabel className="text-black">
                        Duração (min)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-white border-gray-300 text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel className="text-black">Imagem do Serviço</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setImageFile(file ?? null);
                  }}
                  className="bg-white border-gray-300 text-black"
                />
                {imageFile && (
                  <p className="text-sm text-gray-600">
                    Selecionado: {imageFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-white border-gray-300 text-black hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-800"
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
