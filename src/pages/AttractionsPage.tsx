import { useParams, Link } from "react-router-dom";
import { MapPin, Camera, Clock, Euro, Star, ThumbsUp, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useDestinationBySlug } from "@/hooks/useDestinations";
import { getCategoryById } from "@/data/categories";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock attractions data - in production would be from AI-generated database
const getAttractions = (destinationName: string) => [
  {
    id: 1,
    name: `Top attractie van ${destinationName}`,
    description: `De meest bezochte attractie van ${destinationName}. Een absolute must-see voor elke bezoeker.`,
    duration: "2-3 uur",
    price: "€15-25",
    rating: 4.8,
    reviews: 12500,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80",
    tip: "Koop tickets online om wachtrijen te vermijden",
  },
  {
    id: 2,
    name: `Historisch centrum ${destinationName}`,
    description: "Wandel door de prachtige historische straten vol cultuur en geschiedenis.",
    duration: "3-4 uur",
    price: "Gratis",
    rating: 4.7,
    reviews: 8900,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80",
    tip: "Neem een gratis stadswandeling voor meer achtergrond",
  },
  {
    id: 3,
    name: `Lokale markt`,
    description: "Proef lokale specialiteiten en ontdek authentieke producten op deze levendige markt.",
    duration: "1-2 uur",
    price: "Gratis toegang",
    rating: 4.6,
    reviews: 5600,
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&q=80",
    tip: "Bezoek in de ochtend voor de beste producten",
  },
  {
    id: 4,
    name: `Museum van ${destinationName}`,
    description: "Een wereldberoemd museum met indrukwekkende collecties kunst en geschiedenis.",
    duration: "3-4 uur",
    price: "€18-22",
    rating: 4.9,
    reviews: 15200,
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&q=80",
    tip: "Eerste zondag van de maand gratis toegang",
  },
  {
    id: 5,
    name: `Panoramisch uitzichtpunt`,
    description: "Geniet van een adembenemend uitzicht over de hele stad en omgeving.",
    duration: "1-2 uur",
    price: "€8-12",
    rating: 4.7,
    reviews: 7800,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
    tip: "Kom bij zonsondergang voor de mooiste foto's",
  },
];

const AttractionsPage = () => {
  const { categorySlug, destinationSlug } = useParams<{
    categorySlug: string;
    destinationSlug: string;
  }>();

  const { data: destination, isLoading } = useDestinationBySlug(destinationSlug || "");
  const category = destination ? getCategoryById(destination.category) : null;
  const attractions = destination ? getAttractions(destination.name) : [];

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
                <BreadcrumbPage>Bezienswaardigheden</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              🎯
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                Bezienswaardigheden in {destination.name}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Top {attractions.length} dingen om te doen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Attractions List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-2 font-heading text-xl font-semibold">
                  De beste bezienswaardigheden
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Ontdek de mooiste plekken en activiteiten in {destination.name}. 
                  Van historische monumenten tot verborgen parels.
                </p>

                <div className="space-y-6">
                  {attractions.map((attraction, index) => (
                    <div
                      key={attraction.id}
                      className="flex gap-4 rounded-lg border bg-secondary/20 p-4 transition-colors hover:bg-secondary/40"
                    >
                      {/* Number */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {index + 1}
                      </div>

                      {/* Image */}
                      <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg sm:block">
                        <img
                          src={attraction.image}
                          alt={attraction.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="mb-1 font-heading font-semibold">
                          {attraction.name}
                        </h3>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {attraction.description}
                        </p>

                        {/* Meta info */}
                        <div className="mb-3 flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {attraction.duration}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Euro className="h-3.5 w-3.5" />
                            {attraction.price}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            {attraction.rating} ({attraction.reviews.toLocaleString()})
                          </span>
                        </div>

                        {/* Tip */}
                        <div className="flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2">
                          <ThumbsUp className="mt-0.5 h-4 w-4 text-primary" />
                          <p className="text-xs text-foreground">{attraction.tip}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 font-heading font-semibold">
                    Boek tours & tickets
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Sla de wachtrij over en boek je tickets online. Bekijk rondleidingen 
                    en activiteiten met een lokale gids.
                  </p>
                  <Button className="w-full gap-2">
                    <Camera className="h-4 w-4" />
                    Bekijk Tours
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Powered by GetYourGuide
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 font-heading font-semibold">
                    Ook interessant
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to={`/${categorySlug}/${destinationSlug}/hotels`}
                      className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      🏨 Hotels in {destination.name}
                    </Link>
                    <Link
                      to={`/${categorySlug}/${destinationSlug}/vliegtickets`}
                      className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      ✈️ Vluchten naar {destination.name}
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border bg-accent/10 p-6">
                  <h3 className="mb-2 font-heading font-semibold text-accent-foreground">
                    💡 Insider tip
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Plan je bezoek aan populaire attracties vroeg in de ochtend of 
                    laat in de middag om de drukte te vermijden. De meeste toeristen 
                    bezoeken tussen 11:00 en 14:00.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AttractionsPage;
