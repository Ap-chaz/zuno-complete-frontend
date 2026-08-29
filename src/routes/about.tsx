import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import teamAlvan from "@/assets/team-alvan.jpg";
import teamBenson from "@/assets/team-benson.jpg";
import teamPrince from "@/assets/team-prince.jpg";
import teamChris from "@/assets/team-chris.jpg";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  photoWidth?: number;
  photoHeight?: number;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const team: TeamMember[] = [
  {
    name: "Alvan Peter Nyakundi",
    role: "Founder & Chief Executive Officer",
    bio: "Started ZUNO after watching too many Kenyan sellers get scammed on WhatsApp. Sets the vision and holds the mission to the same standard as the escrow itself: no shortcuts, no exceptions.",
    photo: teamAlvan,
    photoWidth: 1448,
    photoHeight: 1086,
  },
  {
    name: "Benson Mose",
    role: "Technical Lead",
    bio: "Builds and maintains the systems that hold funds safely at every step of a deal, from first payment to final release.",
    photo: teamBenson,
    photoWidth: 520,
    photoHeight: 650,
  },
  {
    name: "Prince Jeremiah Wanyama",
    role: "Software Engineer",
    bio: "Focused on making ZUNO fast, reliable, and simple to use, whichever way a buyer or seller chooses to pay.",
    photo: teamPrince,
    photoWidth: 784,
    photoHeight: 980,
  },
  {
    name: "Chris Kamau",
    role: "Marketing",
    bio: "Gets the word out to buyers and sellers who are tired of trading on trust alone, and tells ZUNO's story honestly.",
    photo: teamChris,
    photoWidth: 900,
    photoHeight: 1125,
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ZUNO Escrow" },
      {
        name: "description",
        content:
          "ZUNO holds the money so neither side of a deal has to move first. Here's the story and the mission behind it.",
      },
      { property: "og:title", content: "About — ZUNO Escrow" },
      { property: "og:description", content: "The story and mission behind ZUNO Escrow." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40">
        <div className="mx-auto max-w-[820px] px-6 lg:px-8">
          <p className="eyebrow">About</p>
          <h1 className="text-display-lg mt-4">
            Every scam starts the same way: someone has to move first. ZUNO makes sure it's never
            you.
          </h1>
          <p className="mt-6 text-body-lg text-muted-foreground">
            ZUNO started with a specific, boring observation: for every online sale in Kenya that
            closes cleanly, roughly one falls apart because neither side trusts the other with the
            first move. Buyers get scammed. Honest sellers lose sales to people who already have a
            following. Nothing about the internet fixes this on its own — someone has to be the
            neutral third party.
          </p>
          <p className="mt-5 text-muted-foreground">
            That's ZUNO. We hold the money for a few minutes, hours, or days, and we let both
            sides trade with strangers the way they'd trade with family.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-3 lg:px-8">
          <Reveal>
            <div className="rounded-[20px] border border-border bg-surface p-6 shadow-card">
              <p className="eyebrow">Mission</p>
              <p className="mt-3 font-semibold">Make online trade between strangers as safe as buying from your neighbour.</p>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="rounded-[20px] border border-border bg-surface p-6 shadow-card">
              <p className="eyebrow">Where we operate</p>
              <p className="mt-3 font-semibold">Online, wherever buyers and sellers need a neutral third party.</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[20px] border border-border bg-surface p-6 shadow-card">
              <p className="eyebrow">Team</p>
              <p className="mt-3 font-semibold">A founder, two engineers, and a marketer — small enough to move fast, accountable enough to trust.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="eyebrow text-center">Our Team</p>
          <h2 className="text-heading-lg mt-3 text-center">The people behind ZUNO.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 60}>
                <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        width={member.photoWidth}
                        height={member.photoHeight}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-heading-lg font-semibold text-muted-foreground">
                        {initials(member.name)}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <p className="font-semibold">{member.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-[820px] px-6 text-center lg:px-8">
          <p className="eyebrow">One promise</p>
          <p className="mt-4 text-heading-md">
            Hold the money. Not the risk. Every deal, every time, however you send it.
          </p>
        </div>
      </section>

    </>
  );
}
