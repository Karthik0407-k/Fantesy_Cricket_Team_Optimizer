const ROLE_COLORS = {
  WK: { bg: "#0e2438", color: "#4aa8e8" },
  BAT: { bg: "#092418", color: "#40d870" },
  AR: { bg: "#28180a", color: "#e8a040" },
  BOWL: { bg: "#280e0e", color: "#e84040" },
};

function Avatar({ name, imageUrl, size = 38 }) {
  const initials = name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #0e2040, #1a3060)",
        border: "1.5px solid var(--bronze-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "700",
        color: "#fff",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          onError={(e) => (e.target.style.display = "none")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
          }}
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>{initials}</span>
    </div>
  );
}

export default function PlayerCard({ player }) {
  const role = ROLE_COLORS[player.role] || ROLE_COLORS.BAT;

  return (
    <div
      style={{
        background: "var(--navy-card)",
        border: "0.5px solid var(--bronze-border)",
        borderRadius: "9px",
        padding: "9px 10px",
        display: "flex",
        gap: "9px",
        alignItems: "center",
      }}
    >
      <Avatar name={player.name} imageUrl={player.image_url} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {player.name}
        </div>

        <div
          style={{
            display: "flex",
            gap: "4px",
            marginTop: "3px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "8px",
              fontWeight: "700",
              padding: "2px 5px",
              borderRadius: "3px",
              background: role.bg,
              color: role.color,
            }}
          >
            {player.role}
          </span>
          <span
            style={{ fontSize: "9px", color: "var(--gold)", fontWeight: "500" }}
          >
            {player.credits} cr
          </span>
          <span
            style={{
              fontSize: "9px",
              color: "var(--text-muted)",
              fontWeight: "600",
            }}
          >
            {player.team}
          </span>
        </div>

        <div
          style={{
            fontSize: "9px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          Last: {player.last_match_fp} pts · Avg: {player.career_avg_fp}
        </div>
      </div>
    </div>
  );
}
