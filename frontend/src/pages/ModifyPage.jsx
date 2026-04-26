import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlayers, fetchMatches } from "../services/api";
import PlayerAvatar from "../components/PlayerAvatar";
import RoleBadge from "../components/RoleBadge";

const ROLES = ["All", "WK", "BAT", "AR", "BOWL"];

export default function ModifyPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [match, setMatch] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedResult = sessionStorage.getItem(`result_${matchId}`);
    if (savedResult) {
      const result = JSON.parse(savedResult);
      setSelected(
        result.best_xi.map((p) => ({
          player_id: p.player_id,
          name: p.name,
          team: p.team,
          role: p.role,
          credits: p.credits,
          image_url: p.image_url,
          career_avg_fp: p.career_avg_fp,
          last_5_avg_fp: p.last_5_avg_fp,
          last_match_fp: p.last_match_fp,
        }))
      );
    }

    Promise.all([fetchPlayers(matchId), fetchMatches()])
      .then(([pl, ms]) => {
        setPlayers(pl);
        setMatch(ms.find((m) => m.match_id === parseInt(matchId)));
      })
      .finally(() => setLoading(false));
  }, [matchId]);

  const shown =
    filter === "All" ? players : players.filter((p) => p.role === filter);
  const credits = selected.reduce((s, p) => s + p.credits, 0);
  const isSelected = (p) => selected.some((s) => s.player_id === p.player_id);

  const toggle = (player) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.player_id === player.player_id);
      if (exists) return prev.filter((p) => p.player_id !== player.player_id);
      if (prev.length >= 11) return prev;
      return [...prev, player];
    });
  };

  const applyModification = () => {
    const savedResult = sessionStorage.getItem(`result_${matchId}`);
    if (savedResult) {
      const result = JSON.parse(savedResult);
      const sorted = [...selected].sort((a, b) => {
        const order = { WK: 0, BAT: 1, AR: 2, BOWL: 3 };
        return order[a.role] - order[b.role];
      });
      const captain = sorted.reduce(
        (max, p) => (p.career_avg_fp > max.career_avg_fp ? p : max),
        sorted[0]
      );
      const viceCaptain = sorted
        .filter((p) => p.player_id !== captain.player_id)
        .reduce(
          (max, p) => (p.career_avg_fp > max.career_avg_fp ? p : max),
          sorted[0]
        );

      const newBestXI = sorted.map((p) => ({
        ...p,
        pred_fp: p.career_avg_fp,
        captain: p.player_id === captain.player_id,
        vice_captain: p.player_id === viceCaptain.player_id,
      }));

      const newResult = {
        ...result,
        best_xi: newBestXI,
        total_credits: credits,
        total_pred_fp: newBestXI
          .reduce((s, p) => s + p.career_avg_fp, 0)
          .toFixed(1),
      };

      sessionStorage.setItem(`result_${matchId}`, JSON.stringify(newResult));
    }
    navigate(`/result/${matchId}`);
  };

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        paddingBottom: "140px",
      }}
    >
      {/* top bar */}
      <div style={{ background: "#0d1b2a", padding: "12px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "22px",
            }}
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>
              Modify Team
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
              {match?.team1} vs {match?.team2}
            </div>
          </div>
          <div
            style={{
              background: "rgba(245,166,35,0.15)",
              border: "1px solid rgba(245,166,35,0.4)",
              borderRadius: "8px",
              padding: "4px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "14px", fontWeight: "700", color: "#f5a623" }}
            >
              {(100 - credits).toFixed(1)}
            </div>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>
              Credits Left
            </div>
          </div>
        </div>

        {/* selected count bar */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            height: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(selected.length / 11) * 100}%`,
              height: "100%",
              background: "#f5a623",
              borderRadius: "4px",
              transition: ".3s",
            }}
          />
        </div>
      </div>

      {/* info bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          {selected.length}/11 players · {credits.toFixed(1)} credits
        </div>
        <div style={{ fontSize: "11px", color: "#f5a623", fontWeight: "600" }}>
          Pre-filled from ML prediction
        </div>
      </div>

      {/* role tabs */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          overflowX: "auto",
        }}
      >
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            style={{
              padding: "10px 14px",
              border: "none",
              background: "transparent",
              fontSize: "12px",
              fontWeight: filter === r ? "700" : "400",
              color: filter === r ? "#1a73e8" : "var(--text-secondary)",
              borderBottom:
                filter === r ? "2px solid #1a73e8" : "2px solid transparent",
              whiteSpace: "nowrap",
            }}
          >
            {r === "All" ? `All` : r}
          </button>
        ))}
      </div>

      {/* players */}
      <div style={{ padding: "8px 12px" }}>
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-light)",
            }}
          >
            Loading players...
          </div>
        )}
        {shown.map((player) => {
          const sel = isSelected(player);
          const disabled = !sel && selected.length >= 11;
          return (
            <div
              key={player.player_id}
              onClick={() => !disabled && toggle(player)}
              style={{
                background: "#fff",
                border: `1px solid ${sel ? "#f5a623" : "var(--border)"}`,
                borderRadius: "10px",
                marginBottom: "8px",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                boxShadow: sel
                  ? "0 0 0 1px #f5a623"
                  : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <PlayerAvatar
                name={player.name}
                imageUrl={player.image_url}
                size={42}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>
                    {player.name}
                  </span>
                  {sel && (
                    <span
                      style={{
                        fontSize: "9px",
                        background: "#fef3c7",
                        color: "#b45309",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        fontWeight: "600",
                      }}
                    >
                      SELECTED
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "3px" }}>
                  <RoleBadge role={player.role} small />
                  <span
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {player.team}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "3px",
                    fontSize: "11px",
                    color: "var(--text-light)",
                  }}
                >
                  <span>
                    Avg: <strong>{player.career_avg_fp}</strong>
                  </span>
                  <span>
                    Last: <strong>{player.last_match_fp}</strong>
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: "700" }}>
                  {player.credits}
                </div>
                <div style={{ fontSize: "9px", color: "var(--text-light)" }}>
                  credits
                </div>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: sel ? "#f5a623" : "#f1f5f9",
                    border: `2px solid ${sel ? "#f5a623" : "#d1d5db"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: sel ? "#fff" : "var(--text-light)",
                    fontSize: "13px",
                    fontWeight: "700",
                    marginTop: "4px",
                    marginLeft: "auto",
                  }}
                >
                  {sel ? "✓" : "+"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "480px",
          background: "#fff",
          borderTop: "1px solid var(--border)",
          padding: "10px 16px 16px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {selected.length}/11 · {credits.toFixed(1)} cr used
          </span>
          <span
            style={{
              fontSize: "12px",
              color: credits > 100 ? "#ef4444" : "#22c55e",
              fontWeight: "500",
            }}
          >
            {(100 - credits).toFixed(1)} left
          </span>
        </div>
        <button
          onClick={applyModification}
          disabled={selected.length !== 11}
          style={{
            width: "100%",
            padding: "13px",
            background:
              selected.length !== 11
                ? "#d1d5db"
                : "linear-gradient(135deg,#f5a623,#e8941a)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          {selected.length !== 11
            ? `Select ${11 - selected.length} more`
            : "Apply Changes & View Team →"}
        </button>
      </div>
    </div>
  );
}
