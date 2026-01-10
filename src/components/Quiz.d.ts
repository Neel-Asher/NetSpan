export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}
interface QuizProps {
    isOpen: boolean;
    onClose: () => void;
}
export declare function Quiz({ isOpen, onClose }: QuizProps): import("react/jsx-runtime").JSX.Element | null;
export declare function useQuiz(): {
    isOpen: boolean;
    openQuiz: () => void;
    closeQuiz: () => void;
};
export {};
