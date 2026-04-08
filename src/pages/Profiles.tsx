import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore, type ProfileData } from "@/store/profileStore";
import ProfileAvatar from "@/components/profiles/ProfileAvatar";
import EditProfileDialog from "@/components/profiles/EditProfileDialog";
import { motion } from "framer-motion";
import { Plus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AVATAR_COLORS = ["#E50914", "#E87C03", "#56CCF2", "#6FCF97", "#BB6BD9"];
const MAX_PROFILES = 5;

const Profiles = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { setSelectedProfile } = useProfileStore();
  const { toast } = useToast();

  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [manageMode, setManageMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchProfiles();
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_color, content_rating, is_kids, sort_order")
      .eq("user_id", user.id)
      .order("sort_order");

    if (!error && data) {
      setProfiles(data as ProfileData[]);
    }
    setLoading(false);
  };

  const handleProfileClick = (profile: ProfileData) => {
    if (manageMode) {
      setEditingProfile(profile);
      return;
    }
    setSelectedProfile(profile);
    navigate("/browse");
  };

  const handleAddProfile = async () => {
    if (!user || profiles.length >= MAX_PROFILES) return;
    const colorIndex = profiles.length % AVATAR_COLORS.length;
    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      display_name: `Profile ${profiles.length + 1}`,
      avatar_color: AVATAR_COLORS[colorIndex],
      sort_order: profiles.length,
    });
    if (error) {
      toast({ title: "Error", description: "Could not add profile.", variant: "destructive" });
    } else {
      fetchProfiles();
    }
  };

  const handleSaveProfile = async (
    id: string,
    updates: { display_name?: string; avatar_color?: string; content_rating?: string }
  ) => {
    const { error } = await supabase.from("profiles").update(updates).eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
    } else {
      fetchProfiles();
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-[hsl(0,0%,0%)]" />;
  }

  return (
    <div className="min-h-screen bg-[hsl(0,0%,0%)] flex flex-col items-center justify-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-foreground font-medium mb-8"
        style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }}
      >
        Who's watching?
      </motion.h1>

      <div className="flex flex-wrap items-start justify-center gap-6 md:gap-8">
        {profiles.map((profile, i) => (
          <motion.button
            key={profile.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            onClick={() => handleProfileClick(profile)}
            className="group flex flex-col items-center gap-3 focus:outline-none"
          >
            <div className="relative transition-transform duration-200 group-hover:scale-[1.08] group-hover:ring-[3px] group-hover:ring-foreground rounded">
              <ProfileAvatar
                displayName={profile.display_name}
                avatarColor={profile.avatar_color}
                isKids={profile.is_kids}
                email={user?.email ?? undefined}
                size={160}
              />
              {manageMode && (
                <div className="absolute inset-0 bg-[hsl(0,0%,0%)]/60 rounded flex items-center justify-center">
                  <Pencil className="text-foreground" size={40} />
                </div>
              )}
            </div>
            <span
              className="text-muted-foreground group-hover:text-foreground transition-colors"
              style={{ fontSize: "clamp(0.75rem, 1.3vw, 1rem)" }}
            >
              {profile.display_name || user?.email?.split("@")[0] || "Profile"}
            </span>
          </motion.button>
        ))}

        {/* Add Profile */}
        {profiles.length < MAX_PROFILES && !manageMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: profiles.length * 0.1 }}
            onClick={handleAddProfile}
            className="group flex flex-col items-center gap-3 focus:outline-none"
          >
            <div className="w-[160px] h-[160px] rounded bg-card/50 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.08] group-hover:bg-card">
              <Plus className="text-muted-foreground group-hover:text-foreground transition-colors" size={64} />
            </div>
            <span
              className="text-muted-foreground group-hover:text-foreground transition-colors"
              style={{ fontSize: "clamp(0.75rem, 1.3vw, 1rem)" }}
            >
              Add Profile
            </span>
          </motion.button>
        )}
      </div>

      {/* Manage Profiles toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setManageMode(!manageMode)}
        className="mt-10 flex items-center gap-2 px-6 py-2 border border-muted-foreground/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors text-sm tracking-wider"
      >
        {manageMode ? (
          "Done"
        ) : (
          <>
            <Pencil size={16} />
            Manage Profiles
          </>
        )}
      </motion.button>

      <EditProfileDialog
        profile={editingProfile}
        open={!!editingProfile}
        onClose={() => setEditingProfile(null)}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profiles;
