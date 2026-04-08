const AVATAR_COLORS = [
  "#E50914", "#E87C03", "#56CCF2", "#6FCF97", "#BB6BD9",
  "#F2C94C", "#EB5757", "#2D9CDB", "#27AE60", "#9B51E0",
  "#F2994A", "#219653", "#2F80ED", "#828282", "#4F4F4F",
  "#FF6B6B", "#C471ED", "#12CBC4", "#FDA7DF", "#ED4C67",
  "#1289A7", "#D980FA", "#B53471", "#EE5A24", "#009432",
];

interface AvatarPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

const AvatarPicker = ({ selected, onSelect }: AvatarPickerProps) => (
  <div className="grid grid-cols-5 gap-3">
    {AVATAR_COLORS.map((color) => (
      <button
        key={color}
        onClick={() => onSelect(color)}
        className="w-12 h-12 rounded transition-all"
        style={{
          backgroundColor: color,
          outline: selected === color ? "3px solid white" : "none",
          outlineOffset: 2,
          transform: selected === color ? "scale(1.1)" : "scale(1)",
        }}
      />
    ))}
  </div>
);

export default AvatarPicker;
