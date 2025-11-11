import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Library, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Welcome to <span className="text-primary">BookBank</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your personal library for organizing study materials. Keep all your PDFs, notes, 
            and resources in one beautiful, organized place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate("/register")}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card shadow-sm border">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Library className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Organized Library</h3>
            <p className="text-muted-foreground">
              Organize your study materials by semester and subject for easy access
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card shadow-sm border">
            <div className="h-14 w-14 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
            <p className="text-muted-foreground">
              Control who can see your materials with public/private settings
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card shadow-sm border">
            <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-7 w-7 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Access</h3>
            <p className="text-muted-foreground">
              Find and view your PDFs instantly whenever you need them
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
