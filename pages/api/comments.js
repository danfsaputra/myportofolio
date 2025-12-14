import connectDB from "/lib/mongodb";
import Comment from "/models/Comment";

// Nonaktifkan bodyParser bawaan Next.js
export const config = {
  api: { bodyParser: true }, // <-- sekarang boleh true karena tdk pakai multer
};

// Handler utama
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  try {
    // GET: Semua berita
    if (req.method === "GET") {
      const comments = await Comment.find();
      return res.status(200).json(comments);
    }

    // POST: Tambah berita baru
    if (req.method === "POST") {
      const { nama, tanggal, email, comment, balasan } = req.body;

      const newComment = new Comment({ nama, tanggal, email, comment, balasan });
      await newComment.save();

      return res.status(201).json(newComment);
    }

    // PUT: Edit berita
    if (req.method === "PUT") {
      const { id, nama, tanggal, email, comment, balasan } = req.body;

      const updateData = { nama, tanggal, email, comment, balasan };

      const updated = await Comment.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: "Comment tidak ditemukan" });

      return res.status(200).json(updated);
    }

    // DELETE: Hapus berita
    if (req.method === "DELETE") {
      const { id } = req.query;
      const deleted = await Comment.findByIdAndDelete(id);

      if (!deleted) return res.status(404).json({ error: "Comment tidak ditemukan" });

      return res.status(200).json({ message: "Comment berhasil dihapus" });
    }

    return res.status(405).json({ error: `Method ${req.method} tidak diizinkan` });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}
