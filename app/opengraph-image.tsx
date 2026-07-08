import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Hazel Apparel — Custom Jersey & Premium Apparel";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 20% 20%, rgba(216,179,109,0.25), transparent 32%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12), transparent 28%), #030305",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "70px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: "42px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "58px",
            background: "rgba(255,255,255,0.035)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                color: "#d8b36d",
                fontSize: "28px",
                letterSpacing: "14px",
                textTransform: "uppercase",
              }}
            >
              Hazel Apparel
            </div>

            <div
              style={{
                fontSize: "74px",
                fontWeight: 800,
                lineHeight: 1.04,
                letterSpacing: "-2.5px",
                maxWidth: "900px",
              }}
            >
              Custom Jersey & Premium Apparel
            </div>

            <div
              style={{
                marginTop: "14px",
                fontSize: "30px",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.72)",
                maxWidth: "880px",
              }}
            >
              Platform custom jersey, teamwear, sportswear, dan apparel premium Indonesia.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              color: "rgba(255,255,255,0.62)",
              fontSize: "24px",
            }}
          >
            <div>hazellabel.com</div>
            <div
              style={{
                color: "#d8b36d",
                letterSpacing: "8px",
                textTransform: "uppercase",
                fontSize: "20px",
              }}
            >
              Custom Design · Teamwear · Order Online
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
