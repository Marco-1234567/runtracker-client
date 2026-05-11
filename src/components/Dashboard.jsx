import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import WeeklyChart from "./WeeklyChart";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("runtracker_token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    async function fetchActivities() {
      try {
        const res = await fetch(`${API_BASE}/api/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          navigate("/");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        setActivities(data);
      } catch {
        setError("Could not load activities. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [token, navigate]);

  async function fetchActivities() {
    try {
      const res = await fetch(`${API_BASE}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        navigate("/");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data);
    } catch {
      setError("Could not load activities. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/api/strava/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Sync failed");
      await fetchActivities();
    } catch {
      setError("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("runtracker_token");
    navigate("/");
  }

  // --- Derived stats ---
  const thisWeek = getThisWeekActivities(activities);
  const weeklyKm = thisWeek.reduce((sum, a) => sum + (a.distanceKm ?? 0), 0);
  const weeklyRuns = thisWeek.length;
  const weeklyTime = thisWeek.reduce((sum, a) => sum + (a.durationSec ?? 0), 0);
  const weeklyElev = thisWeek.reduce((sum, a) => sum + (a.elevationM ?? 0), 0);
  const totalKm = activities.reduce((sum, a) => sum + (a.distanceKm ?? 0), 0);

  if (loading) return <LoadingScreen />;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <path d="M14 4L18.5 13H23L14 24L5 13H9.5L14 4Z" fill="#FC4C02" />
          </svg>
          <span style={s.logoText}>RunTracker</span>
        </div>
        <div style={s.headerActions}>
          <button style={s.syncBtn} onClick={handleSync} disabled={syncing}>
            {syncing ? "Syncing…" : "↻ Sync Strava"}
          </button>
          <button style={s.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {error && <p style={s.error}>{error}</p>}

      {/* Weekly stat cards */}
      <div style={s.statsGrid}>
        <StatCard label="This week" value={`${weeklyKm.toFixed(1)} km`} />
        <StatCard label="Runs" value={weeklyRuns} />
        <StatCard label="Time" value={formatDuration(weeklyTime)} />
        <StatCard label="Elevation" value={`${Math.round(weeklyElev)} m`} />
        <StatCard label="Total distance" value={`${totalKm.toFixed(0)} km`} />
      </div>

      {/* Weekly chart */}
      {/* {activities.length > 0 && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Weekly distance</h2>
          <WeeklyChart activities={activities} />
        </div>
      )} */}

      {/* Activity feed */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Recent runs</h2>
        {activities.length === 0 ? (
          <p style={s.empty}>
            No activities yet — click "Sync Strava" to import your runs!
          </p>
        ) : (
          <div style={s.feed}>
            {activities.slice(0, 20).map((a) => (
              <ActivityRow key={a.id} activity={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function StatCard({ label, value }) {
  return (
    <div style={s.statCard}>
      <p style={s.statLabel}>{label}</p>
      <p style={s.statValue}>{value}</p>
    </div>
  );
}

function ActivityRow({ activity }) {
  const date = new Date(activity.activityDate);
  const label = dateLabel(date);

  return (
    <div style={s.activityRow}>
      <div style={s.activityIcon}>
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
          <path d="M14 4L18.5 13H23L14 24L5 13H9.5L14 4Z" fill="#FC4C02" />
        </svg>
      </div>
      <div style={s.activityInfo}>
        <p style={s.activityName}>{activity.name ?? "Run"}</p>
        <p style={s.activityMeta}>
          {label} · {activity.type ?? "Run"}
        </p>
      </div>
      <div style={s.activityStats}>
        <p style={s.activityStat}>{activity.distanceKm?.toFixed(2)} km</p>
        <p style={s.activityMeta}>{formatDuration(activity.durationSec)}</p>
      </div>
      <div style={s.activityStats}>
        <p style={s.activityStat}>{formatPace(activity.paceMinKm)}</p>
        <p style={s.activityMeta}>/ km</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f0f",
        fontFamily: "sans-serif",
      }}
    >
      <p style={{ color: "#666" }}>Loading your runs…</p>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */

function getThisWeekActivities(activities) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return activities.filter((a) => new Date(a.activityDate) >= monday);
}

function formatDuration(seconds) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

function formatPace(paceMinKm) {
  if (!paceMinKm) return "—";
  const min = Math.floor(paceMinKm);
  const sec = Math.round((paceMinKm - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function dateLabel(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-SE", { day: "numeric", month: "short" });
}

/* ── Styles ──────────────────────────────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#f0f0f0",
    fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
    padding: "0 0 48px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #1f1f1f",
  },
  logo: { display: "flex", alignItems: "center", gap: "8px" },
  logoText: { fontSize: "16px", fontWeight: "700", color: "#f0f0f0" },
  headerActions: { display: "flex", gap: "8px" },
  syncBtn: {
    padding: "8px 16px",
    background: "#FC4C02",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "transparent",
    color: "#666",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
    gap: "12px",
    padding: "24px",
  },
  statCard: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "16px",
  },
  statLabel: { margin: "0 0 4px", fontSize: "12px", color: "#666" },
  statValue: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "500",
    color: "#f0f0f0",
  },
  section: { padding: "0 24px", marginTop: "8px" },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#888",
    margin: "0 0 12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  feed: { display: "flex", flexDirection: "column", gap: "8px" },
  activityRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "14px 16px",
  },
  activityIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#2a2a2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  activityInfo: { flex: 1, minWidth: 0 },
  activityName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "500",
    color: "#f0f0f0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  activityMeta: { margin: 0, fontSize: "12px", color: "#555" },
  activityStats: { textAlign: "right", flexShrink: 0 },
  activityStat: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "500",
    color: "#f0f0f0",
  },
  error: {
    margin: "0 24px 16px",
    padding: "12px 16px",
    background: "#3a1a1a",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#f87171",
  },
  empty: { fontSize: "14px", color: "#555" },
};
