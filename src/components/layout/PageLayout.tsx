
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showHero?: boolean;
}

const PageLayout = ({ children, title, description, showHero = false }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {showHero ? (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-10">
          <div className="container">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-4 text-lg max-w-2xl">{description}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2 text-lg">{description}</p>
            )}
          </div>
        </div>
      )}
      
      <main className="flex-1 container py-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
