
import React from 'react';

interface ScoreScreenProps {
    score: number;
    totalQuestions: number;
    onRestart: () => void;
    onNewTopic: () => void;
    topic: string;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, totalQuestions, onRestart, onNewTopic, topic }) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const scoreMessage = percentage >= 80 ? "Excellent!" : percentage >= 50 ? "Good Job!" : "Keep Practicing!";

    return (
        <div className="text-center w-full">
            <h2 className="text-3xl font-bold text-slate-100">{scoreMessage}</h2>
            <p className="text-slate-300 mt-2">You completed the quiz on "{topic}"!</p>
            <div className="my-8">
                <p className="text-lg text-slate-400">Your Score:</p>
                <p className="text-6xl font-bold my-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
                    {score} / {totalQuestions}
                </p>
                <p className="text-2xl font-semibold text-slate-200">({percentage}%)</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={onRestart}
                    className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                >
                    Play Again
                </button>
                <button
                    onClick={onNewTopic}
                    className="bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-all duration-200"
                >
                    Choose New Topic
                </button>
            </div>
        </div>
    );
};

export default ScoreScreen;
