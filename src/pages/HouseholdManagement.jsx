import React, { useState, useEffect } from 'react';
import { Household, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Users as UsersIcon, Plus, Copy, Check, UserPlus, LogOut, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HouseholdManagement() {
  const [user, setUser] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const allHouseholds = await Household.list();
      const userHouseholds = allHouseholds.filter(h => 
        h.members?.includes(currentUser.email) || h.admin_email === currentUser.email
      );
      setHouseholds(userHouseholds);

      if (currentUser.household_id) {
        const active = userHouseholds.find(h => h.id === currentUser.household_id);
        setCurrentHousehold(active);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    if (!newHouseholdName.trim()) return;

    const newHousehold = await Household.create({
      name: newHouseholdName,
      admin_email: user.email,
      members: [user.email],
      invite_code: generateInviteCode()
    });

    await User.updateMyUserData({ household_id: newHousehold.id });
    setShowCreateForm(false);
    setNewHouseholdName('');
    loadData();
  };

  const handleJoinHousehold = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    const allHouseholds = await Household.list();
    const household = allHouseholds.find(h => 
      h.invite_code?.toUpperCase() === inviteCode.toUpperCase()
    );

    if (household) {
      const updatedMembers = [...(household.members || []), user.email];
      await Household.update(household.id, {
        ...household,
        members: updatedMembers
      });
      
      await User.updateMyUserData({ household_id: household.id });
      setShowJoinForm(false);
      setInviteCode('');
      loadData();
    } else {
      alert('Invalid invite code. Please check and try again.');
    }
  };

  const handleSwitchHousehold = async (householdId) => {
    await User.updateMyUserData({ household_id: householdId });
    loadData();
  };

  const handleLeaveHousehold = async (household) => {
    if (household.admin_email === user.email) {
      alert('As the admin, you cannot leave. Please transfer admin rights first or delete the household.');
      return;
    }

    const updatedMembers = household.members.filter(email => email !== user.email);
    await Household.update(household.id, {
      ...household,
      members: updatedMembers
    });

    if (currentHousehold?.id === household.id) {
      await User.updateMyUserData({ household_id: null });
    }
    
    loadData();
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Household Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your family households and invite members</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => setShowCreateForm(true)}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create New Household</h3>
              <p className="text-gray-600">Start a new household for your family</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => setShowJoinForm(true)}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Join a Household</h3>
              <p className="text-gray-600">Enter an invite code to join</p>
            </CardContent>
          </Card>
        </div>

        {currentHousehold && (
          <Card className="shadow-xl border-0 bg-gradient-to-r from-orange-100 to-pink-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Current Active Household
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{currentHousehold.name}</h3>
                  <p className="text-gray-600 mt-1">
                    {currentHousehold.members?.length || 0} member(s)
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Households</h2>
          {households.length === 0 ? (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No households yet</h3>
                <p className="text-gray-500">Create a household or join one with an invite code</p>
              </CardContent>
            </Card>
          ) : (
            households.map(household => (
              <Card key={household.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{household.name}</h3>
                        {household.admin_email === user?.email && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {currentHousehold?.id === household.id && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-4 h-4" />
                          <span>{household.members?.length || 0} members</span>
                        </div>
                        {household.invite_code && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Invite Code:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded">
                              {household.invite_code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyInviteCode(household.invite_code)}
                            >
                              {copiedCode === household.invite_code ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2">MEMBERS:</p>
                        <div className="flex flex-wrap gap-2">
                          {household.members?.map((email, idx) => (
                            <Badge key={idx} variant="outline">
                              {email}
                              {email === household.admin_email && (
                                <Crown className="w-3 h-3 ml-1 text-yellow-600" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {currentHousehold?.id !== household.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSwitchHousehold(household.id)}
                        >
                          Switch to This
                        </Button>
                      )}
                      {household.admin_email !== user?.email && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <LogOut className="w-4 h-4 mr-1" />
                              Leave
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Leave household?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to leave "{household.name}"? You'll need a new invite code to rejoin.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleLeaveHousehold(household)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Leave Household
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
               onClick={() => setShowCreateForm(false)}>
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Create New Household</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateHousehold} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="household_name">Household Name</Label>
                    <Input
                      id="household_name"
                      placeholder="e.g., Smith Family"
                      value={newHouseholdName}
                      onChange={(e) => setNewHouseholdName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500">
                      Create Household
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {showJoinForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
               onClick={() => setShowJoinForm(false)}>
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Join a Household</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinHousehold} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite_code">Invite Code</Label>
                    <Input
                      id="invite_code"
                      placeholder="Enter invite code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Ask a household admin for the invite code
                    </p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowJoinForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500">
                      Join Household
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}