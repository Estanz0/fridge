import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../util/useAuth";

import Home from "./../pages/Home.tsx";
import NavbarComponent from "../components/Navbar.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavbarComponent />
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
