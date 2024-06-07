import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ClientForm from './ClientForm';
import Notification from '../../components/Notification';

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

Modal.setAppElement('#root');

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchClients = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/clients`, { withCredentials: true });
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setNotification({ message: "Erreur lors de la récupération des clients.", type: 'error' });
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = async (client) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/clients`, client, { withCredentials: true });
            fetchClients();
            setShowAddModal(false);
            setNotification({ message: "Client ajouté avec succès.", type: 'success' });
        } catch (error) {
            console.error("Error adding client:", error);
            setNotification({ message: "Erreur lors de l'ajout du client.", type: 'error' });
        }
    };

    const handleEditClient = async (updatedClient) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/clients/${updatedClient.id}`, updatedClient, { withCredentials: true });
            fetchClients();
            setShowEditModal(false);
            setEditingClient(null);
            setNotification({ message: "Client modifié avec succès.", type: 'success' });
        } catch (error) {
            console.error("Erreur lors de la modification du client :", error);
            setNotification({ message: "Erreur lors de la modification du client.", type: 'error' });
        }
    };

    const handleDeleteClient = async (clientId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/clients/${clientId}`, { withCredentials: true });
            setClients(clients.filter(client => client.id !== clientId));
            setNotification({ message: "Client supprimé avec succès.", type: 'success' });
        } catch (error) {
            console.error("Error deleting client:", error);
            setNotification({ message: "Erreur lors de la suppression du client.", type: 'error' });
        }
    };

    const handleSendCustomMessage = async (client) => {
        const message = prompt(`Entrez le message personnalisé pour ${client.name}:`);
        if (message) {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/clients/send-message`, { clientId: client.id, message }, { withCredentials: true });
                setNotification({ message: "Message envoyé avec succès.", type: 'success' });
            } catch (error) {
                console.error("Erreur lors de l'envoi du message:", error);
                setNotification({ message: "Erreur lors de l'envoi du message.", type: 'error' });
            }
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center my-6">Gestion des Clients</h1>
            {notification.message && <Notification message={notification.message} type={notification.type} />}
            <div className="flex justify-between items-center my-4">
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowAddModal(true)}
                >
                    Ajouter un client
                </button>
            </div>
            <Modal
                isOpen={showAddModal}
                onRequestClose={() => setShowAddModal(false)}
                contentLabel="Ajouter un client"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2 className="text-2xl font-bold mb-4">Ajouter un client</h2>
                <ClientForm onSubmit={handleAddClient} />
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => setShowAddModal(false)}
                >
                    Annuler
                </button>
            </Modal>
            <Modal
                isOpen={showEditModal}
                onRequestClose={() => setShowEditModal(false)}
                contentLabel="Modifier un client"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2 className="text-2xl font-bold mb-4">Modifier un client</h2>
                <ClientForm client={editingClient} onSubmit={handleEditClient} />
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => setShowEditModal(false)}
                >
                    Annuler
                </button>
            </Modal>
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
                            <td className="px-4 py-2 flex">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        setEditingClient(client);
                                        setShowEditModal(true);
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
                                <button
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-2"
                                    onClick={() => handleSendCustomMessage(client)}
                                >
                                    Envoyer un message
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClientsPage;
