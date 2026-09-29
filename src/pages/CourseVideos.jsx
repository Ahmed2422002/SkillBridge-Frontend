import React from "react";

export default function CourseVideos() {
  // بيانات ثابتة (Hardcoded) لضمان ظهور الفيديوهات بشكل مثالي
  const videos = [
    {
      title: "Learn HTML & CSS - Full Course for Beginners",
      url: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
      thumbnail: "https://img.youtube.com/vi/qz0aGYrrlhU/0.jpg"
    },
    {
      title: "JavaScript Tutorial - Step by Step",
      url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/0.jpg"
    },
    {
      title: "Python Crash Course - Learn in 1 Hour",
      url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/0.jpg"
    }
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "10px", fontSize: "28px" }}>
        Full-Stack Development
      </h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        Learn to build complete modern web applications.
      </p>

      {/* أزرار التصنيفات */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "30px", flexWrap: "wrap" }}>
        <button style={{ padding: "8px 16px", borderRadius: "20px", border: "none", backgroundColor: "#20c997", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>All</button>
        <button style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #ddd", backgroundColor: "#fff", color: "#333", cursor: "pointer" }}>HTML</button>
        <button style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #ddd", backgroundColor: "#fff", color: "#333", cursor: "pointer" }}>CSS</button>
        <button style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #ddd", backgroundColor: "#fff", color: "#333", cursor: "pointer" }}>JavaScript</button>
        <button style={{ padding: "8px 16px", borderRadius: "20px", border: "1px solid #ddd", backgroundColor: "#fff", color: "#333", cursor: "pointer" }}>Python</button>
      </div>

      {/* عرض الفيديوهات */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {videos.map((video, index) => (
          <a
            key={index}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit", border: "1px solid #eee", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />
            <div style={{ padding: "15px" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "16px", lineHeight: "1.4" }}>{video.title}</h4>
              <span style={{ fontSize: "12px", color: "#20c997", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                ▶️ مشاهدة الفيديو
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}