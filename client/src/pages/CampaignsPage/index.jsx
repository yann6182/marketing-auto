import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token'); 
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCampaign, setCurrentCampaign] = useState({ name: '', message: '', trigger_event: '' });

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/campaigns`, { withCredentials: true });
            setCampaigns(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des campagnes:", error);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleAddCampaign = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/campaigns`, currentCampaign, { withCredentials: true });
            setCampaigns([...campaigns, response.data]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la campagne:", error);
        }
    };

    const handleUpdateCampaign = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/campaigns/${currentCampaign.id}`, currentCampaign, { withCredentials: true });
            setCampaigns(campaigns.map(campaign => (campaign.id === currentCampaign.id ? response.data : campaign)));
            setIsModalOpen(false); 
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la campagne:", error);
        }
    };

    const handleDeleteCampaign = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/campaigns/${id}`, { withCredentials: true });
            setCampaigns(campaigns.filter(campaign => campaign.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de la campagne:", error);
        }
    };

    const openModal = (campaign) => {
        setCurrentCampaign(campaign || { name: '', message: '', trigger_event: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center mb-6">Campagnes</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
                onClick={() => openModal(null)}
            >
                Ajouter une campagne
            </button>
            <ul className="space-y-4">
                {campaigns.map(campaign => (
                    <li key={campaign.id} className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{campaign.name}</h2>
                        <p className="text-gray-700 mb-2">{campaign.message}</p>
                        <p className="text-gray-500 mb-4">Déclencheur: {campaign.trigger_event}</p>
                        <div className="flex space-x-2">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => openModal(campaign)}
                            >
                                Modifier
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => handleDeleteCampaign(campaign.id)}
                            >
                                Supprimer
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Formulaire de campagne"
                className="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">{currentCampaign.id ? 'Modifier la campagne' : 'Ajouter une campagne'}</h2>
                <form onSubmit={e => {
                    e.preventDefault();
                    currentCampaign.id ? handleUpdateCampaign() : handleAddCampaign();
                }}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nom:</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={currentCampaign.name}
                            onChange={e => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Message:</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            value={currentCampaign.message}
                            onChange={e => setCurrentCampaign({ ...currentCampaign, message: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Événement déclencheur:</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={currentCampaign.trigger_event}
                            onChange={e => setCurrentCampaign({ ...currentCampaign, trigger_event: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={closeModal}>
                            Annuler
                        </button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            {currentCampaign.id ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default CampaignsPage;
