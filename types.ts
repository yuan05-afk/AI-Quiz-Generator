
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export enum GameState {
    TopicSelection = 'TOPIC_SELECTION',
    Loading = 'LOADING',
    QuizActive = 'QUIZ_ACTIVE',
    Score = 'SCORE',
}
