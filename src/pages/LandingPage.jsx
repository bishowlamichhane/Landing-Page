"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  CheckIcon,
  ArrowRightIcon,
  BarChartIcon,
  ShoppingCartIcon,
  UsersIcon,
  PackageIcon,
  SettingsIcon,
  PlayIcon,
} from "lucide-react";

const LandingPage = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const features = [
    {
      icon: <BarChartIcon className="h-12 w-12 text-rose-500" />,
      title: "Sales Analytics",
      description:
        "Track your sales performance with detailed analytics and reports to make data-driven decisions.",
    },
    {
      icon: <ShoppingCartIcon className="h-12 w-12 text-amber-500" />,
      title: "Order Management",
      description:
        "Efficiently manage orders from receipt to delivery with our streamlined workflow system.",
    },
    {
      icon: <UsersIcon className="h-12 w-12 text-emerald-500" />,
      title: "Customer Management",
      description:
        "Keep track of customer information, purchase history, and preferences in one place.",
    },
    {
      icon: <PackageIcon className="h-12 w-12 text-sky-500" />,
      title: "Product Management",
      description:
        "Easily add, edit, and organize your product catalog with our intuitive interface.",
    },
    {
      icon: <SettingsIcon className="h-12 w-12 text-purple-500" />,
      title: "Customizable Dashboard",
      description:
        "Personalize your dashboard to focus on the metrics that matter most to your business.",
    },
  ];

  const pricingPlans = [
    {
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

  const faqs = [
    {
      question: "What is Open Shop?",
      answer:
        "Open Shop is a comprehensive e-commerce admin dashboard that helps businesses manage their online stores efficiently. It provides tools for sales analytics, order management, customer management, product management, and more.",
    },
    {
      question: "How do I get started with Open Shop?",
      answer:
        "Getting started is easy! Simply sign up for an account, choose your subscription plan, and you'll have immediate access to your dashboard. We also offer onboarding assistance to help you set up your store.",
    },
    {
      question: "Can I upgrade or downgrade my subscription plan?",
      answer:
        "Yes, you can change your subscription plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the new rate will apply at the start of your next billing cycle.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial for all our subscription plans. No credit card is required to start your trial.",
    },
    {
      question:
        "Can I integrate Open Shop with my existing e-commerce platform?",
      answer:
        "Yes, Open Shop integrates seamlessly with popular e-commerce platforms like Shopify, WooCommerce, Magento, and more. If you need help with integration, our support team is ready to assist you.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 dark:from-rose-500 dark:via-purple-500 dark:to-indigo-500">
                  Supercharge Your E-commerce Business
                </h1>
                <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl">
                  Open Shop provides a powerful admin dashboard to help you
                  track sales, manage products, and grow your online business.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25 dark:shadow-rose-700/20"
                  >
                    <Link to="/signup">
                      Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => setVideoModalOpen(true)}
                  >
                    <PlayIcon className="mr-2 h-4 w-4" /> Watch Demo
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-500 opacity-30 blur-xl"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="/images/openshop.png"
                    alt="Open Shop Dashboard Preview"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-zinc-900" id="features">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Open Shop comes packed with all the tools you need to manage and
              grow your e-commerce business.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section
        className="py-24 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800"
        id="demo"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              See Open Shop in Action
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Watch a quick demo to see how Open Shop can transform your
              e-commerce business.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500 to-indigo-500 opacity-30 blur"></div>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              {/* Replace this with your actual video */}
              <video
                className="w-full aspect-auto object-cover h-full"
                controls
                poster="/images/openshop.png"
              >
                <source src="/videos/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25 dark:shadow-rose-700/20"
            >
              <Link to="/signup">
                Try It Yourself <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-24 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800"
        id="pricing"
      >
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Select the plan that best fits your business needs. All plans
              include a 14-day free trial.
            </p>
          </div>

          <Tabs defaultValue="monthly" className="w-full max-w-5xl mx-auto">
            <div className="flex justify-center mb-12">
              <TabsList className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <TabsTrigger value="monthly" className="rounded-full px-6 py-2">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="yearly" className="rounded-full px-6 py-2">
                  Yearly (Save 20%)
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly" className="grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-3xl overflow-hidden ${
                    index === 1
                      ? "border-2 border-rose-500 dark:border-rose-400 shadow-xl shadow-rose-500/10"
                      : "border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute top-0 inset-x-0 py-1 text-xs font-medium text-center text-white bg-gradient-to-r from-rose-500 to-purple-500">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-8 pt-10">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-extrabold">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        /month
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                      {plan.description}
                    </p>

                    <Button
                      className={`w-full rounded-full mb-8 ${
                        index === 1
                          ? "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25 dark:shadow-rose-700/20"
                          : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
                      }`}
                      asChild
                    >
                      <Link to={`/signup?plan=${plan.name.toLowerCase()}`}>
                        Start Free Trial
                      </Link>
                    </Button>

                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckIcon
                            className={`h-5 w-5 mt-0.5 ${
                              index === 1
                                ? "text-rose-500 dark:text-rose-400"
                                : "text-zinc-600 dark:text-zinc-400"
                            }`}
                          />
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="yearly" className="grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan, index) => {
                const yearlyPrice =
                  Number.parseInt(plan.price.replace("$", "")) * 0.8 * 12;
                return (
                  <div
                    key={index}
                    className={`relative rounded-3xl overflow-hidden ${
                      index === 1
                        ? "border-2 border-rose-500 dark:border-rose-400 shadow-xl shadow-rose-500/10"
                        : "border border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {index === 1 && (
                      <div className="absolute top-0 inset-x-0 py-1 text-xs font-medium text-center text-white bg-gradient-to-r from-rose-500 to-purple-500">
                        MOST POPULAR
                      </div>
                    )}
                    <div className="p-8 pt-10">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-4xl font-extrabold">
                          ${yearlyPrice}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          /year
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        {plan.description}
                      </p>

                      <Button
                        className={`w-full rounded-full mb-8 ${
                          index === 1
                            ? "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25 dark:shadow-rose-700/20"
                            : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
                        }`}
                        asChild
                      >
                        <Link to={`/signup?plan=${plan.name.toLowerCase()}`}>
                          Start Free Trial
                        </Link>
                      </Button>

                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckIcon
                              className={`h-5 w-5 mt-0.5 ${
                                index === 1
                                  ? "text-rose-500 dark:text-rose-400"
                                  : "text-zinc-600 dark:text-zinc-400"
                              }`}
                            />
                            <span className="text-zinc-700 dark:text-zinc-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-800" id="faq">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Find answers to common questions about Open Shop.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-zinc-200 dark:border-zinc-700 py-2"
                >
                  <AccordionTrigger className="text-left font-medium text-lg py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-rose-500 to-indigo-600 text-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to Transform Your E-commerce Business?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses already using Open Shop to grow their
              online presence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-rose-600 hover:bg-zinc-100 hover:text-rose-700 shadow-xl shadow-rose-700/20"
              >
                <Link to="/signup?plan=professional">
                  Start Your Free Trial{" "}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/login">Existing Customer? Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Video Modal - You can keep this if you want a fullscreen option */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-2 -top-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
              onClick={() => setVideoModalOpen(false)}
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
                className="h-5 w-5"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
            <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-black shadow-2xl">
              <div className="aspect-video">
                <video className="w-full h-full object-cover" controls autoPlay>
                  <source src="/videos/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
