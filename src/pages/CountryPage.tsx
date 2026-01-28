import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getCountryBySlug, COUNTRIES } from "@/data/countries";
import { useDestinationsByCountry } from "@/hooks/useDestinationsByCountry";
import { getCategoryById } from "@/data/categories";
import CountryMap from "@/components/maps/CountryMap";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CountryPage = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const country = getCountryBySlug(countrySlug || "");
  const { data: destinations = [], isLoading } = useDestinationsByCountry(country?.name || "");

  if (!country) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Land niet gevonden</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">
            Terug naar home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-secondary/30 py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/landen">Landen</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{country.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              🗺️
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                Bestemmingen in {country.name}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {isLoading ? "Laden..." : `${destinations.length} bestemmingen`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Full Width */}
      <section className="relative">
        <div className="h-[500px] md:h-[600px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center bg-secondary/20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <CountryMap
              destinations={destinations}
              countryName={country.name}
              initialCenter={[country.coordinates.lng, country.coordinates.lat]}
              initialZoom={country.zoom}
            />
          )}
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold">
                Alle bestemmingen in {country.name}
              </h2>
              <p className="text-muted-foreground">
                Klik op een bestemming voor meer informatie
              </p>
            </div>
            
            {/* Other countries links */}
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.filter((c) => c.slug !== countrySlug)
                .slice(0, 5)
                .map((c) => (
                  <Link
                    key={c.slug}
                    to={`/land/${c.slug}`}
                    className="rounded-full bg-secondary px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              <Link
                to="/landen"
                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Alle landen →
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destinations.map((destination) => {
                const category = getCategoryById(destination.category);
                return (
                  <Link
                    key={destination.id}
                    to={`/${destination.category}/${destination.slug}`}
                    className="group overflow-hidden rounded-xl border bg-card transition-all hover:border-primary hover:shadow-lg"
                  >
                    {destination.hero_image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={destination.hero_image}
                          alt={destination.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute left-2 top-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                            {category?.icon} {category?.name}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-heading font-semibold group-hover:text-primary">
                        {destination.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {destination.short_description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                        <span>Bekijk bestemming</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-secondary/50 p-12 text-center">
              <p className="text-lg text-muted-foreground">
                Nog geen bestemmingen in {country.name}.
              </p>
              <Link
                to="/landen"
                className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
              >
                Bekijk andere landen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CountryPage;
