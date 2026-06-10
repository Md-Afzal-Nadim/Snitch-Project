import { createBrowserRouter } from "react-router"
import Register from "../features/auth/pages/Register.jsx"
import Login from "../features/auth/pages/Login.jsx"

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home</h1>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
])