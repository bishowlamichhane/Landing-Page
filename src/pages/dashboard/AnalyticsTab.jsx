"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState("30days");

  // Mock data for charts
  const revenueData = [
    { date: "2023-01", revenue: 4200 },
    { date: "2023-02", revenue: 4800 },
    { date: "2023-03", revenue: 5500 },
    { date: "2023-04", revenue: 6700 },
    { date: "2023-05", revenue: 7900 },
    { date: "2023-06", revenue: 9200 },
    { date: "2023-07", revenue: 10500 },
    { date: "2023-08", revenue: 12000 },
  ];

  const customerData = [
    { date: "2023-01", customers: 28 },
    { date: "2023-02", customers: 35 },
    { date: "2023-03", customers: 42 },
    { date: "2023-04", customers: 53 },
    { date: "2023-05", customers: 68 },
    { date: "2023-06", customers: 82 },
    { date: "2023-07", customers: 95 },
    { date: "2023-08", customers: 128 },
  ];

  const planDistribution = [
    { name: "Starter", value: 35 },
    { name: "Professional", value: 45 },
    { name: "Enterprise", value: 18 },
  ];

  const COLORS = ["#36A2EB", "#FF6384", "#FFCE56"];

  const conversionData = [
    { stage: "Visitors", count: 1250 },
    { stage: "Sign-ups", count: 420 },
    { stage: "Trial", count: 280 },
    { stage: "Paid", count: 98 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Analytics & Reports</h3>
          <p className="text-sm text-muted-foreground">
            Track your SaaS performance metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <CardDescription>Monthly revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                        });
                      }}
                    />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Revenue"]}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FF6384"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Plan</CardTitle>
                <CardDescription>
                  Distribution of revenue by subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} customers`, "Count"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Recurring Revenue</CardTitle>
                <CardDescription>Current MRR breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">
                        Starter ($29/mo)
                      </div>
                      <div className="text-sm font-medium">$1,015</div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">
                        Professional ($79/mo)
                      </div>
                      <div className="text-sm font-medium">$3,555</div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">
                        Enterprise ($199/mo)
                      </div>
                      <div className="text-sm font-medium">$3,582</div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Total MRR</div>
                      <div className="font-bold">$8,152</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>Total customers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                        });
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value, "Customers"]}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#36A2EB"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Monthly retention rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Mar", retention: 92 },
                        { month: "Apr", retention: 88 },
                        { month: "May", retention: 91 },
                        { month: "Jun", retention: 93 },
                        { month: "Jul", retention: 95 },
                        { month: "Aug", retention: 97 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis
                        domain={[80, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Retention Rate"]}
                      />
                      <Bar
                        dataKey="retention"
                        fill="#4BC0C0"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>Average CLV by plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { plan: "Starter", value: 350 },
                        { plan: "Professional", value: 1250 },
                        { plan: "Enterprise", value: 3200 },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={(value) => `$${value}`}
                      />
                      <YAxis type="category" dataKey="plan" width={100} />
                      <Tooltip
                        formatter={(value) => [
                          `$${value}`,
                          "Customer Lifetime Value",
                        ]}
                      />
                      <Bar
                        dataKey="value"
                        fill="#9966FF"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                Customer journey from visitor to paid user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="stage" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF9F40" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>
                  Percentage of users converting between stages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">
                        Visitor → Sign-up
                      </div>
                      <div className="text-sm font-medium">33.6%</div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: "33.6%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Sign-up → Trial</div>
                      <div className="text-sm font-medium">66.7%</div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: "66.7%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Trial → Paid</div>
                      <div className="text-sm font-medium">35.0%</div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: "35.0%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">
                        Overall (Visitor → Paid)
                      </div>
                      <div className="text-sm font-medium">7.8%</div>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: "7.8%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trial Conversion by Plan</CardTitle>
                <CardDescription>
                  Percentage of trials converting to paid by plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { plan: "Starter", rate: 28 },
                        { plan: "Professional", rate: 42 },
                        { plan: "Enterprise", rate: 65 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="plan" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Conversion Rate"]}
                      />
                      <Bar
                        dataKey="rate"
                        fill="#FF6384"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
