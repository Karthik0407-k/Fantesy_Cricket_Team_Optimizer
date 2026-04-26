import { useNavigate } from "react-router-dom";

const TEAM_COLORS = {
  RCB: "#c8102e",
  CSK: "#d4a520",
  MI: "#004ba0",
  KKR: "#3a1d66",
  DC: "#004c93",
  PBKS: "#b0121a",
  RR: "#1e3f9e",
  SRH: "#e8501a",
  GT: "#1a3060",
  LSG: "#a01e56",
};

const TEAM_TEXT = {
  RCB: "#fff",
  CSK: "#050d18",
  MI: "#d4af37",
  KKR: "#f0c040",
  DC: "#fff",
  PBKS: "#d4af37",
  RR: "#fff",
  SRH: "#fff",
  GT: "#d4a33a",
  LSG: "#fff",
};

export default function MatchCard({ match }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/pool/${match.match_id}`)}
      style={{
        background: "var(--navy-card)",
        border: "0.5px solid var(--bronze-border)",
        borderRadius: "13px",
        padding: "16px",
        marginBottom: "12px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gold)";
        e.currentTarget.style.background = "var(--navy-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--bronze-border)";
        e.currentTarget.style.background = "var(--navy-card)";
      }}
    >
      {/* match number */}
      <div
        style={{
          fontSize: "10px",
          color: "var(--text-muted)",
          marginBottom: "10px",
          letterSpacing: "0.08em",
        }}
      >
        IPL 2025 · {match.match_num}
      </div>

      {/* teams row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        {/* team 1 */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: TEAM_COLORS[match.team1] || "#333",
              color: TEAM_TEXT[match.team1] || "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: "800",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
          >
            {match.team1}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {match.team1}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
              Home
            </div>
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "var(--bronze)",
            background: "var(--bronze-dim)",
            border: "0.5px solid var(--bronze-border)",
            padding: "5px 12px",
            borderRadius: "7px",
          }}
        >
          VS
        </div>

        {/* team 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexDirection: "row-reverse",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: TEAM_COLORS[match.team2] || "#333",
              color: TEAM_TEXT[match.team2] || "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: "800",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
          >
            {match.team2}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {match.team2}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
              Away
            </div>
          </div>
        </div>
      </div>

      {/* meta */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          📅 {match.date} · {match.time}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          📍 {match.venue}
        </div>
      </div>

      {/* button */}
      <button
        style={{
          width: "100%",
          padding: "9px",
          border: "none",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #8a5c10, #c17f24, #d4a33a)",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "500",
          cursor: "pointer",
          letterSpacing: "0.04em",
        }}
      >
        Select Match & View Players →
      </button>
    </div>
  );
}
