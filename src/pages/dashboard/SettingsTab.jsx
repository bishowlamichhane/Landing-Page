"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function SettingsTab() {
  const [emailNotifications, setEmailNotifications] = useState({
    newCustomer: true,
    newSubscription: true,
    cancelledSubscription: true,
    paymentFailed: true,
    weeklyReport: true,
    monthlyReport: true,
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Open Shop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input
                    id="company-website"
                    defaultValue="https://openshop.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-address">Address</Label>
                <Textarea
                  id="company-address"
                  defaultValue="Kathmandu, Nepal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-email">Support Email</Label>
                  <Input
                    id="company-email"
                    defaultValue="support@openshop.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Support Phone</Label>
                  <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize your branding settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-2xl font-bold">OS</span>
                  </div>
                  <Button variant="outline">Upload New Logo</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Brand Colors</Label>
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <div className="h-8 w-16 rounded bg-rose-600"></div>
                    <div className="text-xs text-center">Primary</div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-8 w-16 rounded bg-purple-600"></div>
                    <div className="text-xs text-center">Secondary</div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-8 w-16 rounded bg-zinc-900 dark:bg-zinc-100"></div>
                    <div className="text-xs text-center">Text</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Customize
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which emails you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Customer Notification</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an email when a new customer signs up
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.newCustomer}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      newCustomer: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Subscription Notification</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an email when a customer starts a new subscription
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.newSubscription}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      newSubscription: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cancelled Subscription Notification</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an email when a customer cancels their subscription
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.cancelledSubscription}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      cancelledSubscription: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Failed Notification</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an email when a payment fails
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.paymentFailed}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      paymentFailed: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Report</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your SaaS performance
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      weeklyReport: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Monthly Report</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a monthly detailed report of your SaaS performance
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.monthlyReport}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({
                      ...emailNotifications,
                      monthlyReport: checked,
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your admin account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Live API Key</Label>
                <div className="flex items-center gap-2">
                  <Input value="sk_live_51NxXXXXXXXXXXXXXXXXXXXXXX" readOnly />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Test API Key</Label>
                <div className="flex items-center gap-2">
                  <Input value="sk_test_51NxXXXXXXXXXXXXXXXXXXXXXX" readOnly />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Webhook Secret</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value="whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    readOnly
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Regenerate Keys</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
