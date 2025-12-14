import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  tanggal: { type: Date },
  gambar: { type: String },
  deskripsi: { type: String },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
