"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug?: string | null;
  category?: string | null;
  description?: string | null;
  priceFrom?: number | null;
  imageUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number | null;
};

export default function ProductsRuntime() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/public/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load products: ${res.status}`);
        }

        const payload = await res.json();

        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        if (!cancelled) {
          setProducts(list);
        }
      } catch (err) {
        console.error("ProductsRuntime error:", err);

        if (!cancelled) {
          setError("Failed to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  function formatPrice(value?: number | null) {
    if (!value) return "Contact for price";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-white/70">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-white/70">
        No products available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
        >
          <div className="aspect-[4/3] bg-white/[0.04]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.25em] text-white/40">
                Hazel Apparel
              </div>
            )}
          </div>

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-yellow-300">
              {product.category || "Custom Jersey"}
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              {product.name}
            </h3>

            {product.description ? (
              <p className="mt-3 text-sm leading-6 text-white/65">
                {product.description}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white">
                From {formatPrice(product.priceFrom)}
              </p>

              <a
                href="/custom"
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-white/85"
              >
                Custom
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
