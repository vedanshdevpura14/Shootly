import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Professional } from "@/types/photographer";
import { Navbar } from "@/components/Navbar";
import ProActions from "./ProActions"; // <-- Import the new Client Component

async function getProfessional(slug: string) {
  const professional = await prisma.professional.findUnique({
    where: { slug },
    include: { portfolios: { orderBy: { id: "desc" } } },
  });
  if (!professional) notFound();
  return professional;
}

// ✅ After
export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pro = await getProfessional(slug);
  const tags = pro.tags ? pro.tags.split(",").filter(Boolean) : [];

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end pb-16 pt-20">
        <div className="absolute inset-0">
          {pro.portfolios.length > 0 ? (
            <img
              src={pro.portfolios[0].imageUrl}
              alt={pro.name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img
              src="https://picsum.photos/seed/default-cover/1920/1080"
              alt="Cover"
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full border-3 border-amber-500 p-0.5 bg-black flex-shrink-0">
              {pro.image ? (
                <img src={pro.image} alt={pro.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-amber-500">
                  {pro.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{pro.name}</h1>
                {pro.verified && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                {pro.city && (
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {pro.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {pro.rating} ({pro.reviews} reviews)
                </span>
                <span>{pro.type}</span>
              </div>
            </div>

            {/* DESKTOP ACTIONS */}
          <div className="hidden md:block">
  <ProActions professional={pro as unknown as Professional} />
</div>
          </div>
        </div>
      </section>

      {/* Tags & Price Bar */}
      <section className="bg-slate-950 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
  <span key={tag.trim()} className="px-3 py-1 bg-white/5 border border-white/1...">
    {tag.trim()}
  </span>
))}
          </div>
          {pro.price > 0 && (
            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Starting</span>
              <div className="text-xl font-bold text-amber-500">₹{pro.price.toLocaleString()}<span className="text-xs text-slate-500 font-normal">{pro.unit || ""}</span></div>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-2">Portfolio</span>
            <h2 className="font-serif text-2xl font-bold">{pro.name}&apos;s Work</h2>
          </div>
          <span className="text-sm text-slate-500">{pro.portfolios.length} photo{pro.portfolios.length !== 1 ? "s" : ""}</span>
        </div>

        {pro.portfolios.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500">No portfolio photos yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pro.portfolios.map((item: { id: string; imageUrl: string; caption: string | null }) => (
  <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
    <img
      src={item.imageUrl}
      alt={item.caption || "Portfolio"}
      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
    />
    {item.caption && (
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white text-xs">{item.caption}</p>
      </div>
    )}
  </div>
))}

          </div>
        )}
      </section>

      {/* MOBILE ACTIONS (Fixed at bottom) */}
      {/* Mobile Actions */}
<div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/90 ...">
  <ProActions professional={pro as unknown as Professional} />
</div>
    </main>
  );
}