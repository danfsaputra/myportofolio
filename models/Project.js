import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  gambar: { type: String },
  deskripsi: { type: String },
  teknologi: { type: String },
  fitur: { type: String },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
