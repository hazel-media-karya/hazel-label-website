"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  priceFrom: number;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

type ProductForm = {
  name: string;
  category: string;
  description: string;
  priceFrom: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: string;
};

const defaultForm: ProductForm = {
  name: "",
  category: "Custom Jersey",
  description: "",
  priceFrom: "0",
  imageUrl: "",
  isActive: true,
  sortOrder: "0",
};

function inputClass() {
  return "mt-2 w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30";
}

function normalizeImageUrl(value: string) {
  return value.trim();
}

function productPayload(form: ProductForm) {
  return {
    name: form.name,
    category: form.category,
    description: form.description,
    priceFrom: Number(form.priceFrom || 0),
    imageUrl: normalizeImageUrl(form.imageUrl),
    isActive: form.isActive,
    sortOrder: Number(form.sortOrder || 0),
  };
}

export default function AdminProductsForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const json = await response.json();

      if (json.success) {
        setProducts(json.data ?? []);
      }
    } catch {
      setMessage("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/product-images", {
        method: "POST",
        body: formData,
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.success || !json.imageUrl) {
        throw new Error(json.message || "Gagal upload gambar.");
      }

      setForm((current) => ({
        ...current,
        imageUrl: json.imageUrl,
      }));

      setMessage("Gambar berhasil diupload dan dioptimasi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal upload gambar.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ukuran gambar maksimal 5MB.");
      return;
    }

    uploadImage(file);
  }

  function validateBeforeSave() {
    if (!form.name.trim()) {
      setMessage("Nama produk wajib diisi.");
      return false;
    }

    if (!form.imageUrl.trim()) {
      setMessage("Upload gambar produk dulu sampai preview muncul, baru simpan produk.");
      return false;
    }

    if (form.imageUrl.trim().startsWith("data:")) {
      setMessage("Base64 tidak boleh disimpan. Upload gambar ulang.");
      return false;
    }

    return true;
  }

  async function createProduct() {
    if (!validateBeforeSave()) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload(form)),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Gagal menambahkan produk.");
      }

      setMessage("Produk berhasil ditambahkan.");
      setForm(defaultForm);
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menambahkan produk.");
    } finally {
      setSaving(false);
    }
  }

  async function updateProduct() {
    if (!editingProductId) return;
    if (!validateBeforeSave()) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingProductId,
          ...productPayload(form),
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Gagal memperbarui produk.");
      }

      setMessage("Produk berhasil diperbarui.");
      setEditingProductId(null);
      setForm(defaultForm);
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui produk.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm("Hapus produk ini?");
    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.success) {
        throw new Error(json.message || "Gagal menghapus produk.");
      }

      setMessage("Produk berhasil dihapus.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus produk.");
    }
  }

  function startEdit(product: Product) {
    setEditingProductId(product.id);
    setMessage("");

    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      priceFrom: String(product.priceFrom),
      imageUrl: product.imageUrl ?? "",
      isActive: product.isActive,
      sortOrder: String(product.sortOrder),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingProductId(null);
    setForm(defaultForm);
    setMessage("");
  }

  return (
    <div className="space-y-8">
      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm text-white">
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="text-xl font-semibold text-white">
          {editingProductId ? "Edit Product" : "Add Product"}
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-zinc-300">
            Product Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className={inputClass()}
              placeholder="Cycling Jersey Premium"
            />
          </label>

          <label className="text-sm font-medium text-zinc-300">
            Category
            <input
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className={inputClass()}
              placeholder="Custom Jersey"
            />
          </label>

          <label className="text-sm font-medium text-zinc-300">
            Price From
            <input
              value={form.priceFrom}
              onChange={(event) => setForm({ ...form, priceFrom: event.target.value })}
              className={inputClass()}
              placeholder="350000"
            />
          </label>

          <label className="text-sm font-medium text-zinc-300">
            Sort Order
            <input
              value={form.sortOrder}
              onChange={(event) => setForm({ ...form, sortOrder: event.target.value })}
              className={inputClass()}
              placeholder="0"
            />
          </label>

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-zinc-300">Product Image</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>

              {form.imageUrl ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: "" })}
                  className="rounded-full border border-red-500/30 px-6 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Remove Image
                </button>
              ) : null}
            </div>

            <p className="mt-2 text-xs leading-6 text-zinc-500">
              JPG/PNG/WebP maksimal 5MB. Setelah upload sukses, preview gambar akan muncul di bawah.
            </p>

            {form.imageUrl ? (
              <p className="mt-2 break-all rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-zinc-400">
                Image URL: {form.imageUrl}
              </p>
            ) : null}

            {form.imageUrl ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#d8b36d]">
                  Image Preview
                </p>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img
                    src={form.imageUrl}
                    alt="Product preview"
                    className="max-h-[420px] w-full object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <label className="md:col-span-2 text-sm font-medium text-zinc-300">
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className={`${inputClass()} min-h-[130px]`}
              placeholder="Premium custom jersey for cycling teams and communities."
            />
          </label>

          <label className="text-sm font-medium text-zinc-300">
            Status
            <select
              value={form.isActive ? "active" : "inactive"}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.value === "active" })
              }
              className={inputClass()}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          {editingProductId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          ) : null}

          <button
            type="button"
            onClick={editingProductId ? updateProduct : createProduct}
            disabled={saving || uploading || !form.name.trim() || !form.imageUrl.trim()}
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : editingProductId ? "Update Product" : "Add Product"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Products</h2>
          <p className="text-sm text-zinc-500">{products.length} item</p>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-zinc-400">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-white/10 px-4 py-6 text-sm text-zinc-500">
            Belum ada produk.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:grid-cols-[160px_1fr_auto]"
              >
                <div className="h-28 overflow-hidden rounded-xl border border-white/10 bg-black">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                      No Image
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">/{product.slug}</p>
                  <p className="mt-3 text-sm text-zinc-300">{product.category}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Rp {product.priceFrom.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="rounded-full border border-red-500/30 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
