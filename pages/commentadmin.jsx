import AdminHeader from "./components/AdminHeader";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getComments, deleteComment } from "../lib/commentAPI";

export default function CommentAdmin() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/loginmdfs11");
    }
  }, []);

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments();
      setComments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyDrafts((s) => ({ ...s, [id]: value }));
  };

  const submitReply = async (id) => {
    const balasan = (replyDrafts[id] || "").trim();
    if (!balasan) return notifyError("Balasan kosong");
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, balasan }),
      });
      if (!res.ok) throw new Error('Gagal mengirim balasan');
      const updated = await res.json();
      setComments((prev) => prev.map(c => c._id === id ? updated : c));
      notifySuccess('Balasan tersimpan');
      setReplyDrafts((s) => ({ ...s, [id]: '' }));
    } catch (err) {
      console.error(err);
      notifyError('Gagal menyimpan balasan');
    }
  };

  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      const res = await deleteComment(commentToDelete._id);
      if (res.error) throw new Error(res.error || 'Gagal menghapus');
      notifySuccess('Komentar dihapus');
      fetchComments();
    } catch (err) {
      console.error(err);
      notifyError('Gagal menghapus komentar');
    } finally {
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
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
              Yakin ingin menghapus komentar dari <span className="font-semibold">{commentToDelete?.nama}</span>?
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
          <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">Kelola Komentar</h1>

          <div className="bg-white rounded-xl shadow p-6 mb-8">
            {loading ? (
              <div className="text-gray-500">Memuat komentar...</div>
            ) : comments.length === 0 ? (
              <div className="text-gray-500">Belum ada komentar</div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{c.nama} <span className="text-xs text-gray-500">{c.email && `• ${c.email}`}</span></div>
                        <div className="text-xs text-gray-500">{new Date(c.tanggal || c.createdAt || Date.now()).toLocaleString('id-ID')}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openDeleteModal(c)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">Hapus</button>
                      </div>
                    </div>
                    <div className="mt-3 text-gray-700 whitespace-pre-line">{c.comment}</div>

                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Balasan admin</div>
                      {c.balasan ? (
                        <div className="bg-gray-50 border p-3 rounded mb-2">{c.balasan}</div>
                      ) : (
                        <div className="text-sm text-gray-500 mb-2">Belum ada balasan</div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <textarea value={replyDrafts[c._id] || ''} onChange={(e)=>handleReplyChange(c._id, e.target.value)} placeholder="Tulis balasan..." className="w-full border p-2 rounded" rows={2} />
                        <div className="flex gap-2">
                          <button onClick={()=>submitReply(c._id)} className="bg-amber-600 text-white px-4 py-2 rounded">Kirim</button>
                          <button onClick={()=>setReplyDrafts((s)=>({...s,[c._id]:''}))} className="bg-gray-200 px-3 py-2 rounded">Bersihkan</button>
                        </div>
                      </div>
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
