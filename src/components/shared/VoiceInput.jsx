import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function VoiceInput({ onTranscript, currentText = '', buttonSize = "default" }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          // Append to existing text with proper spacing
          const newText = currentText 
            ? currentText + (currentText.endsWith(' ') ? '' : ' ') + transcript
            : transcript;
          onTranscript(newText);
          setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please enable microphone permissions in your browser settings.');
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [currentText, onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size={buttonSize === "icon" ? "icon" : "default"}
      onClick={toggleListening}
      title={isListening ? "Stop listening" : "Continue with voice"}
      className={isListening ? "animate-pulse" : ""}
    >
      {isListening ? (
        buttonSize === "icon" ? <MicOff className="w-4 h-4" /> : <><MicOff className="w-4 h-4 mr-2" /> Stop</>
      ) : (
        buttonSize === "icon" ? <Mic className="w-4 h-4" /> : <><Mic className="w-4 h-4 mr-2" /> Voice</>
      )}
    </Button>
  );
}