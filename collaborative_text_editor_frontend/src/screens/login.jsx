import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [loginemail, setLoginEmail] = useState("");
    const [loginpassword, setLoginPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                loginemail,
                loginpassword
            });

            if (response.data.success) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("userId", response.data.userId);
                console.log(response.data.message);

                navigate("/"); 
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "An error occurred during login.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-secondary p-8 rounded-lg shadow-lg w-96">
                <h2 className="font-poppins font-semibold text-white mb-6 text-center text-4xl">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-text mb-2" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={loginemail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-text mb-2" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={loginpassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-tertiary text-white py-2 rounded-lg hover:opacity-90 transition cursor-pointer mt-8"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center flex justify-end gap-4">
                    <p className="text-text text-[12px]">Don't have an account?</p>
                    <Link to="/register" className="text-[12px] cursor-pointer text-white rounded-lg hover:opacity-90 transition">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
