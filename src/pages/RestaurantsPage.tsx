import { useParams, Link } from "react-router-dom";
import { MapPin, Utensils, Clock, Euro, Star, ThumbsUp, Loader2 } from "lucide-react";
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

// Mock restaurants data - in production would be from AI-generated database
const getRestaurants = (destinationName: string) => [
  {
    id: 1,
    name: `Restaurant ${destinationName} Klassiek`,
    description: `Authentieke lokale keuken met moderne twist. Een van de beste restaurants in ${destinationName}.`,
    cuisine: "Lokaal & Traditioneel",
    priceRange: "€€€",
    rating: 4.8,
    reviews: 2150,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    tip: "Reserveer minimaal een week van tevoren, vooral in het weekend",
  },
  {
    id: 2,
    name: "Trattoria del Porto",
    description: "Gezellige sfeer met verse vis en zeevruchten. Perfect voor een romantisch diner.",
    cuisine: "Vis & Zeevruchten",
    priceRange: "€€",
    rating: 4.7,
    reviews: 1890,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    tip: "Vraag naar de dagverse specialiteit",
  },
  {
    id: 3,
    name: "Streetfood Market",
    description: "Culinaire markt met diverse kraampjes. Ideaal om verschillende smaken te proeven.",
    cuisine: "Streetfood & Mix",
    priceRange: "€",
    rating: 4.6,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80",
    tip: "Bezoek doordeweeks om de drukte te vermijden",
  },
  {
    id: 4,
    name: "Vista Rooftop Restaurant",
    description: "Fine dining met adembenemend uitzicht over de stad. Perfecte locatie voor speciale gelegenheden.",
    cuisine: "Fine Dining",
    priceRange: "€€€€",
    rating: 4.9,
    reviews: 980,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    tip: "Boek een tafel bij zonsondergang voor de beste ervaring",
  },
  {
    id: 5,
    name: "Café Central",
    description: "Charmant café voor ontbijt en lunch. Bekend om de verse gebakjes en koffie.",
    cuisine: "Café & Lunch",
    priceRange: "€",
    rating: 4.5,
    reviews: 4100,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80",
    tip: "Probeer de huisgemaakte taart van de dag",
  },
];

const RestaurantsPage = () => {
  const { categorySlug, destinationSlug } = useParams<{
    categorySlug: string;
    destinationSlug: string;
  }>();

  const { data: destination, isLoading } = useDestinationBySlug(destinationSlug || "");
  const category = destination ? getCategoryById(destination.category) : null;
  const restaurants = destination ? getRestaurants(destination.name) : [];

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
                <BreadcrumbPage>Restaurants</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              🍽️
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                Restaurants in {destination.name}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Top {restaurants.length} eetgelegenheden
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Restaurants List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-2 font-heading text-xl font-semibold">
                  De beste restaurants
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Ontdek de lekkerste eetgelegenheden in {destination.name}. 
                  Van lokale specialiteiten tot internationale keukens.
                </p>

                <div className="space-y-6">
                  {restaurants.map((restaurant, index) => (
                    <div
                      key={restaurant.id}
                      className="flex gap-4 rounded-lg border bg-secondary/20 p-4 transition-colors hover:bg-secondary/40"
                    >
                      {/* Number */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {index + 1}
                      </div>

                      {/* Image */}
                      <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg sm:block">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="mb-1 font-heading font-semibold">
                          {restaurant.name}
                        </h3>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {restaurant.description}
                        </p>

                        {/* Meta info */}
                        <div className="mb-3 flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Utensils className="h-3.5 w-3.5" />
                            {restaurant.cuisine}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Euro className="h-3.5 w-3.5" />
                            {restaurant.priceRange}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            {restaurant.rating} ({restaurant.reviews.toLocaleString()})
                          </span>
                        </div>

                        {/* Tip */}
                        <div className="flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2">
                          <ThumbsUp className="mt-0.5 h-4 w-4 text-primary" />
                          <p className="text-xs text-foreground">{restaurant.tip}</p>
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
                    Reserveer een tafel
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Boek direct een tafel bij de beste restaurants in {destination.name}. 
                    Vergelijk prijzen en lees beoordelingen.
                  </p>
                  <Button className="w-full gap-2">
                    <Utensils className="h-4 w-4" />
                    Zoek Restaurants
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Powered by TheFork
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
                      to={`/${categorySlug}/${destinationSlug}/bezienswaardigheden`}
                      className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      🎯 Bezienswaardigheden
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
                    💡 Eet tip
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Eet zoals de locals! Lunch is vaak het hoofdmaal en veel 
                    restaurants bieden een voordelig dagmenu aan. Avondeten 
                    begint meestal pas na 20:00 uur.
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

export default RestaurantsPage;
