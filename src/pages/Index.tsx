import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const { selectedProfile } = useProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(selectedProfile ? "/browse" : "/profiles");
    }
  }, [loading, user, selectedProfile, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
