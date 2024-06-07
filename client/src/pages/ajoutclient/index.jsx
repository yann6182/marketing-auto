import React from 'react';
import ClientForm from '../ListClientsPage/ClientForm';
import axios from 'axios';

function AddClientPage() {
    const handleAddClient = async (client) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/clients`, client, { withCredentials: true });
            // Redirection ou notification de succès
        } catch (error) {
            console.error("Erreur lors de l'ajout du client:", error);
            // Afficher une notification d'erreur
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-6">Ajouter un Client</h1>
            <ClientForm onSubmit={handleAddClient} />
        </div>
    );
}

export default AddClientPage;