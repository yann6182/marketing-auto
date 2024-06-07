import React from 'react';

const Notification = ({ message, type }) => {
    if (!message) return null;

    const notificationStyle = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    return (
        <div className={`text-white px-4 py-2 rounded ${notificationStyle[type]} my-4`}>
            {message}
        </div>
    );
};

export default Notification;
