import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-lg font-bold">Mon Application</h1>
                <div>
                    <Link to="/" className="px-4 hover:text-gray-200">Accueil</Link>
                    <Link to="/clients" className="px-4 hover:text-gray-200">Clients</Link>
                    <Link to="/about" className="px-4 hover:text-gray-200">À Propos</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;