import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setShowVerificationPrompt(true);
        toast.error("Please verify your email before logging in");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setIsResending(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification email sent! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to BookBank</CardTitle>
          <CardDescription>Sign in to access your study materials</CardDescription>
        </CardHeader>
        <CardContent>
          {showVerificationPrompt && (
            <Alert className="mb-4 border-primary/20 bg-primary/5">
              <Mail className="h-5 w-5 text-primary" />
              <AlertDescription className="ml-2">
                <p className="font-medium mb-2">Email Not Verified</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Please check your email and click the verification link to activate your account.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
