import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Loader2, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const plans = [
  {
    id: "basic" as const,
    name: "Basic",
    price: "$6.99",
    resolution: "480p",
    devices: "1",
  },
  {
    id: "standard" as const,
    name: "Standard",
    price: "$15.49",
    resolution: "1080p",
    devices: "2",
    highlighted: true,
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "$22.99",
    resolution: "4K+HDR",
    devices: "4",
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2
  const [selectedPlan, setSelectedPlan] = useState("standard");

  // Step 3
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!cardNumber.trim()) e.cardNumber = "Card number is required.";
    if (!expiry.trim()) e.expiry = "Expiry is required.";
    if (!cvv.trim()) e.cvv = "CVV is required.";
    if (!cardName.trim()) e.cardName = "Name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleStep2 = () => setStep(3);

  const handleStep3 = async () => {
    if (!validateStep3()) return;
    setLoading(true);
    setErrors({});

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setErrors({ general: error.message });
      setLoading(false);
      return;
    }

    // Update plan in profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ plan: selectedPlan }).eq("user_id", user.id);
    }

    setLoading(false);
    setStep(4);
  };

  const FloatingInput = ({
    id, type = "text", value, onChange, label, error, suffix,
  }: {
    id: string; type?: string; value: string; onChange: (v: string) => void; label: string; error?: string; suffix?: React.ReactNode;
  }) => (
    <div>
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          className="peer w-full h-[50px] bg-card rounded px-4 pt-5 pb-1 pr-12 text-foreground outline-none border border-transparent focus:border-foreground/40 transition-colors text-base"
        />
        <label
          htmlFor={id}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm transition-all peer-focus:top-3 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
        >
          {label}
        </label>
        {suffix && <div className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && <p className="text-primary text-xs mt-1">{error}</p>}
    </div>
  );

  // Progress indicator
  const Progress = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              s <= step ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {s < step ? <Check size={16} /> : s}
          </div>
          {s < 4 && (
            <div className={`w-8 h-0.5 ${s < step ? "bg-primary" : "bg-card"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,40%,8%)] via-background to-[hsl(0,0%,6%)]" />
      <div className="absolute inset-0 bg-background/70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[500px] mx-4 bg-[hsl(0,0%,0%)] rounded p-8 md:p-[60px]"
      >
        <Link to="/" className="block text-primary font-black text-2xl tracking-tighter mb-6">
          STREAMFLIX
        </Link>

        <Progress />

        {errors.general && (
          <div className="bg-primary/20 border border-primary rounded p-3 mb-4 text-sm text-foreground">
            {errors.general}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Create a password to start your membership</h2>
              <p className="text-muted-foreground text-sm mb-6">Just a few more steps and you're done!</p>
              <div className="space-y-4">
                <FloatingInput id="s-email" type="email" value={email} onChange={setEmail} label="Email address" error={errors.email} />
                <FloatingInput
                  id="s-pass" type={showPassword ? "text" : "password"} value={password} onChange={setPassword} label="Password" error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
                <FloatingInput id="s-confirm" type="password" value={confirmPassword} onChange={setConfirmPassword} label="Confirm password" error={errors.confirmPassword} />
                <Button variant="hero" className="w-full h-[50px]" onClick={handleStep1}>
                  Next <ChevronRight size={20} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose your plan</h2>
              <p className="text-muted-foreground text-sm mb-6">Flexible. Cancel anytime.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`rounded-lg p-4 text-center transition-all border-2 ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary/10"
                        : plan.highlighted
                        ? "border-primary/40 bg-card"
                        : "border-transparent bg-card"
                    }`}
                  >
                    <p className="font-bold text-foreground text-sm mb-1">{plan.name}</p>
                    <p className="text-primary font-bold text-lg">{plan.price}</p>
                    <p className="text-muted-foreground text-xs">/month</p>
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <p>{plan.resolution}</p>
                      <p>{plan.devices} device{plan.devices !== "1" ? "s" : ""}</p>
                    </div>
                    {selectedPlan === plan.id && (
                      <Check className="mx-auto mt-2 text-primary" size={20} />
                    )}
                  </button>
                ))}
              </div>
              <Button variant="hero" className="w-full h-[50px]" onClick={handleStep2}>
                Next <ChevronRight size={20} />
              </Button>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">Set up payment</h2>
              <p className="text-muted-foreground text-sm mb-6">Your membership starts as soon as you complete this step.</p>
              <div className="space-y-4">
                <FloatingInput id="s-card" value={cardNumber} onChange={setCardNumber} label="Card number" error={errors.cardNumber} />
                <div className="grid grid-cols-2 gap-3">
                  <FloatingInput id="s-exp" value={expiry} onChange={setExpiry} label="MM/YY" error={errors.expiry} />
                  <FloatingInput id="s-cvv" value={cvv} onChange={setCvv} label="CVV" error={errors.cvv} />
                </div>
                <FloatingInput id="s-name" value={cardName} onChange={setCardName} label="Name on card" error={errors.cardName} />
                <Button variant="hero" className="w-full h-[50px]" onClick={handleStep3} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Start Membership"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6"
              >
                <Check className="text-primary-foreground" size={40} />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Streamflix!</h2>
              <p className="text-muted-foreground">Redirecting you to browse...</p>
              {/* Auto redirect */}
              <RedirectTimer />
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <p className="text-muted-foreground text-sm mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground font-semibold hover:underline">Sign in.</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

const RedirectTimer = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/profiles"), 2000);
    return () => clearTimeout(t);
  }, [navigate]);
  return null;
};

export default Signup;
