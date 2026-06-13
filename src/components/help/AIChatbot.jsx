import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Send, Bot, User, Loader2, Sparkles, Move } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import VoiceInput from '../shared/VoiceInput';

export default function AIChatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your FamilyHub AI assistant. I can help you with:\n\n• How to use any feature\n• Troubleshooting issues\n• Best practices for family organization\n• Tips and tricks\n\nWhat would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatboxRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved position from localStorage
    const savedPosition = localStorage.getItem('chatbot_position');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const rect = chatboxRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 600; // chatbox width
      const maxY = window.innerHeight - 600; // chatbox height
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position to localStorage
      localStorage.setItem('chatbot_position', JSON.stringify(position));
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const contextPrompt = `You are a helpful AI assistant for FamilyHub, a family coordination and organization app. 
      
FamilyHub features:
- Household Management: Create/join households, invite members, switch between households
- Family Calendar: Create events, set recurring schedules, manage visibility (household/private/shared)
- Tasks: Assign tasks, set priorities, track progress, recurring tasks
- Grocery Lists: Add items by voice or text, organize by category, track costs
- Meal Planner: Plan weekly meals, add recipe links, add ingredients to grocery list
- Family Notes: Store important info, organize by category, pin important notes
- Family Photos: Upload and share family memories
- Voice Input: Speak-to-text throughout the app using microphone icons
- Privacy: Control visibility of events/tasks (household-only, all households, or private)
- Event Invites: Send invites to events, track RSVPs, get responses

User question: ${userMessage}

Provide a helpful, concise answer. If the question is about a feature, explain it clearly with step-by-step instructions. Be friendly and encouraging.`;

      const response = await InvokeLLM({
        prompt: contextPrompt,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response || "I'm sorry, I couldn't generate a response. Please try again."
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment, or check the FAQ section above for common questions."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (newText) => {
    setInput(newText);
  };

  const quickQuestions = [
    "How do I create a household?",
    "How do I use voice input?",
    "How do I invite family members?",
    "What are visibility settings?",
    "How do I plan meals for the week?"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[200]"
      onClick={onClose}
    >
      <motion.div
        ref={chatboxRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        className="w-full max-w-2xl h-[600px] rounded-xl overflow-hidden shadow-2xl"
      >
        <Card className="h-full flex flex-col shadow-2xl border-0">
          <CardHeader className="border-b bg-gradient-to-r from-green-500 to-teal-500 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                AI Assistant
                <Sparkles className="w-4 h-4 ml-1" />
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="drag-handle text-white hover:bg-white/20 cursor-grab active:cursor-grabbing"
                  title="Drag to move"
                >
                  <Move className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="bg-green-100 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="bg-green-100 p-2 rounded-full h-8 w-8 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </motion.div>
            )}

            {messages.length === 1 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-600 font-medium">Quick questions:</p>
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t p-4 bg-white flex-shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about FamilyHub..."
                disabled={isLoading}
                className="flex-1"
              />
              <VoiceInput 
                onTranscript={handleVoiceInput} 
                currentText={input}
                buttonSize="icon" 
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}