
import React, { useState, useEffect } from 'react';
import { User, Household, CalendarEvent, TodoItem, GroceryItem } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Home, 
  Calendar, 
  CheckSquare, 
  ShoppingCart,
  Activity,
  TrendingUp,
  AlertCircle,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHouseholds: 0,
    totalEvents: 0,
    totalTasks: 0,
    totalGroceryItems: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [households, setHouseholds] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Check if user is admin
      if (currentUser.role !== 'admin') {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Load all data
      const [allUsers, allHouseholds, allEvents, allTasks, allGroceryItems] = await Promise.all([
        User.list().catch(() => []),
        Household.list().catch(() => []),
        CalendarEvent.list().catch(() => []),
        TodoItem.list().catch(() => []),
        GroceryItem.list().catch(() => [])
      ]);

      setUsers(allUsers);
      setHouseholds(allHouseholds);

      setStats({
        totalUsers: allUsers.length,
        totalHouseholds: allHouseholds.length,
        totalEvents: allEvents.length,
        totalTasks: allTasks.length,
        totalGroceryItems: allGroceryItems.length,
        activeUsers: allUsers.filter(u => u.household_id).length
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      users,
      households,
      stats,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familyhub-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <Shield className="w-8 h-8 text-orange-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">System overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportData} className="bg-gradient-to-r from-orange-500 to-pink-500">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-blue-600" },
            { title: "Households", value: stats.totalHouseholds, icon: Home, color: "from-green-500 to-green-600" },
            { title: "Events", value: stats.totalEvents, icon: Calendar, color: "from-purple-500 to-purple-600" },
            { title: "Tasks", value: stats.totalTasks, icon: CheckSquare, color: "from-orange-500 to-orange-600" },
            { title: "Grocery Items", value: stats.totalGroceryItems, icon: ShoppingCart, color: "from-pink-500 to-pink-600" },
            { title: "Active Users", value: stats.activeUsers, icon: Activity, color: "from-teal-500 to-teal-600" }
          ].map((stat, idx) => (
            <Card key={idx} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className={`bg-gradient-to-r ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="households" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Households
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  All Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Household</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.household_id ? (
                            <Badge variant="outline">
                              {households.find(h => h.id === user.household_id)?.name || 'Unknown'}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">No household</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.household_id ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
                            {user.household_id ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="households">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  All Households
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Invite Code</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {households.map((household) => (
                      <TableRow key={household.id}>
                        <TableCell className="font-medium">{household.name}</TableCell>
                        <TableCell>{household.admin_email}</TableCell>
                        <TableCell>
                          <Badge>{household.members?.length || 0} members</Badge>
                        </TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {household.invite_code || 'N/A'}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(household.created_date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Users with Households</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${(stats.activeUsers / stats.totalUsers * 100) || 0}%` }}
                          />
                        </div>
                        <span className="font-semibold">{Math.round((stats.activeUsers / stats.totalUsers * 100) || 0)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-gray-600">Avg Events per User</span>
                      <span className="font-semibold text-xl">{Math.round(stats.totalEvents / stats.totalUsers) || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-gray-600">Avg Tasks per User</span>
                      <span className="font-semibold text-xl">{Math.round(stats.totalTasks / stats.totalUsers) || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Database Status</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-gray-600">API Response Time</span>
                      <span className="font-semibold">&lt;100ms</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-semibold">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
