import type { AlgorithmState } from './KruskalAlgorithm';
import type { PrimState } from './PrimsAlgorithm';
export type AlgorithmType = 'kruskal' | 'prim';
interface AlgorithmControllerProps {
    algorithmState: AlgorithmState | PrimState | null;
    algorithmType: AlgorithmType;
    isRunning: boolean;
    onStep: () => void;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
    onAlgorithmChange: (type: AlgorithmType) => void;
    speed: number;
    comparisonMode?: boolean;
    onToggleComparison?: () => void;
}
export declare function AlgorithmController({ algorithmState, algorithmType, isRunning, onStep, onPlay, onPause, onReset, onSpeedChange, onAlgorithmChange, speed, comparisonMode, onToggleComparison }: AlgorithmControllerProps): import("react/jsx-runtime").JSX.Element | null;
export {};
