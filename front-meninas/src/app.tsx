import { createBrowserRouter } from "react-router";
import { RegisterClintPage } from "./pages/register-client";
import { BaseLayout } from "./layout/base.layout";
import { LoginPage } from "./pages/login";
import { ClientsPage } from "./pages/clients";
import { RegisterPage } from "./pages/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/register-client",
        element: <RegisterClintPage />,
      },
      {
        path: "/clients",
        element: <ClientsPage />,
      },
    ],
  },
]);
