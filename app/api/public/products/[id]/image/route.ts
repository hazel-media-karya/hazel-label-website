export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function placeholderSvg() {
  return `
    <svg width="1200" height="900" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="900" fill="#050505"/>
      <rect x="80" y="80" width="1040" height="740" rx="48" fill="#111111" stroke="#2a2a2a"/>
      <text x="600" y="430" text-anchor="middle" fill="#d8b36d" font-size="34" font-family="Arial, sans-serif" letter-spacing="8">
        HAZEL APPAREL
      </text>
      <text x="600" y="490" text-anchor="middle" fill="#777777" font-size="24" font-family="Arial, sans-serif">
        Product Image
      </text>
    </svg>
  `;
}

export async function GET() {
  return new Response(placeholderSvg(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
