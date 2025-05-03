// app/register-barbershop/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().optional(),
  phones: z.string().min(1, "Informe pelo menos um telefone"),
  description: z.string().optional(),
  imageUrl: z.string().url("URL inválida").optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterBarbershop() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phones: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const res = await fetch("/api/register-barbershop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          phones: data.phones.split(",").map((p) => p.trim()),
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const { error } = await res.json();
        alert(error);
      }
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl"> Registrar Barbearia</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para registrar sua barbearia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className=" mx-auto mt-10 space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Barbearia</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Barbearia do Zé"
                              {...field}
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
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua Exemplo, 123" {...field} />
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
                          <FormLabel>
                            Telefones (separados por vírgula)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(11) 99999-9999, (11) 98888-8888"
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
                            <Input
                              placeholder="Ex: Cortes modernos e clássicos"
                              {...field}
                            />
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
                          <FormLabel>URL da Imagem</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? "Registrando..." : "Registrar Barbearia"}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
