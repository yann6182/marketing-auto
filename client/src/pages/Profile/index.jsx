import React, { useState } from 'react';


function Profile({ user }) {
    
    const [email, setEmail] = useState(user.email);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
           
            setMessage('Profile updated successfully');
            setLoading(false);
        } catch (error) {
            setMessage('Error updating profile');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-center my-6">Profile</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 shadow-md rounded">
                {message && <div className="mb-4 text-center text-green-500">{message}</div>}
                
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
}

export default Profile;
