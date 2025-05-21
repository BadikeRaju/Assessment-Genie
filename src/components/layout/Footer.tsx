
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Github, Twitter, Linkedin, MessageSquare, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-background/95 backdrop-blur-sm">
      <div className="container grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">AssessmentGenie</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Advanced AI-powered question generation platform by RabbittAI, TechCurators.
            Create customized assessment blueprints, access sample questions, and
            generate AI questions with our powerful tools.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-base">Features</h4>
          <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <Link to="/blueprint" className="link hover:text-primary transition-colors">Blueprint Creator</Link>
            <Link to="/samples" className="link hover:text-primary transition-colors">Sample Questions</Link>
            <Link to="/generate" className="link hover:text-primary transition-colors">AI Generator</Link>
          </nav>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-base">Resources</h4>
          <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <a href="#" className="link hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="link hover:text-primary transition-colors">API Reference</a>
            <a href="#" className="link hover:text-primary transition-colors">Tutorials</a>
            <a href="#" className="link hover:text-primary transition-colors">Blog</a>
          </nav>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-base">Company</h4>
          <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <a href="#" className="link hover:text-primary transition-colors">About RabbittAI</a>
            <a href="#" className="link hover:text-primary transition-colors">TechCurators</a>
            <a href="#" className="link hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="link hover:text-primary transition-colors">Terms</a>
          </nav>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} AssessmentGenie by RabbittAI, TechCurators. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full">
              <MessageSquare className="h-4 w-4" />
              <span>Contact Support</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
