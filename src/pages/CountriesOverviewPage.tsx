import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Loader2, Globe } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useCountriesWithDestinations } from "@/hooks/useCountriesWithDestinations";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CountriesOverviewPage = () => {
  const { data: countries = [], isLoading } = useCountriesWithDestinations();

  const totalDestinations = countries.reduce((sum, c) => sum + c.destination_count, 0);

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-secondary/20 py-12 md:py-16">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container relative mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Landen</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl shadow-lg">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold md:text-4xl">
                  Ontdek Europa per Land
                </h1>
                <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {isLoading ? "Laden..." : `${totalDestinations} bestemmingen in ${countries.length} landen`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : countries.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {countries.map((country) => (
                <Link
                  key={country.slug}
                  to={`/land/${country.slug}`}
                  className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:border-primary hover:shadow-xl"
                >
                  {/* Background Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {country.hero_image ? (
                      <img
                        src={country.hero_image}
                        alt={country.country}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary">
                        <Globe className="h-16 w-16 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    
                    {/* Country Code Badge */}
                    <div className="absolute right-3 top-3">
                      <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        {country.country_code}
                      </span>
                    </div>

                    {/* Country Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading text-xl font-bold text-white">
                        {country.country}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {country.destination_count} {country.destination_count === 1 ? "bestemming" : "bestemmingen"}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-t bg-secondary/30 p-3">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                      Bekijk alle bestemmingen
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-secondary/50 p-12 text-center">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg text-muted-foreground">
                Nog geen bestemmingen gevonden.
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
              >
                Terug naar home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CountriesOverviewPage;
