import { useParams, Link } from "react-router-dom";
import { MapPin, Plane, Calendar, Info, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useDestinationBySlug } from "@/hooks/useDestinations";
import { getCategoryById } from "@/data/categories";
import PartnerizeWidget from "@/components/flights/PartnerizeWidget";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const FlightsPage = () => {
  const { categorySlug, destinationSlug } = useParams<{
    categorySlug: string;
    destinationSlug: string;
  }>();

  const { data: destination, isLoading } = useDestinationBySlug(destinationSlug || "");
  const category = destination ? getCategoryById(destination.category) : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!destination || !category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Bestemming niet gevonden</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">
            Terug naar home
          </Link>
        </div>
      </Layout>
    );
  }

  // Extract airport code from nearestAirport (e.g., "Rome Fiumicino (FCO)" -> "FCO")
  const nearestAirport = destination.nearest_airport || "";
  const airportMatch = nearestAirport.match(/\(([A-Z]{3})\)/);
  const airportCode = airportMatch ? airportMatch[1] : "";

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-secondary/30 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
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
                  <Link to={`/${categorySlug}`}>{category.namePlural}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/${categorySlug}/${destinationSlug}`}>{destination.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Vliegtickets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              ✈️
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                Vliegtickets naar {destination.name}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {nearestAirport || destination.country}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Info */}
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold">
                  Vliegen naar {destination.name}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Vergelijk vliegtickets van alle luchtvaartmaatschappijen en vind 
                  de goedkoopste vluchten naar {destination.name}.
                </p>

                <div className="space-y-3">
                  {nearestAirport && (
                    <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                      <Plane className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Luchthaven</p>
                        <p className="text-sm text-muted-foreground">
                          {nearestAirport}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Beste tijd om te boeken</p>
                      <p className="text-sm text-muted-foreground">
                        6-8 weken voor vertrek
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="mb-3 font-heading font-semibold">
                  Tips voor goedkope vluchten
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Boek op dinsdag of woensdag voor de laagste prijzen
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Wees flexibel met je reisdata
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Vergelijk ook alternatieve luchthavens
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Check prijzen in incognito modus
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border bg-accent/10 p-6">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <h3 className="mb-1 font-heading font-semibold">Let op</h3>
                    <p className="text-sm text-muted-foreground">
                      De weergegeven prijzen zijn indicatief. Klik door naar de 
                      boekingssite voor actuele prijzen en beschikbaarheid.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link to={`/${categorySlug}/${destinationSlug}/hotels`}>
                  <Button variant="outline" className="w-full">
                    🏨 Zoek Hotels in {destination.name}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Partnerize/KLM Widget */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <PartnerizeWidget
                  destinationName={destination.name}
                  airportCode={airportCode}
                  country={destination.country}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FlightsPage;
