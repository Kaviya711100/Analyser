
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const hourlyData = [
  { hour: '6:00', orders: 2, revenue: 45 },
  { hour: '7:00', orders: 8, revenue: 160 },
  { hour: '8:00', orders: 15, revenue: 285 },
  { hour: '9:00', orders: 12, revenue: 220 },
  { hour: '10:00', orders: 6, revenue: 135 },
  { hour: '11:00', orders: 18, revenue: 405 },
  { hour: '12:00', orders: 35, revenue: 735 },
  { hour: '13:00', orders: 42, revenue: 890 },
  { hour: '14:00', orders: 28, revenue: 580 },
  { hour: '15:00', orders: 15, revenue: 315 },
  { hour: '16:00', orders: 12, revenue: 245 },
  { hour: '17:00', orders: 22, revenue: 485 },
  { hour: '18:00', orders: 38, revenue: 820 },
  { hour: '19:00', orders: 45, revenue: 995 },
  { hour: '20:00', orders: 52, revenue: 1150 },
  { hour: '21:00', orders: 35, revenue: 775 },
  { hour: '22:00', orders: 18, revenue: 385 },
  { hour: '23:00', orders: 8, revenue: 175 },
];

const weeklyData = [
  { day: 'Monday', breakfast: 25, lunch: 85, dinner: 120 },
  { day: 'Tuesday', breakfast: 22, lunch: 78, dinner: 115 },
  { day: 'Wednesday', breakfast: 28, lunch: 92, dinner: 135 },
  { day: 'Thursday', breakfast: 30, lunch: 95, dinner: 140 },
  { day: 'Friday', breakfast: 35, lunch: 110, dinner: 180 },
  { day: 'Saturday', breakfast: 45, lunch: 125, dinner: 195 },
  { day: 'Sunday', breakfast: 42, lunch: 118, dinner: 165 },
];

const PeakHoursAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Peak Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8:00 PM</div>
            <p className="text-xs text-slate-600">52 orders average</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Busiest Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Saturday</div>
            <p className="text-xs text-green-600">+25% above average</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Quiet Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">3:00-5:00 PM</div>
            <p className="text-xs text-slate-600">Low order volume</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Staff Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-green-600">During peak hours</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Hourly Order Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="hour" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #3B82F6',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Weekly Pattern Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #3B82F6',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="breakfast" stackId="a" fill="#93C5FD" name="Breakfast" />
              <Bar dataKey="lunch" stackId="a" fill="#3B82F6" name="Lunch" />
              <Bar dataKey="dinner" stackId="a" fill="#1E40AF" name="Dinner" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Peak Hours Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Lunch Rush (12:00-2:00 PM)</h4>
                <p className="text-sm text-slate-600">Average 38 orders/hour. Fast service items perform best.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Dinner Peak (7:00-9:00 PM)</h4>
                <p className="text-sm text-slate-600">Highest revenue period. Premium items have higher demand.</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-2">Opportunity Hours (3:00-5:00 PM)</h4>
                <p className="text-sm text-slate-600">Consider happy hour specials or afternoon promotions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Staffing Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-slate-800">Peak Hours (7-9 PM)</span>
                <span className="text-green-600 font-bold">8-10 staff</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-slate-800">Lunch Rush (12-2 PM)</span>
                <span className="text-blue-600 font-bold">6-8 staff</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="font-medium text-slate-800">Off-Peak Hours</span>
                <span className="text-amber-600 font-bold">3-4 staff</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-slate-800">Early Morning (6-9 AM)</span>
                <span className="text-gray-600 font-bold">2-3 staff</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeakHoursAnalysis;
