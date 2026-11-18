import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/login/Login";
import SignUP from "./pages/signUp/SignUP";
import Home from "./pages/home/Home";
import { Toast } from "@heroui/react";
import AuthContext from "./context/authContext";
import CheckToken from "./components/checkToken/CheckToken";
import Profile from "./pages/profile/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PagePost from "./pages/PagePost/PagePost";
import Notifications from "./components/Notifications/Notifications";

let Client = new QueryClient();

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: (
          <CheckToken>
            <Home />
          </CheckToken>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUP />,
      },
      {
        path: "/profile",
        element: (
          <CheckToken>
            <Profile />
          </CheckToken>
        ),
      },
      {
        path: "/PagePost/:id",
        element: (
          <CheckToken>
            <PagePost />
          </CheckToken>
        ),
      },
      {
        path: "/notifications",
        element: (
          <CheckToken>
            <Notifications />
          </CheckToken>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <QueryClientProvider client={Client}>
        <AuthContext>
          <Toast.Provider placement="top" />
          <RouterProvider router={router} />
        </AuthContext>
      </QueryClientProvider>
    </>
  );
}

export default App;
