import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HandCoins, Rocket, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { HeroRotator } from "@/components/site/HeroRotator";
import forSellersSlide1 from "@/assets/for-sellers-slide-1.jpg";
import forSellersSlide2 from "@/assets/for-sellers-slide-2.jpg";
import forSellersSlide3 from "@/assets/for-sellers-slide-3.jpg";

export const Route = createFileRoute("/for-sellers")({
  head: () => ({
    meta: [
      { title: "ZUNO for sellers — win the buyers who wouldn't have paid you" },
      {
        name: "description",
        content:
          "Sellers lose 40% of buyers to distrust. Send a ZUNO link instead of your bank details and close deals from strangers.",
      },
      { property: "og:title", content: "ZUNO for sellers — win the buyers who wouldn't have paid you" },
      { property: "og:description", content: "You ship, the buyer confirms, ZUNO pays you. Guaranteed on release." },
    ],
  }),
  component: ForSellers,
});

function ForSellers() {
  return (
    <>
      <section className="pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-[820px] px-6 text-center lg:px-8">
          <p className="eyebrow">For sellers</p>
          <h1 className="text-display-xl mx-auto mt-6 max-w-[18ch]">
            Win the buyers who <span className="text-primary">wouldn't have</span> paid you.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted-foreground">
            You already know how many chats end in “ok let me think about it” after you ask for
            payment upfront. Send a ZUNO payment link instead — buyers pay because the money is
            protected, and you get it on release, guaranteed.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/auth/signup"
              className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              Sell with ZUNO <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[1200px] px-6 lg:px-8">
          <HeroRotator
            slides={[
              {
                src: forSellersSlide1,
                alt: "A seller handing over house keys to happy buyers after a completed, trusted deal",
                width: 1600,
                height: 1036,
              },
              {
                src: forSellersSlide2,
                alt: "A market seller confirming a payment on her phone with a card in hand",
                width: 1600,
                height: 1052,
              },
              {
                src: forSellersSlide3,
                alt: "People from different walks of life using ZUNO — a nurse, a delivery courier, a father and his kids, all wearing or holding ZUNO branding",
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
            <Card icon={TrendingUp} k="Close deals from strangers" v="Buyers who'd otherwise walk away pay comfortably because their money is protected — not because they trust you yet." />
            <Card icon={HandCoins} k="Guaranteed payout on release" v="Once the buyer confirms (or the auto-release window ends), ZUNO settles to your account within seconds." />
            <Card icon={Rocket} k="No app needed for the buyer" v="Share a ZUNO link over chat, social, or a marketplace listing. The buyer pays via a simple web page — no download." />
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
