
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lightbulb, BookOpen } from "lucide-react";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Hero section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">QuizForge</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Create professional, AI-powered quizzes for educational and professional use
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="button-glow">
              <Link to="/blueprint">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover animate-scale-in" style={{ animationDelay: "0s" }}>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Create Blueprints</CardTitle>
                <CardDescription>
                  Define your quiz structure with topic, difficulty, and question count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Specify exactly what kind of questions you need with our intuitive blueprint builder
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/blueprint">Create Blueprint</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Browse Samples</CardTitle>
                <CardDescription>
                  View sample questions for your selected topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Review examples of AI-generated questions to ensure they meet your requirements
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/samples">View Samples</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Generate Questions</CardTitle>
                <CardDescription>
                  Generate AI-powered questions and export in various formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get professionally written questions instantly and export to JSON, Excel, or Word
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/generate">Generate Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to create your first quiz?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start by creating a blueprint for your quiz and generate professional questions in minutes
          </p>
          <Button asChild size="lg" className="button-glow">
            <Link to="/blueprint">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
