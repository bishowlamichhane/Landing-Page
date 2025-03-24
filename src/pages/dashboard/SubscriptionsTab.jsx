"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebase/firebaseConfig";

export default function SubscriptionsTab() {
  const [activeTab, setActiveTab] = useState("plans");
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalActive: 0,
    newThisMonth: 0,
    churnRate: "0%",
    avgLifetime: "0 months",
  });
  const [planDistribution, setPlanDistribution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock subscription plans
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$29",
      period: "month",
      description:
        "Perfect for small businesses just getting started with e-commerce.",
      features: [
        "Up to 100 products",
        "Basic analytics",
        "Standard support",
        "1 user account",
        "Basic customization",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      id: "professional",
      name: "Professional",
      price: "$79",
      period: "month",
      description:
        "Ideal for growing businesses with expanding product catalogs.",
      features: [
        "Up to 1,000 products",
        "Advanced analytics",
        "Priority support",
        "5 user accounts",
        "Advanced customization",
        "API access",
        "Abandoned cart recovery",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$199",
      period: "month",
      description: "For large businesses with complex e-commerce needs.",
      features: [
        "Unlimited products",
        "Enterprise analytics",
        "24/7 dedicated support",
        "Unlimited user accounts",
        "Full customization",
        "Advanced API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      isPopular: false,
      isActive: true,
    },
  ];

  // Fetch subscription data from Firestore
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const firestore = getFirestore(app);
        const usersRef = collection(firestore, "users");
        const customersQuery = query(usersRef, where("role", "==", "customer"));

        const querySnapshot = await getDocs(customersQuery);
        const customers = [];
        const plans = {};
        let activeCount = 0;
        let newThisMonthCount = 0;

        // Get current date and 30 days ago
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          customers.push(data);

          // Count active subscriptions
          if (data.subscription?.status === "active") {
            activeCount++;

            // Count new subscriptions in the last 30 days
            if (data.createdAt) {
              const createdDate = new Date(data.createdAt);
              if (createdDate >= thirtyDaysAgo) {
                newThisMonthCount++;
              }
            }
          }

          // Count plans for distribution
          const planName = data.subscription?.planName || "None";
          plans[planName] = (plans[planName] || 0) + 1;
        });

        // Format plan distribution for chart
        const planDistributionData = Object.keys(plans).map((plan) => ({
          name: plan,
          count: plans[plan],
          percentage:
            customers.length > 0
              ? Math.round((plans[plan] / customers.length) * 100)
              : 0,
        }));

        setSubscriptionStats({
          totalActive: activeCount,
          newThisMonth: newThisMonthCount,
          churnRate: "3.2%", // Mock data - would need historical data to calculate
          avgLifetime: "8.5 months", // Mock data - would need historical data to calculate
        });

        setPlanDistribution(planDistributionData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="plans"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <TabsTrigger
            value="plans"
            className={`${
              activeTab === "plans"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300"
            } px-4 py-2 rounded-md transition-all`}
          >
            Subscription Plans
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className={`${
              activeTab === "stats"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300"
            } px-4 py-2 rounded-md transition-all`}
          >
            Subscription Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                Manage Subscription Plans
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure your subscription offerings and pricing
              </p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Plan
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-0 shadow-md bg-white dark:bg-gray-800 ${
                  plan.isPopular
                    ? "ring-2 ring-indigo-500 dark:ring-indigo-400"
                    : ""
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-800 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`active-${plan.id}`} className="sr-only">
                        Active
                      </Label>
                      <Switch
                        id={`active-${plan.id}`}
                        checked={plan.isActive}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Loading subscription data...
              </span>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Active Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {subscriptionStats.totalActive}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Across all plans
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      New Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {subscriptionStats.newThisMonth}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Churn Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {subscriptionStats.churnRate}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Monthly average
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Avg. Lifetime
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {subscriptionStats.avgLifetime}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Per subscription
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6 border-0 shadow-md bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">
                    Subscription Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Breakdown of active subscriptions by plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {planDistribution.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        No subscription data available
                      </div>
                    ) : (
                      planDistribution.map((plan, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {plan.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {plan.count} subscription
                              {plan.count !== 1 ? "s" : ""} ({plan.percentage}%)
                            </div>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${plan.percentage}%`,
                                backgroundColor:
                                  index === 0
                                    ? "#4F46E5"
                                    : index === 1
                                    ? "#EC4899"
                                    : index === 2
                                    ? "#10B981"
                                    : "#F59E0B",
                              }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
