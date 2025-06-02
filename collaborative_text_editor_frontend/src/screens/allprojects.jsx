import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import RightArrow from '../assets/rightarrow.svg';
import CopyIcon from '../assets/copy.svg';

const UserProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);
    const [showCollabPopup, setShowCollabPopup] = useState(false);
    const [collabEmail, setCollabEmail] = useState("");
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [addingCollaborator, setAddingCollaborator] = useState(false);
    const [collabResult, setCollabResult] = useState({ message: "", isError: false });
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");
        setUserId(userId);
        if (!accessToken) {
            navigate("/login");
            return;
        }

        const fetchProjects = async () => {
            try {
                const response = await api.get('/api/project/');
                console.log("API Response:", response);

                setProjects(response.data?.projects || []);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to fetch projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleCopySecret = async (secretCode) => {
        if (!secretCode) {
            alert("No secret code available to copy.");
            return;
        }

        try {
            await navigator.clipboard.writeText(secretCode);
            alert("Secret copied!");
        } catch (err) {
            console.error("Clipboard error:", err);
            alert("Copy failed. Try manual copy or use HTTPS.");
        }
    };

    const openCollaboratorPopup = (projectId) => {
        setCurrentProjectId(projectId);
        setCollabEmail("");
        setCollabResult({ message: "", isError: false });
        setShowCollabPopup(true);
    };

    const closeCollaboratorPopup = () => {
        setShowCollabPopup(false);
        setCurrentProjectId(null);
        setCollabEmail("");
        setCollabResult({ message: "", isError: false });
    };

    const addCollaborator = async (e) => {
        e.preventDefault();

        if (!collabEmail.trim()) {
            setCollabResult({ message: "Please enter an email address", isError: true });
            return;
        }

        setAddingCollaborator(true);

        try {
            const response = await api.post(`/api/project/${currentProjectId}/collaborators`, {
                email: collabEmail.trim()
            });

            if (response.data.success) {
                setCollabResult({
                    message: response.data.message,
                    isError: false
                });
                setTimeout(() => {
                    closeCollaboratorPopup();
                }, 2000);
            }

            setCollabEmail("");

        } catch (err) {
            console.error("Add collaborator error:", err);
            setCollabResult({
                message: err.response?.data?.message || "Failed to add collaborator",
                isError: true
            });
            setTimeout(() => {
                closeCollaboratorPopup();
            }, 2000);

        } finally {
            setAddingCollaborator(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center my-8">
            <div className="text-white text-6xl flex items-center gap-4">
                Your Projects
            </div>
            <Link
                to="/"
                className="text-gray-400 text-sm hover:text-white transition-colors mt-4"
            >
                ← Back to Home
            </Link>

            {loading &&
                <div className="min-h-screen flex justify-center items-center">
                    <div className="text-white text-xl">Loading projects...</div>
                </div>
            }

            {(!Array.isArray(projects) || projects.length === 0) && (
                <div className="text-center text-gray-400 my-12">
                    No projects found. Create your first project!
                </div>
            )}

            <div className="flex justify-center mt-12">
                <Link
                    to="/create-project"
                    className="bg-tertiary px-12 py-4 cursor-pointer rounded-full flex items-center gap-2 mt-4 transition duration-300 
    hover:bg-opacity-80 hover:scale-105 hover:shadow-[0_0px_24px_rgba(255,255,255,0.4)] hover:text-white group"
                >
                    New Project
                    <img
                        src={RightArrow}
                        className="w-6 transition duration-300 transform group-hover:translate-x-2 group-hover:invert group-hover:brightness-0"
                    />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                {Array.isArray(projects) && projects.map((project) => (
                    <div
                        key={project?._id}
                        className="bg-tertiary bg-opacity-10 rounded-xl p-6 hover:bg-opacity-20 transition-all
                            duration-300 hover:scale-[1.02] hover:shadow-[0_0px_24px_rgba(255,255,255,0.2)] 
                            cursor-pointer relative"
                    >
                        <div className="text-white font-bold text-xl mb-2">
                            {project?.name || 'Untitled Project'}
                        </div>
                        <div className="text-gray-300 text-sm mb-4">
                            {project?.description || "No description"}
                        </div>
                        <div className="text-xs text-gray-400">
                            Created: {project?.createdAt ?
                                new Date(project.createdAt).toLocaleDateString() :
                                'Unknown date'}
                        </div>
                        <div className="flex items-center justify-between gap-8 mt-4">
                            <div className="text-xs bg-opacity-20 py-1 rounded-full">
                                ID: {project?.projectId || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span>Secret: {project?.secretCode || 'N/A'}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopySecret(project?.secretCode);
                                    }}
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    <img src={CopyIcon} className="w-4 h-4" alt="Copy" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            {
                                project.owner.id == userId &&
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openCollaboratorPopup(project.projectId);
                                    }}
                                    className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full"
                                >
                                    Add Collaborators
                                </button>
                            }
                        </div>
                    </div>
                ))}
            </div>

            {error &&
                <div className="min-h-screen flex justify-center items-center">
                    <div className="text-red-500 text-xl">{error}</div>
                </div>
            }

            {showCollabPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-tertiary bg-opacity-90 rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-white text-xl font-bold mb-4">Add Collaborator</h3>
                        <form onSubmit={addCollaborator}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-300 text-sm mb-2">
                                    Collaborator Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={collabEmail}
                                    onChange={(e) => setCollabEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
                                    placeholder="Enter collaborator's email"
                                    required
                                />
                            </div>

                            {collabResult.message && (
                                <div className={`text-sm mb-4 ${collabResult.isError ? 'text-red-400' : 'text-green-400'}`}>
                                    {collabResult.message}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeCollaboratorPopup}
                                    className="bg-background text-white px-3 py-2 rounded hover:opacity-90 transition cursor-pointer text-sm mt-2 w-32"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-background text-white px-3 py-2 rounded hover:opacity-90 transition cursor-pointer text-sm mt-2 w-32"
                                    disabled={addingCollaborator}
                                >
                                    {addingCollaborator ? 'Sending...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserProjects;