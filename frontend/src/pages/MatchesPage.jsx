import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMatches } from "../services/api";
import TeamLogo from "../components/TeamLogo";
import BottomNav from "../components/BottomNav";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches()
      .then(setMatches)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingBottom: "var(--bottom-nav-h)" }}>
      {/* top header */}
      <div
        style={{
          background: "#0d1b2a",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#f5a623" }}
          >
            FantasyXI
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
              marginTop: "2px",
            }}
          >
            IPL 2025 · Powered by ML + PuLP
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["My Teams", "Contest"].map((b) => (
            <button
              key={b}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "6px",
                padding: "5px 10px",
                fontSize: "11px",
                fontWeight: "500",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* section title */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          IPL 2025 Matches
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            marginTop: "2px",
          }}
        >
          Select a match to build your dream team
        </div>
      </div>

      <div style={{ padding: "12px 12px 0" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "700",
            color: "var(--text-secondary)",
            letterSpacing: "0.08em",
            marginBottom: "10px",
          }}
        >
          LIVE &amp; UPCOMING
        </div>

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-light)",
            }}
          >
            Loading matches...
          </div>
        )}

        {matches.map((m, idx) => (
          <div
            key={m.match_id}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              marginBottom: "10px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {/* match badge */}
            <div
              style={{
                background: idx === 0 ? "#0d1b2a" : "#f8fafc",
                padding: "8px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color:
                    idx === 0
                      ? "rgba(255,255,255,0.7)"
                      : "var(--text-secondary)",
                  letterSpacing: "0.04em",
                }}
              >
                {m.match_num} · T20 · IPL 2025
              </div>
              {idx === 0 ? (
                <span
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: "700",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    letterSpacing: "0.05em",
                  }}
                >
                  LIVE
                </span>
              ) : idx === 1 ? (
                <span
                  style={{
                    fontSize: "10px",
                    color: "#f5a623",
                    fontWeight: "600",
                  }}
                >
                  Today 7:30 PM
                </span>
              ) : (
                <span
                  style={{ fontSize: "10px", color: "var(--text-secondary)" }}
                >
                  {m.date} · {m.time}
                </span>
              )}
            </div>

            {/* teams */}
            <div
              style={{
                padding: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <TeamLogo team={m.team1} size={52} />
                <div style={{ fontSize: "12px", fontWeight: "600" }}>
                  {m.team1}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "var(--text-secondary)",
                    background: "#f1f5f9",
                    padding: "4px 12px",
                    borderRadius: "20px",
                  }}
                >
                  VS
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--text-secondary)",
                    marginTop: "4px",
                  }}
                >
                  {m.venue.split(",")[0]}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <TeamLogo team={m.team2} size={52} />
                <div style={{ fontSize: "12px", fontWeight: "600" }}>
                  {m.team2}
                </div>
              </div>
            </div>

            {/* venue + button */}
            <div
              style={{
                padding: "0 14px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-light)" }}>
                📍 {m.venue}
              </div>
              <button
                onClick={() => navigate(`/pool/${m.match_id}`)}
                style={{
                  background:
                    idx === 0
                      ? "linear-gradient(135deg,#1a73e8,#0d47a1)"
                      : "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {idx === 0 ? "View Team" : "Predict XI →"}
              </button>
            </div>

            {/* deadline if needed */}
            {idx === 1 && (
              <div
                style={{
                  background: "#fef3c7",
                  padding: "6px 14px",
                  fontSize: "11px",
                  color: "#b45309",
                  fontWeight: "500",
                  borderTop: "1px solid #fde68a",
                }}
              >
                ⏰ Deadline: 2h 14m left
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
