"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  priceFrom: number | null;
  imageUrl: string | null;
  isActive?: boolean;
};

function formatPrice(value: number | null) {
  if (!value) {
    return "Hubungi kami";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getOrderLink(product: Product) {
  return `/contact?product=${encodeURIComponent(product.slug)}`;
}

export default function ProductsRuntime() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      try {
        const response = await fetch("/api/public/products", {
          cache: "no-store",
        });

        const json = await response.json();

        if (!json.success) {
          setMessage("Produk belum dapat dimuat.");
          setProducts([]);
          return;
        }

        setProducts(json.data ?? []);
      } catch {
        setMessage("Produk belum dapat dimuat.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-zinc-400">
        Loading products...
      </div>
    );
  }

  if (message) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-zinc-400">
        {message}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-zinc-400">
        Produk Hazel akan segera ditampilkan di sini.
      </div>
    );
  }

  return (
    <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.055]"
        >
          <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.35em] text-zinc-600">
                No Image
              </div>
            )}
          </div>

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
              {product.category || "Custom Jersey"}
            </p>

            <h2 className="mt-4 text-2xl font-semibold text-white">
              {product.name}
            </h2>

            <p className="mt-3 min-h-[56px] text-sm leading-7 text-zinc-400">
              {product.description || "Custom apparel by Hazel Apparel."}
            </p>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500">Start from</p>
                <p className="mt-1 text-base font-semibold text-white">
                  {formatPrice(product.priceFrom)}
                </p>
              </div>

              <a
                href={getOrderLink(product)}
                className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white hover:text-black"
              >
                Order
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
