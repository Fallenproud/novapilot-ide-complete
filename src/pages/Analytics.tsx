import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  Code2, 
  Download, 
  TrendingUp,
  Users,
  Globe,
  Zap,
  GitCommit
} from 'lucide-react';

const Analytics = () => {
  const performanceMetrics = [
    { name: 'Build Time', value: '1.2s', change: '-15%', trend: 'down' },
    { name: 'Bundle Size', value: '245KB', change: '-8%', trend: 'down' },
    { name: 'Load Time', value: '0.8s', change: '-12%', trend: 'down' },
    { name: 'Memory Usage', value: '32MB', change: '+5%', trend: 'up' }
  ];

  const usageStats = [
    { label: 'Total Sessions', value: '1,247', period: 'Last 30 days' },
    { label: 'Active Users', value: '89', period: 'Last 7 days' },
    { label: 'Projects Created', value: '156', period: 'This month' },
    { label: 'Code Executions', value: '3,428', period: 'Last 30 days' }
  ];

  const projectHealth = [
    { name: 'React Components', status: 'Healthy', count: 24, issues: 0 },
    { name: 'TypeScript Files', status: 'Warning', count: 18, issues: 2 },
    { name: 'CSS Modules', status: 'Healthy', count: 12, issues: 0 },
    { name: 'API Endpoints', status: 'Critical', count: 8, issues: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'text-green-500';
      case 'Warning': return 'text-yellow-500';
      case 'Critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy': return 'default';
      case 'Warning': return 'secondary';
      case 'Critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor performance, usage, and project health metrics.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="health">Project Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {usageStats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Activity Overview
              </CardTitle>
              <CardDescription>
                Daily activity and usage patterns over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chart visualization would appear here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Integration with analytics service required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Key performance indicators for your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{metric.name}</h3>
                        <p className="text-sm text-muted-foreground">{metric.value}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        metric.trend === 'down' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <TrendingUp className={`h-3 w-3 ${
                          metric.trend === 'down' ? 'rotate-180' : ''
                        }`} />
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Build Performance
                </CardTitle>
                <CardDescription>
                  Build times and optimization metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Build performance chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-sm text-muted-foreground">Active users this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,456</div>
                <p className="text-sm text-muted-foreground">Total sessions this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Code Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-sm text-muted-foreground">Commits this week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Project Health Overview
              </CardTitle>
              <CardDescription>
                Monitor the health and quality of your project components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectHealth.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        item.status === 'Healthy' ? 'bg-green-500' :
                        item.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.count} items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.issues > 0 && (
                        <Badge variant="destructive">{item.issues} issues</Badge>
                      )}
                      <Badge variant={getStatusBadge(item.status)}>{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;