import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, { email, password });
      console.log("User signed up:", response.data);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      window.location.href = "/";
    } catch (error) {
      setError("Signup failed");
      console.error("Error signing up:", error);
    }
  };

  const googleAuth = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/google/callback`, "_self");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-500">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Create Your Account</h1>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition duration-300"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition duration-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-500 my-4">or</p>
        <button
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg flex items-center justify-center shadow-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
          onClick={googleAuth}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.35 11.1h-9.17v2.72h5.33c-.23 1.28-.95 2.36-2.01 3.1v2.54h3.24c1.9-1.75 3-4.33 3-7.25 0-.75-.08-1.47-.22-2.16h-1.18z" />
            <path d="M12 21.99c2.43 0 4.46-.8 5.94-2.15l-2.88-2.54c-.87.59-1.98.94-3.06.94-2.35 0-4.33-1.58-5.04-3.69h-3.26v2.28c1.52 3.05 4.61 5.16 8.3 5.16z" />
            <path d="M6.96 12.96c-.19-.56-.3-1.16-.3-1.77s.11-1.21.3-1.77v-2.28h-3.26c-.67 1.33-1.06 2.81-1.06 4.39s.39 3.06 1.06 4.39l3.26-2.96z" />
            <path d="M12 5.18c1.24 0 2.35.43 3.24 1.27l2.43-2.43c-1.49-1.4-3.52-2.26-5.67-2.26-3.69 0-6.78 2.11-8.3 5.16l3.26 2.96c.71-2.11 2.69-3.69 5.04-3.69z" />
          </svg>
          Sign up with Google
        </button>
        <p className="text-center text-gray-700 mt-6">
          Already have an account? <Link to="/login" className="text-purple-500 hover:underline">Log In</Link>
        </p>
        <p className="text-center text-gray-500 mt-2">
          <Link to="/forgot-password" className="text-purple-500 hover:underline">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
