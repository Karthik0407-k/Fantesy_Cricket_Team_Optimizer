export default function PlayerAvatar({ name, imageUrl, size = 40 }) {
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
        background: "linear-gradient(135deg,#1e3a5f,#0d2137)",
        border: "2px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.28,
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
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>{initials}</span>
    </div>
  );
}
