import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", label: "Matches", icon: "🏏" },
  { path: "/teams", label: "My Teams", icon: "👥" },
  { path: "/cont", label: "Contests", icon: "🏆" },
  { path: "/prof", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        height: "var(--bottom-nav-h)",
        background: "#fff",
        borderTop: "1px solid var(--border)",
        display: "flex",
        zIndex: 100,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
      }}
    >
      {tabs.map((t) => {
        const active = pathname === t.path;
        return (
          <button
            key={t.path}
            onClick={() => navigate(t.path)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              color: active ? "#d4a33a" : "var(--text-light)",
              transition: ".15s",
            }}
          >
            <span style={{ fontSize: "20px" }}>{t.icon}</span>
            <span
              style={{ fontSize: "10px", fontWeight: active ? "600" : "400" }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
