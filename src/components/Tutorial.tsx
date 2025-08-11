import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, ArrowRight, ArrowLeft, Play, MousePointer } from 'lucide-react';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  action?: 'click' | 'hover' | 'input';
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NetSpan!',
    content: 'NetSpan is an interactive visualization tool for learning Minimum Spanning Tree (MST) algorithms. Let\'s take a quick tour to get you started!',
    position: 'bottom'
  },
  {
    id: 'modes',
    title: 'Choose Your Mode',
    content: 'You can switch between Random Simulation (pre-generated graphs) and Custom Builder (create your own networks). Try clicking on the tabs above.',
    target: '[role="tablist"]',
    action: 'click',
    position: 'bottom'
  },
  {
    id: 'graph-area',
    title: 'Network Visualization',
    content: 'This is where you\'ll see your network graph. Nodes represent cities/locations, and edges represent connections with costs.',
    target: 'svg',
    position: 'right'
  },
  {
    id: 'algorithm-button',
    title: 'Start the Algorithm',
    content: 'Click this button to begin the MST algorithm visualization. You can choose between Kruskal\'s and Prim\'s algorithms.',
    target: 'button:has-text("Start Algorithm")',
    action: 'hover',
    position: 'top'
  },
  {
    id: 'side-panel',
    title: 'Control Panel',
    content: 'Once the algorithm starts, this panel will show controls for stepping through the algorithm, statistics, and explanations of each step.',
    position: 'left'
  },
  {
    id: 'custom-mode',
    title: 'Custom Builder',
    content: 'Switch to Custom Builder to create your own networks! You can add cities, create connections, and experiment with different scenarios.',
    position: 'left'
  },
  {
    id: 'features',
    title: 'Additional Features',
    content: 'Don\'t forget to explore the tutorial, quiz mode, and import/export features. You can also toggle between light and dark themes using the button in the top-right corner.',
    position: 'bottom'
  }
];

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Tutorial({ isOpen, onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStepData = TUTORIAL_STEPS[currentStep];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Tutorial Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {currentStep + 1} of {TUTORIAL_STEPS.length}
                </Badge>
              </div>
              <Button onClick={onClose} variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStepData.content}
            </p>

            {currentStepData.action && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <MousePointer className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Try {currentStepData.action}ing on the highlighted element
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button 
                onClick={handleSkip} 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground"
              >
                Skip Tutorial
              </Button>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handlePrevious} 
                  variant="outline" 
                  size="sm"
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button onClick={handleNext} size="sm">
                  {currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < TUTORIAL_STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1 pt-2">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 
                    index < currentStep ? 'bg-primary/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Hook for tutorial management
export function useTutorial() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('netspan-tutorial-completed');
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const closeTutorial = React.useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('netspan-tutorial-completed', 'true');
  }, []);

  const openTutorial = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const resetTutorial = React.useCallback(() => {
    localStorage.removeItem('netspan-tutorial-completed');
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    openTutorial,
    closeTutorial,
    resetTutorial
  };
}