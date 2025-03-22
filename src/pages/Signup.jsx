"use client";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

import { app } from "../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";

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

  const signup = async (e) => {
    e.preventDefault();
    const setError = "";
    const password = "";
    const confirmPassword = "";
    let isRegistering = false;
    const setIsRegistering = (value) => {
      isRegistering = value;
    };

    const [email, setEmail] = useState(""); // Declare email state
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

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

    if (!isRegistering) {
      try {
        setIsRegistering(true);

        const userCredentials = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredentials.user;

        const firestore = getFirestore();

        // Create user document with basic info
        await setDoc(doc(firestore, "users", user.uid), {
          email: email,
          fname: fname,
          lname: lname,
          uid: user.uid,
        });

        // Create company document and other Firestore operations...
        // [Your existing Firestore code here]

        // Get the ID token
        const idToken = await user.getIdToken();

        // Redirect to admin dashboard with token
        window.location.href = `https://admin-dashboard-phi-amber.vercel.app/?token=${idToken}`;
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
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Create your account</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Start your 14-day free trial, no credit card required
              </p>
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl">
              <CardContent className="pt-6">
                {error && (
                  <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                <form className="space-y-4" onSubmit={signup}>
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
                    <Label htmlFor="confirm-password">Confirm password</Label>
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
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
                  </div>
                </div>
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
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Signup;
