"use client"

import { Form, FormField } from "@/components/ui/form";
import { loginFields, LoginInterface, loginSchema } from "../structs/login";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { InferItem } from "./infer-field";

interface LoginFormProps {
  onSubmit?: (data: LoginInterface) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {

  const form = useForm<LoginInterface>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: LoginInterface) => {
    console.log('Formulario de login enviado:', data);
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
      {loginFields.map((field) => (
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
