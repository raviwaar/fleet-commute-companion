import React from "react";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./components/dashboard/DashBoard";

const App: React.FC = () => {
    const { currentView, isLoggedIn } = useAuth();

    if (!isLoggedIn && currentView === "Dashboard") {
        return <Login />;
    }

    switch (currentView) {
        case "Login":
            return <Login />;
        case "Register":
            return <Register />;
        case "Dashboard":
            return <DashboardPage />;
        default:
            return <Home />;
    }
};

export default App;
