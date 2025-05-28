import { RHFForm } from "@/components/rhf/rhf-form";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRequester } from "@/hooks/use-requester";
import { api, ManageToken } from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleUser, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string({ required_error: "Nome é um campo obrigatório" })
    .trim()
    .min(3, "Nome precisa ter no mínimo 3 caracteres"),
  email: z
    .string({ required_error: "Email é um campo obrigatório" })
    .trim()
    .min(1, "Email é um campo obrigatório")
    .email({ message: "Passe um email valido" }),
  password: z
    .string({ required_error: "Senha é um campo obrigatório" })
    .trim()
    .min(6, "Senha precisa ter no mínimo 6 caracteres")
    .max(100, "Senha precisa ter no máximo 100 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasToken = !!ManageToken.get();

  const methods = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && hasToken) {
      navigate("/register-client", { replace: true });
    }
  }, [user, hasToken, navigate]);

  const { mutation, isPending } = useRequester({
    mutateFn: (body: RegisterSchema) =>
      api.post<any, any, RegisterSchema>("/auth/register", {
        name: body.name,
        email: body.email,
        password: body.password,
      }),
    onSuccess: () => {
      navigate("/");
    },
    onError: (error: any) => {
      // console.log(error);
      if (
        error.response.status === 400 &&
        error.response.data === "User already exists, please login"
      ) {
        methods.setError("email", {
          message: "Já existe um usuário com esse email",
        });
      }
    },
  });

  function onSubmit({ name, email, password }: RegisterSchema) {
    if (isPending) return;
    mutation({ name, email, password });
  }

  return (
    <div className="max-w-xl mx-auto pt-12 px-4">
      <div className="bg-white w-full rounded-md shadow-sm border p-8 mx-auto flex flex-col items-center justify-center">
        <div className="w-full text-center flex flex-col items-center justify-center gap-2">
          <CircleUser className="text-blue-400 stroke-3 size-10" />
          <h2 className="text-4xl font-bold text-gray-800">Crie sua conta</h2>
        </div>
        <Separator className="my-5" />
        <div className="w-full">
          <RHFForm methods={methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6 w-full">
              <RHFInput<RegisterSchema>
                name="name"
                placeholder="exemplo..."
                required
                label="Nome"
              />
              <RHFInput<RegisterSchema>
                name="email"
                placeholder="@exemplo.com"
                required
                label="Email"
              />
              <RHFInput<RegisterSchema>
                type="password"
                name="password"
                placeholder="•••••••••"
                required
                label="Senha"
              />
              <div className="w-full inline-flex items-center justify-end">
                <span className="text-zinc-800 text-sm [&>a]:hover:underline [&>a]:hover:text-blue-500 [&>a]:font-bold">
                  Já tem conta? Então é só <Link to={"/"}>entrar</Link>
                </span>
              </div>

              <Button
                disabled={isPending}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-6 items-center">
                {isPending ? "Registrando" : "Registrar"}
                {isPending ? (
                  <Loader2 className="animate-spin " />
                ) : (
                  <ArrowRight />
                )}
              </Button>
            </form>
          </RHFForm>
        </div>
      </div>
    </div>
  );
}
