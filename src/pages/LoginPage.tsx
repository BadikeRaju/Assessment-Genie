import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Key, Sparkles, LogOut } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { useGoogleLogin } from '@react-oauth/google';
import { auth } from '../services/api';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get AuthContext setters
  const { setUser, setIsAuthenticated, setIsAdmin } = useAuth();

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: async (data) => {
      const errors: Record<string, { message: string }> = {};
      
      // Basic email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!data.email) {
        errors.email = { message: "Email is required" };
      } else if (!emailRegex.test(data.email)) {
        errors.email = { message: "Invalid email format" };
      }

      // Password validation
      if (!data.password) {
        errors.password = { message: "Password is required" };
      }

      return {
        values: data,
        errors: errors
      };
    }
  });

  // If already authenticated, redirect to blueprint
  if (isAuthenticated) {
    return <Navigate to="/blueprint" />;
  }

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);

    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to Assessment Genie!",
        });
        navigate('/blueprint');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'An error occurred during login',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const backendResponse = await auth.googleAuth({ token: tokenResponse.access_token });
        
        if (backendResponse.token && backendResponse.user) {
          localStorage.setItem('token', backendResponse.token);
          localStorage.setItem('authUser', JSON.stringify(backendResponse.user));
          
          // Update AuthContext state
          setUser(backendResponse.user);
          setIsAuthenticated(true);
          setIsAdmin(backendResponse.user.role === 'admin');
          
          toast({
            title: "Google Login Successful",
            description: "Logged in via Google.",
          });
          
          // Navigate based on user role
          if (backendResponse.user.role === 'admin') {
            navigate('/samples');
          } else {
            navigate('/blueprint');
          }
        } else {
          toast({
            title: "Google Auth Failed",
            description: backendResponse.message || "Backend Google auth failed.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Backend Google auth error:', error.response?.data || error.message);
        toast({
          title: "Google Login Failed",
          description: error.response?.data?.message || error.message || "An error occurred during Google login.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Auth Error:', error);
      toast({
        title: "Google Login Failed",
        description: "Could not authenticate with Google. Please try again.",
        variant: "destructive",
      });
    },
    flow: 'implicit',
    scope: 'email profile openid',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md px-4">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="h-12 w-12 text-primary animate-pulse-slow" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Assessment Genie</h1>
            <p className="text-sm text-muted-foreground mt-2">by Rabbitt AI, TechCurators</p>
          </div>

          <Card className="animate-scale-in shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter your email address" 
                              className="pl-10"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-1">
                          Use @techcurators.in email for admin access
                        </p>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="Enter your password" 
                              className="pl-10"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full button-glow" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-2 text-xs text-muted-foreground">
                        OR CONTINUE WITH
                      </span>
                    </div>
                  </div>

                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => googleLogin()}
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="h-4 w-4">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Sign in with Google
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                    onClick={() => navigate('/signup')}
                  >
                    Sign up
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
