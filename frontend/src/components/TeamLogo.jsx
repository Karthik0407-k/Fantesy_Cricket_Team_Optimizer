const COLORS = {
  RCB: { bg: "#c8102e", tx: "#fff" },
  CSK: { bg: "#f5c518", tx: "#0a0a0a" },
  MI: { bg: "#004ba0", tx: "#d4af37" },
  KKR: { bg: "#3a1d66", tx: "#f5c518" },
  DC: { bg: "#004c93", tx: "#ef3340" },
  PBKS: { bg: "#ed1c24", tx: "#d4af37" },
  RR: { bg: "#1e3f9e", tx: "#ff69b4" },
  SRH: { bg: "#f26522", tx: "#000" },
  GT: { bg: "#1c3764", tx: "#d4af37" },
  LSG: { bg: "#a72056", tx: "#00bcd4" },
};

export default function TeamLogo({ team, size = 44 }) {
  const c = COLORS[team] || { bg: "#333", tx: "#fff" };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: c.bg,
        color: c.tx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.22,
        fontWeight: "800",
        border: "2px solid rgba(255,255,255,0.2)",
        flexShrink: 0,
      }}
    >
      {team}
    </div>
  );
}
