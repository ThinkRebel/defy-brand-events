import { ImageResponse } from "next/og";

/**
 * /og.jpg — the social card behind og:image / twitter:image (LinkedIn, WhatsApp, X, Slack…).
 * Rendered at build time from code, so there is no file to upload or forget. 1200×630.
 */
export const dynamic = "force-static";

/** the brand mark (outline of public/assets/mark-fluo.svg) */
const MARK = "M58.5635 16.2745C58.5635 22.2023 63.369 27.0078 69.2968 27.0078H74.8389C80.7668 27.0078 85.5723 31.8133 85.5723 37.7411V47.8301C85.5723 53.758 80.7668 58.5635 74.8389 58.5635H69.2968C63.369 58.5635 58.5635 63.369 58.5635 69.2968V74.838C58.5635 80.7658 53.758 85.5713 47.8301 85.5713H37.7411C31.8133 85.5713 27.0078 80.7658 27.0078 74.838V69.2968C27.0078 63.369 22.2023 58.5635 16.2745 58.5635H10.7333C4.80548 58.5635 0 53.758 0 47.8301V37.7411C0 31.8133 4.80548 27.0078 10.7333 27.0078H16.2745C22.2023 27.0078 27.0078 22.2023 27.0078 16.2745V10.7333C27.0078 4.80548 31.8133 0 37.7411 0H47.8301C53.758 0 58.5635 4.80548 58.5635 10.7333V16.2745Z";
const FLUO = "#e4ff2e";

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#050609", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="54" height="54" viewBox="0 0 85.5723 85.5713" style={{ transform: "rotate(-45deg)" }}>
            <path d={MARK} stroke={FLUO} strokeWidth="4" fill="none" />
          </svg>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>DB Events · Oostende</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 700, lineHeight: 0.98, letterSpacing: -4 }}>
          <div>DEFY</div>
          <div>BRAND</div>
          <div style={{ color: FLUO }}>EVENTS</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 28, color: "rgba(255,255,255,0.8)" }}>
          <div>We turn ideas into experiences.</div>
          <div style={{ color: FLUO }}>defyandbrandevents.be</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
