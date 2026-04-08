import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(270,40%,12%)] via-[hsl(280,30%,8%)] to-background" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-lg md:text-2xl text-foreground mb-4">
          Watch anywhere. Cancel anytime.
        </p>
        <p className="text-base md:text-lg text-foreground/80 mb-6">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="Email address"
            className="w-full sm:flex-1 h-12 md:h-14 px-4 rounded-sm sm:rounded-r-none border border-foreground/30 bg-background/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <Button
            variant="hero"
            size="xl"
            className="w-full sm:w-auto sm:rounded-l-none flex items-center justify-center gap-2"
          >
            Get Started
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
