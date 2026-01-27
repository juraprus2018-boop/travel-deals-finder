import { useParams, Link } from "react-router-dom";
import { MapPin, Hotel, Star, Wifi, Car, Coffee } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getDestinationBySlug } from "@/data/destinations";
import { getCategoryById } from "@/data/categories";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const HotelsPage = () => {
  const { categorySlug, destinationSlug } = useParams<{
    categorySlug: string;
    destinationSlug: string;
  }>();

  const destination = getDestinationBySlug(destinationSlug || "");
  const category = destination ? getCategoryById(destination.category) : null;

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

  // Stay22 affiliate map URL
  const stay22MapUrl = `https://www.stay22.com/embed/gm?aid=lovable&lat=${destination.coordinates.lat}&lng=${destination.coordinates.lng}&zoom=14&checkin=&checkout=&guests=2&currency=EUR&lang=nl`;

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
                <BreadcrumbPage>Hotels</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              🏨
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                Hotels in {destination.name}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {destination.country}
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
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold">
                  Overnachten in {destination.name}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Vind de beste hotels, appartementen en vakantiewoningen in {destination.name}. 
                  Gebruik de interactieve kaart om accommodaties te vergelijken op basis van 
                  locatie en prijs.
                </p>
                
                <h3 className="mb-3 text-sm font-medium">Populaire voorzieningen</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">
                    <Wifi className="h-3.5 w-3.5" /> Gratis WiFi
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">
                    <Coffee className="h-3.5 w-3.5" /> Ontbijt
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">
                    <Car className="h-3.5 w-3.5" /> Parkeren
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">
                    <Star className="h-3.5 w-3.5" /> Zwembad
                  </span>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="mb-3 font-heading font-semibold">Tips voor {destination.name}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Boek 2-3 maanden van tevoren voor de beste prijzen
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Het centrum is ideaal voor bezienswaardigheden
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Check de reviews voor recente ervaringen
                  </li>
                </ul>
              </div>

              <Link to={`/${categorySlug}/${destinationSlug}/bezienswaardigheden`}>
                <Button variant="outline" className="w-full">
                  🎯 Bekijk Bezienswaardigheden
                </Button>
              </Link>
            </div>

            {/* Right Column - Stay22 Map */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 overflow-hidden rounded-xl border bg-card">
                <div className="border-b bg-secondary/30 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hotel className="h-5 w-5 text-primary" />
                      <span className="font-medium">Hotels & Accommodaties</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Powered by Stay22</span>
                  </div>
                </div>
                <iframe
                  src={stay22MapUrl}
                  width="100%"
                  height="600"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Hotels in ${destination.name}`}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HotelsPage;
