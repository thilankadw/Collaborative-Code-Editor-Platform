import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import RightArrow from '../assets/rightarrow.svg';

const CreateProjectScreen = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post('/api/project/', {
                name,
                description
            });

            if (response.data.success) {
                navigate('/all-projects');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-secondary p-8 rounded-lg shadow-lg w-[600px]">
                <h2 className="font-poppins font-semibold text-white mb-6 text-center text-4xl">
                    Create New Project
                </h2>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-text mb-2" htmlFor="projectName">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            placeholder="Enter project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-text mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            placeholder="Enter project description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px] h-32 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-tertiary text-white py-2 rounded-lg hover:opacity-90 transition cursor-pointer mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-spin">🌀</span>
                        ) : (
                            <>
                                Create Project
                                {/* <img
                                    src={RightArrow}
                                    className="w-4 transition duration-300 transform group-hover:translate-x-2"
                                /> */}
                            </>
                        )}
                    </button>

                    <div className="mt-4 text-center flex justify-end">
                        <Link
                            to="/all-projects"
                            className="text-text text-[12px] cursor-pointer text-white rounded-lg hover:opacity-90 transition"
                        >
                            ← Back to Projects
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectScreen;