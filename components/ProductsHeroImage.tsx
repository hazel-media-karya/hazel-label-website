"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  imageUrl: string | null;
  isActive: boolean;
};

export default function ProductsHeroImage() {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("Hazel Apparel");

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const response = await fetch("/api/public/products", {
          cache: "no-store",
        });

        const json = await response.json();

        if (!json.success) {
          return;
        }

        const product = (json.data ?? []).find(
          (item: Product) => item.imageUrl
        );

        if (product?.imageUrl) {
          setImageUrl(product.imageUrl);
          setName(product.name);
        }
      } catch {
        setImageUrl("");
      }
    }

    loadHeroImage();
  }, []);

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-56 w-full object-cover transition duration-500 hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-56 items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
              Hazel Apparel
            </p>
            <p className="mt-4 text-xl font-semibold text-white">
              Custom Jersey Preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
