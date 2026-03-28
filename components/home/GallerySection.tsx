import Image from "next/image";

export function GallerySection() {
  return (
    <section className="space-y-8">
      <h3 className="text-secondary text-xl sm:text-2xl md:text-4xl font-bold tracking-tight uppercase">
        The Gallery of Victors
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="aspect-square bg-surface-container-high overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
            alt="Tech event auditorium"
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
          />
        </div>
        <div className="aspect-square bg-surface-container-high overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"
            alt="Students working with laptops"
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-3"
          />
        </div>
        <div className="aspect-square bg-surface-container-high overflow-hidden group md:row-span-2">
          <Image
            src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80"
            alt="Trophy and award"
            width={400}
            height={800}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
          />
        </div>
        <div className="aspect-square bg-surface-container-high overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80"
            alt="Conference audience"
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6"
          />
        </div>
        <div className="aspect-square bg-surface-container-high overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
            alt="Circuit board close-up"
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-6"
          />
        </div>
        <div className="aspect-square bg-surface-container-high overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
            alt="Modern office workspace"
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
          />
        </div>
      </div>
    </section>
  );
  return null;
}