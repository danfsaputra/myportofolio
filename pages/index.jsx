import { useEffect, useState } from "react";
import { Phone, MapPin, Mail, Download, Linkedin, Instagram, ArrowUp, X, Code, Database, Wrench, Send } from "lucide-react";
import UserHeader from "../pages/components/UserHeader"; // Pastikan path ini sesuai
import { getBlogs } from "../lib/blogAPI"; // Pastikan path ini sesuai

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [sendingComment, setSendingComment] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", comment: "" });
  const [preview, setPreview] = useState(null);

  const [activeSkill, setActiveSkill] = useState("web");
  const [activeProjectTab, setActiveProjectTab] = useState("project");
  const [activeCommentTab, setActiveCommentTab] = useState("komentar");

  // --- DATA STATIS ---
  const collaborationData = [
    { title: "Intern Full Stack Developer PEMKAB BOJONEGORO", year: "2025", desc: "Mengembangkan sitem alih media arsip PEMKAB Bojonegoro" },
    { title: "Freelance Full Stack Kelurahan Krembangan Selatan Surabaya", year: "2025", desc: "Desain dan implementasi website portal UMKM" },
  ];

  const educationData = [
    { title: "S1 Teknik Informatika - UPN Veteran Jawa Timur", year: "2022-Sekarang", desc: "Konsentrasi pada sistem informasi dan pengembangan web." },
    { title: "Bootcamp Data Analis - RevoU", year: "2024", desc: "Data Analis & Machine Learning" },
  ];

  const skillData = {

    web: [

      { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
      { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
      { name: "Laravel", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
      { name: "CodeIgniter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-plain.svg" },
      { name: "Tailwind", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    ],

    data: [
      { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "Pandas", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
    ],

    tools: [
      { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "VSCode", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Postman", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
      { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "PowerBI", logo: "https://cdn.worldvectorlogo.com/logos/power-bi.svg" },
      { name: "Google Colab", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg" },
      { name: "Jupyter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
      { name: "BigQuery", logo: "https://www.vectorlogo.zone/logos/google_bigquery/google_bigquery-icon.svg" },
    ],

  };

  const skillIcons = { web: Code, data: Database, tools: Wrench };

  // --- EFFECTS ---
  useEffect(() => {
    // Gunakan try-catch atau default value untuk menghindari error jika API belum siap
    fetch("/api/projects").then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : [])).catch(()=> setProjects([]));
    fetch("/api/comments").then(r => r.json()).then(d => setComments(Array.isArray(d) ? d : [])).catch(()=> setComments([]));
    getBlogs().then(d => setBlogs(Array.isArray(d) ? d : [])).catch(()=> setBlogs([]));

    // Handle hash navigation on page load
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 80;
        const rect = element.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.top - headerHeight,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  // --- HANDLERS ---
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.comment) return alert("Nama & komentar wajib diisi!");

    setSendingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setForm({ nama: "", email: "", comment: "" });
    } catch (error) {
      console.error("Gagal mengirim komentar", error);
      alert("Gagal mengirim komentar. Coba lagi nanti.");
    } finally {
      setSendingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- BACKGROUND ANIMATION (GLOWING ORBS) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <UserHeader />

      {/* --- HERO SECTION --- */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-medium backdrop-blur-sm">
             👋 Welcome to my creative space
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Hi, I'm <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
              Dani Saputra
            </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Seorang <span className="text-white font-semibold">Web Developer</span> & <span className="text-white font-semibold">Data Science </span> yang fokus membangun website modern, API scalable, dan analisis data mendalam.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button onClick={() => scrollToSection('project')} 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
              Lihat Karya Saya
            </button>
            <a href="/CVKU.pdf" download
              className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-2">
              <Download className="w-5 h-5" /> Download CV
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center relative">
          <div className="relative w-72 h-72 md:w-96 md:h-96 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-800 border border-white/10 shadow-2xl">
              <img src="/fotoku.png" alt="Dani Profile" className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skill" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tech Stack</h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {["web", "data", "tools"].map((cat) => {
            const Icon = skillIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveSkill(cat)}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium ${
                  activeSkill === cat 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                <Icon className="w-4 h-4" /> {cat.toUpperCase()}
              </button>
            )
          })}
        </div>

        {/* Grid Skills */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skillData[activeSkill].map((s, idx) => (
            <div key={s.name} 
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/10 hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <img src={s.logo} alt={s.name} className="w-12 h-12 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- PORTFOLIO SECTION --- */}
      <section id="project" className="relative z-10 max-w-7xl mx-auto px-6 py-24 bg-black/20 backdrop-blur-sm rounded-3xl my-10 border border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Portofolio & Experience</h2>
          <p className="text-slate-400">Jejak karya dan perjalanan profesional saya</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { key: 'project', label: 'Projects' },
            { key: 'kolaborasi', label: 'Collaboration' },
            { key: 'pendidikan', label: 'Education' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveProjectTab(tab.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeProjectTab === tab.key 
                ? 'bg-white text-slate-900' 
                : 'bg-transparent text-slate-400 border border-white/20 hover:border-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeProjectTab === 'project' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.length > 0 ? projects.map((p) => (
                <div key={p._id} className="group bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={p.gambar || '/placeholder.png'} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" alt={p.nama} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button onClick={() => setPreview(p)} className="px-6 py-2 bg-white text-black rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Detail</button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{p.nama}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">{p.deskripsi}</p>
                    <div className="text-xs text-blue-400 font-mono">{p.teknologi ? p.teknologi.split(',').slice(0,3).join(' • ') : 'Web App'}</div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center text-slate-500 py-10">Belum ada project yang ditampilkan.</div>
              )}
            </div>
          )}

          {activeProjectTab === 'kolaborasi' && (
            <div className="grid md:grid-cols-2 gap-6">
              {collaborationData.map((c, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{c.title}</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">{c.year}</span>
                  </div>
                  <p className="text-slate-300">{c.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeProjectTab === 'pendidikan' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {educationData.map((e, i) => (
                <div key={i} className="flex gap-6 relative">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 z-10"></div>
                    {i !== educationData.length - 1 && <div className="w-0.5 h-full bg-white/10 absolute top-4"></div>}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 hover:border-blue-500/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                      <h3 className="text-lg font-bold text-white">{e.title}</h3>
                      <span className="text-sm text-blue-300">{e.year}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- KONTAK & FOOTER SECTION (Combined for flow) --- */}
      <div className="relative z-10 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-white/10">
        
        {/* Kontak */}
        <section id="kontak" className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Info Kontak */}
            <div>
              <h3 className="text-4xl font-bold mb-6">Let's Connect</h3>
              <p className="text-slate-400 mb-10 text-lg">
                Tertarik bekerja sama atau sekadar menyapa? Jangan ragu untuk menghubungi saya. Saya selalu terbuka untuk diskusi project baru.
              </p>
              
              <div className="space-y-6">
                <a href="mailto:yourmail@gmail.com" className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition group">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Mail />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Email Me</div>
                    <div className="text-white font-medium text-lg">daniferdiansaputra1@gmail.com</div>
                  </div>
                </a>

                <a href="tel:0313570574" className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition group">
                  <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                    <Phone />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Call Me</div>
                    <div className="text-white font-medium text-lg">081334818093</div>
                  </div>
                </a>

                <div className="flex gap-4 pt-4">
                   <a href="https://www.instagram.com/dani.fsaputra/" className="p-3 rounded-full bg-white/5 hover:bg-pink-600 hover:text-white transition-all border border-white/10"><Instagram className="w-5 h-5"/></a>
                   <a href="https://www.linkedin.com/in/moch-dani-ferdian-saputra-291498283/" className="p-3 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all border border-white/10"><Linkedin className="w-5 h-5"/></a>
                </div>
              </div>
            </div>

            {/* Quick Form Box */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400"/> Kirim Komentar
              </h4>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const nama = e.target[0].value;
                const email = e.target[1].value;
                const comment = e.target[2].value;
                if (!nama || !comment) return alert("Nama & komentar wajib diisi!");
                
                setSendingComment(true);
                try {
                  const res = await fetch("/api/comments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nama, email, comment }),
                  });
                  const newComment = await res.json();
                  setComments([newComment, ...comments]);
                  e.target.reset();
                } catch (error) {
                  console.error("Gagal mengirim komentar", error);
                  alert("Gagal mengirim komentar. Coba lagi nanti.");
                } finally {
                  setSendingComment(false);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Nama" className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                  <input placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                </div>
                <textarea rows={4} placeholder="Pesan Anda..." className="w-full px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none" />
                <button type="submit" disabled={sendingComment} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {sendingComment ? "Mengirim..." : "Kirim Komentar"}
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* --- COMMENT & BLOG SECTION --- */}
        <section id="comment" className="max-w-4xl mx-auto px-6 pb-24 pt-10">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold">Diskusi & Blog</h2>
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
              <button onClick={() => setActiveCommentTab('komentar')} className={`px-4 py-1.5 rounded-md text-sm transition ${activeCommentTab === 'komentar' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Komentar</button>
              <button onClick={() => setActiveCommentTab('blog')} className={`px-4 py-1.5 rounded-md text-sm transition ${activeCommentTab === 'blog' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Blog</button>
            </div>
          </div>

          {activeCommentTab === 'komentar' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="space-y-6">
                {comments.map((c) => (
                  <div key={c._id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {c.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-white">{c.nama}</span>
                          <span className="text-xs text-slate-500">{new Date(c.createdAt || c.tanggal).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{c.comment}</p>
                      </div>
                      
                      {/* Balasan Admin */}
                      {c.balasan && (
                        <div className="flex gap-4 ml-4 sm:ml-8 mt-2">
                           <div className="bg-blue-600/10 rounded-2xl rounded-tl-none p-4 border border-blue-500/20 w-full">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-md font-bold">ADMIN</span>
                              </div>
                              <p className="text-blue-200 text-sm">{c.balasan}</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

           {activeCommentTab === 'blog' && (
             <div className="space-y-4">
                {blogs.length === 0 ? (
                  <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500">
                    Belum ada postingan blog saat ini.
                  </div>
                ) : (
                  blogs.map((b) => (
                    <div key={b._id} className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex gap-4 transition cursor-pointer">
                       {b.gambar && <img src={b.gambar} className="w-24 h-24 object-cover rounded-xl" alt="blog thumb" />}
                       <div>
                          <h4 className="font-bold text-lg text-white mb-1">{b.nama}</h4>
                          <p className="text-slate-400 text-sm line-clamp-2">{b.deskripsi}</p>
                          <span className="text-xs text-blue-400 mt-2 block">{new Date(b.tanggal || b.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>
                  ))
                )}
             </div>
           )}
        </section>

        <footer className="py-8 text-center border-t border-white/5 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Dani Saputra. Built with React & Tailwind CSS.</p>
        </footer>
      </div>

      {/* --- SCROLL TO TOP & MODAL --- */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-500/40 hover:bg-blue-500 transition-all z-40 group">
        <ArrowUp className="group-hover:-translate-y-1 transition-transform" />
      </button>

      {/* MODAL PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-2xl w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={preview.gambar || "/placeholder.png"}
              className="w-full h-64 object-cover rounded-2xl mb-6 border border-white/10"
              alt={preview.nama}
            />

            <h3 className="text-3xl font-bold text-white mb-2">
              {preview.nama}
            </h3>

            {/* Teknologi */}
            <div className="flex flex-wrap gap-2 mb-4">
              {preview.teknologi &&
                preview.teknologi.split(",").map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30"
                  >
                    {t.trim()}
                  </span>
                ))}
            </div>

            {/* Deskripsi */}
            <p className="text-slate-300 leading-relaxed mb-6">
              {preview.deskripsi}
            </p>

            {/* FITUR PROJECT */}
            {preview.fitur && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">
                  Fitur Utama
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2 text-slate-300 text-sm">
                  {(Array.isArray(preview.fitur)
                    ? preview.fitur
                    : preview.fitur.split(",")
                  ).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{f.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPreview(null)}
                className="px-5 py-2 rounded-xl text-slate-300 hover:bg-white/5 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}