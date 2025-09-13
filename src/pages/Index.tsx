import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const Index = () => {
  const features = [
    {
      title: "AI Body Analysis",
      description: "Get personalized style recommendations based on your body type and measurements",
      icon: "🔍",
      link: "/analysis"
    },
    {
      title: "Virtual Try-On",
      description: "See how clothes look on you with advanced AI overlay technology",
      icon: "👕", 
      link: "/try-on"
    },
    {
      title: "Style Recommendations",
      description: "Receive AI-powered suggestions for the perfect fit and style",
      icon: "✨",
      link: "/analysis"
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-white mb-6 animate-glow">
              FitVerse AI™
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              The future of fashion meets AI. Analyze your body type, get personalized recommendations, 
              and virtually try on any garment with unlimited AI generations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/analysis">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Start Body Analysis
                </Button>
              </Link>
              <Link to="/try-on">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  Try Virtual Clothing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="ai-card hover-scale">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <Link to={feature.link}>
                    <Button variant="ai" size="sm">
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto text-center">
          <Card className="ai-card max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold text-ai-primary mb-2">∞</div>
                  <div className="text-sm text-muted-foreground">Unlimited Generations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-ai-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-ai-primary mb-2">2M+</div>
                  <div className="text-sm text-muted-foreground">Try-Ons Generated</div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-card-foreground">
                Ready to Transform Your Style?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join millions of users revolutionizing their fashion experience with AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/analysis">
                  <Button variant="ai" size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/try-on">
                  <Button variant="outline" size="lg">
                    Try Virtual Clothing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
