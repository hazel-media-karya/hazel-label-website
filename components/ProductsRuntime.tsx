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
};

function getOrderLink(product: Product) {
  const message = encodeURIComponent(
    `Halo Hazel Apparel, saya tertarik order produk ${product.name}.`
  );

  const whatsappNumber = process.env.NEXT_PUBLIC_HAZEL_WHATSAPP_NUMBER;

  if (whatsappNumber) {
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  }

  return `/contact?product=${encodeURIComponent(product.slug)}`;
}

export default function ProductsRuntime() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/admin/products", {
          cache: "no-store",
        });

        const json = await response.json();

        if (json.success) {
          const activeProducts = (json.data ?? []).filter(
            (product: Product) => product.isActive
          );

          setProducts(activeProducts);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-zinc-400">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-8 text-zinc-400">
        Produk Hazel akan segera ditampilkan di sini.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.055]"
        >
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="px-8 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
                  Hazel Apparel
                </p>
                <p className="mt-4 text-2xl font-semibold text-white">
                  {product.name}
                </p>
              </div>
            )}
          </div>

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d8b36d]">
              {product.category}
            </p>

            <h2 className="mt-4 text-xl font-semibold text-white">
              {product.name}
            </h2>

            <p className="mt-3 min-h-[72px] text-sm leading-6 text-zinc-400">
              {product.description || "Premium custom apparel by Hazel."}
            </p>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-500">
                Start from{" "}
                <span className="font-semibold text-white">
                  Rp {product.priceFrom.toLocaleString("id-ID")}
                </span>
              </p>

              <a
                href={getOrderLink(product)}
                target={getOrderLink(product).startsWith("https://wa.me") ? "_blank" : undefined}
                rel={getOrderLink(product).startsWith("https://wa.me") ? "noreferrer" : undefined}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white transition hover:border-white/25 hover:bg-white hover:text-black"
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
