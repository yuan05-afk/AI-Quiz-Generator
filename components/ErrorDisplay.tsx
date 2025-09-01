
import React from 'react';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div
            className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative"
            role="alert"
        >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default ErrorDisplay;
