
import React, { useState, useCallback, useEffect } from 'react';
import { QuizQuestion, GameState } from './types';
import { QUIZ_LENGTH } from './constants';
import { generateQuiz } from './services/geminiService';

import TopicSelection from './components/TopicSelection';
import QuizScreen from './components/QuizScreen';
import ScoreScreen from './components/ScoreScreen';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.TopicSelection);
    const [topic, setTopic] = useState<string>('');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const handleStartQuiz = useCallback((selectedTopic: string) => {
        if (!selectedTopic.trim()) {
            setError("Please enter a topic.");
            return;
        }
        setTopic(selectedTopic);
        setGameState(GameState.Loading);
        setError(null);
        setScore(0);
        setCurrentQuestionIndex(0);
    }, []);

    const fetchQuiz = useCallback(async () => {
        if (gameState !== GameState.Loading || !topic) return;

        try {
            const newQuestions = await generateQuiz(topic, QUIZ_LENGTH);
            if (newQuestions.length < QUIZ_LENGTH) {
                throw new Error("Could not generate enough questions for the quiz. Please try a different topic.");
            }
            setQuestions(newQuestions);
            setGameState(GameState.QuizActive);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating the quiz.";
            setError(errorMessage);
            setGameState(GameState.TopicSelection);
        }
    }, [gameState, topic]);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);


    const handleAnswer = useCallback((isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGameState(GameState.Score);
        }
    }, [currentQuestionIndex, questions.length]);
    
    const handleRestart = useCallback(() => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setGameState(GameState.Loading);
    }, []);

    const handleNewTopic = useCallback(() => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setTopic('');
        setQuestions([]);
        setGameState(GameState.TopicSelection);
    }, []);

    const renderContent = () => {
        switch (gameState) {
            case GameState.Loading:
                return <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-slate-300 animate-pulse">Generating your quiz on "{topic}"...</p>
                </div>;
            case GameState.QuizActive:
                return <QuizScreen 
                            question={questions[currentQuestionIndex]} 
                            onAnswer={handleAnswer}
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={questions.length}
                        />;
            case GameState.Score:
                return <ScoreScreen 
                            score={score} 
                            totalQuestions={questions.length}
                            onRestart={handleRestart}
                            onNewTopic={handleNewTopic}
                            topic={topic}
                        />;
            case GameState.TopicSelection:
            default:
                return <TopicSelection onStart={handleStartQuiz} />;
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
                        AI Quiz Generator
                    </h1>
                    <p className="text-slate-400 mt-2">Endless quizzes on any topic. Developed by Yuan</p>
                </header>
                <main className="bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 min-h-[300px] flex items-center justify-center transition-all duration-300">
                    {error && gameState === GameState.TopicSelection && (
                        <div className="mb-4 w-full">
                            <ErrorDisplay message={error} />
                        </div>
                    )}
                    {renderContent()}
                </main>
                 <footer className="text-center mt-8 text-slate-500 text-sm">
                    <p>Powered by Google Gemini</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
