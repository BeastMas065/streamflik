import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarPicker from "./AvatarPicker";
import ProfileAvatar from "./ProfileAvatar";
import type { ProfileData } from "@/store/profileStore";

interface EditProfileDialogProps {
  profile: ProfileData | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: { display_name?: string; avatar_color?: string; content_rating?: string }) => void;
}

const RATINGS = ["All", "13+", "16+", "18+"];

const EditProfileDialog = ({ profile, open, onClose, onSave }: EditProfileDialogProps) => {
  const [name, setName] = useState(profile?.display_name ?? "");
  const [color, setColor] = useState(profile?.avatar_color ?? "#E50914");
  const [rating, setRating] = useState(profile?.content_rating ?? "All");

  // Reset state when profile changes
  useState(() => {
    if (profile) {
      setName(profile.display_name ?? "");
      setColor(profile.avatar_color);
      setRating(profile.content_rating);
    }
  });

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-4">
          <ProfileAvatar
            displayName={name || null}
            avatarColor={color}
            isKids={profile.is_kids}
            size={100}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground text-sm mb-1 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-border"
              disabled={profile.is_kids}
            />
          </div>

          <div>
            <label className="text-muted-foreground text-sm mb-2 block">Avatar Color</label>
            <AvatarPicker selected={color} onSelect={setColor} />
          </div>

          <div>
            <label className="text-muted-foreground text-sm mb-1 block">Content Rating</label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATINGS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={() => {
                onSave(profile.id, {
                  display_name: name || undefined,
                  avatar_color: color,
                  content_rating: rating,
                });
                onClose();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
