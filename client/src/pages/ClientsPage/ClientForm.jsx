import React, { useState, useEffect } from 'react';

const ClientForm = ({ client, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address
            });
        }
    }, [client]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...client, ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700">Nom</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Téléphone</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700">Adresse</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                {client ? 'Modifier' : 'Ajouter'}
            </button>
        </form>
    );
};

export default ClientForm;
