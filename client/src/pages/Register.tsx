import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
// @ts-ignore
import FleetyLogo from "../assets/fleety-logo.png";

const Register: React.FC = () => {
    const { register, setCurrentView } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await register(username, email, password);
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 p-4 space-y-6">
            <img src={FleetyLogo} alt="Fleety Logo" className="w-40 h-40 object-contain" />
            <Card className="w-full max-w-sm p-6">
                <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    <Button type="submit" isLoading={isLoading} className="w-full">Register</Button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <button
                        onClick={() => setCurrentView("Login")}
                        className="text-blue-600 font-medium hover:text-blue-500"
                    >
                        Sign In
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default Register;
