// Static site content for now. In the future this can be sourced from a database or an admin CMS.
export interface NavItem {
  label: string;
  href: string;
}

export interface HeroSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  primaryHref: string;
  secondaryHref: string;
  badges: string[];
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface ProductCategory {
  title: string;
  description: string;
  accentClass: string;
}

export interface StudioFeature {
  title: string;
  description: string;
}

export interface SiteConfig {
  brandName: string;
  logoPath: string;
  navigation: NavItem[];
  ctaButtonText: string;
  loginButtonText: string;
  heroSliderItems: HeroSlide[];
  footerColumns: FooterColumn[];
  contactEmail: string;
  socialLinks: Array<{ label: string; href: string }>;
  productCategories: ProductCategory[];
  hazelStudioFeatures: StudioFeature[];
}

export const siteConfig: SiteConfig = {
  brandName: "Hazel Label",
  logoPath: "/logo-hazel-white.png",
  navigation: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Hazel Studio", href: "/hazel-studio" },
    { label: "Contact", href: "/contact" },
  ],
  ctaButtonText: "Start Custom",
  loginButtonText: "Login",
  heroSliderItems: [
    {
      eyebrow: "Premium sports-tech custom apparel",
      title: "Create your custom jersey in 3D",
      subtitle:
        "Build elite team uniforms, athlete gear, and signature apparel with cinematic previews, precise branding, and luxury-grade finishes.",
      primaryCtaText: "Design Now",
      secondaryCtaText: "Explore Products",
      primaryHref: "/hazel-studio",
      secondaryHref: "/products",
      badges: ["Premium Quality Fabrics", "Advanced 3D Customization", "Worldwide Shipping"],
    },
    {
      eyebrow: "Digitally crafted for clubs and brands",
      title: "Launch a premium collection without friction",
      subtitle:
        "From team kits to athlete capsules, Hazel Studio helps you upload artwork, define measurements, and preview every detail before production.",
      primaryCtaText: "View Studio",
      secondaryCtaText: "Meet Hazel",
      primaryHref: "/hazel-studio",
      secondaryHref: "/about",
      badges: ["8-Panel Design Upload", "Body Measurement Fit", "Invoice & Tracking"],
    },
    {
      eyebrow: "Luxury apparel made measurable",
      title: "Bring your vision to life with custom precision",
      subtitle:
        "A polished, digital-first workflow for premium jerseys, running wear, and bespoke apparel experiences crafted for modern teams.",
      primaryCtaText: "Start A Project",
      secondaryCtaText: "Contact Us",
      primaryHref: "/products",
      secondaryHref: "/contact",
      badges: ["Ultra-Light Fabrics", "Sublimation Finish", "Global Delivery"],
    },
  ],
  footerColumns: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Story", href: "/about" },
        { label: "Hazel Studio", href: "/hazel-studio" },
      ],
    },
    {
      title: "Products",
      links: [
        { label: "Cycling Jersey", href: "/products" },
        { label: "Running Jersey", href: "/products" },
        { label: "Team Jersey", href: "/products" },
        { label: "Custom Apparel", href: "/products" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Login", href: "/login" },
        { label: "Admin", href: "/admin" },
      ],
    },
  ],
  contactEmail: "hello@hazellabel.com",
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "WhatsApp", href: "https://wa.me/15551234567" },
  ],
  productCategories: [
    {
      title: "Cycling Jersey",
      description: "Aerodynamic race gear with premium sublimation and logo-ready detailing.",
      accentClass: "from-amber-300/20 via-amber-400/10 to-transparent",
    },
    {
      title: "Running Jersey",
      description: "Lightweight performance apparel for clubs, events, and training squads.",
      accentClass: "from-slate-200/15 via-slate-100/10 to-transparent",
    },
    {
      title: "Team Jersey",
      description: "Custom uniforms designed for elite teams and growing communities.",
      accentClass: "from-amber-400/20 via-transparent to-stone-200/10",
    },
    {
      title: "Custom Apparel",
      description: "Launch a full collection with personalized fit, trim, and branding.",
      accentClass: "from-zinc-300/15 via-zinc-100/10 to-transparent",
    },
  ],
  hazelStudioFeatures: [
    {
      title: "Register",
      description: "Create your athlete, team, or brand profile in minutes.",
    },
    {
      title: "Upload 8-Panel Design",
      description: "Bring artwork, sponsor marks, and full panel layouts into the studio.",
    },
    {
      title: "Body Measurement",
      description: "Preview fit with tailored measurements for men and women.",
    },
    {
      title: "3D Preview",
      description: "Approve a cinematic jersey preview before production begins.",
    },
    {
      title: "Checkout",
      description: "Finalize colors, sizing, and delivery details in a single flow.",
    },
    {
      title: "Invoice & Tracking",
      description: "Receive a polished invoice and real-time order updates.",
    },
  ],
};
