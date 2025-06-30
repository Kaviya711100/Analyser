
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const sentimentTrends = [
  { week: 'Week 1', positive: 65, neutral: 25, negative: 10 },
  { week: 'Week 2', positive: 68, neutral: 22, negative: 10 },
  { week: 'Week 3', positive: 70, neutral: 20, negative: 10 },
  { week: 'Week 4', positive: 72, neutral: 18, negative: 10 },
];

const feedbackCategories = [
  { category: 'Food Quality', positive: 145, negative: 12 },
  { category: 'Service Speed', positive: 98, negative: 28 },
  { category: 'Staff Behavior', positive: 132, negative: 8 },
  { category: 'Ambiance', positive: 156, negative: 15 },
  { category: 'Value for Money', positive: 89, negative: 22 },
];

const reviewSentiment = [
  { name: 'Excellent (5★)', value: 45, color: '#1E40AF' },
  { name: 'Good (4★)', value: 32, color: '#3B82F6' },
  { name: 'Average (3★)', value: 15, color: '#93C5FD' },
  { name: 'Poor (2★)', value: 6, color: '#BFDBFE' },
  { name: 'Terrible (1★)', value: 2, color: '#DBEAFE' },
];

const CustomerSentiment = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4.6/5</div>
            <p className="text-xs text-green-600 font-medium">+0.2 this month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Positive Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">77%</div>
            <p className="text-xs text-green-600 font-medium">+5% increase</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-xs text-blue-600 font-medium">This month</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89%</div>
            <p className="text-xs text-green-600 font-medium">+12% improvement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Sentiment Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="week" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #3B82F6',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="positive" stroke="#16A34A" strokeWidth={3} name="Positive" />
                <Line type="monotone" dataKey="neutral" stroke="#EAB308" strokeWidth={3} name="Neutral" />
                <Line type="monotone" dataKey="negative" stroke="#DC2626" strokeWidth={3} name="Negative" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Review Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reviewSentiment}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                >
                  {reviewSentiment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Feedback Categories Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={feedbackCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="category" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #3B82F6',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="positive" fill="#16A34A" name="Positive Feedback" radius={[4, 4, 0, 0]} />
              <Bar dataKey="negative" fill="#DC2626" name="Negative Feedback" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSentiment;
