import { useNavigate } from "react-router-dom";

export default function TopBar({ title, subtitle, back, right }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#0d1b2a",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {back && (
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "22px",
            padding: "0 4px",
            lineHeight: 1,
          }}
        >
          ←
        </button>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff" }}>
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.6)",
              marginTop: "1px",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
