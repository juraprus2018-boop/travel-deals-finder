import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Thermometer, Plane, Globe, Coins, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getDestinationBySlug } from "@/data/destinations";
import { getCategoryById } from "@/data/categories";
import { SUB_PAGES } from "@/data/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DestinationPage = () => {
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${destination.heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />
        </div>

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-white/80 hover:text-white">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/${categorySlug}`} className="text-white/80 hover:text-white">
                    {category.namePlural}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{destination.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                {category.icon} {category.name}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5" />
                {destination.country}
              </span>
            </div>

            <h1 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {category.name} {destination.name}
            </h1>

            <p className="text-lg text-white/90 md:text-xl">
              {destination.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links to Sub Pages */}
      <section className="border-b bg-card py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">Ontdek:</span>
            {SUB_PAGES.map((page) => (
              <Link
                key={page.id}
                to={`/${categorySlug}/${destinationSlug}/${page.slug}`}
              >
                <Button variant="outline" size="sm" className="gap-1.5">
                  <span>{page.icon}</span>
                  {page.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Highlights */}
              <div>
                <h2 className="mb-4 font-heading text-2xl font-semibold">
                  Hoogtepunten in {destination.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {destination.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="mb-4 font-heading text-2xl font-semibold">
                  Over {destination.name}
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    {destination.name} is een van de meest geliefde bestemmingen in {destination.country}.{" "}
                    {destination.shortDescription} Of je nu op zoek bent naar cultuur, gastronomie of gewoon een 
                    ontspannen vakantie - {destination.name} heeft het allemaal.
                  </p>
                  <p>
                    De beste tijd om {destination.name} te bezoeken is {destination.bestTimeToVisit.toLowerCase()}.
                    Met gemiddelde temperaturen rond de {destination.averageTemperature} is het weer ideaal voor verkenning.
                  </p>
                </div>
              </div>

              {/* Sub Pages Cards */}
              <div>
                <h2 className="mb-6 font-heading text-2xl font-semibold">
                  Plan je reis naar {destination.name}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {SUB_PAGES.map((page) => (
                    <Link
                      key={page.id}
                      to={`/${categorySlug}/${destinationSlug}/${page.slug}`}
                      className="group rounded-xl border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
                    >
                      <div className="mb-3 text-3xl">{page.icon}</div>
                      <h3 className="mb-1 font-heading font-semibold group-hover:text-primary">
                        {page.title}
                      </h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        {page.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Bekijken
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Info Card */}
            <div>
              <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-heading text-lg font-semibold">
                  Praktische Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Beste reistijd</p>
                      <p className="text-sm text-muted-foreground">
                        {destination.bestTimeToVisit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Thermometer className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Temperatuur</p>
                      <p className="text-sm text-muted-foreground">
                        {destination.averageTemperature}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Taal</p>
                      <p className="text-sm text-muted-foreground">
                        {destination.language}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Coins className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Valuta</p>
                      <p className="text-sm text-muted-foreground">
                        {destination.currency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Plane className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Luchthaven</p>
                      <p className="text-sm text-muted-foreground">
                        {destination.nearestAirport}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Link to={`/${categorySlug}/${destinationSlug}/hotels`}>
                    <Button className="w-full">
                      🏨 Zoek Hotels
                    </Button>
                  </Link>
                  <Link to={`/${categorySlug}/${destinationSlug}/vliegtickets`}>
                    <Button variant="outline" className="w-full">
                      ✈️ Zoek Vluchten
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DestinationPage;
