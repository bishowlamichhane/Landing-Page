"use client";

import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import {
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
import {
  Users,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  UserRound,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { doSignOut } from "../firebase/auth";
import CustomersTab from "./dashboard/CustomersTab";
import SubscriptionsTab from "./dashboard/SubscriptionsTab";
import AnalyticsTab from "./dashboard/AnalyticsTab";
import SettingsTab from "./dashboard/SettingsTab";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";

export default function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  });
  const [planDistribution, setPlanDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated as admin
  const isAdmin = location.state?.isAdmin;

  // Fetch dashboard data from Firestore
  useEffect(() => {
    if (!isAdmin) return;

    const fetchDashboardData = async () => {
      try {
        const firestore = getFirestore(app);
        const usersRef = collection(firestore, "users");

        // First, try to get customers without ordering (this doesn't require an index)
        const customersQuery = query(usersRef, where("role", "==", "customer"));

        let querySnapshot;
        try {
          // Try to get customers with ordering (requires index)
          const orderedQuery = query(
            usersRef,
            where("role", "==", "customer"),
            orderBy("createdAt", "desc")
          );
          querySnapshot = await getDocs(orderedQuery);
        } catch (error) {
          // If index error occurs, fall back to unordered query
          console.warn(
            "Using unordered query because index is missing. To enable sorting, create the index using the link in the console error."
          );
          querySnapshot = await getDocs(customersQuery);
        }

        const customers = [];
        const plans = {};
        let activeCount = 0;
        let totalRevenue = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          customers.push(data);

          // Count active subscriptions
          if (data.subscription?.status === "active") {
            activeCount++;

            // Calculate revenue
            const price = data.subscription?.price || "$0";
            const numericPrice = Number.parseInt(price.replace(/[^0-9]/g, ""));
            if (!isNaN(numericPrice)) {
              totalRevenue += numericPrice;
            }
          }

          // Count plans for distribution
          const planName = data.subscription?.planName || "None";
          plans[planName] = (plans[planName] || 0) + 1;
        });

        // Calculate conversion rate (active / total)
        const conversionRate =
          customers.length > 0
            ? Math.round((activeCount / customers.length) * 100)
            : 0;

        // Format plan distribution for chart
        const planData = Object.keys(plans).map((plan) => ({
          name: plan,
          value: plans[plan],
        }));

        // Sort customers by createdAt if we didn't get ordered results
        const sortedCustomers = [...customers].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA; // descending order
        });

        // Get recent activity (newest 3 customers)
        const recentCustomers = sortedCustomers.slice(0, 3).map((customer) => ({
          type: "new-customer",
          name: `${customer.fname} ${customer.lname}`,
          email: customer.email,
          date: customer.createdAt,
          plan: customer.subscription?.planName || "None",
        }));

        setDashboardStats({
          totalCustomers: customers.length,
          activeSubscriptions: activeCount,
          monthlyRevenue: totalRevenue,
          conversionRate: conversionRate,
        });

        setPlanDistribution(planData);
        setRecentActivity(recentCustomers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);

        // Show a helpful message if it's an index error
        if (error.message && error.message.includes("index")) {
          alert(
            "This query requires a Firestore index. Please check the console for a link to create it."
          );
        }
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  // Mock data for revenue trend (would be replaced with real data)
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 5000 },
    { name: "Mar", revenue: 6000 },
    { name: "Apr", revenue: 8000 },
    { name: "May", revenue: 10000 },
    { name: "Jun", revenue: 12000 },
  ];

  // Professional color palette
  const COLORS = ["#4F46E5", "#EC4899", "#10B981", "#F59E0B", "#6366F1"];
  const CHART_COLORS = {
    primary: "#4F46E5",
    secondary: "#EC4899",
    tertiary: "#10B981",
    quaternary: "#F59E0B",
  };

  const handleSignOut = async () => {
    try {
      await doSignOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      } else {
        return "Just now";
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // If not authenticated as admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              OS
            </div>
            {!isSidebarCollapsed && (
              <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                Open Shop
              </span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(true)}
              className="h-8 w-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          )}
          {isSidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(false)}
              className="h-8 w-8 absolute -right-4 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Button
            variant={activeTab === "overview" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "overview"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard
              className={`h-5 w-5 ${
                activeTab === "overview"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : ""
              } ${isSidebarCollapsed ? "" : "mr-2"}`}
            />
            {!isSidebarCollapsed && <span>Overview</span>}
          </Button>

          <Button
            variant={activeTab === "customers" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "customers"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
            }`}
            onClick={() => setActiveTab("customers")}
          >
            <UserRound
              className={`h-5 w-5 ${
                activeTab === "customers"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : ""
              } ${isSidebarCollapsed ? "" : "mr-2"}`}
            />
            {!isSidebarCollapsed && <span>Customers</span>}
          </Button>

          <Button
            variant={activeTab === "subscriptions" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "subscriptions"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
            }`}
            onClick={() => setActiveTab("subscriptions")}
          >
            <Receipt
              className={`h-5 w-5 ${
                activeTab === "subscriptions"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : ""
              } ${isSidebarCollapsed ? "" : "mr-2"}`}
            />
            {!isSidebarCollapsed && <span>Subscriptions</span>}
          </Button>

          <Button
            variant={activeTab === "analytics" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "analytics"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3
              className={`h-5 w-5 ${
                activeTab === "analytics"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : ""
              } ${isSidebarCollapsed ? "" : "mr-2"}`}
            />
            {!isSidebarCollapsed && <span>Analytics</span>}
          </Button>

          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            } ${
              activeTab === "settings"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings
              className={`h-5 w-5 ${
                activeTab === "settings"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : ""
              } ${isSidebarCollapsed ? "" : "mr-2"}`}
            />
            {!isSidebarCollapsed && <span>Settings</span>}
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
              isSidebarCollapsed ? "justify-center px-0" : ""
            }`}
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-6 h-16">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "customers" && "Customer Management"}
              {activeTab === "subscriptions" && "Subscription Plans"}
              {activeTab === "analytics" && "Analytics & Reports"}
              {activeTab === "settings" && "Admin Settings"}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 w-48 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600"></span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">
                    Loading dashboard data...
                  </span>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Total Customers
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                          {dashboardStats.totalCustomers}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1 h-3 w-3"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                          +12% from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Active Subscriptions
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                          {dashboardStats.activeSubscriptions}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {dashboardStats.totalCustomers > 0
                            ? Math.round(
                                (dashboardStats.activeSubscriptions /
                                  dashboardStats.totalCustomers) *
                                  100
                              )
                            : 0}
                          % of total customers
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Monthly Revenue
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                          ${dashboardStats.monthlyRevenue}
                        </div>
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1 h-3 w-3"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                          +18.2% from last month
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Conversion Rate
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-amber-600 dark:text-amber-400"
                          >
                            <path d="M12 2v20" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                          {dashboardStats.conversionRate}%
                        </div>
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1 h-3 w-3"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                          +5.4% from last month
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="col-span-1 border-0 shadow-md bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-gray-800 dark:text-white">
                          Revenue Trend
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          Monthly revenue for the last 6 months
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#E5E7EB"
                              />
                              <XAxis
                                dataKey="name"
                                tick={{ fill: "#6B7280" }}
                                axisLine={{ stroke: "#E5E7EB" }}
                              />
                              <YAxis
                                tick={{ fill: "#6B7280" }}
                                axisLine={{ stroke: "#E5E7EB" }}
                              />
                              <Tooltip
                                formatter={(value) => [`$${value}`, "Revenue"]}
                                contentStyle={{
                                  backgroundColor: "#FFF",
                                  border: "1px solid #E5E7EB",
                                  borderRadius: "0.375rem",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                }}
                              />
                              <Bar
                                dataKey="revenue"
                                fill={CHART_COLORS.primary}
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-1 border-0 shadow-md bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-gray-800 dark:text-white">
                          Subscription Plans
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          Distribution of active subscription plans
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={
                                  planDistribution.length > 0
                                    ? planDistribution
                                    : [{ name: "No Data", value: 1 }]
                                }
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
                                formatter={(value) => [
                                  `${value} customers`,
                                  "Count",
                                ]}
                                contentStyle={{
                                  backgroundColor: "#FFF",
                                  border: "1px solid #E5E7EB",
                                  borderRadius: "0.375rem",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="text-gray-800 dark:text-white">
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        Latest customer and subscription activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentActivity.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          No recent activity to display
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentActivity.map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-4"
                            >
                              <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <UserRound className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                  New customer registered
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  {activity.name} ({activity.email}) created an
                                  account
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(activity.date)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {activeTab === "customers" && <CustomersTab />}
          {activeTab === "subscriptions" && <SubscriptionsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
