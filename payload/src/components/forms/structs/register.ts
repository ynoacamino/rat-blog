import {z} from "zod";
import { Field } from "../types/field";
import { SupportedFields } from "../lib/field";

export const registerSchema = z.object({
  fullName: z.string().min(2, {message: "El nombre completo debe tener al menos 2 caracteres"}),
  userType: z.enum(['voter', 'candidate']),
  email: z.email({message: "El correo no es válido"}),
  password: z.string().min(6, {message: "La contraseña debe tener al menos 6 caracteres"}),
  confirmPassword: z.string().min(6, {message: "La confirmación de la contraseña debe tener al menos 6 caracteres"}),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
});

export type RegisterInterface = z.infer<typeof registerSchema>;

export const registerFields: Field<keyof RegisterInterface>[] = [
  {
    name: "fullName",
    label: "Nombre completo",
    type: SupportedFields.TEXT,
    placeholder: "Tu nombre completo",
  },
  {
    name: "userType",
    label: "Tipo de usuario",
    type: SupportedFields.TOGGLE_GROUP,
    options: [
      { textValue: "Votante", value: "voter", key: "voter" },
      { textValue: "Candidato", value: "candidate", key: "candidate" },
    ],
    columns: 2,
    placeholder: "Selecciona tu tipo de usuario",
  },
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
  },
  {
    name: "confirmPassword",
    label: "Confirmar contraseña",
    type: SupportedFields.PASSWORD,
    placeholder: "********",
  }
]
