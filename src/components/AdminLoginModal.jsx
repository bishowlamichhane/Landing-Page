"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doSignInWithEmailAndPassword, doSignOut } from "../firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";

export default function AdminLoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const firestore = getFirestore(app);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in with email and password
      const userCredential = await doSignInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user has admin role
      const userDoc = await getDoc(doc(firestore, "admin", user.uid));
      const userData = userDoc.data();

      if (userData?.role === "admin") {
        // Get the ID token
        const idToken = await user.getIdToken();

        // Redirect to admin dashboard with token
        navigate("/admin-dashboard", {
          state: {
            isAdmin: true,
            uid: user.uid,
            idToken: idToken,
          },
        });
        onClose();
      } else {
        // Not an admin, show error
        await doSignOut();
        setError("You don't have permission to access the admin dashboard");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || "Failed to login");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Access the admin dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
