"use client";

import { useEffect, useState } from "react";

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

function labelClass() {
  return "text-sm font-medium text-zinc-300";
}

export default function AdminProductsForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  async function updateProduct() {
    if (!editingProductId) {
      return;
    }

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
          name: form.name,
          category: form.category,
          description: form.description,
          priceFrom: Number(form.priceFrom || 0),
          imageUrl: form.imageUrl,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder || 0),
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error("Update failed");
      }

      setMessage("Produk berhasil diperbarui.");
      setEditingProductId(null);
      setForm(defaultForm);
      await loadProducts();
    } catch {
      setMessage("Gagal memperbarui produk.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm("Hapus produk ini?");

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error("Delete failed");
      }

      setMessage("Produk berhasil dihapus.");
      await loadProducts();
    } catch {
      setMessage("Gagal menghapus produk.");
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function createProduct() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
          priceFrom: Number(form.priceFrom || 0),
          imageUrl: form.imageUrl,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder || 0),
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error("Create failed");
      }

      setMessage("Produk berhasil ditambahkan.");
      setForm(defaultForm);
      await loadProducts();
    } catch {
      setMessage("Gagal menambahkan produk.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-zinc-200">
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="text-xl font-semibold text-white">Add Product</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className={labelClass()}>
            Product Name
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className={inputClass()}
              placeholder="Cycling Jersey Premium"
            />
          </label>

          <label className={labelClass()}>
            Category
            <input
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              className={inputClass()}
              placeholder="Custom Jersey"
            />
          </label>

          <label className={labelClass()}>
            Price From
            <input
              type="number"
              value={form.priceFrom}
              onChange={(event) =>
                setForm({ ...form, priceFrom: event.target.value })
              }
              className={inputClass()}
              placeholder="150000"
            />
          </label>

          <label className={labelClass()}>
            Sort Order
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm({ ...form, sortOrder: event.target.value })
              }
              className={inputClass()}
              placeholder="0"
            />
          </label>

          <label className={`${labelClass()} md:col-span-2`}>
            Image URL
            <input
              value={form.imageUrl}
              onChange={(event) =>
                setForm({ ...form, imageUrl: event.target.value })
              }
              className={inputClass()}
              placeholder="/products/cycling-jersey.png"
            />
          </label>

          {form.imageUrl.trim() ? (
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d8b36d]">
                Image Preview
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
                <img
                  src={form.imageUrl.trim()}
                  alt="Product preview"
                  className="h-64 w-full object-cover"
                />
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Preview muncul jika Image URL valid.
              </p>
            </div>
          ) : null}

          <label className={`${labelClass()} md:col-span-2`}>
            Description
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className={`${inputClass()} min-h-[130px]`}
              placeholder="Premium custom jersey for cycling teams and communities."
            />
          </label>

          <label className={labelClass()}>
            Status
            <select
              value={form.isActive ? "active" : "inactive"}
              onChange={(event) =>
                setForm({
                  ...form,
                  isActive: event.target.value === "active",
                })
              }
              className={inputClass()}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={editingProductId ? updateProduct : createProduct}
            disabled={saving || !form.name.trim()}
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
            Belum ada produk. Tambahkan produk pertama dari form di atas.
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.05] text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price From</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-4">
                      <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                            No Image
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        /{product.slug}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 text-zinc-300">
                      Rp {product.priceFrom.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
