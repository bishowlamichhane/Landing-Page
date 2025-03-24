import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/authContext";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="open-shop-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
