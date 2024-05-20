import React from 'react';
import {  useNavigate } from "react-router-dom";


function Home({ user }) {
	const navigate = useNavigate();
	const logout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
		

		navigate('/login');
	};







	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold mb-8">Home</h1>
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
						src={user.picture || './images/default-profile.png'}
						alt="profile"
						className="w-24 h-24 rounded-full mb-4"
					/>
					<input
						type="text"
						defaultValue={user.name}
						className="w-full p-2 mb-4 border border-gray-300 rounded"
						placeholder="Username"
					/>
					<input
						type="text"
						defaultValue={user.email}
						className="w-full p-2 mb-4 border border-gray-300 rounded"
						placeholder="Email"
					/>
					<button
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
						onClick={logout}
					>
						Log Out
					</button>
				</div>
			</div>
		</div>
	);
}

export default Home;
