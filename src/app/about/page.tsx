import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "UTSAB is a non-profit association celebrating Bengali and Hindu culture in Orpington, Kent through Durga Puja, Saraswati Puja, and community events.",
};

const ACTIVITIES = [
  {
    title: "Annual Festivals",
    body: "Celebrating key Hindu and Bengali festivals such as Durga Puja, Saraswati Puja, and Poila Boisakh (Bengali New Year) through community gatherings, prayers, processions, and feasts.",
  },
  {
    title: "Educational Workshops",
    body: "Classes and workshops for members — especially the younger generation — on Hindu scriptures, customs, traditions, and philosophy.",
  },
  {
    title: "Charity & Outreach",
    body: "Food drives, donations for the underprivileged, and support for local charitable initiatives, guided by the value of selfless service (Seva).",
  },
  {
    title: "Cultural Programmes",
    body: "Classical dance, music, and drama that celebrate Bengal's artistic heritage and bring the community together to showcase its traditions.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-indigo-950">
      <section
        className="dot-grid relative overflow-hidden py-20 text-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(108,63,201,0.27) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,74,168,0.2) 0%, transparent 50%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-[12.5px] font-bold uppercase tracking-wide text-marigold-500">
            About {SITE.name}
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-lavender-50 sm:text-5xl">
            A home away from home
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <p className="text-[16px] leading-relaxed text-lavender-400">
          UTSAB — meaning &ldquo;celebration&rdquo; — is a non-profit association committed to
          promoting Bengali culture and values through socio-cultural events like Saraswati Puja,
          Durga Puja, and Kali Puja. It is our humble endeavour that the younger generation
          appreciates the beauty of our rich cultural heritage and joins hands to ensure our
          cultural legacy continues to enthral the world.
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-lavender-400">
          Durga Puja transcends all barriers, creating for us a home away from home. Please join
          us in this magnificent celebration of life as part of the UTSAB family.
        </p>

        <div className="alpona-divider my-12" />

        <h2 className="font-display text-[28px] font-extrabold text-lavender-50">Our Purpose</h2>
        <div className="mt-5 flex flex-col gap-3.5">
          <p className="text-[15.5px] leading-relaxed text-lavender-400">
            <strong className="text-marigold-500">Promote Hindu &amp; Bengali practices</strong> —
            provide a platform for the community in the UK to engage in religious practices,
            festivals, pujas, and sacred rituals.
          </p>
          <p className="text-[15.5px] leading-relaxed text-lavender-400">
            <strong className="text-marigold-500">Create a spiritual and cultural hub</strong> —
            foster community through regular religious events, festivals, and cultural activities.
          </p>
          <p className="text-[15.5px] leading-relaxed text-lavender-400">
            <strong className="text-marigold-500">Strengthen Bengali identity</strong> — help
            younger generations stay connected with their heritage and its cultural significance.
          </p>
          <p className="text-[15.5px] leading-relaxed text-lavender-400">
            <strong className="text-marigold-500">Serve the community</strong> — offer spiritual
            guidance, community support, and welfare services to individuals and families.
          </p>
          <p className="text-[15.5px] leading-relaxed text-lavender-400">
            <strong className="text-marigold-500">Promote interfaith understanding</strong> —
            share Hindu and Bengali values with the broader community, encouraging respect and
            tolerance.
          </p>
        </div>

        <div className="alpona-divider my-12" />

        <h2 className="font-display text-[28px] font-extrabold text-lavender-50">What We Do</h2>
        <div className="mt-5 grid gap-[18px] sm:grid-cols-2">
          {ACTIVITIES.map((a) => (
            <div key={a.title} className="surface-shadow rounded-[18px] bg-indigo-800 p-6">
              <h3 className="font-display text-[17px] font-bold text-lavender-50">{a.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-lavender-600">{a.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center font-display text-[19px] font-bold text-marigold-500">
          Thank you — Team UTSAB
        </p>
      </section>
    </div>
  );
}
