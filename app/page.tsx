import { ThreeDShowcase } from "@/components/home";

export default function Home() {
  return (
    <>
      <main className="h-dvh overflow-hidden bg-black text-on-background">
        <section aria-label="3D showcase" className="h-full">
          <ThreeDShowcase />
        </section>
      </main>
    </>
  );
}
