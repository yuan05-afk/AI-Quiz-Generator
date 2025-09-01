
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';

interface QuizScreenProps {
    question: QuizQuestion;
    onAnswer: (isCorrect: boolean) => void;
    questionNumber: number;
    totalQuestions: number;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const QuizScreen: React.FC<QuizScreenProps> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        setSelectedOption(null);
        setIsAnswered(false);
    }, [question]);

    const handleOptionClick = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        setTimeout(() => {
            onAnswer(option === question.correctAnswer);
        }, 1500);
    };
    
    const getButtonClass = (option: string) => {
        if (!isAnswered) {
            return 'bg-slate-700 hover:bg-purple-600';
        }
        if (option === question.correctAnswer) {
            return 'bg-green-600';
        }
        if (option === selectedOption) {
            return 'bg-red-600';
        }
        return 'bg-slate-700 opacity-50';
    };

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <p className="text-slate-400">Question {questionNumber} of {totalQuestions}</p>
                <h2 className="text-xl md:text-2xl font-semibold mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: question.question }}></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 flex items-center justify-between ${getButtonClass(option)} ${!isAnswered ? 'hover:scale-105' : 'cursor-not-allowed'}`}
                    >
                        <span dangerouslySetInnerHTML={{ __html: option }}></span>
                        {isAnswered && option === selectedOption && option === question.correctAnswer && <CheckIcon />}
                        {isAnswered && option === selectedOption && option !== question.correctAnswer && <XIcon />}
                        {isAnswered && option !== selectedOption && option === question.correctAnswer && <CheckIcon />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuizScreen;
