
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            description: "The quiz question text."
        },
        options: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING 
            },
            description: "An array of 4 multiple-choice options."
        },
        correctAnswer: {
            type: Type.STRING,
            description: "The correct answer, which must exactly match one of the items in the 'options' array."
        },
    },
    required: ["question", "options", "correctAnswer"],
};

const quizSchema = {
    type: Type.ARRAY,
    items: quizQuestionSchema,
};


export const generateQuiz = async (topic: string, numberOfQuestions: number): Promise<QuizQuestion[]> => {
    try {
        const prompt = `Generate a JSON array of ${numberOfQuestions} unique and challenging multiple-choice quiz questions on the topic: "${topic}".
        Each question must have exactly 4 options.
        Ensure one option is clearly the correct answer.
        The other three options should be plausible but incorrect distractors.
        The "correctAnswer" field must be an exact match to one of the strings in the "options" array.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: quizSchema,
                temperature: 0.8, // Add some creativity
            },
        });
        
        const jsonText = response.text.trim();
        const quizData = JSON.parse(jsonText);

        // Basic validation
        if (!Array.isArray(quizData) || quizData.length === 0) {
            throw new Error("AI returned invalid or empty quiz data.");
        }

        return quizData.map((q: any) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
        }));
    } catch (error) {
        console.error("Error generating quiz with Gemini API:", error);
        throw new Error("Failed to generate quiz. The topic might be too restrictive or the service may be unavailable.");
    }
};
