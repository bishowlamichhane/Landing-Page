import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Signup = () => {
  return (
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
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      className="h-12 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company name</Label>
                  <Input
                    id="company"
                    placeholder="Your Company"
                    className="h-12 rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="h-12 rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="h-12 rounded-lg"
                    required
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
                  Create account
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 rounded-lg border-zinc-300 dark:border-zinc-700"
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
                    className="mr-2 h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-lg border-zinc-300 dark:border-zinc-700"
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
                    className="mr-2 h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  Twitter
                </Button>
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
  );
};

export default Signup;
