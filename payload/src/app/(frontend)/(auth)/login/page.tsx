import LoginForm from "@/components/forms/components/loginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <h1 className="mb-6 text-3xl font-bold">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  )
}
