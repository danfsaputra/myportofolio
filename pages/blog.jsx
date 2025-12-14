import AdminHeader from "./components/AdminHeader";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBlogs, createBlogs, updateBlog, deleteBlog } from "../lib/blogAPI";


export default function BlogAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    nama: "",
    deskripsi: "",
    tanggal: "",
    gambar: "",
  });
  const [editBlogId, setEditBlogId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/loginmdfs11");
    }
  }, []);

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
      notifyError("Gagal memuat blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewBlog({ ...newBlog, gambar: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", newBlog.nama);
    formData.append("deskripsi", newBlog.deskripsi);
    if (newBlog.tanggal) formData.append("tanggal", newBlog.tanggal);
    if (selectedFile) {
      formData.append("gambar", selectedFile);
    }

    try {
      if (editBlogId) {
        await updateBlog(editBlogId, formData);
        notifySuccess("Blog berhasil diperbarui");
      } else {
        await createBlogs(formData);
        notifySuccess("Blog berhasil ditambahkan");
      }
      setNewBlog({ nama: "", deskripsi: "", tanggal: "", gambar: "" });
      setSelectedFile(null);
      setEditBlogId(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      notifyError("Gagal menyimpan blog");
    }
  };

  const handleEdit = (blog) => {
    setNewBlog({
      nama: blog.nama,
      deskripsi: blog.deskripsi,
      tanggal: blog.tanggal ? new Date(blog.tanggal).toISOString().split('T')[0] : "",
      gambar: blog.gambar,
    });
    setEditBlogId(blog._id);
    setSelectedFile(null);
  };

  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await deleteBlog(blogToDelete._id);
      notifySuccess("Blog berhasil dihapus");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      notifyError("Gagal menghapus blog");
    } finally {
      setShowDeleteModal(false);
      setBlogToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  return (
    <>
      <AdminHeader />
      <ToastContainer position="top-right" autoClose={3000} />

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus blog <span className="font-semibold">{blogToDelete?.nama}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-sm">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">Hapus</button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-5xl mx-auto pt-10 pb-20">
          <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">Kelola Blog</h1>

          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editBlogId ? "Edit Blog" : "Tambah Blog Baru"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Blog</label>
                <input
                  type="text"
                  value={newBlog.nama}
                  onChange={(e) => setNewBlog({ ...newBlog, nama: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  value={newBlog.deskripsi}
                  onChange={(e) => setNewBlog({ ...newBlog, deskripsi: e.target.value })}
                  className="w-full border p-2 rounded"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                <input
                  type="date"
                  value={newBlog.tanggal}
                  onChange={(e) => setNewBlog({ ...newBlog, tanggal: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border p-2 rounded"
                />
                {newBlog.gambar && (
                  <img src={newBlog.gambar} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>
              <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
                {editBlogId ? "Update Blog" : "Tambah Blog"}
              </button>
              {editBlogId && (
                <button
                  type="button"
                  onClick={() => {
                    setNewBlog({ nama: "", deskripsi: "", tanggal: "", gambar: "" });
                    setEditBlogId(null);
                    setSelectedFile(null);
                  }}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Batal Edit
                </button>
              )}
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Daftar Blog</h2>
            {blogs.length === 0 ? (
              <div className="text-gray-500">Belum ada blog</div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div key={blog._id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {blog.gambar && (
                        <img src={blog.gambar} alt={blog.nama} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <h3 className="font-medium">{blog.nama}</h3>
                        <p className="text-sm text-gray-600">{blog.deskripsi.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-500">{new Date(blog.tanggal || blog.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(blog)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => openDeleteModal(blog)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full overflow-hidden">
              <img src="/surabaya.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-semibold">UMKM KREMBANGAN SELATAN</span>
          </div>
          <p className="text-gray-400 text-sm">© 2025 Kumpulan UMKM. Dibuat dengan ❤️ untuk UMKM Lokal</p>
        </div>
      </footer>
    </>
  );
}
