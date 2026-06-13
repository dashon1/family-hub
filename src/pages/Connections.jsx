import React, { useState, useEffect } from 'react';
import { Connection, User, Household } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Users, 
  Heart, 
  Shield,
  Trash2,
  Check,
  X,
  Settings,
  Mail
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Connections() {
  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnection, setNewConnection] = useState({
    connected_email: '',
    connection_type: 'family',
    nickname: '',
    can_see_calendar: true,
    can_see_tasks: true,
    can_see_notes: false
  });
  const [editingConnection, setEditingConnection] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const allConnections = await Connection.list();
      const myConnections = allConnections.filter(
        conn => conn.user_email === currentUser.email || conn.connected_email === currentUser.email
      );
      setConnections(myConnections);

      const allHouseholds = await Household.list();
      setHouseholds(allHouseholds.filter(h => 
        h.members?.includes(currentUser.email) || h.admin_email === currentUser.email
      ));

      const users = await User.list();
      setAllUsers(users);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddConnection = async (e) => {
    e.preventDefault();
    if (!newConnection.connected_email.trim()) return;

    try {
      await Connection.create({
        ...newConnection,
        user_email: user.email,
        status: 'accepted'
      });

      setShowAddForm(false);
      setNewConnection({
        connected_email: '',
        connection_type: 'family',
        nickname: '',
        can_see_calendar: true,
        can_see_tasks: true,
        can_see_notes: false
      });
      loadData();
    } catch (error) {
      console.error('Error adding connection:', error);
      // error already logged above
    }
  };

  const handleUpdateConnection = async (connectionId, updates) => {
    try {
      const connection = connections.find(c => c.id === connectionId);
      await Connection.update(connectionId, {
        ...connection,
        ...updates
      });
      loadData();
    } catch (error) {
      console.error('Error updating connection:', error);
    }
  };

  const handleDeleteConnection = async (connectionId) => {
    if (!confirm('Remove this connection?')) return;

    try {
      await Connection.delete(connectionId);
      loadData();
    } catch (error) {
      console.error('Error deleting connection:', error);
    }
  };

  const getConnectionUser = (connection) => {
    const email = connection.user_email === user.email 
      ? connection.connected_email 
      : connection.user_email;
    return allUsers.find(u => u.email === email);
  };

  const connectionTypeColors = {
    family: 'bg-pink-100 text-pink-800',
    friend: 'bg-blue-100 text-blue-800',
    extended_family: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const getHouseholdMembers = () => {
    const memberEmails = new Set();
    households.forEach(h => {
      h.members?.forEach(email => memberEmails.add(email));
      if (h.admin_email) memberEmails.add(h.admin_email);
    });
    memberEmails.delete(user?.email); // Remove current user
    return Array.from(memberEmails);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              My Connections
            </h1>
            <p className="text-gray-600 mt-2">Manage who can see your events, tasks, and notes</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Connection
          </Button>
        </div>

        {/* Info Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">How Connections Work</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Add connections to specific people across different households</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Control what each person can see (calendar, tasks, notes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>When creating events/tasks, choose "Selected People" to share with specific connections</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Household Members Quick Add */}
        {getHouseholdMembers().length > 0 && (
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Quick Add from Households
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getHouseholdMembers().map(email => {
                  const isConnected = connections.some(
                    c => c.connected_email === email || c.user_email === email
                  );
                  const userInfo = allUsers.find(u => u.email === email);
                  
                  return (
                    <Button
                      key={email}
                      variant={isConnected ? "outline" : "default"}
                      size="sm"
                      disabled={isConnected}
                      onClick={() => {
                        setNewConnection({
                          ...newConnection,
                          connected_email: email,
                          nickname: userInfo?.full_name || email
                        });
                        setShowAddForm(true);
                      }}
                    >
                      {isConnected && <Check className="w-4 h-4 mr-2" />}
                      {userInfo?.full_name || email}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connections List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Your Connections ({connections.length})</h2>
          {connections.length === 0 ? (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No connections yet</h3>
                <p className="text-gray-500">Add connections to share specific items with individual people</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {connections.map(connection => {
                const connectedUser = getConnectionUser(connection);
                const isOwner = connection.user_email === user.email;
                
                return (
                  <Card key={connection.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {(connectedUser?.full_name || connection.connected_email)[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">
                              {connection.nickname || connectedUser?.full_name || connection.connected_email}
                            </h3>
                            <p className="text-sm text-gray-600">{connectedUser?.email || connection.connected_email}</p>
                          </div>
                        </div>
                        {isOwner && (
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingConnection(connection)}>
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Connection Settings</DialogTitle>
                                  <DialogDescription>
                                    Control what {connection.nickname || connectedUser?.full_name || 'this person'} can see
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="calendar">Can See Calendar</Label>
                                    <Switch
                                      id="calendar"
                                      checked={connection.can_see_calendar}
                                      onCheckedChange={(checked) => 
                                        handleUpdateConnection(connection.id, { can_see_calendar: checked })
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="tasks">Can See Tasks</Label>
                                    <Switch
                                      id="tasks"
                                      checked={connection.can_see_tasks}
                                      onCheckedChange={(checked) => 
                                        handleUpdateConnection(connection.id, { can_see_tasks: checked })
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="notes">Can See Notes</Label>
                                    <Switch
                                      id="notes"
                                      checked={connection.can_see_notes}
                                      onCheckedChange={(checked) => 
                                        handleUpdateConnection(connection.id, { can_see_notes: checked })
                                      }
                                    />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteConnection(connection.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Badge className={connectionTypeColors[connection.connection_type]}>
                          {connection.connection_type.replace('_', ' ')}
                        </Badge>
                        
                        <div className="flex gap-2 text-xs text-gray-600 flex-wrap mt-3">
                          {connection.can_see_calendar && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Check className="w-3 h-3" /> Calendar
                            </Badge>
                          )}
                          {connection.can_see_tasks && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Check className="w-3 h-3" /> Tasks
                            </Badge>
                          )}
                          {connection.can_see_notes && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Check className="w-3 h-3" /> Notes
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Connection Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
               onClick={() => setShowAddForm(false)}>
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Add New Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddConnection} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Person's Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={newConnection.connected_email}
                      onChange={(e) => setNewConnection({...newConnection, connected_email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname (Optional)</Label>
                    <Input
                      id="nickname"
                      placeholder="e.g., Mom, Brother"
                      value={newConnection.nickname}
                      onChange={(e) => setNewConnection({...newConnection, nickname: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Connection Type</Label>
                    <Select
                      value={newConnection.connection_type}
                      onValueChange={(value) => setNewConnection({...newConnection, connection_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="extended_family">Extended Family</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label>What can they see?</Label>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="calendar_perm">Calendar Events</Label>
                      <Switch
                        id="calendar_perm"
                        checked={newConnection.can_see_calendar}
                        onCheckedChange={(checked) => 
                          setNewConnection({...newConnection, can_see_calendar: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tasks_perm">Tasks</Label>
                      <Switch
                        id="tasks_perm"
                        checked={newConnection.can_see_tasks}
                        onCheckedChange={(checked) => 
                          setNewConnection({...newConnection, can_see_tasks: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notes_perm">Notes</Label>
                      <Switch
                        id="notes_perm"
                        checked={newConnection.can_see_notes}
                        onCheckedChange={(checked) => 
                          setNewConnection({...newConnection, can_see_notes: checked})
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500">
                      Add Connection
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