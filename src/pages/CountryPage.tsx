import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowRight, Loader2, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useDestinationsByCountry } from "@/hooks/useDestinationsByCountry";
import { useCountriesWithDestinations } from "@/hooks/useCountriesWithDestinations";
import { useCountryContent } from "@/hooks/useCountryContent";
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
  const { data: destinations = [], isLoading } = useDestinationsByCountry(countrySlug || "");
  const { data: allCountries = [] } = useCountriesWithDestinations();
  const { data: countryContent } = useCountryContent(countrySlug || "");
  
  // Get country info from first destination or from countries list
  const countryInfo = destinations[0] 
    ? { name: destinations[0].country, code: destinations[0].country_code }
    : allCountries.find(c => c.slug === countrySlug)
      ? { name: allCountries.find(c => c.slug === countrySlug)!.country, code: allCountries.find(c => c.slug === countrySlug)!.country_code }
      : null;

  if (!isLoading && !countryInfo && destinations.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Land niet gevonden</h1>
          <Link to="/landen" className="mt-4 text-primary hover:underline">
            Bekijk alle landen
          </Link>
        </div>
      </Layout>
    );
  }
  
  const countryName = countryInfo?.name || "Laden...";
  const heroImage = countryContent?.hero_image || destinations[0]?.hero_image;
  
  // Calculate center from destinations or use default
  const mapCenter: [number, number] = destinations.length > 0
    ? [
        destinations.reduce((sum, d) => sum + Number(d.lng), 0) / destinations.length,
        destinations.reduce((sum, d) => sum + Number(d.lat), 0) / destinations.length,
      ]
    : [10, 50]; // Default Europe center

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={countryName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          </div>
        )}
        <div className={`container relative mx-auto px-4 ${heroImage ? 'py-16 md:py-24' : 'py-8'}`}>
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className={heroImage ? 'text-foreground/80 hover:text-foreground' : ''}>Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/landen" className={heroImage ? 'text-foreground/80 hover:text-foreground' : ''}>Landen</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{countryName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl font-bold md:text-4xl lg:text-5xl">
              {countryContent?.meta_title || `Bestemmingen in ${countryName}`}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {isLoading ? "Laden..." : `${destinations.length} bestemmingen om te ontdekken`}
            </p>
            
            {countryContent?.intro_text && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {countryContent.intro_text}
              </p>
            )}

            {countryContent?.highlights && countryContent.highlights.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {countryContent.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium"
                  >
                    <Star className="h-3.5 w-3.5 text-primary" />
                    {highlight}
                  </span>
                ))}
              </div>
            )}
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
              countryName={countryName}
              initialCenter={mapCenter}
              initialZoom={6}
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
                Alle bestemmingen in {countryName}
              </h2>
              <p className="text-muted-foreground">
                Klik op een bestemming voor meer informatie
              </p>
            </div>
            
            {/* Other countries links */}
            <div className="flex flex-wrap gap-2">
              {allCountries
                .filter((c) => c.slug !== countrySlug)
                .slice(0, 5)
                .map((c) => (
                  <Link
                    key={c.slug}
                    to={`/land/${c.slug}`}
                    className="rounded-full bg-secondary px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {c.country}
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
                Nog geen bestemmingen in {countryName}.
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

      {/* SEO Content Section */}
      {countryContent?.seo_content && (
        <section className="border-t bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg mx-auto max-w-4xl">
              <div 
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: countryContent.seo_content
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>')
                    .replace(/## (.*)/g, '</p><h2 class="font-heading text-xl font-semibold text-foreground mt-8 mb-4">$1</h2><p>')
                    .replace(/### (.*)/g, '</p><h3 class="font-heading text-lg font-semibold text-foreground mt-6 mb-3">$1</h3><p>')
                }}
              />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default CountryPage;
