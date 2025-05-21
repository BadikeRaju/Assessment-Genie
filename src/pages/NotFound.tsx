
import React from 'react';
import { useLocation } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 text-center p-4">
      <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
      <p className="text-xl text-muted-foreground mb-6">
        Oops! The page at <code className="text-primary">{location.pathname}</code> was not found.
      </p>
      <Button asChild className="button-glow">
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
