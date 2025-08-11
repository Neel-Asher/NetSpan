import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'mst-definition',
    question: 'What is a Minimum Spanning Tree (MST)?',
    options: [
      'A tree that connects all vertices with minimum total edge weight',
      'A tree with the minimum number of edges',
      'A tree with the maximum height',
      'A tree that minimizes the number of vertices'
    ],
    correctAnswer: 0,
    explanation: 'An MST connects all vertices in a graph with the minimum total weight, using exactly n-1 edges for n vertices.',
    difficulty: 'easy'
  },
  {
    id: 'kruskal-principle',
    question: 'What is the key principle behind Kruskal\'s algorithm?',
    options: [
      'Start from any vertex and grow the tree',
      'Sort edges by weight and add them if they don\'t create cycles',
      'Use a priority queue to select vertices',
      'Divide the graph into smaller subgraphs'
    ],
    correctAnswer: 1,
    explanation: 'Kruskal\'s algorithm sorts all edges by weight and adds them to the MST if they don\'t create a cycle.',
    difficulty: 'medium'
  },
  {
    id: 'prim-vs-kruskal',
    question: 'What is the main difference between Prim\'s and Kruskal\'s algorithms?',
    options: [
      'Prim\'s is faster than Kruskal\'s',
      'Prim\'s grows a tree from a starting vertex, Kruskal\'s considers all edges globally',
      'Kruskal\'s only works on directed graphs',
      'Prim\'s produces different MSTs than Kruskal\'s'
    ],
    correctAnswer: 1,
    explanation: 'Prim\'s algorithm grows the MST from a starting vertex, while Kruskal\'s considers all edges globally and uses union-find to detect cycles.',
    difficulty: 'medium'
  },
  {
    id: 'cycle-detection',
    question: 'Why is cycle detection important in MST algorithms?',
    options: [
      'To minimize the total weight',
      'To ensure the result is a tree (connected and acyclic)',
      'To improve algorithm performance',
      'To handle disconnected graphs'
    ],
    correctAnswer: 1,
    explanation: 'A tree by definition is connected and acyclic. Adding an edge that creates a cycle would violate the tree property.',
    difficulty: 'easy'
  },
  {
    id: 'time-complexity',
    question: 'What is the time complexity of Kruskal\'s algorithm?',
    options: [
      'O(V²)',
      'O(E log E)',
      'O(V log V)',
      'O(E + V)'
    ],
    correctAnswer: 1,
    explanation: 'Kruskal\'s algorithm is dominated by sorting the edges (O(E log E)) and union-find operations (nearly O(E)).',
    difficulty: 'hard'
  },
  {
    id: 'applications',
    question: 'Which of these is NOT a typical application of MST algorithms?',
    options: [
      'Network design (connecting cities with minimum cable cost)',
      'Finding shortest path between two specific nodes',
      'Clustering analysis',
      'Circuit design optimization'
    ],
    correctAnswer: 1,
    explanation: 'MSTs minimize total connection cost, not shortest paths between specific nodes. Use Dijkstra or A* for shortest paths.',
    difficulty: 'medium'
  }
];

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Quiz({ isOpen, onClose }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string>('');
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      resetQuiz();
    }
  }, [isOpen]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const handleAnswer = () => {
    if (!selectedAnswer) return;

    const answerIndex = parseInt(selectedAnswer);
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (answerIndex === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const getScoreColor = () => {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    if (percentage >= 80) return 'Excellent! You have a strong understanding of MST algorithms.';
    if (percentage >= 60) return 'Good job! You understand the basics. Consider reviewing some concepts.';
    return 'Keep learning! Review the tutorial and try the interactive visualization.';
  };

  const currentQ = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Quiz Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <CardTitle className="text-lg">MST Knowledge Quiz</CardTitle>
                {!quizCompleted && (
                  <Badge variant="secondary" className="text-xs">
                    {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                  </Badge>
                )}
              </div>
              <Button onClick={onClose} variant="ghost" size="sm" className="h-6 w-6 p-0">
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            {!quizCompleted && (
              <Progress value={progress} className="w-full" />
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {quizCompleted ? (
              // Quiz Results
              <div className="text-center space-y-4">
                <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Quiz Completed!</h3>
                  <div className={`text-2xl font-bold ${getScoreColor()}`}>
                    {score} / {QUIZ_QUESTIONS.length}
                  </div>
                  <p className="text-muted-foreground mt-2">{getScoreMessage()}</p>
                </div>
                
                {/* Detailed Results */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {QUIZ_QUESTIONS.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    return (
                      <div key={question.id} className="flex items-center gap-2 p-2 bg-muted rounded text-left">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                        <div className="text-xs">
                          <div className="font-medium">Q{index + 1}: {question.question}</div>
                          {!isCorrect && (
                            <div className="text-muted-foreground mt-1">
                              Correct: {question.options[question.correctAnswer]}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <Button onClick={resetQuiz} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Again
                  </Button>
                  <Button onClick={onClose}>
                    Continue Learning
                  </Button>
                </div>
              </div>
            ) : (
              // Quiz Question
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {currentQ.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-medium">{currentQ.question}</h3>
                </div>

                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`}
                        disabled={showResult}
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className={`flex-1 cursor-pointer ${showResult && index === currentQ.correctAnswer ? 'text-green-600 font-medium' : ''} ${showResult && index === parseInt(selectedAnswer) && index !== currentQ.correctAnswer ? 'text-red-600' : ''}`}
                      >
                        {option}
                      </Label>
                      {showResult && index === currentQ.correctAnswer && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {showResult && index === parseInt(selectedAnswer) && index !== currentQ.correctAnswer && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {showResult && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {currentQ.explanation}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Score: {score} / {currentQuestion + (showResult ? 1 : 0)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!showResult ? (
                      <Button 
                        onClick={handleAnswer} 
                        disabled={!selectedAnswer}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>
                        {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function useQuiz() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openQuiz = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeQuiz = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openQuiz,
    closeQuiz
  };
}