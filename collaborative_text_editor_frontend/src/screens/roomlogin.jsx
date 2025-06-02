import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const RoomLogin = () => {
    const [formData, setFormData] = useState({
        secretCode: '',
        username: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const joinProject = async () => {
        if (!formData.secretCode || !formData.username) {
            alert('Both fields are required');
            return;
        }
        try {
            const response = await api.get(`/api/project/secret/${formData.secretCode}`);
            const data = response.data;

            if (data.success) {
                navigate(`/editor/${data.project.id}`, {
                    state: {
                        formData: {
                            username: formData.username,
                            secretCode: formData.secretCode,
                            projectId: data.project.id
                        }
                    }
                });
            } else {
                alert('Invalid secret code');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to join project');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-secondary p-8 rounded-lg shadow-lg w-96">
                <h2 className="font-poppins font-semibold text-white mb-6 text-center text-4xl">Join Project</h2>
                <form>
                    <div className="mb-6">
                        <label className="block text-text mb-2">Secret Code</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            type="text"
                            name="secretCode"
                            placeholder="Enter Secret Code"
                            required
                            value={formData.secretCode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-text mb-2">User Name</label>
                        <input
                            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                            name="username"
                            type="text"
                            placeholder="Enter user name"
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div
                        onClick={joinProject}
                        className="w-full bg-tertiary text-white py-2 rounded-lg hover:opacity-90 transition cursor-pointer mt-8 text-center"
                    >
                        Join
                    </div>
                    <div className="mt-4 text-center flex justify-end">
                        <Link
                            to="/"
                            className="text-text text-[12px] cursor-pointer text-white rounded-lg hover:opacity-90 transition"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomLogin;
