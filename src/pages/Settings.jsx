
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, User as UserIcon, Palette, Bell, Save, Lock, Eye, EyeOff, Check } from 'lucide-react';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    display_color: 'blue',
    notification_preferences: {
      email_reminders: true,
      event_notifications: true,
      task_notifications: true
    },
    privacy_passcode: '',
    protected_categories: ['passwords', 'medical']
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [confirmPasscode, setConfirmPasscode] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || '',
        phone_number: currentUser.phone_number || '',
        display_color: currentUser.display_color || 'blue',
        notification_preferences: currentUser.notification_preferences || {
          email_reminders: true,
          event_notifications: true,
          task_notifications: true
        },
        privacy_passcode: currentUser.privacy_passcode || '',
        protected_categories: currentUser.protected_categories || ['passwords', 'medical']
      });
      setConfirmPasscode(currentUser.privacy_passcode || ''); // Initialize confirmPasscode with current passcode
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleSave = async () => {
    if (formData.privacy_passcode && formData.privacy_passcode !== confirmPasscode) {
      alert('Passcodes do not match!');
      return;
    }

    if (formData.privacy_passcode && formData.privacy_passcode.length < 4) {
      alert('Passcode must be at least 4 characters long.');
      return;
    }

    setIsSaving(true);
    try {
      await User.updateMyUserData(formData);
      alert('Settings saved successfully!');
      sessionStorage.removeItem('passcode_unlocked'); // Clear session on passcode change
      loadUser();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Failed to save settings. Please try again.');
    }
    setIsSaving(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProtectedCategory = (category) => {
    const categories = formData.protected_categories || [];
    if (categories.includes(category)) {
      handleChange('protected_categories', categories.filter(c => c !== category));
    } else {
      handleChange('protected_categories', [...categories, category]);
    }
  };

  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'teal', label: 'Teal', class: 'bg-teal-500' }
  ];

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Your Color</Label>
              <p className="text-sm text-gray-600 mb-3">
                This color will be used to identify your events and tasks
              </p>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('display_color', color.value)}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${formData.display_color === color.value
                        ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-400'
                      }
                    `}
                  >
                    <div className={`w-full h-8 ${color.class} rounded`} />
                    <p className="text-xs mt-2 text-center">{color.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Passcode Protection</Label>
              <p className="text-sm text-gray-600 mb-3">
                Set a passcode to protect sensitive information like passwords and medical records
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passcode">New Passcode</Label>
                  <div className="relative">
                    <Input
                      id="passcode"
                      type={showPasscode ? "text" : "password"}
                      placeholder="Enter passcode (4-6 digits)"
                      value={formData.privacy_passcode}
                      onChange={(e) => handleChange('privacy_passcode', e.target.value)}
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Passcode</Label>
                  <Input
                    id="confirm"
                    type={showPasscode ? "text" : "password"}
                    placeholder="Confirm passcode"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Protected Categories</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select which note categories require passcode protection
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {['passwords', 'medical', 'contacts', 'household_info', 'important_dates'].map(category => (
                  <div
                    key={category}
                    onClick={() => toggleProtectedCategory(category)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${(formData.protected_categories || []).includes(category)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-400 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        (formData.protected_categories || []).includes(category)
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {(formData.protected_categories || []).includes(category) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium capitalize">{category.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
