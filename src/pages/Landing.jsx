import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CheckSquare, 
  ShoppingCart, 
  Users, 
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Zap,
  Shield,
  Clock,
  Heart,
  Home,
  UtensilsCrossed,
  Camera,
  FileText,
  Mic,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '@/api/entities';
import { User } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import LeadCaptureModal from '../components/landing/LeadCaptureModal';
import ChatWidget from '../components/landing/ChatWidget';
import ExitIntentPopup from '../components/landing/ExitIntentPopup';
import NewsletterSignup from '../components/landing/NewsletterSignup';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user) {
          navigate(createPageUrl('Dashboard'));
        }
      } catch (error) {
        // User not logged in, stay on landing page
      }
    };
    checkAuth();

    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [navigate]);

  const handleQuickSignup = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await Lead.create({
        email: email,
        source: 'landing_page',
        interest_level: 'interested',
        subscribed_to_newsletter: true
      });
      setShowLeadModal(true);
      setEmail('');
    } catch (error) {
      console.error('Error capturing lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Shared Family Calendar",
      description: "Never miss an appointment, practice, or family event again",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: "Smart Task Management",
      description: "Assign chores, track completion, and keep everyone accountable",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Collaborative Shopping Lists",
      description: "Real-time grocery lists with voice input for hands-free adding",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      title: "Meal Planning",
      description: "Plan weekly meals and add ingredients to your list instantly",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Family Photo Gallery",
      description: "Share and preserve precious family memories in one place",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Important Notes",
      description: "Store passwords, contacts, medical info, and more securely",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Save Time",
      description: "Reduce family coordination time by 70%"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Private",
      description: "Bank-level encryption for your family data"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Unlimited Family Members",
      description: "No limits on households or users"
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Voice Input",
      description: "Add items hands-free while cooking or driving"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Real-time Sync",
      description: "Everyone sees updates instantly"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Free Forever",
      description: "Core features always free for families"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Mom of 3",
      content: "FamilyHub has transformed how we coordinate our busy family. No more missed soccer practices or forgotten grocery items!",
      rating: 5,
      avatar: "👩"
    },
    {
      name: "Michael Chen",
      role: "Working Dad",
      content: "The voice input feature is a game-changer. I can add items to our shopping list while driving home from work.",
      rating: 5,
      avatar: "👨"
    },
    {
      name: "Emily Rodriguez",
      role: "Single Parent",
      content: "Managing two households (mine and my ex's) was chaos. FamilyHub keeps everything organized and the kids can see both schedules.",
      rating: 5,
      avatar: "👩"
    }
  ];

  const pricing = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Unlimited family members",
        "Shared calendar & tasks",
        "Grocery lists & meal planning",
        "Photo gallery & notes",
        "Voice input",
        "Mobile app access"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per family/month",
      features: [
        "Everything in Free",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Export your data",
        "Ad-free experience",
        "Premium themes"
      ],
      cta: "Start 30-Day Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Premium",
        "Dedicated account manager",
        "Custom development",
        "SLA guarantees",
        "Advanced security",
        "Training & onboarding",
        "White-label options"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                FamilyHub
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-orange-600 transition-colors">Benefits</a>
              <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors">Pricing</a>
              <Button 
                variant="outline" 
                onClick={() => User.login()}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                onClick={() => setShowLeadModal(true)}
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                #1 Family Organization Platform
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Keep Your Family
                <span className="block bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Organized & Connected
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                One app for calendars, tasks, shopping lists, meal planning, and more. 
                Finally, a place where your whole family stays in sync.
              </p>
              
              {/* Email Capture Form */}
              <form onSubmit={handleQuickSignup} className="flex gap-3 mb-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-lg"
                  required
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-12 px-8"
                >
                  {isSubmitting ? 'Starting...' : 'Start Free'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
              
              <p className="text-sm text-gray-500 mb-8">
                ✨ Free forever • No credit card required • Set up in 2 minutes
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-white">
                      S
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold border-2 border-white">
                      M
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white">
                      E
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">10,000+ families organized</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-semibold">4.9/5</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&auto=format&fit=crop"
                  alt="Family using FamilyHub"
                  className="rounded-lg w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">2,847</p>
                      <p className="text-sm text-gray-600">Tasks Completed Today</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">87</p>
                      <p className="text-sm text-gray-600">Events This Week</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-0">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything Your Family Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for modern families
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setShowLeadModal(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              Try All Features Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-0">
              Benefits
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Families Love FamilyHub
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-0">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Families Everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setShowLeadModal(true)}
            >
              Join 10,000+ Happy Families
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-0">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full ${plan.popular ? 'border-4 border-orange-500 shadow-2xl scale-105' : ''}`}>
                  <CardContent className="p-8">
                    {plan.popular && (
                      <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => setShowLeadModal(true)}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Family Life?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families already organized with FamilyHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
              onClick={() => setShowLeadModal(true)}
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => setShowLeadModal(true)}
            >
              <Phone className="w-5 h-5 mr-2" />
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">FamilyHub</span>
              </div>
              <p className="text-gray-400 text-sm">
                The complete family organization platform
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Mobile App</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Stay Updated</h4>
              <NewsletterSignup />
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 FamilyHub. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Lead Capture Components */}
      {showLeadModal && (
        <LeadCaptureModal onClose={() => setShowLeadModal(false)} />
      )}

      {showExitIntent && (
        <ExitIntentPopup onClose={() => setShowExitIntent(false)} />
      )}

      <ChatWidget />
    </div>
  );
}