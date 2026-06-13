import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

export default function TutorialOverlay({ steps, onComplete, onSkip, currentStepIndex = 0 }) {
  const [step, setStep] = useState(currentStepIndex);
  const currentStepData = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  useEffect(() => {
    // Scroll to highlighted element if it exists
    if (currentStepData.target) {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [step, currentStepData]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]">
        {/* Dark overlay with hole for highlighted element */}
        <div className="absolute inset-0 bg-black/70" onClick={handleSkip} />
        
        {/* Highlight box */}
        {currentStepData.target && (
          <HighlightBox target={currentStepData.target} />
        )}

        {/* Tutorial card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`absolute ${currentStepData.position || 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'} z-[101]`}
          style={{ maxWidth: '500px', width: '90%' }}
        >
          <Card className="shadow-2xl border-2 border-orange-400">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {currentStepData.icon}
                  {currentStepData.title}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleSkip} className="text-white hover:bg-white/20">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index <= step ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-6">{currentStepData.description}</p>
              
              {currentStepData.tips && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-orange-800 font-medium mb-2">💡 Pro Tip:</p>
                  <p className="text-sm text-gray-700">{currentStepData.tips}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={step === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <span className="text-sm text-gray-500">
                  Step {step + 1} of {steps.length}
                </span>

                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 flex items-center gap-2"
                >
                  {step === steps.length - 1 ? (
                    <>
                      Complete <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function HighlightBox({ target }) {
  const [box, setBox] = useState(null);

  useEffect(() => {
    const element = document.querySelector(target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setBox({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16
      });
    }
  }, [target]);

  if (!box) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute border-4 border-orange-400 rounded-lg bg-white/5 pointer-events-none"
      style={{
        top: `${box.top}px`,
        left: `${box.left}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
      }}
    />
  );
}