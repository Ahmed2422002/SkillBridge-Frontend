export const frontendCategories = [
  { key: "HTML", label: "HTML", playlistId: "PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji" },
  { key: "CSS", label: "CSS", playlistId: "PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe" },
  { key: "JavaScript", label: "JavaScript", playlistId: "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv" },
  { key: "React", label: "React", playlistId: "PLYyqC4bNbCIdSZ-JayMLl4WO2Cr995vyS" },
  { key: "Responsive Design", label: "Responsive Design", playlistId: "PLDoPjvoNmBAzVaRnCYoklHqz01jve8ZWv" },
  { key: "Git", label: "Git & GitHub", playlistId: "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF" },
];

export const backendCategories = [
  { key: "Python", label: "Python", playlistId: "PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs" },
  { key: "SQL", label: "SQL", playlistId: "PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9" },
  { key: "Django/Flask", label: "Django/Flask", playlistId: "PLknwEmKsW8OtK_n48UOuYGxJPbSFrICxm" },
  { key: "REST APIs", label: "REST APIs", playlistId: "PLMTdZ61eBnyqzVhegrlKy38Zwzky-eugX" },
  { key: "Database Design", label: "Database Design", playlistId: "PLC7aGATfqnIj6p1GIzk4X13Xdv3T8rBzJ" },
  { key: "Git", label: "Git & GitHub", playlistId: "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF" },
  { key: "Docker/K8s", label: "Docker/K8s", playlistId: "PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ" },
  { key: "Backend Deployment", label: "Backend Deployment", playlistId: "PLzNfs-3kBUJnY7Cy1XovLaAkgfjim05RR" },
  { key: "System Design", label: "System Design", playlistId: "PLzhWJrmO-SPXqnbYwVin1UuYhTIPC2ukF" },
];

// ====== Full-Stack: نفس الـ 12 خطوة الموجودة بالضبط في paths.fullstack.steps بملف OnboardingRoadmap.jsx ======
// مهم جدًا: قيمة "key" هون لازم تطابق قيمة "key" هناك حرفيًا (حتى لو اختلف label)
// لأن هذا هو الأساس يلي بتعتمد عليه علامة الصح ✅ ونسبة التقدّم بصفحة الرود ماب و My Progress.
// التصنيفات المعلّمة TODO ما إلها playlist حقيقي بمشروعك — لازم تحط ID فعلي قبل ما تجرب هالتصنيف تحديدًا،
// وإلا fetchPlaylistVideos رح يرمي "فشل جلب الفيديوهات" عليه بس (باقي التصنيفات رح تشتغل عادي).
export const fullstackCategories = [
  { key: "HTML", label: "HTML", playlistId: "PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji" },
  { key: "CSS", label: "CSS", playlistId: "PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe" },
  { key: "JavaScript", label: "JavaScript", playlistId: "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv" },
  { key: "Git", label: "Git & GitHub", playlistId: "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF" },
  { key: "React", label: "React", playlistId: "PLYyqC4bNbCIdSZ-JayMLl4WO2Cr995vyS" },
  { key: "Python", label: "Python", playlistId: "PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs" },
  { key: "SQL", label: "SQL & PostgreSQL", playlistId: "PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9" },
  { key: "Django", label: "Django", playlistId: "PLknwEmKsW8OtK_n48UOuYGxJPbSFrICxm" },
  { key: "REST APIs", label: "REST APIs", playlistId: "PLMTdZ61eBnyqzVhegrlKy38Zwzky-eugX" },
  { key: "Deployment", label: "Deployment", playlistId: "PLzNfs-3kBUJnY7Cy1XovLaAkgfjim05RR" },
];

// ====== Data Science: نفس الـ 12 خطوة الموجودة بالضبط في paths.datascientist.steps بملف OnboardingRoadmap.jsx ======
// نفس المبدأ: قيمة "key" هون لازم تطابق قيمة "key" هناك حرفيًا حتى تشتغل علامة الصح ✅ والتقدّم صح.
// معظم هالتصنيفات ما إلها playlist بمشروعك حاليًا (TODO) — استعملت Python و SQL الموجودين مسبقًا بس.
export const datascientistCategories = [
  { key: "Python", label: "Programming (Python)", playlistId: "PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs" },
  { key: "Math & Stats", label: "Math & Stats (Probability)", playlistId: "PLJM7jJIw2GC2Ihr__bRSeMxzsiFMZEsx7" },
  { key: "Data Analysis", label: "Data Manipulation (Pandas)", playlistId: "PLuRv1IekA3YVwzaWa2Kp7bgIVcJsJ5XGW" },
  { key: "Data Visualization", label: "Data Visualization (Matplotlib/Seaborn)", playlistId: "PLNJJ29ohdyWm18ipuHc-m9keFb8Fxbmju" },
  { key: "Linear Algebra", label: "Linear Algebra", playlistId: "PLW4fKU07_q1cT08ESJRypw2EssmZEYXH2" },
  { key: "SQL", label: "SQL & Database", playlistId: "PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9" },
  { key: "Statistical Inference", label: "Statistical Inference", playlistId: "PLCVy8dqNAIgnrGoeg9_JHyncFWjpn-mbH" },
  { key: "Machine Learning", label: "Machine Learning ", playlistId: "PLUTTglLg097yFwGNk4rEn7HlC-U6Y-kJr" },
  { key: "Deep Learning", label: "Deep Learning Basics", playlistId: "PLH0em1f_fBoT1xlF8F4bD2CQd--FZ3RR8" },
 
];

