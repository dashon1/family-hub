import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Mail, 
  Check, 
  X, 
  Clock, 
  HelpCircle,
  Copy,
  Send,
  Users,
  Trash2
} from 'lucide-react';
import { EventInvite } from '@/api/entities';
import { User } from '@/api/entities';
import { Household } from '@/api/entities';

export default function InviteManager({ event, onUpdate }) {
  const [invites, setInvites] = useState([]);
  const [newInvite, setNewInvite] = useState({ email: '', name: '' });
  const [householdMembers, setHouseholdMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, [event]);

  const loadData = async () => {
    if (!event?.id) return;

    try {
      const user = await User.me();
      setCurrentUser(user);

      // Load existing invites
      const allInvites = await EventInvite.list();
      const eventInvites = allInvites.filter(inv => inv.event_id === event.id);
      setInvites(eventInvites);

      // Load household members
      if (user.household_id) {
        const households = await Household.list();
        const household = households.find(h => h.id === user.household_id);
        if (household?.members) {
          const allUsers = await User.list();
          const members = allUsers.filter(u => household.members.includes(u.email));
          setHouseholdMembers(members);
        }
      }
    } catch (error) {
      console.error('Error loading invite data:', error);
    }
  };

  const handleAddInvite = async (email, name) => {
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await EventInvite.create({
        event_id: event.id,
        invitee_email: email,
        invitee_name: name || email.split('@')[0],
        invited_by: currentUser.email,
        status: 'pending'
      });

      // Send invitation email (you could add this as a backend function)
      // await sendInviteEmail({ event, invitee: email });

      setNewInvite({ email: '', name: '' });
      loadData();
      onUpdate?.();
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Failed to send invite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickInvite = (member) => {
    handleAddInvite(member.email, member.full_name);
  };

  const handleRemoveInvite = async (inviteId) => {
    if (!confirm('Remove this invite?')) return;

    try {
      await EventInvite.delete(inviteId);
      loadData();
      onUpdate?.();
    } catch (error) {
      console.error('Error removing invite:', error);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/rsvp/${event.id}`;
    navigator.clipboard.writeText(link);
    alert('Invite link copied! Share it with anyone.');
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    maybe: 'bg-yellow-100 text-yellow-800'
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    accepted: <Check className="w-4 h-4" />,
    declined: <X className="w-4 h-4" />,
    maybe: <HelpCircle className="w-4 h-4" />
  };

  const getStatusCounts = () => {
    return {
      total: invites.length,
      accepted: invites.filter(i => i.status === 'accepted').length,
      declined: invites.filter(i => i.status === 'declined').length,
      maybe: invites.filter(i => i.status === 'maybe').length,
      pending: invites.filter(i => i.status === 'pending').length,
      plusOnes: invites.reduce((sum, i) => sum + (i.plus_one || 0), 0)
    };
  };

  const stats = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-xs text-gray-600">Going</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.maybe}</div>
            <div className="text-xs text-gray-600">Maybe</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
            <div className="text-xs text-gray-600">Can't Go</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </CardContent>
        </Card>
      </div>

      {stats.plusOnes > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            👥 <span className="font-semibold">{stats.plusOnes}</span> additional guest{stats.plusOnes !== 1 ? 's' : ''} expected
          </p>
        </div>
      )}

      {/* Quick Invite Household Members */}
      {householdMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Quick Invite Family
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {householdMembers
                .filter(member => !invites.find(inv => inv.invitee_email === member.email))
                .map(member => (
                  <Button
                    key={member.email}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickInvite(member)}
                    disabled={isLoading}
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    {member.full_name}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Invite Someone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              type="email"
              value={newInvite.email}
              onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
            />
            <Input
              placeholder="Name (optional)"
              value={newInvite.name}
              onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
              className="w-40"
            />
            <Button 
              onClick={() => handleAddInvite(newInvite.email, newInvite.name)}
              disabled={!newInvite.email.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyInviteLink}
              className="flex-1"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy Invite Link
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Share the invite link via text, email, or social media
          </p>
        </CardContent>
      </Card>

      {/* Invite List */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Invited Guests ({invites.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invites.map(invite => (
                <div 
                  key={invite.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm`}>
                      {invite.invitee_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {invite.invitee_name || invite.invitee_email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{invite.invitee_email}</p>
                      {invite.plus_one > 0 && (
                        <p className="text-xs text-blue-600">+{invite.plus_one} guest{invite.plus_one !== 1 ? 's' : ''}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusColors[invite.status]} flex items-center gap-1`}>
                      {statusIcons[invite.status]}
                      <span className="capitalize">{invite.status}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveInvite(invite.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}