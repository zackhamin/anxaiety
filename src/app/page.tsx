"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  Brain,
  MessageSquare,
  LineChart,
  Save,
  Phone,
  Calendar,
} from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, isLoading, error } = useUser();

  if (user) {
    redirect("/chat");
  }

  return (
    <main className="flex flex-col h-screen">
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <section className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Your AI Anxiety Therapist
              </h2>
              <p className="text-xl mb-8">
                Get answers, talk without judgement, and connect with
                professionals when needed.
              </p>
              <Button size="lg">Get Started</Button>
            </section>

            <section className="grid md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2" /> Ask About Anxiety
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Type your question here..."
                    className="mb-4"
                  />
                  <Button>Get Answer</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2" /> Track Your Feelings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">How are you feeling today?</p>
                  <div className="flex justify-between">
                    {["😔", "😐", "🙂", "😊"].map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-2xl"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="text-center mb-16">
              <h3 className="text-2xl font-bold mb-8">
                How Anxaiety Helps You
              </h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <Brain size={48} className="mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">AI-Powered Support</h4>
                  <p>Get instant answers to your mental health questions.</p>
                </div>
                <div>
                  <Save size={48} className="mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Progress Tracking</h4>
                  <p>Monitor your emotional well-being over time.</p>
                </div>
                <div>
                  <Calendar size={48} className="mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Automatic Updates</h4>
                  <p>
                    AI updates your calendar with assessments for easy tracking.
                  </p>
                </div>
                <div>
                  <Phone size={48} className="mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Professional Help</h4>
                  <p>Connect with mental health experts when needed.</p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2" /> Your Progress Calendar
                  </CardTitle>
                  <CardDescription>
                    AI-powered insights automatically added to your calendar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    [Calendar Placeholder]
                    <p className="mt-2 text-sm text-gray-600">
                      Your conversations and mood tracking will be automatically
                      reflected here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 py-6 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p>&copy; 2024 Anxiaety. All rights reserved.</p>
            <p className="mt-2">
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>{" "}
              |
              <a href="#" className="hover:underline ml-2">
                Terms of Service
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
