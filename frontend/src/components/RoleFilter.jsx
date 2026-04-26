const ROLES = [
  { key: "ALL", label: "All Players" },
  { key: "WK", label: "Keeper" },
  { key: "BAT", label: "Batters" },
  { key: "AR", label: "All-rounders" },
  { key: "BOWL", label: "Bowlers" },
];

export default function RoleFilter({ active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        marginBottom: "12px",
        flexWrap: "wrap",
      }}
    >
      {ROLES.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          style={{
            padding: "5px 13px",
            borderRadius: "16px",
            fontSize: "10px",
            fontWeight: "500",
            border:
              active === r.key ? "none" : "0.5px solid var(--bronze-border)",
            background: active === r.key ? "var(--bronze)" : "transparent",
            color: active === r.key ? "#fff" : "var(--text-muted)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
