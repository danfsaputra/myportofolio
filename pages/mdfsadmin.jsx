import  AdminHeader from"./components/AdminHeader";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../lib/projectAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    nama: "",
    deskripsi: "",
    teknologi: "",
    fitur: "",
    gambar: "",
  });
  const [editProductId, setEditProductId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/loginmdfs11");
    }
  }, []);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewProject((prev) => ({ ...prev, gambar: ev.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewProject((prev) => ({ ...prev, gambar: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", newProject.nama || "");
    formData.append("deskripsi", newProject.deskripsi || "");
    formData.append("teknologi", newProject.teknologi || "");
    formData.append("fitur", newProject.fitur || "");
    if (selectedFile) formData.append("gambar", selectedFile);

    let data;
    if (editProductId) {
      data = await updateProject(editProductId, formData);
    } else {
      data = await createProject(formData);
    }

    if (data.error) {
      notifyError(data.error || "Gagal menyimpan project");
      return;
    }

    notifySuccess(editProductId ? "Project berhasil diperbarui" : "Project berhasil ditambahkan");

    setNewProject({ nama: "", deskripsi: "", teknologi: "", fitur: "", gambar: "" });
    setSelectedFile(null);
    setEditProductId(null);
    fetchProjects();
  };

  const handleEdit = (product) => {
    setNewProject({
      nama: product.nama,
      deskripsi: product.deskripsi || "",
      teknologi: product.teknologi || "",
      fitur: product.fitur || "",
      gambar: product.gambar || "",
    });
    setEditProductId(product._id);
  };

  const openDeleteModal = (project) => {
    setProductToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const res = await deleteProject(productToDelete._id);
    if (res.error) {
      notifyError(res.error || "Gagal menghapus project");
    } else {
      notifySuccess("Project berhasil dihapus");
      fetchProjects();
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <>
      
      <AdminHeader/>

      <ToastContainer position="top-right" autoClose={3000} />

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus UMKM{" "}
              <span className="font-semibold">{productToDelete?.nama}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-5xl mx-auto pt-10 pb-20">
          <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">
            Kelola Project
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 mb-10 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Project</label>
                <input
                  placeholder="Nama Project"
                  value={newProject.nama}
                  onChange={(e) => setNewProject({ ...newProject, nama: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teknologi</label>
                <input
                  placeholder="Contoh: React, Next.js"
                  value={newProject.teknologi}
                  onChange={(e) => setNewProject({ ...newProject, teknologi: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Project</label>
              <textarea
                placeholder="Jelaskan tentang project ini..."
                value={newProject.deskripsi}
                onChange={(e) => setNewProject({ ...newProject, deskripsi: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-md"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fitur / Catatan</label>
              <input
                placeholder="Fitur singkat atau catatan"
                value={newProject.fitur}
                onChange={(e) => setNewProject({ ...newProject, fitur: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-md"
              />
            </div>

            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-gray-300 p-3 rounded-md" />

            {newProject.gambar && (
              <img src={newProject.gambar} alt="Preview" className="w-40 h-40 object-cover rounded-md border mx-auto mt-4" />
            )}

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-md">{editProductId ? "Update Project" : "Tambah Project"}</button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col"
              >
                {project.gambar && (
                  <img
                    src={project.gambar}
                    alt={project.nama}
                    className="w-full h-40 object-cover mb-3 rounded-md"
                  />
                )}
                <h2 className="text-lg font-bold text-gray-800 mb-1">{project.nama}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Teknologi:</strong> {project.teknologi || "-"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Fitur:</strong> {project.fitur || "-"}
                </p>
                <p className="text-sm text-gray-600 flex-1">{project.deskripsi}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(project)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo UMKM" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-semibold">UMKM KREMBANGAN SELATAN </span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Kumpulan UMKM. Dibuat dengan ❤️ untuk UMKM Lokal
          </p>
        </div>
      </footer>
    </>
  );
}
