import { ImageResponse } from "next/og";
import { EVENT_DATE_TEXT, EVENT_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Link-preview card for search results, iMessage, Slack, LinkedIn, X, etc.
export const alt = `${EVENT_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(160deg, #0b1235 0%, #111c4c 45%, #5b3a9c 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: 64,
        }}
      >
        <div style={{ fontSize: 148, fontWeight: 700, letterSpacing: -2, color: "#f1e3fa" }}>{EVENT_NAME}</div>
        <div style={{ fontSize: 46, marginTop: 20, color: "#dfc5ee" }}>{SITE_TAGLINE}</div>
        <div style={{ fontSize: 30, marginTop: 44, color: "#ffffff", opacity: 0.8 }}>
          {`${EVENT_DATE_TEXT} · ${SITE_URL.replace(/^https?:\/\//, "")}`}
        </div>
      </div>
    ),
    size,
  );
}
