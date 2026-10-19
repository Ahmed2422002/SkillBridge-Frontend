import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsSearch, BsBell, BsCheckCircleFill, BsAwardFill, BsMortarboardFill,
  BsBookFill, BsCollectionPlayFill, BsClockFill, BsGraphUpArrow,
} from "react-icons/bs";
import { learningPaths } from "../data/coursePlaylists";
import { fetchPlaylistVideos } from "../utils/youtube";
import {
  getCompletedVideos,
  getCompletedVideoDetails,
  getRecentActivity,
  getTotalStudySeconds,
  getCurrentStreak,
  getLastVisitedPath,
} from "../utils/progress";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function formatStudyTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.round((totalSeconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function MyProgress() {
  const navigate = useNavigate();
  const [pathTotals, setPathTotals] = useState({});
  const [loading, setLoading] = useState(true);

  // نجيب عدد الفيديوهات الحقيقي لكل مسار (مجموع فيديوهات كل تصنيفاته من يوتيوب)
  useEffect(() => {
    let cancelled = false;
async function loadTotals() {
  setLoading(true);
  const entries = Object.entries(learningPaths);
  try {
    const results = await Promise.allSettled(
      entries.map(async ([pathKey, path]) => {
        const categoryResults = await Promise.allSettled(
          path.categories.map((c) => fetchPlaylistVideos(c.playlistId, 100))
        );
        const total = categoryResults.reduce(
          (sum, r) => sum + (r.status === "fulfilled" ? r.value.length : 0),
          0
        );
        return [pathKey, total];
      })
    );
    if (!cancelled) {
      const totalsMap = {};
      results.forEach((r, i) => {
        const [pathKey] = entries[i];
        totalsMap[pathKey] = r.status === "fulfilled" ? r.value[1] : 0;
      });
      setPathTotals(totalsMap);
    }
  } finally {
    if (!cancelled) setLoading(false);
  }
}
    loadTotals();
    return () => {
      cancelled = true;
    };
  }, []);

  const pathsWithProgress = useMemo(() => {
    return Object.entries(learningPaths).map(([pathKey, path]) => {
      const completedCount = getCompletedVideos(pathKey).length;
      const total = pathTotals[pathKey] || 0;
      const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
      const isCompleted = total > 0 && completedCount >= total;
      const details = getCompletedVideoDetails(pathKey);
      const completedDates = details.map((d) => d.completedAt).filter(Boolean).sort();
      const completionDate =
        isCompleted && completedDates.length ? completedDates[completedDates.length - 1] : null;

      return { pathKey, title: path.title, completedCount, total, percent, isCompleted, completionDate };
    });
  }, [pathTotals]);

  const completedPaths = pathsWithProgress.filter((p) => p.isCompleted);
  const totalLessonsCompleted = pathsWithProgress.reduce((s, p) => s + p.completedCount, 0);
  const totalLessonsAvailable = pathsWithProgress.reduce((s, p) => s + p.total, 0);
  const recentActivity = getRecentActivity(5);
  const studyTime = formatStudyTime(getTotalStudySeconds());
  const streak = getCurrentStreak();

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 28, height: 28, backgroundColor: "#22D3C5", color: "#fff" }}
            >
              ●
            </span>
            Platform
          </a>

          <div className="d-none d-lg-flex mx-auto gap-4">
            <span role="button" className="text-dark text-decoration-none" onClick={() => navigate("/")}>
              Home
            </span>
             <span
                role="button"
                className="text-dark text-decoration-none"
                onClick={() => {
                    const target = getLastVisitedPath() || Object.keys(learningPaths)[0];
                    navigate(`/learning/${target}`);
                }}
                >
                Videos
            </span>
                            <span role="button" className="fw-bold text-decoration-none" style={{ color: "#22D3C5" }}>
              My Progress
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
           <BsSearch className="text-dark" role="button" />
<BsBell className="text-dark" role="button" onClick={() => navigate("/notifications")} />
            <div role="button"
            className="rounded-circle bg-secondary"
            style={{ width: 32, height: 32 }}
            onClick={() => navigate("/profile")} />
          </div>
        </div>
      </nav>

      <div className="container py-5" style={{ maxWidth: 1100 }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold">My Progress</h2>
          <p className="text-muted mb-1">Track your learning journey and keep moving toward your goals.</p>
          <p className="text-muted">
            {completedPaths.length > 0
              ? "You're making great progress. Keep learning and stay consistent!"
              : "Start a learning path to see your progress here."}
          </p>
        </div>

        {/* Completed Learning Paths */}
        <section className="mb-4">
          <h5 className="fw-bold mb-1">Completed Learning Paths</h5>
          <p className="text-muted small mb-3">Paths you've completed. Keep up the amazing work!</p>

          {loading && <p className="text-muted">جاري حساب التقدّم...</p>}

          {!loading && completedPaths.length === 0 && (
            <div className="bg-white rounded-4 shadow-sm p-4 text-center text-muted">
              لسا ما كملتي أي مسار. كملي كل فيديوهات المسار حتى يظهر هون.
            </div>
          )}

          {!loading &&
            completedPaths.map((p) => (
              <div
                key={p.pathKey}
                className="bg-white rounded-4 shadow-sm p-4 mb-3 d-flex align-items-center gap-3 flex-wrap"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, backgroundColor: "#D6F5F2", color: "#22D3C5", fontSize: 22 }}
                >
                  <BsCheckCircleFill />
                </div>
                <div style={{ minWidth: 180 }}>
                  <div className="fw-bold">{p.title}</div>
                  <div className="text-muted small">Completed on {formatDate(p.completionDate)}</div>
                </div>
                <div className="flex-grow-1" style={{ minWidth: 200 }}>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar" style={{ width: `${p.percent}%`, backgroundColor: "#22D3C5" }} />
                  </div>
                </div>
                <div className="fw-bold">{p.percent}%</div>
                <button className="btn btn-outline-success rounded-pill d-flex align-items-center gap-2">
                  Certificates <BsAwardFill />
                </button>
              </div>
            ))}

          {!loading && (
            <div className="bg-white rounded-4 shadow-sm p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, backgroundColor: "#D6F5F2", color: "#22D3C5", fontSize: 22 }}
              >
                <BsMortarboardFill />
              </div>
              <div>
                <div className="fw-bold">Complete more learning paths to earn more certificates.</div>
                <div className="text-muted small">Keep learning and achieve your goals!</div>
              </div>
            </div>
          )}
        </section>

        {/* Progress Overview */}
        <section className="mb-4">
          <h5 className="fw-bold mb-1">Your Progress Overview</h5>
          <p className="text-muted small mb-3">Here's a quick look at your overall learning progress.</p>

          <div className="row g-3">
            <div className="col-6 col-md-3">
              <StatCard icon={<BsBookFill />} color="#22D3C5" label="Paths Completed" value={completedPaths.length} sub="Keep going!" />
            </div>
            <div className="col-6 col-md-3">
              <StatCard
                icon={<BsCollectionPlayFill />}
                color="#7C4DFF"
                label="Lessons Completed"
                value={totalLessonsCompleted}
                sub={`Out of ${totalLessonsAvailable} lessons`}
              />
            </div>
            <div className="col-6 col-md-3">
              <StatCard icon={<BsClockFill />} color="#F5B301" label="Study Time" value={studyTime} sub="Total time spent" />
            </div>
            <div className="col-6 col-md-3">
              <StatCard icon={<BsGraphUpArrow />} color="#3B82F6" label="Current Streak" value={`${streak} days`} sub="Amazing consistency!" />
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h5 className="fw-bold mb-1">Recent Activity</h5>
          <p className="text-muted small mb-3">Your latest learning activities.</p>

          {recentActivity.length === 0 && (
            <div className="bg-white rounded-4 shadow-sm p-4 text-center text-muted">
              ما في نشاط بعد. ابدأي بمشاهدة أي فيديو حتى يظهر هون.
            </div>
          )}
            {recentActivity.map((a) => (
            <div
                key={`${a.pathKey}-${a.id}`}
                role="button"
                className="bg-white rounded-4 shadow-sm p-3 mb-2 d-flex align-items-center gap-3"
                onClick={() =>
                navigate(`/learning/${a.pathKey}`, {
                    state: { initialTab: a.categoryKey || "all" },
                })
                }
            >
                <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: 36, height: 36, backgroundColor: "#22c55e" }}
                >
                <BsCheckCircleFill />
                </div>
                <div className="flex-grow-1">
                <div className="fw-semibold">Completed {learningPaths[a.pathKey]?.title || a.pathKey}</div>
                <div className="text-muted small">{a.title || "You've earned progress!"}</div>
                </div>
                <div className="text-muted small">{formatDate(a.completedAt)}</div>
            </div>
            ))}
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, color, label, value, sub }) {
  return (
    <div className="bg-white rounded-4 shadow-sm p-3 h-100">
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mb-2"
        style={{ width: 40, height: 40, backgroundColor: `${color}22`, color }}
      >
        {icon}
      </div>
      <div className="text-muted small">{label}</div>
      <div className="fw-bold fs-4">{value}</div>
      <div className="text-muted small">{sub}</div>
    </div>
  );
}