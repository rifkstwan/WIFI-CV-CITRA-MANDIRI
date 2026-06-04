import { createBrowserRouter } from "react-router-dom"
import { HomePage } from "../pages/public/HomePage"
import { LoginPage } from "../pages/auth/LoginPage"
import { RegisterPage } from "../pages/auth/RegisterPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
])