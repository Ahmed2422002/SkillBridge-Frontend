import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BsPlayCircleFill,
  BsCheckCircleFill,
  BsSearch,
  BsBell,
  BsQuestionCircleFill,
} from "react-icons/bs";
import { useOnboarding } from "../context/OnboardingContext";
import { learningPaths } from "../data/coursePlaylists";
import { fetchPlaylistVideos } from "../utils/youtube";
import { getCompletedVideos, markVideoCompleted, isVideoCompleted, setLastVisitedPath } from "../utils/progress";
// ألوان مميزة لكل تصنيف (badge)، تدور تلقائيًا لو التصنيفات أكثر من الألوان
const BADGE_COLORS = [
  "#0D1B2A", // كحلي
  "#22D3C5", // تركوازي
  "#7C4DFF", // بنفسجي
  "#F5B301", // أصفر
  "#E63946", // أحمر
  "#2A9D8F", // أخضر مزرق
];

export default function CourseVideos() {
  const navigate = useNavigate();
  const { skills } = useOnboarding();
  const { pathKey } = useParams();
  const location = useLocation();

  const path = learningPaths[pathKey] || learningPaths.frontend;
  const courseCategories = path.categories;

  const doneKeys = useMemo(
    () =>
      courseCategories
        .filter((c) => skills.some((sk) => sk.toLowerCase() === c.key.toLowerCase()))
        .map((c) => c.key),
    [skills, courseCategories]
  );

  const requestedTab = location.state?.initialTab;
  const firstNotDone = courseCategories.find((c) => !doneKeys.includes(c.key));
  const defaultTab = requestedTab
    ? requestedTab
    : doneKeys.length > 0
    ? firstNotDone
      ? firstNotDone.key
      : "all"
    : "all";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [completedIds, setCompletedIds] = useState(() => getCompletedVideos(pathKey));

  useEffect(() => {
  setActiveTab(defaultTab);
  setCompletedIds(getCompletedVideos(pathKey));
  setLastVisitedPath(pathKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pathKey, requestedTab]);

  useEffect(() => {
    let cancelled = false;

    async function loadVideos() {
      setLoading(true);
      setError(null);
      try {
              if (activeTab === "all") {
        const results = await Promise.allSettled(
          courseCategories.map(async (c) => {
            const vids = await fetchPlaylistVideos(c.playlistId, 6);
            return vids.map((v) => ({ ...v, category: c.label, categoryKey: c.key }));
          })
        );
          if (!cancelled) {
            const successfulVideos = results
              .filter((r) => r.status === "fulfilled")
              .flatMap((r) => r.value);
            setVideos(successfulVideos);
            results.forEach((r, i) => {
              if (r.status === "rejected") {
                console.warn(`فشل تصنيف "${courseCategories[i].label}":`, r.reason?.message);
              }
            });
          }
              } else {
          const category = courseCategories.find((c) => c.key === activeTab);
          const vids = await fetchPlaylistVideos(category.playlistId, 100);
          if (!cancelled)
            setVideos(vids.map((v) => ({ ...v, category: category.label, categoryKey: category.key })));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideos();
    return () => {
      cancelled = true;
    };
  }, [activeTab, courseCategories]);

 const handleOpenVideo = (video) => {
  setActiveVideoId(video.id);
  markVideoCompleted(pathKey, video.id, {
    title: video.title,
    duration: video.duration,
    category: video.category,
    categoryKey: video.categoryKey,
  });
  setCompletedIds(getCompletedVideos(pathKey));
};
const categoryColor = (label) => {
  const idx = courseCategories.findIndex((c) => c.label === label);
  return BADGE_COLORS[idx % BADGE_COLORS.length];
};
  // نحدد أول فيديو "غير مكتمل" باعتباره الدرس الحالي (In Progress)، والباقي بعده "Not Started"
  const firstNotCompletedIndex = videos.findIndex((v) => !isVideoCompleted(pathKey, v.id));

  const totalLessons = videos.length;
  const completedCount = videos.filter((v) => isVideoCompleted(pathKey, v.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

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
            <span role="button" className="fw-bold text-decoration-none" style={{ color: "#22D3C5" }}>
              Videos
            </span>
            <span role="button" className="text-dark text-decoration-none" onClick={() => navigate("/my-progress")}>
              My Progress
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
           <BsSearch className="text-dark" role="button" />
<BsBell className="text-dark" role="button" onClick={() => navigate("/notifications")} />
            <div
              role="button"
              className="rounded-circle bg-secondary"
              style={{ width: 32, height: 32, backgroundSize: "cover" }}
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white pb-4 pt-4 shadow-sm">
        <div className="container text-center">
          <h2 className="fw-bold mb-1">{path.title}</h2>
          <p className="text-muted mb-2">{path.description}</p>
          <p className="text-muted small mb-1">
            {completedCount} of {totalLessons} lessons completed
          </p>
          <div className="mx-auto" style={{ maxWidth: 400 }}>
            <div className="progress" style={{ height: 6 }}>
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%`, backgroundColor: "#22D3C5" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* أزرار التصنيفات */}
        <div className="d-flex gap-2 flex-wrap justify-content-center mb-4">
          <button
            className="btn rounded-pill px-3 py-1"
            style={{
              backgroundColor: activeTab === "all" ? "#22D3C5" : "#fff",
              color: activeTab === "all" ? "#fff" : "#212529",
              border: "1px solid #dee2e6",
            }}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          {courseCategories.map((c) => (
            <button
              key={c.key}
              className="btn rounded-pill px-3 py-1 d-flex align-items-center gap-1"
              style={{
                backgroundColor: activeTab === c.key ? "#22D3C5" : "#fff",
                color: activeTab === c.key ? "#fff" : "#212529",
                border: "1px solid #dee2e6",
              }}
              onClick={() => setActiveTab(c.key)}
            >
              {c.label}
              {doneKeys.includes(c.key) && (
                <BsCheckCircleFill style={{ color: activeTab === c.key ? "#fff" : "#22c55e" }} size={12} />
              )}
            </button>
          ))}
        </div>

        {/* مشغل الفيديو */}
        {activeVideoId && (
          <div className="ratio ratio-16x9 mb-4 rounded-4 overflow-hidden">
            <iframe src={`https://www.youtube.com/embed/${activeVideoId}`} title="Video Player" allowFullScreen />
          </div>
        )}

        {loading && <p className="text-center text-muted">جاري تحميل الفيديوهات...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {!loading && !error && (
          <div className="row g-4">
            {videos.map((v, idx) => {
              const completed = isVideoCompleted(pathKey, v.id);
              const isCurrent = idx === firstNotCompletedIndex;
              const statusLabel = completed ? "Completed" : isCurrent ? "In Progress" : "Not Started";
              const barPercent = completed ? 100 : isCurrent ? 45 : 0;

              return (
                <div className="col-12 col-md-6 col-lg-4" key={`${v.id}-${idx}`}>
                  <div className="bg-white rounded-4 shadow-sm overflow-hidden h-100 d-flex flex-column">
                    <div
                      role="button"
                      className="position-relative"
                     onClick={() => handleOpenVideo(v)}
                    >
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-100"
                        style={{ objectFit: "cover", aspectRatio: "16/9" }}
                      />
                      <BsPlayCircleFill
                        className="position-absolute top-50 start-50 translate-middle text-white"
                        size={40}
                        style={{ opacity: 0.9 }}
                      />
                      <span
                        className="position-absolute top-0 start-0 m-2 badge text-white"
                        style={{ backgroundColor: categoryColor(v.category) }}
                      >
                        {v.category}
                      </span>
                      {v.duration && (
                        <span
                          className="position-absolute bottom-0 end-0 m-2 badge"
                          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
                        >
                          {v.duration}
                        </span>
                      )}
                    </div>

                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <h6 className="fw-bold mb-1">{v.title}</h6>
                      <p
                        className="text-muted small mb-3"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {v.description || "Learn to build modern, responsive, and interactive content."}
                      </p>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
                          <span>Lesson {idx + 1}</span>
                          {completed ? (
                            <BsCheckCircleFill style={{ color: "#22c55e" }} />
                          ) : (
                            <span
                              role="button"
                              className="fw-semibold text-decoration-none"
                              style={{ color: "#22D3C5" }}
                              onClick={() => handleOpenVideo(v)}
                            >
                              {isCurrent ? "" : "Start Lesson"}
                            </span>
                          )}
                        </div>
                        <div className="progress" style={{ height: 4 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${barPercent}%`,
                              backgroundColor: completed ? "#22c55e" : "#22D3C5",
                            }}
                          />
                        </div>
                        <div className="small text-muted mt-1">{statusLabel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {!videos.length && <p className="text-center text-muted">لا يوجد فيديوهات لهذا التصنيف حاليًا.</p>}
          </div>
        )}
      </div>

      {/* زر Quiz العائم */}
      <button
        className="btn rounded-pill text-white d-flex align-items-center gap-2 px-3 py-2 position-fixed"
        style={{ backgroundColor: "#22D3C5", bottom: 24, right: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
      >
        <BsQuestionCircleFill /> Quiz
      </button>
    </div>
  );
}
