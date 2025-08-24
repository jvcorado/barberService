import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().optional(),
  phones: z.string().min(1, "Informe pelo menos um telefone"),
  description: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
});

export type FormData = z.infer<typeof registerFormSchema>;
