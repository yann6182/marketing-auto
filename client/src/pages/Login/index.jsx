import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Dans votre composant de login (index.jsx)
const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
        console.log("User logged in:", response.data);
        // Stocker le token et les données de l'utilisateur dans le local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        
        window.location.href = "/";

        // Rediriger vers la page d'accueil
        navigate('/home');
    } catch (error) {
        setError("Invalid email or password");
        console.error("Error logging in:", error);
    }
};

    const googleAuth = () => {
        window.open(`${process.env.REACT_APP_API_URL}/auth/google/callback`, "_self");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Log in Form</h1>
            <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                <div className="md:w-1/2">
                    <img
                        className="object-cover w-full h-full"
                        src="./images/login.jpg"
                        alt="login"
                    />
                </div>
                <div className="md:w-1/2 p-8">
                    <h2 className="text-2xl font-semibold mb-4">Members Log in</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-4 hover:bg-blue-600">
                            Log In
                        </button>
                    </form>
                    <p className="text-center mb-4">or</p>
                    <button
                        className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded mb-4 hover:bg-red-600"
                        onClick={googleAuth}
                    >
                        <img
                            src="./images/google.png"
                            alt="google icon"
                            className="w-5 h-5 mr-2"
                        />
                        <span>Sign in with Google</span>
                    </button>
                    <p className="text-center">
                        New Here? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
