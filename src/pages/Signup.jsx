"use client";
import bcrypt from "bcryptjs";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Check } from "lucide-react";

import { app } from "../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";

// Define subscription plans
const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    description: "Perfect for small businesses just getting started",
    features: [
      "Dashboard analytics",
      "Product management (up to 100 products)",
      "Order management",
      "Customer database",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$79",
    description: "Ideal for growing businesses with more needs",
    features: [
      "Everything in Starter",
      "Unlimited products",
      "Advanced analytics",
      "Inventory management",
      "Priority support",
      "Multiple user accounts",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199",
    description: "For large businesses with complex requirements",
    features: [
      "Everything in Professional",
      "Custom reporting",
      "API access",
      "Dedicated account manager",
      "White-label options",
      "Advanced security features",
      "24/7 phone support",
    ],
  },
];

const Signup = () => {
  const currentUser = useAuth();
  const navigate = useNavigate();
  const firestore = getFirestore(app);

  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [cname, setCname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState("account");
  const [selectedPlan, setSelectedPlan] = useState("");

  // Check for plan in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planFromUrl = params.get("plan");
    if (planFromUrl) {
      setSelectedPlan(planFromUrl);
    }
  }, []);

  const validateAccountDetails = () => {
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setCurrentStep("subscription");
  };

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    // Validate subscription selection
    if (!selectedPlan) {
      setError("Please select a subscription plan");
      return;
    }

    if (!isRegistering) {
      try {
        setIsRegistering(true);

        const userCredentials = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredentials.user;

        // Hash the password using bcryptjs
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Get the selected plan details
        const planDetails = subscriptionPlans.find(
          (plan) => plan.id === selectedPlan
        );

        // Create subscription object
        const subscription = {
          plan: selectedPlan,
          planName: planDetails ? planDetails.name : selectedPlan,
          price: planDetails ? planDetails.price : "",
          startDate: new Date().toISOString(),
          status: "active",
          trialEnds: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(), // 14 days from now
        };

        // Create user document with basic info
        await setDoc(doc(firestore, "users", user.uid), {
          role: "customer",
          email: email,
          fname: fname,
          lname: lname,
          subscription: subscription,
          uid: user.uid,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
        });

        // Create company document in a subcollection
        const companyRef = await addDoc(
          collection(firestore, "users", user.uid, "company"),
          {
            name: cname,
          }
        );

        // Create initial analytics document in analytics subcollection
        await addDoc(
          collection(
            firestore,
            "users",
            user.uid,
            "company",
            companyRef.id,
            "analytics"
          ),
          {
            revenue: 1,
            sales: 1,
          }
        );

        // Create initial empty customer document
        await addDoc(
          collection(
            firestore,
            "users",
            user.uid,
            "company",
            companyRef.id,
            "customers"
          ),
          {
            email: "",
            name: "",
            orders: 1,
          }
        );

        // Create initial empty product document
        await addDoc(
          collection(
            firestore,
            "users",
            user.uid,
            "company",
            companyRef.id,
            "products"
          ),
          {
            description: "",
            name: "",
            price: 1,
          }
        );

        // Get the ID token
        const idToken = await user.getIdToken();

        // Determine if we're in development or production
        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        // Set the appropriate redirect URL - using HTTP for localhost, not HTTPS
        const redirectUrl = isLocalhost
          ? `http://localhost:5174/?token=${idToken}` // Note: HTTP not HTTPS
          : `https://admin-dashboard-phi-amber.vercel.app/?token=${idToken}`;

        console.log("Redirecting to:", redirectUrl);

        // Redirect to admin dashboard with token
        window.location.href = redirectUrl;
      } catch (err) {
        setError(err.message);
        console.error("Signup error:", err);
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {currentUser && <Navigate to="/" replace={true} />}
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 pt-24">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Create your account</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Start your 14-day free trial, no credit card required
              </p>
            </div>

            <Tabs value={currentStep} onValueChange={setCurrentStep}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="account">Account Details</TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  disabled={currentStep !== "subscription"}
                >
                  Choose Subscription
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl">
                  <CardContent className="pt-6">
                    {error && (
                      <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                      </div>
                    )}
                    <form className="space-y-4" onSubmit={handleContinue}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input
                            id="first-name"
                            placeholder="John"
                            className="h-12 rounded-lg"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input
                            id="last-name"
                            placeholder="Doe"
                            className="h-12 rounded-lg"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={email}
                          type="email"
                          placeholder="you@example.com"
                          className="h-12 rounded-lg"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company name</Label>
                        <Input
                          id="company"
                          placeholder="Your Company"
                          value={cname}
                          onChange={(e) => setCname(e.target.value)}
                          className="h-12 rounded-lg"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          value={password}
                          type="password"
                          className="h-12 rounded-lg"
                          required
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm password
                        </Label>
                        <Input
                          id="confirm-password"
                          value={confirmPassword}
                          type="password"
                          className="h-12 rounded-lg"
                          required
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" className="mt-1" required />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <Link
                            to="#"
                            className="text-rose-600 dark:text-rose-400 hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="#"
                            className="text-rose-600 dark:text-rose-400 hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <Button
                        className="w-full h-12 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white"
                        type="submit"
                      >
                        Continue to Select Plan
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-zinc-200 dark:border-zinc-800 p-6">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-rose-600 dark:text-rose-400 font-medium hover:underline"
                      >
                        Log in
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="subscription">
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl">
                  <CardContent className="pt-6">
                    {error && (
                      <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                      </div>
                    )}
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">
                        Choose your subscription plan
                      </h2>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        All plans include a 14-day free trial. No credit card
                        required.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      {subscriptionPlans.map((plan) => (
                        <Card
                          key={plan.id}
                          className={`border-2 transition-all ${
                            selectedPlan === plan.id
                              ? "border-rose-500 dark:border-rose-400 shadow-xl shadow-rose-500/10"
                              : "border-zinc-200 dark:border-zinc-700"
                          }`}
                        >
                          <CardContent className="pt-6">
                            <h3 className="text-xl font-bold mb-2">
                              {plan.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-2xl font-bold">
                                {plan.price}
                              </span>
                              <span className="text-zinc-500 dark:text-zinc-400">
                                /month
                              </span>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                              {plan.description}
                            </p>
                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check
                                    className={`h-4 w-4 mt-0.5 ${
                                      selectedPlan === plan.id
                                        ? "text-rose-500 dark:text-rose-400"
                                        : "text-zinc-600 dark:text-zinc-400"
                                    }`}
                                  />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full ${
                                selectedPlan === plan.id
                                  ? "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white"
                                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100"
                              }`}
                              onClick={() => setSelectedPlan(plan.id)}
                            >
                              {selectedPlan === plan.id
                                ? "Selected"
                                : "Select Plan"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button
                        variant="outline"
                        className="h-12 rounded-lg"
                        onClick={() => setCurrentStep("account")}
                        disabled={isRegistering}
                      >
                        Back
                      </Button>
                      <Button
                        className="h-12 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white"
                        onClick={signup}
                        disabled={isRegistering || !selectedPlan}
                      >
                        {isRegistering
                          ? "Creating account..."
                          : "Create account"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Signup;
