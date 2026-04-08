import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore, ProfileData } from "@/store/profileStore";

const NAV_LINKS = ["Home", "TV Shows", "Movies", "New & Popular", "My List", "Browse by Languages"];

const BrowseNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { signOut } = useAuth();
  const { selectedProfile, clearSelectedProfile } = useProfileStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    clearSelectedProfile();
    await signOut();
    navigate("/login");
  };

  const initial = selectedProfile?.display_name?.[0]?.toUpperCase() ?? "U";
  const color = selectedProfile?.avatar_color ?? "#E50914";

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 100%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-12 h-16 md:h-[68px]">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/browse" className="text-primary font-black text-xl md:text-2xl tracking-tighter select-none">
            STREAMFLIX
          </Link>
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="text-sm text-foreground/80 hover:text-foreground/50 transition-colors whitespace-nowrap"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-5">
          <button className="text-foreground hover:text-foreground/70 transition-colors">
            <Search size={20} />
          </button>
          <button className="hidden md:block text-foreground/90 text-sm font-semibold hover:text-foreground/60 transition-colors">
            Kids
          </button>
          <button className="text-foreground hover:text-foreground/70 transition-colors relative">
            <Bell size={20} />
          </button>

          {/* Profile dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 group"
            >
              <div
                className="w-8 h-8 rounded-[4px] flex items-center justify-center text-sm font-bold text-foreground"
                style={{ backgroundColor: color }}
              >
                {selectedProfile?.is_kids ? "👶" : initial}
              </div>
              <ChevronDown
                size={16}
                className={`text-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-52 bg-black/95 border border-border rounded shadow-xl py-2 text-sm">
                <div className="px-4 py-2 text-foreground font-medium border-b border-border mb-1">
                  {selectedProfile?.display_name ?? "User"}
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/profiles"); }}
                  className="w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  Manage Profiles
                </button>
                <button className="w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/40 transition-colors">
                  Account
                </button>
                <button className="w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/40 transition-colors">
                  Help Center
                </button>
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/40 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default BrowseNavbar;
