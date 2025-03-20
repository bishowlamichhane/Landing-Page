"use client";

import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");
  const currentUser = useAuth();

  const loginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        await doSignInWithEmailAndPassword(email, password);
        window.location.href = "https://admin-dashboard-phi-amber.vercel.app/";
        // Success - the redirect will happen automatically due to the Navigate component
      } catch (err) {
        setError(err.message);
        console.error("Login error:", err);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        await doSignInWithGoogle();
        // Success - the redirect will happen automatically
      } catch (err) {
        setError(err.message);
        console.error("Google sign-in error:", err);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
      {currentUser && <Navigate to="/" replace={true} />}
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 pt-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Log in to your Open Shop account
            </p>
          </div>

          <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl">
            <CardContent className="pt-6">
              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form className="space-y-4" onSubmit={loginSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-lg"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="#"
                      className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="h-12 rounded-lg"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me for 30 days
                  </Label>
                </div>
                <Button
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white"
                  type="submit"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? "Logging in..." : "Log in"}
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
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-rose-600 dark:text-rose-400 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
