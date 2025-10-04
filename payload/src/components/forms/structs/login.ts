import {z} from "zod";
import { Field } from "../types/field";
import { SupportedFields } from "../lib/field";

export const loginSchema = z.object({
  email: z.email({message: "El correo no es válido"}),
  password: z.string().min(6, {message: "La contraseña debe tener al menos 6 caracteres"}),
});

export type LoginInterface = z.infer<typeof loginSchema>;

export const loginFields: Field<keyof LoginInterface>[] = [
  {
    name: "email",
    label: "Correo electrónico",
    type: SupportedFields.TEXT,
    placeholder: "tucorreo@unsa.edu.pe",
  },
  {
    name: "password",
    label: "Contraseña",
    type: SupportedFields.PASSWORD,
    placeholder: "********",
  }
]
