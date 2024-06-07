import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

function Dashboard() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    const getUserFromToken = async (token, email) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/auth/user?email=${email}`;
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(data.user);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const email = params.get("email");

        if (token && email) {
            localStorage.setItem("token", token);
            getUserFromToken(token, email);
        }
    }, [location]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (

        
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                <div className="md:w-1/2">
                    <img
                        className="object-cover w-full h-full"
                        src="./images/profile.jpg"
                        alt="profile"
                    />
                </div>
                <div className="md:w-1/2 p-8">
                    <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                    <img
                        src={user.picture || './images/default_profile.png'}
                        alt="profile"
                        className="w-24 h-24 rounded-full mb-4"
                    />
                    <input
                        type="text"
                        defaultValue={user.name || user.email}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                        placeholder="Username"
                        readOnly
                    />
                    <input
                        type="text"
                        defaultValue={user.email}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                        placeholder="Email"
                        readOnly
                    />
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = `${process.env.REACT_APP_API_URL}/auth/logout`;
                        }}
                    >
                        Log Out
                    </button>

                    <div>
                        <Link to="/clients">Clients</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
