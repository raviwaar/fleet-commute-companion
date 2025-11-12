import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
// @ts-ignore
import FleetyLogo from "../assets/fleety-logo.png";

const Home: React.FC = () => {
    const { setCurrentView } = useAuth();

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 p-4 space-y-6">
            <img src={FleetyLogo} alt="Fleety Logo" className="w-40 h-40 object-contain" />
            <h1 className="text-2xl font-bold text-blue-700 text-center">
                Fleety — Your Fleet Commute Companion
            </h1>
            <p className="text-center text-gray-600 max-w-md">
                Play, ease your commute, and connect with fellow Fleeties.
            </p>
            <Card className="w-full max-w-sm text-center space-y-4">
                <Button onClick={() => setCurrentView("Login")}>Wanna Explore?</Button>
                <div className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                        onClick={() => setCurrentView("Login")}
                        className="text-blue-600 font-medium hover:text-blue-500"
                    >
                        Sign In
                    </button>
                </div>
                <div className="text-sm text-gray-500">
                    New here?{" "}
                    <button
                        onClick={() => setCurrentView("Register")}
                        className="text-blue-600 font-medium hover:text-blue-500"
                    >
                        Create Account
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Home;
