cat > lib/site-settings.ts <<'EOF'
import { prisma } from "@/lib/prisma";

export const defaultSiteSettings = {
  header: {
    logoText: "HAZEL APPAREL",
    tagline: "Premium Custom Jersey & Apparel",
    navItems: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Hazel Studio", href: "/hazel-studio" },
      { label: "Contact", href: "/contact" }
    ],
    ctaLabel: "Start Custom",
    ctaHref: "/hazel-studio"
  },

  hero: {
    eyebrow: "Premium Custom Jersey Platform",
    title: "Design Your Custom Jersey with Hazel Apparel",
    subtitle:
      "Create custom teamwear, preview apparel, upload panel designs, and manage orders through Hazel Studio.",
    primaryButtonLabel: "Open Hazel Studio",
    primaryButtonHref: "/hazel-studio",
    secondaryButtonLabel: "View Products",
    secondaryButtonHref: "/products",
    slides: [
      {
        title: "Custom Jersey 3D Preview",
        description: "Male/female avatar preview, body measurement, and 360 jersey simulation."
      },
      {
        title: "8 Panel Design Upload",
        description: "Upload front, back, sleeves, collar, side, and detail panel design assets."
      },
      {
        title: "Production Tracking",
        description: "Customer dashboard, invoice, payment confirmation, and production progress."
      }
    ]
  },

  footer: {
    brand: "HAZEL APPAREL",
    description:
      "Premium custom jersey and apparel platform for teams, communities, events, and professional sportswear production.",
    address: "Indonesia",
    email: "officialhazelapparel@gmail.com",
    instagram: "@officialhazelapparel",
    copyright: "© 2026 Hazel Apparel. All rights reserved.",
    links: [
      { label: "About", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Hazel Studio", href: "/hazel-studio" },
      { label: "Contact", href: "/contact" }
    ]
  }
};

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      header: defaultSiteSettings.header,
      hero: defaultSiteSettings.hero,
      footer: defaultSiteSettings.footer
    }
  });

  return settings;
}
EOF
