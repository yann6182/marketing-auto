import React from 'react';
import ClientForm from '../ListClientsPage/ClientForm';
import axios from 'axios';

function EditClientPage({ match }) {
    const clientId = match.params.id; // Obtenez l'ID du client à partir de l'URL

    const handleEditClient = async (client) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/clients/${clientId}`, client, { withCredentials: true });
            // Redirection ou notification de succès
        } catch (error) {
            console.error("Erreur lors de la modification du client :", error);
            // Afficher une notification d'erreur
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-6">Modifier un Client</h1>
            <ClientForm onSubmit={handleEditClient} />
        </div>
    );
}

export default EditClientPage;