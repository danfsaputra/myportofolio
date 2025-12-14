const API_URL = "/api/projects";

// Ambil semua produk
export async function getProjects() {
  const res = await fetch(API_URL);
  return await res.json();
}

// Tambah produk (dengan FormData)
export async function createProject(formData) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

// Update produk (dengan FormData)
export async function updateProject(id, formData) {
  formData.append("id", id);
  const res = await fetch(API_URL, {
    method: "PUT",
    body: formData,
  });
  return await res.json();
}

// Hapus produk
export async function deleteProject(id) {
  const res = await fetch(`${API_URL}?id=${id}`, {
    method: "DELETE",
  });
  return await res.json();
}
