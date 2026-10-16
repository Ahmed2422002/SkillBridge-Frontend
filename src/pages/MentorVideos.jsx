
import React, { useEffect, useState } from "react";
import { learningPaths } from "../data/coursePlaylists";
import { getAllVideos, createVideo, deleteVideo, extractYouTubeId } from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  BsArrowLeft,
  BsBell,
  BsCloudUpload,
  BsPlayFill,
  BsEyeFill,
  BsPencilFill,
  BsFilesAlt,
  BsTrashFill,
  BsYoutube
} from "react-icons/bs";

// بيانات وهمية مبدئية — لاحقًا تجيبيها من backend
/*const INITIAL_VIDEOS = [
  {
    id: 1,
    course: "HTML & CSS Foundations",
    title: "Intro to Flexbox & Grid",
    description: "A hands-on walkthrough of modern CSS techniques used in real interfaces.",
    tag: "HTML & CSS Foundations",
    views: 188,
    duration: "16:45",
    status: "Published",
  },
  {
    id: 2,
    course: "JavaScript Essentials",
    title: "JavaScript Closures Explained",
    description: "Understand how closures work under the hood with live code examples.",
    tag: "HTML & CSS Foundations",
    views: 203,
    duration: "18:46",
    status: "Published",
  },
];*/

