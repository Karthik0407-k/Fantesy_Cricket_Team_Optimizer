import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { predictBestXI } from "../services/api";

const STEPS = [
  {
    label: "Feature engineering complete",
    sub: "22 players processed",
    duration: 1500,
  },
  {
    label: "ML model predictions ready",
    sub: "Random Forest · 22 predictions",
    duration: 2000,
  },
  {
    label: "PuLP optimizer running...",
    sub: "Applying Dream11 constraints",
    duration: 3000,
  },
  {
    label: "Selecting C & VC",
    sub: "Maximizing fantasy points",
    duration: 1500,
  },
];

export default function LoadingPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    predictBestXI(parseInt(matchId)).then((data) => {
      sessionStorage.setItem(`result_${matchId}`, JSON.stringify(data));
      setResult(data);
    });
  }, [matchId]);

  useEffect(() => {
    let total = 0;
    const timers = [];
    STEPS.forEach((s, i) => {
      timers.push(setTimeout(() => setStep(i + 1), total + s.duration));
      total += s.duration;
    });
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 95));
    }, 80);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (step >= STEPS.length && result) {
      setProgress(100);
      setTimeout(() => navigate(`/result/${matchId}`), 800);
    }
  }, [step, result]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(170deg,#0d1b2a 0%,#1a2f4a 50%,#0d1b2a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* spinning ring */}
      <div style={{ position: "relative", marginBottom: "32px" }}>
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.1)",
            borderTop: "4px solid #f5a623",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: "800",
            color: "#fff",
          }}
        >
          XI
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "#fff",
          marginBottom: "6px",
          textAlign: "center",
        }}
      >
        Building Your Dream XI
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        {matchId &&
          `Match ${matchId} · Optimizing team within 100 credit budget${dots}`}
      </div>

      {/* steps */}
      <div style={{ width: "100%", maxWidth: "320px", marginBottom: "32px" }}>
        {STEPS.map((s, i) => {
          const done = step > i;
          const active = step === i;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                marginBottom: "16px",
                animation: done || active ? "fadeIn 0.4s ease" : "none",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: done
                    ? "#22c55e"
                    : active
                    ? "#f5a623"
                    : "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#fff",
                  marginTop: "1px",
                  transition: ".3s",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: done
                      ? "#22c55e"
                      : active
                      ? "#f5a623"
                      : "rgba(255,255,255,0.35)",
                    transition: ".3s",
                  }}
                >
                  {s.label}
                </div>
                {(done || active) && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.45)",
                      marginTop: "2px",
                    }}
                  >
                    {s.sub}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* progress bar */}
      <div style={{ width: "100%", maxWidth: "320px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "6px",
            height: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg,#f5a623,#22c55e)",
              borderRadius: "6px",
              transition: "width 0.1s",
            }}
          />
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            marginTop: "8px",
            textAlign: "center",
          }}
        >
          Optimizing team within 100 credit budget{dots}
        </div>
      </div>
    </div>
  );
}
