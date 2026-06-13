import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Gift } from 'lucide-react';
import { Lead } from '@/api/entities';

export default function ExitIntentPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Lead.create({
        email: email,
        source: 'exit_intent',
        interest_level: 'interested',
        subscribed_to_newsletter: true
      });
      alert('🎉 Thanks! Check your email for your free guide!');
      onClose();
    } catch (error) {
      console.error('Error capturing lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="w-full max-w-lg shadow-2xl border-4 border-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">Wait! Before You Go...</CardTitle>
                <p className="text-white/90 text-sm mt-1">Get our free family organization guide!</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-3">Get Your Free Guide:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  ✅ 10 Time-Saving Family Hacks
                </li>
                <li className="flex items-center gap-2">
                  ✅ Weekly Meal Planning Template
                </li>
                <li className="flex items-center gap-2">
                  ✅ Chore Chart for Kids
                </li>
                <li className="flex items-center gap-2">
                  ✅ Exclusive Tips from Organized Families
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-lg"
              />
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Me the Free Guide'}
              </Button>
              <p className="text-xs text-center text-gray-500">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}