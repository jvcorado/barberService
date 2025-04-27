"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createBarbershop } from "@/src/actions/create-barbershop";

const formSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  phones: z.string().min(5),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export default function CreateBarbershopForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phones: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createBarbershop({
        name: values.name,
        address: values.address,
        phones: values.phones.split(",").map((p) => p.trim()),
        description: values.description,
        imageUrl: values.imageUrl,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar barbearia", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Cadastrar Barbearia</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da barbearia" {...field} />
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
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, cidade" {...field} />
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
                <FormLabel>Telefones</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: (11) 99999-9999, (11) 98888-8888"
                    {...field}
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
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Sobre a barbearia..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Cadastrar Barbearia
          </Button>
        </form>
      </Form>
    </div>
  );
}
