import { useState } from "react";
import { Plus, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  {
    q: "What is Streamflix?",
    a: "Streamflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
  },
  {
    q: "How much does Streamflix cost?",
    a: "Watch Streamflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $6.99 to $22.99 a month. No extra costs, no contracts.",
  },
  {
    q: "Where can I watch?",
    a: "Watch anywhere, anytime. Sign in with your Streamflix account to watch instantly on the web at streamflix.com from your personal computer or on any internet-connected device.",
  },
  {
    q: "How do I cancel?",
    a: "Streamflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees — start or stop your account anytime.",
  },
  {
    q: "What can I watch on Streamflix?",
    a: "Streamflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Streamflix originals, and more. Watch as much as you want, anytime you want.",
  },
  {
    q: "Is Streamflix good for kids?",
    a: "The Streamflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-12 md:py-20 border-t-8 border-[hsl(0,0%,13%)]">
      <div className="max-w-[800px] mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black text-foreground text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between bg-card hover:bg-card/80 px-6 py-5 text-left text-lg md:text-xl font-medium text-foreground transition-colors"
              >
                {item.q}
                {openIndex === i ? <X size={24} /> : <Plus size={24} />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-card border-t border-border px-6 py-5 text-foreground/80 text-base md:text-lg">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Repeated CTA */}
        <div className="mt-12 text-center">
          <p className="text-base md:text-lg text-foreground/80 mb-4">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 max-w-xl mx-auto">
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
      </div>
    </section>
  );
};

export default FAQ;
