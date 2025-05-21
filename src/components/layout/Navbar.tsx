
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { 
  Settings,
  BookOpen, 
  Lightbulb, 
  Upload, 
  Database,
  Sparkles,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../ui/mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of Assessment Genie."
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse-slow" />
          <Link to={isAdmin ? "/samples" : "/blueprint"} className="text-xl font-bold gradient-text flex items-center">
            <span className="hidden sm:inline">AssessmentGenie</span>
            <span className="sm:hidden">AG</span>
            <span className="text-sm ml-2 text-muted-foreground font-normal">by RabbittAI</span>
          </Link>
        </div>

        {isAuthenticated && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Only show Blueprint link to regular users */}
              {!isAdmin && (
                <NavigationMenuItem>
                  <Link to="/blueprint" className={cn(navigationMenuTriggerStyle(), isActive('/blueprint') && "bg-accent/50")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Blueprint
                  </Link>
                </NavigationMenuItem>
              )}
              
              {/* Only show Samples link to regular users */}
              {!isAdmin && (
                <NavigationMenuItem>
                  <Link to="/samples" className={cn(navigationMenuTriggerStyle(), isActive('/samples') && "bg-accent/50")}>
                    <Database className="mr-2 h-4 w-4" />
                    Samples
                  </Link>
                </NavigationMenuItem>
              )}
              
              {/* Only show Generate link to regular users */}
              {!isAdmin && (
                <NavigationMenuItem>
                  <Link to="/generate" className={cn(navigationMenuTriggerStyle(), isActive('/generate') && "bg-accent/50")}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-3">
          <ModeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
                className="h-9 px-3"
              >
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="rounded-sm bg-primary/10 text-xs px-1 mr-2 text-primary">
                      {user?.role.toUpperCase()}
                    </span> 
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-1" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
