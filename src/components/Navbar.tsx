import { useState, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen ? "bg-background" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-8 h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="text-primary font-black text-2xl md:text-3xl tracking-tighter select-none">
          STREAMFLIX
        </Link>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-1 border border-foreground/30 rounded px-3 py-1 text-sm text-foreground hover:border-foreground/60 transition-colors">
            <Globe size={16} />
            English
          </button>
          <Button variant="signin" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <button className="flex items-center gap-2 text-foreground text-sm">
                <Globe size={16} />
                English
              </button>
              <Button variant="signin" size="sm" className="w-fit" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
