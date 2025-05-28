import { Profile } from "@/components/profile";
import { cn } from "@/lib/utils";
import { AuthProvider, publicRoutes } from "@/providers/auth-provider";
import { Users } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";

export function BaseLayout() {
  const pathname = useLocation().pathname;

  return (
    <>
      <AuthProvider>
        <div className="w-full flex-1 flex flex-col ">
          <header className="w-full inline-flex items-center justify-center bg-white border-b shadow py-4 px-4">
            <div className="inline-flex items-center justify-between w-full max-w-[1400px] ">
              <h1 className="font-bold text-2xl text-zinc-800 inline-flex gap-2 items-center">
                MAINCONSOFT
                <Users className="text-blue-500" />
              </h1>

              {!publicRoutes.includes(pathname) && (
                <div className="inline-flex items-center justify-center gap-6">
                  <ul className="flex items-center justify-center gap-4">
                    <li>
                      <Link
                        to="/register-client"
                        className={cn(
                          " text-zinc-800 font-semibold hover:bg-blue-100 hover:text-blue-500 px-2 py-1 rounded-sm transition-colors",
                          pathname === "/register-client" &&
                            "text-blue-500 font-semibold bg-blue-50"
                        )}>
                        Formulário
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={cn(
                          " text-zinc-800 font-semibold hover:bg-blue-100 hover:text-blue-500 px-2 py-1 rounded-sm transition-colors",
                          pathname === "/clients" &&
                            "text-blue-500 font-semibold bg-blue-50 "
                        )}
                        to="/clients">
                        Clientes
                      </Link>
                    </li>
                  </ul>
                  <Profile />
                </div>
              )}
            </div>
          </header>
          <main className="w-full max-w-[1400px] flex-1  mx-auto">
            <Outlet />
          </main>
        </div>
      </AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
