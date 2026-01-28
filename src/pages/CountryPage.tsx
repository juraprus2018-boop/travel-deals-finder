import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getCountryBySlug, COUNTRIES } from "@/data/countries";
import { useDestinationsByCountry } from "@/hooks/useDestinationsByCountry";
import { getCategoryById } from "@/data/categories";
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

  // Generate OpenStreetMap URL with markers
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${country.coordinates.lng - 5}%2C${country.coordinates.lat - 4}%2C${country.coordinates.lng + 5}%2C${country.coordinates.lat + 4}&layer=mapnik&marker=${country.coordinates.lat}%2C${country.coordinates.lng}`;

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

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Destinations List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-heading text-xl font-semibold">Alle bestemmingen</h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : destinations.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {destinations.map((destination) => {
                    const category = getCategoryById(destination.category);
                    return (
                      <Link
                        key={destination.id}
                        to={`/${destination.category}/${destination.slug}`}
                        className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-primary hover:bg-secondary/50"
                      >
                        {destination.hero_image && (
                          <img
                            src={destination.hero_image}
                            alt={destination.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{destination.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {category?.icon} {category?.name}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground py-4">
                  Nog geen bestemmingen in {country.name}.
                </p>
              )}

              {/* Other countries */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-heading text-sm font-semibold mb-3">Andere landen</h3>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.filter((c) => c.slug !== countrySlug)
                    .slice(0, 8)
                    .map((c) => (
                      <Link
                        key={c.slug}
                        to={`/land/${c.slug}`}
                        className="rounded-full bg-secondary px-3 py-1 text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        {c.name}
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Column - Map & Destination Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="overflow-hidden rounded-xl border bg-card">
                <div className="border-b bg-secondary/30 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">Kaart van {country.name}</span>
                    </div>
                    <a
                      href={`https://www.openstreetmap.org/#map=${country.zoom}/${country.coordinates.lat}/${country.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      Grotere kaart
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  title={`Kaart van ${country.name}`}
                  className="w-full"
                />
              </div>

              {/* Destination Cards Grid */}
              {destinations.length > 0 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-4">
                    Ontdek {country.name}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {destinations.map((destination) => {
                      const category = getCategoryById(destination.category);
                      return (
                        <Link
                          key={destination.id}
                          to={`/${destination.category}/${destination.slug}`}
                          className="group overflow-hidden rounded-xl border bg-card transition-all hover:border-primary hover:shadow-md"
                        >
                          {destination.hero_image && (
                            <div className="relative aspect-[16/9] overflow-hidden">
                              <img
                                src={destination.hero_image}
                                alt={destination.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
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
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CountryPage;
