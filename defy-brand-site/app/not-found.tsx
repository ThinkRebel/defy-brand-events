import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "var(--pad)", textAlign: "center" }}>
      <div>
        <p className="eyebrow">404</p>
        <h1 className="display" style={{ fontSize: "clamp(32px,5vw,96px)", lineHeight: 1, textTransform: "uppercase", marginTop: ".4em", maxWidth: "16ch", textWrap: "balance" }}>
          Deze pagina bestaat niet. <span className="fluo">Het idee dat je zocht misschien wel.</span>
        </h1>
        <p style={{ marginTop: "2em" }}>
          <Link className="arrow-link" href="/nl">Terug naar start</Link>
        </p>
      </div>
    </main>
  );
}
