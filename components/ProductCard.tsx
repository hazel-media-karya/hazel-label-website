import { ProductCategory } from "@/lib/site-config";

export function ProductCard({ category }: { category: ProductCategory }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#060606]">
      <div className={`h-36 bg-gradient-to-br ${category.accentClass}`}>
        <div className="mx-auto flex h-full max-w-[90%] items-end justify-center px-4 pb-4">
          <div className="h-24 w-20 rounded-[30px] border border-white/10 bg-black/55" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white">{category.title}</h3>
        <p className="mt-2 text-sm leading-7 text-zinc-400">{category.description}</p>
      </div>
    </article>
  );
}
