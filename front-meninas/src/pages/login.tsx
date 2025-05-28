import { RHFForm } from "@/components/rhf/rhf-form";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRequester } from "@/hooks/use-requester";
import { api, ManageToken } from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email é um campo obrigatório" })
    .trim()
    .min(1, "Email é um campo obrigatório")
    .email({ message: "Passe um email valido" }),
  password: z
    .string({ required_error: "Senha é um campo obrigatório" })
    .trim()
    .min(1, "Senha é um campo obrigatório"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const hasToken = !!ManageToken.get();

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
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
    mutateFn: (body: LoginSchema) =>
      api.post<any, any, LoginSchema>("/auth/login", {
        email: body.email,
        password: body.password,
      }),
    onSuccess: (data) => {
      ManageToken.set(data.access_token);
      setUser(data.user);
      toast(`Bem vindo ${data.user.name}`);
      navigate("/register-client", { replace: true });
    },
    onError: (error: any) => {
      // console.log(error);
      if (
        (error.response.status === 401 || error.response.status === 400) &&
        error.response.data === "Invalid credentials"
      ) {
        methods.setError("email", {
          message: "Email ou senha estão incorretos",
        });
        methods.setError("password", {
          message: "Email ou senha estão incorretos",
        });
      }
    },
  });

  function onSubmit({ email, password }: LoginSchema) {
    if (isPending) return;
    mutation({ email, password });
  }

  return (
    <div className="max-w-xl mx-auto pt-12 px-4">
      <div className="bg-white w-full rounded-md shadow-sm border p-8 mx-auto flex flex-col items-center justify-center">
        <div className="w-full text-center flex flex-col items-center justify-center gap-2">
          <LogIn className="text-blue-400 stroke-3 size-10" />
          <h2 className="text-4xl font-bold text-gray-800">Bem vindo!</h2>
          <p>Entre na sua conta</p>
        </div>
        <Separator className="my-5" />
        <div className="w-full">
          <RHFForm methods={methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-6 w-full">
              <RHFInput<LoginSchema>
                name="email"
                placeholder="@exemplo.com"
                required
                label="Email"
              />
              <RHFInput<LoginSchema>
                type="password"
                name="password"
                placeholder="•••••••••"
                required
                label="Senha"
              />
              <div className="w-full inline-flex items-center justify-end">
                <span className="text-zinc-800 text-sm [&>a]:hover:underline [&>a]:hover:text-blue-500 [&>a]:font-bold">
                  Ainda não tem uma conta?{" "}
                  <Link to={"/register"}>Registar</Link>
                </span>
              </div>

              <Button
                disabled={isPending}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white py-6 items-center">
                {isPending ? "Entrando" : "Entrar"}
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
