import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { Lead } from '@/api/entities';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hi! 👋 I'm here to help you get started with FamilyHub. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [email, setEmail] = useState('');

  const quickQuestions = [
    "How does it work?",
    "What's the pricing?",
    "Can I try it free?",
    "Talk to a human"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Simple bot responses
    let botResponse = '';
    if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
      botResponse = "FamilyHub is FREE forever for core features! We also have a Premium plan at $9.99/month with advanced features. Would you like to start with the free plan?";
    } else if (userMessage.toLowerCase().includes('how') || userMessage.toLowerCase().includes('work')) {
      botResponse = "FamilyHub helps families stay organized with shared calendars, task lists, grocery lists, and meal planning - all in one place! You can add family members and everyone stays synced in real-time. Want to see it in action?";
    } else if (userMessage.toLowerCase().includes('free') || userMessage.toLowerCase().includes('try')) {
      botResponse = "Yes! FamilyHub is free to start and free forever for basic features. No credit card required. Can I get your email to send you a quick start guide?";
    } else if (userMessage.toLowerCase().includes('human') || userMessage.toLowerCase().includes('talk')) {
      botResponse = "I'd be happy to connect you with our team! Please share your email and phone number, and someone will reach out within 24 hours.";
    } else {
      botResponse = "Great question! I'd love to help you personally. Could you share your email so I can send you detailed information?";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleEmailCapture = async () => {
    if (!email.trim()) return;

    try {
      await Lead.create({
        email: email,
        source: 'chat_widget',
        interest_level: 'interested',
        message: `Chat conversation: ${messages.map(m => `${m.role}: ${m.content}`).join(' | ')}`
      });
      setLeadCaptured(true);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "Thanks! I've sent you a guide to your email. Feel free to ask me anything else!" 
      }]);
    } catch (error) {
      console.error('Error capturing lead:', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[100] w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chat with us!
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-white/90">We typically reply in a few minutes</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, idx) => (
                    <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {!leadCaptured && messages.length > 2 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">📧 Want us to email you details?</p>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleEmailCapture} size="sm">
                          Send
                        </Button>
                      </div>
                    </div>
                  )}

                  {messages.length === 1 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickQuestion(q)}
                          className="block w-full text-left px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!input.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center z-[100] hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}