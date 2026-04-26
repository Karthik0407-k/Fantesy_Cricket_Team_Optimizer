const ROLE_COLORS = {
  WK: { bg: "#0e2438", color: "#4aa8e8" },
  BAT: { bg: "#092418", color: "#40d870" },
  AR: { bg: "#28180a", color: "#e8a040" },
  BOWL: { bg: "#280e0e", color: "#e84040" },
};

export default function FieldPlayer({ player }) {
  const initials = player.name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const role = ROLE_COLORS[player.role] || ROLE_COLORS.BAT;
  const isCap = player.captain;
  const isVC = player.vice_captain;

  return (
    <div
      style={{
        background: "rgba(6, 10, 20, 0.85)",
        border: `1.5px solid ${
          isCap || isVC ? "var(--gold)" : "rgba(193,127,36,0.4)"
        }`,
        borderRadius: "10px",
        padding: "6px 9px",
        textAlign: "center",
        minWidth: "72px",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {/* C / VC badge */}
      {(isCap || isVC) && (
        <div
          style={{
            position: "absolute",
            top: "-8px",
            left: "-8px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: isCap ? "var(--gold)" : "#3a80d4",
            color: isCap ? "#06100a" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "7px",
            fontWeight: "800",
            border: "1.5px solid rgba(255,255,255,0.8)",
          }}
        >
          {isCap ? "C" : "VC"}
        </div>
      )}

      {/* role badge */}
      <div
        style={{
          position: "absolute",
          top: "-6px",
          right: "-6px",
          fontSize: "7px",
          fontWeight: "700",
          padding: "1px 4px",
          borderRadius: "3px",
          background: role.bg,
          color: role.color,
        }}
      >
        {player.role}
      </div>

      {/* avatar */}
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          margin: "0 auto 4px",
          background: "linear-gradient(135deg, #0e2040, #1a3060)",
          border: "1.5px solid var(--bronze-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "9px",
          fontWeight: "700",
          color: "#d0ddf0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {player.image_url && (
          <img
            src={player.image_url}
            alt={player.name}
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

      {/* name */}
      <div
        style={{
          fontSize: "9px",
          fontWeight: "500",
          color: "#e0eaf8",
          whiteSpace: "nowrap",
        }}
      >
        {player.name.split(" ").pop()}
      </div>

      {/* points */}
      <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.45)" }}>
        {isCap ? "C · " : isVC ? "VC · " : ""}
        {player.pred_fp} pts
      </div>
    </div>
  );
}
