import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

// Mock data for charts
const REVENUE_DATA = [
  { month: 'Jan', revenue: 42000, users: 2400 },
  { month: 'Feb', revenue: 45000, users: 2600 },
  { month: 'Mar', revenue: 48000, users: 2800 },
  { month: 'Apr', revenue: 51000, users: 3200 },
  { month: 'May', revenue: 54000, users: 3400 },
  { month: 'Jun', revenue: 58000, users: 3800 },
];

const TOP_PRODUCTS = [
  { name: 'Premium Plan', sales: 234, revenue: 46800, change: '+12%' },
  { name: 'Basic Plan', sales: 567, revenue: 28350, change: '+8%' },
  { name: 'Enterprise Plan', sales: 89, revenue: 35600, change: '+15%' },
];

const RECENT_ACTIVITY = [
  { user: 'John Doe', action: 'Purchased Premium Plan', time: '2 min ago', type: 'purchase' },
  { user: 'Sarah Smith', action: 'Signed up for trial', time: '5 min ago', type: 'signup' },
  { user: 'Mike Johnson', action: 'Upgraded to Enterprise', time: '12 min ago', type: 'upgrade' },
  { user: 'Lisa Brown', action: 'Cancelled subscription', time: '1 hour ago', type: 'cancel' },
];

export const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const periods = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend 
  }: { 
    title: string; 
    value: string; 
    change: string; 
    icon: any; 
    trend: 'up' | 'down' 
  }) => (
    <Card className="p-6 border-border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-4 w-4 mr-1 ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`} />
            <span className={`text-sm ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {change}
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your business performance and insights</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-lg">
              {periods.map(period => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {period.label}
                </Button>
              ))}
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="$54,239"
            change="+12.5%"
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="Active Users"
            value="3,847"
            change="+8.2%"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Total Orders"
            value="1,234"
            change="+15.3%"
            icon={ShoppingCart}
            trend="up"
          />
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            change="-2.1%"
            icon={Activity}
            trend="down"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
                <p className="text-sm text-muted-foreground">Monthly revenue over time</p>
              </div>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Simple Bar Chart Representation */}
            <div className="space-y-4">
              {REVENUE_DATA.map((data, index) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground w-8">
                    {data.month}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-4 relative overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${(data.revenue / 60000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    ${(data.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* User Growth Chart */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">User Growth</h3>
                <p className="text-sm text-muted-foreground">New users acquired monthly</p>
              </div>
              <Button variant="outline" size="sm">
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Simple Line Chart Representation */}
            <div className="space-y-4">
              {REVENUE_DATA.map((data, index) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground w-8">
                    {data.month}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-3 relative overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(data.users / 4000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {(data.users / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <Card className="p-6 border-border bg-card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="space-y-4">
              {TOP_PRODUCTS.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${product.revenue.toLocaleString()}</p>
                    <Badge variant="outline" className="text-green-600">
                      {product.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'purchase' ? 'bg-green-500' :
                    activity.type === 'signup' ? 'bg-blue-500' :
                    activity.type === 'upgrade' ? 'bg-purple-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};