import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { User } from '@/api/entities';

export default function PasscodeProtection({ onUnlock, children, title = "Protected Content" }) {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showPasscode, setShowPasscode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  useEffect(() => {
    loadUser();
    
    // Check if there's a session unlock
    const sessionUnlock = sessionStorage.getItem('passcode_unlocked');
    if (sessionUnlock === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (lockoutTime) {
      const timer = setTimeout(() => {
        setLockoutTime(null);
        setAttempts(0);
      }, 30000); // 30 second lockout
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Too many attempts. Try again in ${remaining} seconds.`);
      return;
    }

    if (!user?.privacy_passcode) {
      setError('No passcode set. Please set one in Settings first.');
      return;
    }

    // Simple comparison (in production, use proper encryption)
    if (passcode === user.privacy_passcode) {
      setIsUnlocked(true);
      setError('');
      sessionStorage.setItem('passcode_unlocked', 'true');
      onUnlock?.();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setLockoutTime(Date.now() + 30000);
        setError('Too many failed attempts. Locked for 30 seconds.');
      } else {
        setError(`Incorrect passcode. ${3 - newAttempts} attempts remaining.`);
      }
      setPasscode('');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('passcode_unlocked');
    setPasscode('');
  };

  if (!user?.privacy_passcode) {
    return (
      <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Passcode Protection Not Set Up</h3>
          <p className="text-gray-600 mb-6">
            Set up a passcode in Settings to protect sensitive information.
          </p>
          <Button 
            onClick={() => window.location.href = '/Settings'}
            className="bg-gradient-to-r from-orange-500 to-pink-500"
          >
            Go to Settings
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isUnlocked) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLock}
            className="flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Lock
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm w-full max-w-md">
        <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
          <CardTitle className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <Shield className="w-16 h-16 text-orange-500 mx-auto" />
              <p className="text-gray-600">
                This content is protected. Enter your passcode to continue.
              </p>
            </div>

            <div className="relative">
              <Input
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="text-center text-2xl tracking-widest pr-12"
                maxLength={6}
                disabled={!!lockoutTime}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              disabled={!passcode || !!lockoutTime}
            >
              Unlock
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Forgot your passcode? Contact your household admin.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}