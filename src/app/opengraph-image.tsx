import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #360a10 0%, #501019 55%, #6e1622 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <span style={{ color: "#e8a33d", fontSize: 32, letterSpacing: 6, textTransform: "uppercase" }}>
          {SITE.tagline}
        </span>
        <span style={{ color: "#fdf8f0", fontSize: 130, fontWeight: 700, marginTop: 20 }}>
          {SITE.name}
        </span>
        <span style={{ color: "#f8ecd8", fontSize: 30, marginTop: 20 }}>
          {SITE.fullName}
        </span>
      </div>
    ),
    { ...size },
  );
}
