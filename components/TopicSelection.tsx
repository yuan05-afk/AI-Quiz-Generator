
import React, { useState } from 'react';

interface TopicSelectionProps {
    onStart: (topic: string) => void;
}

const TopicSelection: React.FC<TopicSelectionProps> = ({ onStart }) => {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStart(topic);
    };

    return (
        <div className="w-full text-center">
            <h2 className="text-2xl font-semibold mb-4 text-slate-100">What do you want to be quizzed on?</h2>
            <p className="text-slate-400 mb-6">Enter any topic below to begin.</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Roman History, React.js, Marine Biology"
                    className="flex-grow bg-slate-700 text-white placeholder-slate-400 border-2 border-slate-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    aria-label="Quiz topic"
                />
                <button
                    type="submit"
                    className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={!topic.trim()}
                >
                    Start Quiz
                </button>
            </form>
        </div>
    );
};

export default TopicSelection;
