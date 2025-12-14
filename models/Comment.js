import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  tanggal: { type: Date },
  email: { type: String },
  comment: { type: String },
  balasan: { type: String },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
