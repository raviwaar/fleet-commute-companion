import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
// @ts-ignore
import FleetyLogo from "../assets/fleety-logo.png";

const Login: React.FC = () => {
    const { login, setCurrentView } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await login(username, password);
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 p-4 space-y-6">
            <img src={FleetyLogo} alt="Fleety Logo" className="w-40 h-40 object-contain" />
            <Card className="w-full max-w-sm p-6">
                <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    <Button type="submit" isLoading={isLoading} className="w-full">Log In</Button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <button
                        onClick={() => setCurrentView("Register")}
                        className="text-blue-600 font-medium hover:text-blue-500"
                    >
                        Register here
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default Login;
