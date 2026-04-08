import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Please enter a valid email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (!password.trim()) e.password = "Your password must contain between 4 and 60 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrors({ general: "Sorry, we can't find an account with this email address and password." });
      setLoading(false);
      return;
    }

    navigate("/browse");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,40%,8%)] via-background to-[hsl(0,0%,6%)]" />
      <div className="absolute inset-0 bg-background/70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[450px] mx-4 bg-[hsl(0,0%,0%)] rounded p-8 md:p-[60px]"
      >
        <Link to="/" className="block text-primary font-black text-2xl tracking-tighter mb-8">
          STREAMFLIX
        </Link>

        <h1 className="text-[32px] font-bold text-foreground mb-7">Sign In</h1>

        {errors.general && (
          <div className="bg-primary/20 border border-primary rounded p-3 mb-4 text-sm text-foreground">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <div className="relative">
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full h-[50px] bg-card rounded px-4 pt-5 pb-1 text-foreground outline-none border border-transparent focus:border-foreground/40 transition-colors text-base"
              />
              <label
                htmlFor="login-email"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm transition-all peer-focus:top-3 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
              >
                Email address
              </label>
            </div>
            {errors.email && <p className="text-primary text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full h-[50px] bg-card rounded px-4 pt-5 pb-1 pr-12 text-foreground outline-none border border-transparent focus:border-foreground/40 transition-colors text-base"
              />
              <label
                htmlFor="login-password"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm transition-all peer-focus:top-3 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-primary text-xs mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            variant="hero"
            disabled={loading}
            className="w-full h-[50px] rounded text-base"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </Button>

          <div className="text-right">
            <a href="#" className="text-muted-foreground text-sm hover:underline">
              Forgot password?
            </a>
          </div>
        </form>

        <div className="mt-12">
          <p className="text-muted-foreground">
            New to Streamflix?{" "}
            <Link to="/signup" className="text-foreground font-semibold hover:underline">
              Sign up now.
            </Link>
          </p>
          <p className="text-muted-foreground text-xs mt-4 leading-relaxed">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
