export function ThreeDShowcase() {
  return (
    <section className="relative h-full w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-background via-background/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-background via-background/90 to-transparent" />
      <iframe
        src="/3d/index.html?embedded=1"
        title="Chakravyuh 3D experience"
        className="block h-full w-full border-0"
        allow="fullscreen"
      />
    </section>
  );
}
