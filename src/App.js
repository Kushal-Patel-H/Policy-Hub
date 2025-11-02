import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 🔥 React Hot Toast container */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { background: "#333", color: "#fff" },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
