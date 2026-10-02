import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donation & Sponsorship Terms",
  description: "Terms governing donations and sponsorships made to UTSAB Bengali Association of Orpington.",
};

export default function DonationTermsPage() {
  return (
    <div className="min-h-screen bg-indigo-950 px-4 py-16 sm:px-6">
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-extrabold text-lavender-50">
        Donation &amp; Sponsorship Terms
      </h1>
      <div className="alpona-divider my-8" />

      <div className="space-y-6 text-[15px] leading-relaxed text-lavender-400">
        <p>
          Utsab Bengali Association of Orpington (&ldquo;the Association&rdquo;) is an
          unincorporated organisation that organises key Hindu and Bengali festivals such as
          Durga Puja, Saraswati Puja, Poila Boisakh (Bengali New Year), and others through
          community gatherings, prayers, processions, and feasts.
        </p>

        <section>
          <h2 className="font-display text-2xl font-extrabold text-lavender-50">
            Purpose of the Association
          </h2>
          <p className="mt-3">The purpose of the Association is to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              Promote Hindu and Bengali religious practices, including the observance of
              important festivals, pujas, and other sacred rituals.
            </li>
            <li>
              Create a spiritual and cultural hub by hosting regular religious events, festivals,
              and cultural activities.
            </li>
            <li>
              Support and strengthen Hindu and Bengali identity, particularly among younger
              generations.
            </li>
            <li>
              Serve the community by offering spiritual guidance, support, and welfare services.
            </li>
            <li>
              Promote interfaith dialogue and understanding across different faiths and cultures.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-extrabold text-lavender-50">
            Donations and Sponsorships
          </h2>
          <p className="mt-3">
            The Association accepts voluntary donations and sponsorships from individuals and
            corporate entities. All contributions are accounted for if paid to the designated
            bank account only, unless a written acknowledgement or receipt is issued for any cash
            payment received from a donor or sponsor.
          </p>
          <p className="mt-3">
            All donations and sponsorships are accepted on the clear understanding that such
            payments are non-refundable after 48 hours of payment. Anyone seeking a refund must
            submit a written request, together with the bank transfer record or payment receipt
            (if issued), within 48 hours of payment.
          </p>
          <p className="mt-3">
            Donations are accepted only if made voluntarily, without any expectation of receiving
            goods, privileges, or designations from the Association.
          </p>
          <p className="mt-3">
            A sponsor must have a prior agreement with the Association regarding the display of
            advertising material or the setting up of a stall in return for an agreed sponsorship
            fee. All sponsors and stall providers must comply with the rules of both the venue
            and the Association. Disregard of these rules may result in immediate closure of the
            stall, with no refund of fees.
          </p>
          <p className="mt-3">
            Funds accumulated through donations and sponsorship fees are used to organise
            UTSAB&rsquo;s social and cultural events. All professionals and suppliers (excluding
            volunteers, who participate without remuneration) are paid from these funds.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-extrabold text-lavender-50">
            Changes to Terms
          </h2>
          <p className="mt-3">
            These terms are subject to change from time to time. Donors and sponsors are advised
            to request the most up-to-date copy of these terms at the time of making payment.
          </p>
        </section>
      </div>
    </div>
    </div>
  );
}