function VideoCard({ video, onDelete }) {
  return (
    <div className="col-12 col-md-6">
      <div className="bg-white rounded-4 overflow-hidden h-100 shadow-sm">
        <div
          className="position-relative d-flex align-items-center justify-content-center"
         
          style={{
          aspectRatio: "16 / 9",
          backgroundImage: `url(https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
         
        >
          <span
            className="position-absolute top-0 start-0 m-2 badge rounded-pill"
            style={{ backgroundColor: "#D6F5F2", color: "#0D9488" }}
          >
            ● {video.status}
          </span>
          <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark bg-opacity-75">
            {video.duration}
          </span>
          <button
            type="button"
            className="btn btn-light rounded-circle p-3 d-flex align-items-center justify-content-center bg-opacity-75"
            aria-label={`Play ${video.title}`}
             onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank")}
          >
            <BsPlayFill size={20} />
          </button>
        </div>

        <div className="p-3">
          <div className="text-muted small mb-1">Course Name</div>
          <div className="fw-bold mb-1">{video.title}</div>
          <p className="text-muted small mb-2">{video.description}</p>
          <span
            className="badge rounded-pill fw-normal"
            style={{ backgroundColor: "#D6F5F2", color: "#0D9488" }}
          >
            {video.tag}
          </span>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex gap-2">
              <IconButton icon={<BsEyeFill size={14} />} label="Preview" />
              <IconButton icon={<BsPencilFill size={14} />} label="Edit" />
              <IconButton icon={<BsFilesAlt size={14} />} label="Duplicate" />
              <IconButton
                icon={<BsTrashFill size={14} />}
                label="Delete"
                danger
                onClick={() => onDelete(video.id)}
              />
            </div>
            <span className="text-muted small">{video.views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({ icon, label, danger, onClick }) {
  return (
    <button
      type="button"
      className="btn btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
      style={{
        width: 32,
        height: 32,
        backgroundColor: "#F1F5F4",
        color: danger ? "#E63946" : "#495057",
      }}
      aria-label={label}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export default function MentorVideos() {
  const navigate = useNavigate();
 const [videos, setVideos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [showForm, setShowForm] = useState(false);
const [saving, setSaving] = useState(false);

const emptyForm = {
  youtubeUrl: "",
  title: "",
  description: "",
  duration: "",
  pathKey: "frontend",
  categoryKey: learningPaths.frontend.categories[0].key,
};
const [form, setForm] = useState(emptyForm);

useEffect(() => {
  let cancelled = false;
  getAllVideos()
    .then((data) => !cancelled && setVideos(data))
    .catch((e) => !cancelled && setError(e.message))
    .finally(() => !cancelled && setLoading(false));
  return () => { cancelled = true; };
}, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) =>
    name === "pathKey"
      ? { ...prev, pathKey: value, categoryKey: learningPaths[value].categories[0].key }
      : { ...prev, [name]: value }
  );
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const youtubeId = extractYouTubeId(form.youtubeUrl);
  if (!youtubeId) {
    setError("رابط YouTube غير صحيح");
    return;
  }
  const category = learningPaths[form.pathKey].categories.find((c) => c.key === form.categoryKey);
  setSaving(true);
  setError(null);
  try {
    const saved = await createVideo({
      youtubeId,
      youtubeUrl: form.youtubeUrl,
      title: form.title,
      description: form.description,
      duration: form.duration,
      pathKey: form.pathKey,
      categoryKey: category.key,
      category: category.label,
    });
    setVideos((prev) => [saved, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};

const handleDelete = async (id) => {
  try {
    await deleteVideo(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar - بنفس ستايل MentorDashboard */}
      <nav className="navbar navbar-light bg-white py-3 shadow-sm">
        <div className="container-fluid px-4 d-flex align-items-center">
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
            onClick={() => navigate("/mentor-dashboard")}
            aria-label="Back to dashboard"
          >
            <BsArrowLeft />
          </button>

          <a
            className="navbar-brand fw-bold d-flex align-items-center gap-2 me-4"
            href="/mentor-dashboard"
          >
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 28, height: 28, backgroundColor: "#22D3C5", color: "#fff" }}
            >
              ●
            </span>
            SkillBridge
            <span className="text-muted fw-normal ms-2 border-start ps-2">EduAI Mentor</span>
          </a>

          <div className="d-flex align-items-center gap-3 ms-auto">
                            <div
                  className="position-relative"
                  role="button"
                  onClick={() => navigate("/mentor-dashboard/notifications")}
                  style={{ cursor: "pointer" }}
                >
                  <BsBell className="text-dark" size={18} />

                  <span
                    className="position-absolute rounded-circle bg-danger"
                    style={{
                      width: 8,
                      height: 8,
                      top: -2,
                      right: -2,
                    }}
                  />
                </div>
                    <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white"
            style={{ width: 34, height: 34, backgroundColor: "#0D9488", fontSize: 13, cursor: "pointer" }}
            role="button"
            aria-label="Open profile"
            onClick={() => navigate("/mentor-dashboard/profile")}
          >
            LH
          </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1200 }}>
        <div className="bg-white rounded-4 shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h4 className="fw-bold mb-1">Learning Content - Videos</h4>
              <p className="text-muted small mb-0">
                Upload lessons and publish them straight to your students' learning path.
              </p>
            </div>

             <button
              type="button"
              className="btn text-white rounded-3 d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
              style={{ backgroundColor: "#0D9488" }}
              onClick={() => setShowForm((p) => !p)}
            >
              <BsYoutube /> Add YouTube Video
            </button>
           
          </div>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}

{showForm && (
  <form onSubmit={handleSubmit} className="border rounded-4 p-3 mb-4">
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label small fw-semibold">YouTube Link</label>
        <input name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange}
          className="form-control" placeholder="https://www.youtube.com/watch?v=..." required />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="form-control" required />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold">Duration (optional)</label>
        <input name="duration" value={form.duration} onChange={handleChange} className="form-control" placeholder="16:45" />
      </div>
      <div className="col-12">
        <label className="form-label small fw-semibold">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={2} />
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold">Learning Path</label>
        <select name="pathKey" value={form.pathKey} onChange={handleChange} className="form-select">
          {Object.entries(learningPaths).map(([key, p]) => (
            <option key={key} value={key}>{p.title}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label small fw-semibold">Category</label>
        <select name="categoryKey" value={form.categoryKey} onChange={handleChange} className="form-select">
          {learningPaths[form.pathKey].categories.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
    <button type="submit" disabled={saving} className="btn text-white rounded-3 mt-3 px-4" style={{ backgroundColor: "#0D9488" }}>
      {saving ? "Saving..." : "Publish"}
    </button>
  </form>
)}

{loading && <p className="text-muted text-center">Loading...</p>}

          <div className="row g-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onDelete={handleDelete} />
            ))}
          </div>

          {videos.length === 0 && (
            <p className="text-muted text-center py-4 mb-0">لا يوجد فيديوهات بعد</p>
          )}

          <div className="text-center mt-4">
            <p className="text-muted small mb-2">No more videos</p>
            <button className="btn btn-outline-secondary btn-sm rounded-3">
              View All Videos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
