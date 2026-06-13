import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, Calendar, CheckSquare, ShoppingCart, Users } from 'lucide-react';

export default function WelcomeModal({ onStartTutorial, onSkip }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-2 border-orange-400">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Sparkles className="w-12 h-12" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Welcome to FamilyHub! 🎉</CardTitle>
            <p className="text-white/90">Your all-in-one family organization platform</p>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-700 mb-6 text-center text-lg">
              Let's take a quick tour to help you get started with organizing your family life!
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold">Create Households</h4>
                </div>
                <p className="text-sm text-gray-600">Set up different households for your family</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold">Shared Calendar</h4>
                </div>
                <p className="text-sm text-gray-600">Coordinate everyone's busy schedules</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <CheckSquare className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold">Family Tasks</h4>
                </div>
                <p className="text-sm text-gray-600">Assign and track household chores</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold">Grocery Lists</h4>
                </div>
                <p className="text-sm text-gray-600">Collaborative shopping made easy</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>💡 Pro Tip:</strong> You can use voice input (microphone icon) throughout the app to quickly add items!
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={onSkip}
                className="px-8"
              >
                Skip Tour
              </Button>
              <Button
                onClick={onStartTutorial}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-8"
              >
                Start Tutorial
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}