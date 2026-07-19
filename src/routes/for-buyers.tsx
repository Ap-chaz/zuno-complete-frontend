import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, PackageCheck, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { HeroRotator } from "@/components/site/HeroRotator";
import forBuyersSlide1 from "@/assets/for-buyers-slide-1.jpg";
import forBuyersSlide2 from "@/assets/for-buyers-slide-2.jpg";
import forBuyersSlide3 from "@/assets/for-buyers-slide-3.jpg";

export const Route = createFileRoute("/for-buyers")({
  head: () => ({
    meta: [
      { title: "ZUNO for buyers — stop sending money to strangers" },
      {
        name: "description",
        content:
          "Buy from online sellers you've never met. ZUNO holds your money until the item is in your hands and confirmed working.",
      },
      { property: "og:title", content: "ZUNO for buyers — stop sending money to strangers" },
      { property: "og:description", content: "Your money sits in a segregated ZUNO Escrow account until you say the deal is done." },
    ],
  }),
  component: ForBuyers,
});

function ForBuyers() {
  return (
    <>
      <section className="pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-[820px] px-6 text-center lg:px-8">
          <p className="eyebrow">For buyers</p>
          <h1 className="text-display-xl mx-auto mt-6 max-w-[16ch]">
            Pay <span className="text-primary">sellers</span> you've never met — without the leap of faith.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted-foreground">
            Every direct transfer is a bet on a stranger. ZUNO changes the shape of the
            bet: the seller sees the money is real, but can't touch it until you confirm the
            item arrived.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/auth/signup"
              className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              Buy safely with ZUNO <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[1200px] px-6 lg:px-8">
          <HeroRotator
            slides={[
              {
                src: forBuyersSlide1,
                alt: "A buyer smiling while video-calling a seller on his phone outdoors",
                width: 1600,
                height: 1049,
              },
              {
                src: forBuyersSlide2,
                alt: "A courier handing over a package to a smiling buyer at her door",
                width: 1600,
                height: 1064,
              },
              {
                src: forBuyersSlide3,
                alt: "People from different professions using ZUNO — a nurse, a construction worker, a delivery courier, and others, each wearing or holding ZUNO branding",
                width: 1536,
                height: 1024,
              },
            ]}
          />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Card icon={ShieldCheck} k="The seller cannot touch your money" v="Your money sits in a segregated ZUNO account. Only ZUNO can move it — and only when the release condition is met." />
            <Card icon={PackageCheck} k="You decide when the deal is done" v="Confirm delivery in the app and funds release instantly. Do nothing and they release automatically after 72h." />
            <Card icon={MessageCircle} k="You get a real dispute path" v="If the item is wrong or missing, open a case. Funds freeze. Upload evidence. A human rules on the outcome." />
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ icon: Icon, k, v }: { icon: any; k: string; v: string }) {
  return (
    <Reveal>
      <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
        <div className="grid h-11 w-11 place-items-center rounded-[12px] bg-surface-2 text-primary">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <p className="mt-5 font-semibold">{k}</p>
        <p className="mt-2 text-sm text-muted-foreground">{v}</p>
      </div>
    </Reveal>
  );
}
