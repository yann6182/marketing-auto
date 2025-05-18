import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ClientsPage from './pages/ClientsPage';
import CampaignsPage from './pages/CampaignsPage';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import "./App.css";

function App() {
	const [user, setUser] = useState(null);

	const getUser = async () => {
		try {
			let url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
			let { data } = await axios.get(url, { withCredentials: true });
	    
			if (!data.user) {
				url = `${process.env.REACT_APP_API_URL}/auth/me`;
				const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké quelque part
				data = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
			}
	
			setUser(data.user);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			// Si un token est présent, l'utilisateur est connecté
			const user = JSON.parse(localStorage.getItem('user'));
			setUser(user);
		}
		getUser();
	}, []);

	return (
		<div className="container">
			<Navbar user={user} />
			<Routes>

			
            
                
          
				<Route
					exact
					path="/"
					element={user ? <Home user={user} /> : <Navigate to="/login" />}
				/>
				<Route
					exact
					path="/login"
					element={user ? <Navigate to="/" /> : <Login />}
				/>
				<Route
					path="/signup"
					element={user ? <Navigate to="/" /> : <Signup />}
				/>
				<Route
					path="/home"
					element={user ? <Home user={user} /> : <Navigate to="/login" />}
				/>
				 <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
				<Route path="/clients" element={<ClientsPage />} />
				<Route path="/campaigns" element={<CampaignsPage />} />
				<Route path="/profile" element={<Profile user={user} />} />
				
			</Routes>
		</div>
	);
}

export default App;
