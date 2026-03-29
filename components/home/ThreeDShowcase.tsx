export function ThreeDShowcase() {
  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      <iframe
        src="/3d/index.html?embedded=1"
        title="Chakravyuh 3D experience"
        className="block h-full w-full border-0"
        allow="fullscreen"
      />
    </section>
  );
}
