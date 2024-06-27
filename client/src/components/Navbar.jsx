import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, '_self');
        navigate('/login');
    };

    return (
        <nav className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold">Mon Application</h1>
                <div className="flex items-center">
                    <Link to="/" className="px-4 hover:text-gray-200">Accueil</Link>
                    <Link to="/clients" className="px-4 hover:text-gray-200">Clients</Link>
                    <Link to="/about" className="px-4 hover:text-gray-200">À Propos</Link>
                    <Link to="/campaigns" className="px-4 hover:text-gray-200">Campaigns</Link>
                   
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
