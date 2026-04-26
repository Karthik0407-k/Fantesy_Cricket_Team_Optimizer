import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMatches } from "../services/api";
import PlayerAvatar from "../components/PlayerAvatar";
import RoleBadge from "../components/RoleBadge";
import html2canvas from "html2canvas";

const ROLE_ORDER = ["WK", "BAT", "AR", "BOWL"];
const ROLE_LABELS = {
  WK: "WICKET KEEPERS",
  BAT: "BATTERS",
  AR: "ALL ROUNDERS",
  BOWL: "BOWLERS",
};

function FieldPlayerCard({ player }) {
  const isCap = player.captain;
  const isVC = player.vice_captain;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <div style={{ position: "relative" }}>
        {(isCap || isVC) && (
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "-6px",
              zIndex: 2,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: isCap ? "#f5a623" : "#3b82f6",
              color: "#fff",
              fontSize: "8px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #fff",
            }}
          >
            {isCap ? "C" : "VC"}
          </div>
        )}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: `2px solid ${
              isCap ? "#f5a623" : isVC ? "#3b82f6" : "rgba(255,255,255,0.4)"
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "700",
            color: "#fff",
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
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          <span style={{ position: "relative", zIndex: 1 }}>
            {player.name.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
      <div
        style={{
          background: "rgba(0,0,0,0.65)",
          borderRadius: "6px",
          padding: "3px 6px",
          textAlign: "center",
          minWidth: "64px",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            fontWeight: "600",
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "70px",
          }}
        >
          {player.name.split(" ").slice(-1)[0]}
        </div>
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.65)" }}>
          {player.pred_fp} pts
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const fieldRef = useRef();
  const [result, setResult] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("field");

  useEffect(() => {
    const saved = sessionStorage.getItem(`result_${matchId}`);
    if (saved) setResult(JSON.parse(saved));

    fetchMatches().then((ms) => {
      setMatch(ms.find((m) => m.match_id === parseInt(matchId)));
      setLoading(false);
    });
  }, [matchId]);

  // in exportImage function:
  const exportImage = async () => {
    const canvas = await html2canvas(fieldRef.current, {
      useCORS: true,
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `CricketXI_${match?.team1}_vs_${match?.team2}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading || !result)
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#888" }}>
        Loading result...
      </div>
    );

  const byRole = {};
  ROLE_ORDER.forEach((r) => (byRole[r] = []));
  result.best_xi.forEach((p) => byRole[p.role]?.push(p));

  const t1 = result.best_xi.filter((p) => p.team === match?.team1).length;
  const t2 = result.best_xi.filter((p) => p.team === match?.team2).length;

  const topPerformers = [...result.best_xi]
    .sort((a, b) => b.pred_fp - a.pred_fp)
    .slice(0, 4);

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        paddingBottom: "20px",
      }}
    >
      {/* top bar */}
      <div
        style={{
          background: "#0d1b2a",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate(`/pool/${matchId}`)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "22px",
            }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>
              Best XI — {match?.team1} vs {match?.team2}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
              PuLP Optimized · {result.total_credits} Credits Used
            </div>
          </div>
        </div>
        <div
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.4)",
            borderRadius: "8px",
            padding: "5px 10px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "13px", fontWeight: "700", color: "#22c55e" }}
          >
            ~{result.total_pred_fp}
          </div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>
            Pred Pts
          </div>
        </div>
      </div>

      {/* stats row */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {[
          { label: "WK", value: byRole.WK?.length },
          { label: "BAT", value: byRole.BAT?.length },
          { label: "AR", value: byRole.AR?.length },
          { label: "BOWL", value: byRole.BOWL?.length },
          { label: match?.team1, value: t1 },
          { label: match?.team2, value: t2 },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "var(--text-primary)",
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "var(--text-secondary)",
                marginTop: "1px",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          display: "flex",
        }}
      >
        {["field", "list"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "11px",
              border: "none",
              background: "transparent",
              fontSize: "13px",
              fontWeight: tab === t ? "700" : "400",
              color: tab === t ? "#1a73e8" : "var(--text-secondary)",
              borderBottom:
                tab === t ? "2px solid #1a73e8" : "2px solid transparent",
            }}
          >
            {t === "field" ? "🏟 Field View" : "📋 List View"}
          </button>
        ))}
      </div>

      {/* FIELD VIEW */}
      {tab === "field" && (
        <div
          ref={fieldRef}
          style={{
            background:
              "linear-gradient(170deg,#1a7a3c 0%,#0f4f26 50%,#1a7a3c 100%)",
            margin: "12px",
            borderRadius: "16px",
            padding: "16px 10px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* oval */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "85%",
              paddingTop: "90%",
              border: "2px solid rgba(255,255,255,0.08)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          {/* inner oval */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "55%",
              paddingTop: "58%",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* match label */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "14px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {match?.team1} vs {match?.team2}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.45)",
                marginTop: "2px",
              }}
            >
              Predicted {result.total_pred_fp} pts
            </div>
          </div>

          {/* players by role */}
          {ROLE_ORDER.map((role) => (
            <div
              key={role}
              style={{ marginBottom: "14px", position: "relative", zIndex: 2 }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: "8px",
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: "8px",
                }}
              >
                {ROLE_LABELS[role]}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: `${byRole[role]?.length > 3 ? "8px" : "16px"}`,
                  flexWrap: "wrap",
                }}
              >
                {byRole[role]?.map((p, i) => (
                  <FieldPlayerCard key={i} player={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {tab === "list" && (
        <div style={{ padding: "10px 12px" }}>
          {result.best_xi.map((p, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                marginBottom: "8px",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <PlayerAvatar name={p.name} imageUrl={p.image_url} size={42} />
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    {p.name}
                  </span>
                  {p.captain && (
                    <span
                      style={{
                        background: "#fef3c7",
                        color: "#b45309",
                        fontSize: "9px",
                        fontWeight: "700",
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      CAPTAIN
                    </span>
                  )}
                  {p.vice_captain && (
                    <span
                      style={{
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        fontSize: "9px",
                        fontWeight: "700",
                        padding: "1px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      VICE CAP
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "3px" }}>
                  <RoleBadge role={p.role} small />
                  <span
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {p.team}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1a73e8",
                  }}
                >
                  {p.pred_fp}
                </div>
                <div style={{ fontSize: "9px", color: "var(--text-light)" }}>
                  pred pts
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {p.credits} cr
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* top performers */}
      <div
        style={{
          margin: "0 12px",
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "12px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--text-secondary)",
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}
        >
          TOP PERFORMERS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          {topPerformers.map((p, i) => (
            <div
              key={i}
              style={{
                background: "#f8fafc",
                borderRadius: "8px",
                padding: "8px 10px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {p.name.split(" ").slice(-1)[0]}
                {p.captain && " (C)"}
                {p.vice_captain && " (VC)"}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#1a73e8",
                  fontWeight: "700",
                  marginTop: "2px",
                }}
              >
                {p.pred_fp} pts
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-light)" }}>
                {p.role} · {p.team}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* action buttons */}
      <div style={{ padding: "0 12px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => navigate(`/modify/${matchId}`)}
          style={{
            flex: 1,
            padding: "13px",
            background: "#fff",
            border: "1.5px solid #1a73e8",
            borderRadius: "10px",
            color: "#1a73e8",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Modify Team
        </button>
        <button
          onClick={exportImage}
          style={{
            flex: 1,
            padding: "13px",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(34,197,94,0.35)",
          }}
        >
          Export Team
        </button>
      </div>
    </div>
  );
}
