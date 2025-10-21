import { Heart, Shirt, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About KOON 7R</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            More than just clothing - it's a statement of identity and freedom
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 rounded-lg bg-card animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To celebrate Palestinian culture and heritage through premium streetwear that tells our story to the world.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-card animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shirt className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality First</h3>
            <p className="text-muted-foreground">
              Premium materials, ethical production, and attention to detail in every piece we create.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-card animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-muted-foreground">
              Building a global community of people who stand for freedom, justice, and cultural pride.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Founded in 1948, KOON 7R represents the spirit of resilience and hope. Each design carries 
            the weight of our history and the brightness of our future. When you wear KOON 7R, you're 
            not just wearing clothes - you're wearing freedom.
          </p>
          <p className="text-lg font-semibold">
            🇵🇸 From Palestine, to the world 🇵🇸
          </p>
        </div>
      </div>
    </section>
  );
}

