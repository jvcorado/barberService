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
import { useRouter } from "next/navigation";
import { createService } from "@/src/actions/create-service";
import { useState, useTransition } from "react";

const formSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Preço deve ser maior que 0"),
  imageUrl: z.string().url("URL inválida").optional(),
  duration: z.coerce.number().min(1, "Duração deve ser positiva").optional(),
});

export default function CreateServicePage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

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
          router.push("/dashboard/services");
        })
        .catch((error) => {
          console.error("Erro ao criar barbearia", error);
        });
    });
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-6">Cadastrar novo serviço</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Corte masculino" {...field} />
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
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição do serviço" {...field} />
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
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
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
                  <FormLabel>Duração (min)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Imagem da Barbearia</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImageFile(file ?? null);
              }}
            />
            {imageFile && (
              <p className="text-sm text-muted-foreground">
                Selecionado: {imageFile.name}
              </p>
            )}
          </div>

          <div className="w-full flex items-center justify-end">
            <Button type="submit" className="w-full md:w-fit ">
              {isPending ? "Cadastrando..." : "Cadastrar serviço"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
