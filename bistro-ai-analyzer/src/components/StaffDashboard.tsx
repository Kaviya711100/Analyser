
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import OrderTaking from './OrderTaking';
import MenuView from './MenuView';
import OrderManagement from './OrderManagement';

const StaffDashboard = () => {
  const { user, logout } = useSupabaseAuth();
  const { loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Card className="rounded-none border-0 border-b border-blue-200 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">RA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Restaurant Analytics</h1>
                <p className="text-sm text-slate-600">Staff Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome,</p>
                <p className="font-semibold text-slate-800">{user?.name}</p>
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-blue-200">
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Take Orders</TabsTrigger>
            <TabsTrigger value="status" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Order Status</TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">View Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderTaking />
          </TabsContent>

          <TabsContent value="status">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="menu">
            <MenuView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDashboard;
