import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support UTSAB's Durga Puja idol fund or make an ad-hoc donation to help keep our celebrations free and open to everyone.",
};

export default function DonatePage() {
  return (
    <div className="bg-indigo-950">
      <section
        className="dot-grid relative overflow-hidden py-20 text-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgba(217,74,168,0.27) 0%, transparent 50%), radial-gradient(circle at 80% 75%, rgba(108,63,201,0.27) 0%, transparent 50%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-[12.5px] font-bold uppercase tracking-wide text-marigold-500">
            Support UTSAB
          </p>
          <h1 className="mx-auto mt-3 max-w-xl font-display text-4xl font-extrabold text-lavender-50 sm:text-[42px]">
            Help Us Keep the Celebration Alive
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-lavender-300">
            UTSAB is run entirely by volunteers. Every donation goes directly towards venue
            costs, priests, cultural programmes, and making our festivals free and open to the
            whole community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="surface-shadow flex flex-col rounded-[22px] bg-indigo-800 p-8">
            <span className="inline-flex w-fit items-center rounded-full bg-marigold-500/20 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-marigold-500">
              Featured appeal
            </span>
            <h2 className="mt-[18px] font-display text-[23px] font-extrabold text-lavender-50">
              A New Durga Maa Idol
            </h2>
            <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-lavender-400">
              Every year, Maa Durga&rsquo;s arrival is the heart of our celebration. We&rsquo;re
              raising funds for a beautiful new idol to welcome her home in Orpington — one that
              our community and generations to come can cherish. Whatever you can give brings us
              closer to celebrating Maa Durga in the way she deserves.
            </p>
            <a
              href={SITE.gofundmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-marigold mt-6 inline-flex items-center justify-center rounded-full bg-marigold-500 px-7 py-3.5 font-bold text-indigo-975 transition-transform hover:scale-105"
            >
              Give via GoFundMe →
            </a>
          </div>

          <div className="surface-shadow flex flex-col rounded-[22px] bg-indigo-800 p-8">
            <span className="inline-flex w-fit items-center rounded-full bg-white/8 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-lavender-300">
              Ad-hoc donation
            </span>
            <h2 className="mt-[18px] font-display text-[23px] font-extrabold text-lavender-50">
              General Donation
            </h2>
            <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-lavender-400">
              Prefer to give directly? You can make an immediate one-off donation via PayPal to
              support UTSAB&rsquo;s day-to-day running costs — from hall hire to prasad for
              hundreds of visitors.
            </p>
            <a
              href={SITE.paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-violet-500 px-7 py-3.5 font-bold text-lavender-50 transition-transform hover:scale-105"
            >
              Donate via PayPal →
            </a>
          </div>
        </div>

        <div className="alpona-divider my-16" />

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-extrabold text-lavender-50">
            How your donation is used
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-lavender-400">
            Funds raised through donations and sponsorships go towards organising UTSAB&rsquo;s
            social and cultural events — venue hire, priests and puja materials, cultural
            performers, and supplies. All professionals and suppliers are paid from these funds;
            our volunteers give their time freely. Donations are non-refundable after 48 hours —
            see our{" "}
            <a href="/donation-terms" className="text-marigold-500 underline decoration-marigold-500/50">
              donation &amp; sponsorship terms
            </a>{" "}
            for details.
          </p>

          <p className="mt-7 font-display text-[17px] font-bold text-marigold-500">
            To everyone who has supported us so far — thank you. UTSAB would not exist without
            you.
          </p>
        </div>
      </section>
    </div>
  );
}
