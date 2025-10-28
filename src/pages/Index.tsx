import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import AuthButton from "@/components/AuthButton";
import heroImage from "@/assets/hero-marketplace.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            Community Connect
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/browse">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Browse
              </Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-secondary/95" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover & Support<br />Minority-Owned Businesses
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Connect with verified minority-owned and Howard University-affiliated businesses in one trusted platform
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                placeholder="Search for businesses, categories, or locations..."
                className="h-14 text-lg bg-white/95 backdrop-blur"
              />
              <Button size="lg" className="h-14 px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <Link to="/browse">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Browse All Businesses
            </Button>
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg leading-relaxed mb-8">
              In light of recent rollbacks to diversity, equity, and inclusion (DEI) initiatives, 
              we're building a platform that shines a spotlight on minority-owned businesses and 
              connects them directly with conscious consumers. We empower communities through 
              authentic discovery, trusted reviews, and special support for Howard University-affiliated 
              entrepreneurs.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Verified Businesses</h3>
              <p className="text-muted-foreground">
                All businesses undergo strict verification to ensure authentic minority ownership and Howard affiliation
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-secondary-foreground">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Trusted Reviews</h3>
              <p className="text-muted-foreground">
                Read authentic customer experiences and build trust through transparent, moderated feedback
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Community Impact</h3>
              <p className="text-muted-foreground">
                Support Howard University students and alumni while driving economic empowerment in our communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of conscious consumers supporting minority-owned businesses
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/browse">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Explore Businesses
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white border-white">
              List Your Business
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Community Business Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
