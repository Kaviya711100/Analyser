
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSupabaseData } from '@/contexts/SupabaseDataContext';
import { CalendarDays, Download, TrendingUp } from 'lucide-react';

const DetailedReports = () => {
  const { orders } = useSupabaseData();
  const [timespan, setTimespan] = useState<'day' | 'week' | 'month'>('day');

  const getReportData = () => {
    const now = new Date();
    const data = [];
    
    if (timespan === 'day') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayKey = date.toDateString();
        
        const dayOrders = orders.filter(order => 
          new Date(order.createdAt).toDateString() === dayKey
        );
        
        const paidOrders = dayOrders.filter(order => order.status === 'paid');
        
        data.push({
          period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: date.toLocaleDateString(),
          totalOrders: dayOrders.length,
          paidOrders: paidOrders.length,
          revenue: paidOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          avgOrderValue: paidOrders.length > 0 ? paidOrders.reduce((sum, order) => sum + order.totalAmount, 0) / paidOrders.length : 0
        });
      }
    } else if (timespan === 'week') {
      // Last 12 weeks
      for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= weekStart && orderDate <= weekEnd;
        });
        
        const paidOrders = weekOrders.filter(order => order.status === 'paid');
        
        data.push({
          period: `Week ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          fullDate: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
          totalOrders: weekOrders.length,
          paidOrders: paidOrders.length,
          revenue: paidOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          avgOrderValue: paidOrders.length > 0 ? paidOrders.reduce((sum, order) => sum + order.totalAmount, 0) / paidOrders.length : 0
        });
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === monthDate.getMonth() && 
                 orderDate.getFullYear() === monthDate.getFullYear();
        });
        
        const paidOrders = monthOrders.filter(order => order.status === 'paid');
        
        data.push({
          period: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          fullDate: monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          totalOrders: monthOrders.length,
          paidOrders: paidOrders.length,
          revenue: paidOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          avgOrderValue: paidOrders.length > 0 ? paidOrders.reduce((sum, order) => sum + order.totalAmount, 0) / paidOrders.length : 0
        });
      }
    }
    
    return data;
  };

  const reportData = getReportData();
  const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
  const totalPaidOrders = reportData.reduce((sum, item) => sum + item.paidOrders, 0);
  const avgRevenue = reportData.length > 0 ? totalRevenue / reportData.length : 0;

  const downloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Period,Total Orders,Paid Orders,Revenue,Average Order Value\n" +
      reportData.map(row => 
        `${row.fullDate},${row.totalOrders},${row.paidOrders},₹${row.revenue.toFixed(2)},₹${row.avgOrderValue.toFixed(2)}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `restaurant_report_${timespan}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-slate-800">Detailed Sales Reports</CardTitle>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timespan} onValueChange={(value: 'day' | 'week' | 'month') => setTimespan(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={downloadReport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-600">Last {reportData.length} {timespan}s</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Paid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPaidOrders}</div>
            <p className="text-xs text-slate-600">Completed transactions</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Revenue per {timespan}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{avgRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-600">Revenue trend</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Payment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reportData.reduce((sum, item) => sum + item.totalOrders, 0) > 0 
                ? ((totalPaidOrders / reportData.reduce((sum, item) => sum + item.totalOrders, 0)) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-slate-600">Orders paid vs total</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Revenue Trend - {timespan.charAt(0).toUpperCase() + timespan.slice(1)}ly
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="period" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #3B82F6',
                  borderRadius: '8px'
                }} 
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `₹${value.toFixed(2)}` : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders vs Revenue Comparison */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Orders vs Revenue Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="period" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #3B82F6',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="paidOrders" fill="#10B981" name="Paid Orders" />
              <Bar dataKey="totalOrders" fill="#94A3B8" name="Total Orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Detailed {timespan.charAt(0).toUpperCase() + timespan.slice(1)}ly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Total Orders</TableHead>
                <TableHead className="text-right">Paid Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg Order Value</TableHead>
                <TableHead className="text-right">Payment Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.fullDate}</TableCell>
                  <TableCell className="text-right">{row.totalOrders}</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">{row.paidOrders}</TableCell>
                  <TableCell className="text-right font-medium">₹{row.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{row.avgOrderValue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {row.totalOrders > 0 ? ((row.paidOrders / row.totalOrders) * 100).toFixed(1) : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedReports;
