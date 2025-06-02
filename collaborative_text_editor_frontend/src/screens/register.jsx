import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/auth/signup", {
                email,
                password,
            });

            if (res.data.success) {
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                localStorage.setItem("userId", res.data.userId);
                
                navigate("/");
            } else {
                setError(res.data.message || "Registration failed.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-secondary p-8 rounded-lg shadow-lg w-96">
                <h2 className="font-poppins font-semibold text-white mb-6 text-center text-4xl">Register</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="mb-6">
                        <label className="block text-text mb-2" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-text mb-2" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-text mb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            type="password"
                            id="confirmPassword"
                            placeholder="Enter confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-tertiary text-white py-2 rounded-lg hover:opacity-90 transition cursor-pointer mt-8"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <div className="mt-4 text-center flex justify-end gap-4">
                    <p className="text-text text-[12px]">Already have an account?</p>
                    <Link
                        to="/login"
                        className="text-[12px] cursor-pointer text-white rounded-lg hover:opacity-90 transition"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
