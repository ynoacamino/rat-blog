import RegisterForm from "@/components/forms/components/registerForm";


export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <h1 className="mb-6 text-3xl font-bold">
        Crear una Cuenta
      </h1>
      <RegisterForm />

    </div>
  )
}
