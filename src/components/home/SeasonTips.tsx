import { Link } from "react-router-dom";
import { Sun, Snowflake, Leaf, Flower } from "lucide-react";

const seasons = [
  {
    name: "Lente",
    icon: Flower,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    months: "Maart - Mei",
    destinations: [
      { name: "Amsterdam", slug: "/stedentrips/amsterdam", tip: "Tulpenseizoen" },
      { name: "Parijs", slug: "/stedentrips/parijs", tip: "Bloesem in de parken" },
    ],
  },
  {
    name: "Zomer",
    icon: Sun,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    months: "Juni - Augustus",
    destinations: [
      { name: "Santorini", slug: "/strandvakanties/santorini", tip: "Perfect strandweer" },
      { name: "Mallorca", slug: "/strandvakanties/mallorca", tip: "Hoogseizoen" },
    ],
  },
  {
    name: "Herfst",
    icon: Leaf,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    months: "September - November",
    destinations: [
      { name: "Rome", slug: "/stedentrips/rome", tip: "Minder drukte" },
      { name: "Barcelona", slug: "/stedentrips/barcelona", tip: "Aangenaam weer" },
    ],
  },
  {
    name: "Winter",
    icon: Snowflake,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    months: "December - Februari",
    destinations: [
      { name: "Praag", slug: "/stedentrips/praag", tip: "Kerstmarkten" },
      { name: "Alpen", slug: "/wintersport", tip: "Skiën" },
    ],
  },
];

const SeasonTips = () => {
  // Determine current season
  const month = new Date().getMonth();
  const currentSeasonIndex = month >= 2 && month <= 4 ? 0 : month >= 5 && month <= 7 ? 1 : month >= 8 && month <= 10 ? 2 : 3;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
            Seizoenstips
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            De beste bestemmingen per seizoen. Reis slim en beleef je bestemming op het perfecte moment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {seasons.map((season, index) => {
            const Icon = season.icon;
            const isCurrent = index === currentSeasonIndex;

            return (
              <div
                key={season.name}
                className={`rounded-2xl border p-6 transition-all ${
                  isCurrent 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "bg-card hover:border-primary/50"
                }`}
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${season.bgColor}`}>
                  <Icon className={`h-6 w-6 ${season.color}`} />
                </div>

                <h3 className="mb-1 font-heading text-xl font-semibold">
                  {season.name}
                  {isCurrent && (
                    <span className="ml-2 text-xs font-normal text-primary">Nu</span>
                  )}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">{season.months}</p>

                <div className="space-y-2">
                  {season.destinations.map((dest) => (
                    <Link
                      key={dest.name}
                      to={dest.slug}
                      className="block rounded-lg bg-secondary/50 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      <span className="font-medium">{dest.name}</span>
                      <span className="ml-2 text-muted-foreground">• {dest.tip}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SeasonTips;
