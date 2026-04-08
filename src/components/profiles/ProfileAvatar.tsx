import { User, Baby } from "lucide-react";

interface ProfileAvatarProps {
  displayName: string | null;
  avatarColor: string;
  isKids: boolean;
  email?: string;
  size?: number;
}

const ProfileAvatar = ({ displayName, avatarColor, isKids, email, size = 160 }: ProfileAvatarProps) => {
  const initial = displayName
    ? displayName.charAt(0).toUpperCase()
    : email
    ? email.charAt(0).toUpperCase()
    : "?";

  return (
    <div
      className="relative rounded flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: avatarColor,
        borderRadius: 4,
      }}
    >
      {isKids ? (
        <Baby size={size * 0.45} className="text-foreground" />
      ) : (
        <span
          className="font-bold text-foreground select-none"
          style={{ fontSize: size * 0.45 }}
        >
          {initial}
        </span>
      )}
      {isKids && (
        <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-[10px] font-black px-1.5 py-0.5 rounded">
          KIDS
        </span>
      )}
    </div>
  );
};

export default ProfileAvatar;
