const STYLES = {
  WK: { bg: "#dbeafe", color: "#1d4ed8" },
  BAT: { bg: "#dcfce7", color: "#15803d" },
  AR: { bg: "#fef3c7", color: "#b45309" },
  BOWL: { bg: "#fee2e2", color: "#b91c1c" },
};

export default function RoleBadge({ role, small }) {
  const s = STYLES[role] || STYLES.BAT;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: small ? "9px" : "10px",
        fontWeight: "700",
        padding: small ? "1px 5px" : "2px 7px",
        borderRadius: "4px",
      }}
    >
      {role}
    </span>
  );
}
