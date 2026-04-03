import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import { setupInterceptors } from "./api/axios.js";

import App from "./App.jsx";

setupInterceptors();

const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
);
