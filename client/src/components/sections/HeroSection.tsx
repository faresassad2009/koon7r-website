import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-card">
      <div className="absolute inset-0 bg-[url('/assets/back.png')] opacity-5 bg-cover bg-center" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="gradient-text">KOON 7R</span>
            <br />
            <span className="text-3xl md:text-5xl">Wearing Freedom 🇵🇸</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Express your identity through premium Palestinian streetwear. 
            Each piece tells a story of resilience, culture, and pride.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <a href="#products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#custom">
                Custom Design
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">5K+</div>
              <div className="text-sm text-muted-foreground mt-1">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">EST. 1948</div>
              <div className="text-sm text-muted-foreground mt-1">Heritage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