// ====== Mobile: نفس الـ 12 خطوة الموجودة بالضبط في paths.mobile.steps بملف OnboardingRoadmap.jsx ======
export const mobileCategories = [
  {key: "Setup & Environment", label: "Setup & Environment ", playlistId: "PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ" },
  { key: "Programming Basics", label: "Programming Basics", playlistId: "PLw6Y5u47CYq47oDw63bMqkq06fjuoK_GJ" },
  { key: "Basic UI", label: "Basic UI", playlistId: "PL1WkZqhlAdC-i3Vs_HBQw9BPT9-_zMSun" },
  { key: "API Integration", label: "API Integration", playlistId: "PLW3uJGWFOnbEw2PfOLoBV8msehVZtIWFz" },
  { key: "State Management", label: "State Management", playlistId: "PL6yRaaP0WPkUf-ff1OX99DVSL1cynLHxO" },
  { key: "React Native", label: "Native Features", playlistId: "PLDW6PD2vA6ck" },
  { key: "Unit Testing", label: "Unit Testing", playlistId: "PL4n1Qos4Tb6RrQpmpGWALaE1PVvWR8d3A" },
  { key: "Performance Optimization", label: "Performance Opt.", playlistId: "PLejc1JbD4ZFTYdkjzqYBujf7UCVQyn_aq" },
  { key: "Advanced Features", label: "Advanced Features (e.g., Push notifications)", playlistId: "PLYfTCw9blWRMwKMz9e3MyewOTQQBbUt7e" },
 
];

// ====== UI/UX: نفس الـ 12 خطوة الموجودة بالضبط في paths.uiux.steps بملف OnboardingRoadmap.jsx ======
export const uiuxCategories = [
  { key: "User Research", label: "User Research", playlistId: "PL1h8Fv-RGaUJJdI0JS6I9eE49kXFxbQwJ" },
  { key: "Information Architecture", label: "Information Architecture", playlistId: "PLPKlKj-O4T-WX6X0PwwCIdEcUReL1Nrq8" },
  { key: "Wireframing", label: "Wireframing", playlistId: "PLDoPjvoNmBAxQFcU0t_rjaL0geUX47VtL" },
  { key: "UI Fundamentals", label: "UI Fundamentals", playlistId: "PLl0Umi92CQzUiSX7uY-_XuI3LeSUyCysm" },
  { key: "Figma", label: "Design Systems", playlistId: "PLTRDUPO2OmIkAcnzgg0hi7SpiKVwGro-y" },
  { key: "Usability Testing", label: "Usability Testing", playlistId: "PLJOFJ3Ok_idsS9msQ0S23zczHChp7mpMY" },
  { key: "Visual Design", label: "Visual Design", playlistId: "PL4xeUOr3Yk9fMuDOuggAd6NO44oIVVKWF" },
  { key: "Interaction Design", label: "Interaction Design", playlistId: "PLLy_2iUCG87D_R2oD4Q6zKzWoakUQomoR&index=2" },
  { key: "Motion Design", label: "Motion Design", playlistId: "PLgGbWId6zgaV9QYvGLQF_hWgTR5jk_s_q" },
  
];

// ====== Cyber Security: نفس الـ 12 خطوة الموجودة بالضبط في paths.cybersecurity.steps بملف OnboardingRoadmap.jsx ======
export const cybersecurityCategories = [
  { key: "Cybersecurity Basics", label: "Cybersecurity Basics", playlistId: "PLh2Jy0nKL_j1WZMzITHgUuzaadpSULlMm" },
 
];

// خريطة مركزية تربط اسم المسار (بالرابط /learning/:pathKey) بعنوانه ووصفه وتصنيفاته
// لإضافة مسار جديد بالمستقبل: ضيف مجموعة تصنيفات جديدة + سطر هنا، بدون لمس CourseVideos.jsx
export const learningPaths = {
  frontend: {
    title: "Front-End Development",
    description: "Learn to build modern, responsive, and interactive websites from the ground up.",
    categories: frontendCategories,
  },
  backend: {
    title: "Back-End Development",
    description: "Learn to build robust servers, APIs, and databases that power modern applications.",
    categories: backendCategories,
  },
  fullstack: {
    title: "Full-Stack Development",
    description:
      "Learn to build complete modern web applications from frontend to backend, databases, APIs, and deployment.",
    categories: fullstackCategories,
  },
  datascientist: {
    title: "Data Science",
    description: "Learn to analyze data, build predictive models, and turn data into meaningful insights.",
    categories: datascientistCategories,
  },
  mobile: {
    title: "Mobile Development",
    description: "Learn to build modern mobile applications for Android and iOS from the ground up.",
    categories: mobileCategories,
  },
  uiux: {
    title: "UI/UX Design",
    description:
      "Learn to design intuitive, beautiful, and user centered digital experiences from research to final interface.",
    categories: uiuxCategories,
  },
  cybersecurity: {
    title: "Cyber Security",
    description: "Learn to protect systems, networks, and applications through modern cybersecurity principles and practices.",
    categories: cybersecurityCategories,
  },
};