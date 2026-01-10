export interface TutorialStep {
    id: string;
    title: string;
    content: string;
    target?: string;
    action?: 'click' | 'hover' | 'input';
    position?: 'top' | 'bottom' | 'left' | 'right';
}
interface TutorialProps {
    isOpen: boolean;
    onClose: () => void;
}
export declare function Tutorial({ isOpen, onClose }: TutorialProps): import("react/jsx-runtime").JSX.Element | null;
export declare function useTutorial(): {
    isOpen: boolean;
    openTutorial: () => void;
    closeTutorial: () => void;
    resetTutorial: () => void;
};
export {};
