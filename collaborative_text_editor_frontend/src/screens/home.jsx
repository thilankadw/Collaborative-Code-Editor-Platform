import React, { useEffect, useState } from "react";
import RightArrow from '../assets/rightarrow.svg';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../public/favicon.png"

const Home = () => {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setIsLogged(!!accessToken);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        setIsLogged(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center gap-4">
            <img src={Logo} className="w-28"/>
            <div className="text-white text-6xl flex items-center gap-4 mb-8">
                Collaborative
                <div className="text-tertiary font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] text-6xl"
                    style={{ WebkitTextStroke: "0.3px white" }}>
                    Code
                </div>
                Editor
            </div>
            {isLogged ? (
                <>
                    <Link
                        to='/room-login'
                        className="bg-tertiary px-12 py-4 cursor-pointer rounded-full flex items-center gap-2 mt-2 transition duration-300 
                            hover:bg-opacity-80 hover:scale-105 hover:shadow-[0_0px_24px_rgba(255,255,255,0.4)] hover:text-white group"
                    >
                        Join a Room
                        <img
                            src={RightArrow}
                            className="w-6 transition duration-300 transform group-hover:translate-x-2 group-hover:invert group-hover:brightness-0"
                        />
                    </Link>

                    <Link
                        to='/all-projects'
                        className="bg-tertiary px-12 py-4 cursor-pointer rounded-full flex items-center gap-2 mt-4 transition duration-300 
                            hover:bg-opacity-80 hover:scale-105 hover:shadow-[0_0px_24px_rgba(255,255,255,0.4)] hover:text-white group"
                    >
                        My Projects
                        <img
                            src={RightArrow}
                            className="w-6 transition duration-300 transform group-hover:translate-x-2 group-hover:invert group-hover:brightness-0"
                        />
                    </Link>

                    <Link
                        to='/git-integration'
                        className="bg-tertiary px-12 py-4 cursor-pointer rounded-full flex items-center gap-2 mt-4 transition duration-300 
                            hover:bg-opacity-80 hover:scale-105 hover:shadow-[0_0px_24px_rgba(255,255,255,0.4)] hover:text-white group"
                    >
                        Git Operations
                        <img
                            src={RightArrow}
                            className="w-6 transition duration-300 transform group-hover:translate-x-2 group-hover:invert group-hover:brightness-0"
                        />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-tertiary px-12 py-4 cursor-pointer rounded-full flex items-center gap-2 mt-4 transition duration-300 
                            hover:bg-opacity-80 hover:scale-105 hover:shadow-[0_0px_24px_rgba(255,255,255,0.4)] hover:text-white group"
                    >
                        Logout
                        <img
                            src={RightArrow}
                            className="w-6 transition duration-300 transform group-hover:translate-x-2 group-hover:invert group-hover:brightness-0"
                        />
                    </button>
                </>
            ) : (
                <Link
                    to='/login'
                    className="bg-tertiary px-12 py-4 cursor-pointer rounded-full flex items-center gap-2 mt-4 transition duration-300 
                        hover:bg-opacity-80 hover:scale-105 hover:shadow-[0_0px_24px_rgba(255,255,255,0.4)] hover:text-white group"
                >
                    Login
                    <img
                        src={RightArrow}
                        className="w-6 transition duration-300 transform group-hover:translate-x-2 group-hover:invert group-hover:brightness-0"
                    />
                </Link>
            )}
        </div>
    );
}

export default Home;