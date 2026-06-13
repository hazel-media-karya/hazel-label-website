import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020202]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:flex-row lg:justify-between lg:px-10">
        <div className="max-w-sm">
          <Image src={siteConfig.logoPath} alt={`${siteConfig.brandName} logo`} width={140} height={40} />
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Luxury custom sportswear and premium apparel experiences crafted for modern teams and athletes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-400">
            {siteConfig.socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="transition hover:text-[#d8b36d]">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {siteConfig.footerColumns.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d8b36d]">{section.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d8b36d]">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>{siteConfig.contactEmail}</li>
              <li>+1 (800) 555-0148</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-sm text-zinc-500 sm:px-8 lg:px-10">
        © 2026 {siteConfig.brandName}. All rights reserved.
      </div>
    </footer>
  );
}
