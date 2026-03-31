import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(3, "Senha deve ter no mínimo 3 caracteres"),
});

export const CadastroSchema = z.object({
  nomeConsultor: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  dataCadastro: z.string().datetime(),
  fezVenda: z.boolean(),
  dataVenda: z.string().datetime().optional(),
});

export const VendaSchema = z.object({
  dataVenda: z.string().datetime(),
});

export const ValidacaoSchema = z.object({
  status: z.enum(["APROVADO", "REJEITADO"]),
  comentario: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type CadastroInput = z.infer<typeof CadastroSchema>;
export type VendaInput = z.infer<typeof VendaSchema>;
export type ValidacaoInput = z.infer<typeof ValidacaoSchema>;
