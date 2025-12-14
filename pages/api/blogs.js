import cloudinaryModule from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import connectDB from "/lib/mongodb";
import Blog from "/models/Blog";

// Nonaktifkan bodyParser bawaan Next.js
export const config = {
  api: { bodyParser: false },
};

// Konfigurasi Cloudinary
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurasi multer storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

// Helper middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      return result instanceof Error ? reject(result) : resolve(result);
    });
  });
}

// Handler utama
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  try {
    if (req.method === "GET") {
      const blogs = await Blog.find();
      return res.status(200).json(blogs);
    }

    if (req.method === "POST") {
      await runMiddleware(req, res, upload.single("gambar"));

      const { nama, deskripsi, tanggal } = req.body;
      const gambar = req.file?.path;

      const newBlog = new Blog({ nama, tanggal: tanggal ? new Date(tanggal) : Date.now(), gambar, deskripsi });
      await newBlog.save();

      return res.status(201).json(newBlog);
    }

    if (req.method === "PUT") {
      await runMiddleware(req, res, upload.single("gambar"));

      const { id, nama, deskripsi, tanggal } = req.body;

      const updateData = { nama, deskripsi };
      if (tanggal) updateData.tanggal = new Date(tanggal);
      if (req.file) updateData.gambar = req.file.path;

      const updated = await Blog.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ error: "Blog tidak ditemukan" });

      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const deleted = await Blog.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Blog tidak ditemukan" });

      return res.status(200).json({ message: "Blog berhasil dihapus" });
    }

    return res.status(405).json({ error: `Method ${req.method} tidak diizinkan` });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", detail: error.message });
  }
}
