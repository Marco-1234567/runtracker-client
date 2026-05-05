import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function ConnectStrava() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/strava/connect`);
      const data = await res.json();
      // Redirect the browser to Strava's authorization page
      window.location.href = data.authUrl;
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Card */}
      <div style={styles.card}>
        {/* Logo mark */}
        <div style={styles.logoRing}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4L18.5 13H23L14 24L5 13H9.5L14 4Z" fill="#FC4C02" />
          </svg>
        </div>

        <h1 style={styles.heading}>RunTracker</h1>
        <p style={styles.sub}>
          Connect your Strava account to import your runs and
          <br />
          share progress with your running crew.
        </p>

        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            ...styles.btn,
            ...(loading ? styles.btnLoading : {}),
          }}
          onMouseEnter={(e) => {
            if (!loading) Object.assign(e.currentTarget.style, styles.btnHover);
          }}
          onMouseLeave={(e) => {
            if (!loading) Object.assign(e.currentTarget.style, styles.btn);
          }}
        >
          {loading ? (
            <span style={styles.btnInner}>
              <Spinner /> Connecting…
            </span>
          ) : (
            <span style={styles.btnInner}>
              <StravaLogo />
              Connect with Strava
            </span>
          )}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.hint}>
          You'll be redirected to Strava to authorise access.
          <br />
          RunTracker only reads your activities — it never posts on your behalf.
        </p>
      </div>

      {/* Subtle feature row */}
      <div style={styles.features}>
        {[
          { icon: "⚡", label: "Auto-sync runs" },
          { icon: "📊", label: "Weekly overview" },
          { icon: "👟", label: "Share with friends" },
        ].map((f) => (
          <div key={f.label} style={styles.feature}>
            <span style={styles.featureIcon}>{f.icon}</span>
            <span style={styles.featureLabel}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Inline SVG icons ────────────────────────────────────────── */
function StravaLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 28 28"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path d="M14 4L18.5 13H23L14 24L5 13H9.5L14 4Z" fill="white" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="28"
        strokeDashoffset="10"
        strokeLinecap="round"
        fill="none"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    padding: "24px",
    background: "#0f0f0f",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
  card: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "20px",
    padding: "48px 40px 40px",
    maxWidth: "420px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 0 0 1px #ffffff08, 0 24px 48px #00000060",
  },
  logoRing: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#1f1f1f",
    border: "1px solid #2e2e2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  heading: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    color: "#f0f0f0",
    letterSpacing: "-0.5px",
  },
  sub: {
    margin: 0,
    fontSize: "14px",
    color: "#888",
    textAlign: "center",
    lineHeight: "1.6",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "8px",
    padding: "14px 24px",
    background: "#FC4C02",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
    letterSpacing: "-0.2px",
  },
  btnHover: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "8px",
    padding: "14px 24px",
    background: "#e04300",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
    letterSpacing: "-0.2px",
    transform: "translateY(-1px)",
  },
  btnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  btnInner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  error: {
    margin: 0,
    fontSize: "13px",
    color: "#f87171",
    textAlign: "center",
  },
  hint: {
    margin: 0,
    fontSize: "12px",
    color: "#555",
    textAlign: "center",
    lineHeight: "1.6",
  },
  features: {
    display: "flex",
    gap: "12px",
  },
  feature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "14px 18px",
    minWidth: "100px",
  },
  featureIcon: {
    fontSize: "20px",
  },
  featureLabel: {
    fontSize: "12px",
    color: "#666",
    whiteSpace: "nowrap",
  },
};
