import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function StravaCallback() {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    // Strava sends ?error=access_denied if the user clicked "Cancel"
    if (error) {
      setStatus("error");
      setMessage(
        "You cancelled the Strava connection. You can try again anytime.",
      );
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorisation code received from Strava.");
      return;
    }

    // Exchange the code for a JWT via our Spring Boot backend
    fetch(`${API_BASE}/api/auth/strava/callback?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        // Save the JWT in localStorage so React can use it for future requests
        localStorage.setItem("runtracker_token", data.token);
        setStatus("success");
        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      })
      .catch(() => {
        setStatus("error");
        setMessage(
          "Something went wrong connecting to Strava. Please try again.",
        );
      });
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {status === "loading" && <LoadingState />}
        {status === "success" && <SuccessState />}
        {status === "error" && <ErrorState message={message} />}
      </div>
    </div>
  );
}

/* ── States ──────────────────────────────────────────────────── */

function LoadingState() {
  return (
    <>
      <Spinner />
      <h2 style={styles.heading}>Connecting to Strava…</h2>
      <p style={styles.sub}>Importing your runs, just a moment.</p>
    </>
  );
}

function SuccessState() {
  return (
    <>
      <div style={styles.iconCircle("#1a3a2a")}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="#4ade80"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 style={styles.heading}>Connected!</h2>
      <p style={styles.sub}>Strava is linked. Taking you to your dashboard…</p>
    </>
  );
}

function ErrorState({ message }) {
  return (
    <>
      <div style={styles.iconCircle("#3a1a1a")}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke="#f87171"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 style={styles.heading}>Something went wrong</h2>
      <p style={styles.sub}>{message}</p>
      <button
        style={styles.btn}
        onClick={() => (window.location.href = "/")}
        onMouseEnter={(e) =>
          Object.assign(e.currentTarget.style, styles.btnHover)
        }
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.btn)}
      >
        Try again
      </button>
    </>
  );
}

/* ── Spinner ─────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      style={{ animation: "spin 0.9s linear infinite", marginBottom: "4px" }}
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="#2a2a2a"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="#FC4C02"
        strokeWidth="4"
        fill="none"
        strokeDasharray="80"
        strokeDashoffset="60"
        strokeLinecap="round"
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
    alignItems: "center",
    justifyContent: "center",
    background: "#0f0f0f",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    padding: "24px",
  },
  card: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "20px",
    padding: "48px 40px",
    maxWidth: "380px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    textAlign: "center",
    boxShadow: "0 0 0 1px #ffffff08, 0 24px 48px #00000060",
  },
  heading: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#f0f0f0",
    letterSpacing: "-0.4px",
  },
  sub: {
    margin: 0,
    fontSize: "14px",
    color: "#777",
    lineHeight: "1.6",
  },
  iconCircle: (bg) => ({
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  }),
  btn: {
    marginTop: "8px",
    padding: "12px 28px",
    background: "#FC4C02",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
  btnHover: {
    marginTop: "8px",
    padding: "12px 28px",
    background: "#e04300",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    transform: "translateY(-1px)",
  },
};
