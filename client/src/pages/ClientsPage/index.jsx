import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientForm from './ClientForm';

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké sous le nom 'token'
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/clients`, { withCredentials: true });
            setClients(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des clients:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = async (client) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/clients`, client, { withCredentials: true });
            setClients([...clients, response.data]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout du client:", error);
        }
        setIsLoading(false);
    };

    const handleEditClient = async (updatedClient) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/clients/${updatedClient.id}`, updatedClient, { withCredentials: true });
            setClients(clients.map(client => (client.id === updatedClient.id ? response.data : client)));
            setEditingClient(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de la modification du client:", error);
        }
        setIsLoading(false);
    };

    const handleDeleteClient = async (clientId) => {
        setIsLoading(true);
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/clients/${clientId}`, { withCredentials: true });
            setClients(clients.filter(client => client.id !== clientId));
        } catch (error) {
            console.error("Erreur lors de la suppression du client:", error);
        }
        setIsLoading(false);
    };

    const handleCloseModal = () => {
        setEditingClient(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-6">Clients</h1>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => setIsModalOpen(true)}
            >
                Ajouter un client
            </button>
            {isLoading ? (
                <div className="text-center py-4">Chargement en cours...</div>
            ) : (
                <table className="table-auto w-full mt-4">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Nom</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Téléphone</th>
                            <th className="px-4 py-2">Adresse</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} className="bg-white border-b">
                                <td className="px-4 py-2">{client.name}</td>
                                <td className="px-4 py-2">{client.email}</td>
                                <td className="px-4 py-2">{client.phone}</td>
                                <td className="px-4 py-2">{client.address}</td>
                                <td className="px-4 py-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            setEditingClient(client);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                                        onClick={() => handleDeleteClient(client.id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {isModalOpen && (
                <ClientForm
                    client={editingClient}
                    onSubmit={editingClient ? handleEditClient : handleAddClient}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default ClientsPage;
