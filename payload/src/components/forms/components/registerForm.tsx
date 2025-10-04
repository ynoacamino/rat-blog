"use client";

import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { InferItem } from "./infer-field";
import { registerFields, RegisterInterface, registerSchema } from "../structs/register";

interface RegisterFormProps {
  onSubmit?: (data: RegisterInterface) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {

  const form = useForm<RegisterInterface>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',

    },
  });

  const handleSubmit = async (data: RegisterInterface) => {
    console.log('Formulario de Registro enviado:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mt-10 mb-14 flex w-full flex-col gap-8"
    >
      {registerFields.map((field) => (
        <FormField
          key={`clasic-exam-${field.name}`}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <InferItem {...field} {...formField} />
          )}
        />
      ))}

      <div className="flex justify-center">
        <Button type="submit" className="w-full">
          Empezar Examen
        </Button>
      </div>
    </form>
  </Form>
  )
}
