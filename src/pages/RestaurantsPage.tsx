import { useParams, Link } from "react-router-dom";
import { MapPin, Utensils, Euro, Star, Phone, Clock, ExternalLink, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useDestinationBySlug } from "@/hooks/useDestinations";
import { useRestaurantsByDestination } from "@/hooks/useRestaurants";
import { getCategoryById } from "@/data/categories";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const RestaurantsPage = () => {
  const { categorySlug, destinationSlug } = useParams<{
    categorySlug: string;
    destinationSlug: string;
  }>();

  const { data: destination, isLoading: isLoadingDestination } = useDestinationBySlug(destinationSlug || "");
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useRestaurantsByDestination(destination?.id);
  const category = destination ? getCategoryById(destination.category) : null;

  const isLoading = isLoadingDestination || isLoadingRestaurants;

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

  const getPriceLabel = (level: number | null) => {
    if (!level) return null;
    return "€".repeat(level);
  };

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
                {restaurants.length > 0 ? `Top ${restaurants.length} eetgelegenheden` : "Eetgelegenheden"}
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

                {restaurants.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nog geen restaurants beschikbaar voor deze bestemming.</p>
                  </div>
                ) : (
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
                        {restaurant.photo_url && (
                          <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg sm:block">
                            <img
                              src={restaurant.photo_url}
                              alt={restaurant.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-heading font-semibold">
                              {restaurant.name}
                            </h3>
                            {restaurant.google_maps_url && (
                              <a
                                href={restaurant.google_maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 text-primary hover:text-primary/80"
                                title="Bekijk op Google Maps"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          
                          {restaurant.address && (
                            <p className="mb-3 text-sm text-muted-foreground">
                              {restaurant.address}
                            </p>
                          )}

                          {/* Meta info */}
                          <div className="mb-3 flex flex-wrap gap-3 text-xs">
                            {restaurant.rating && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                {restaurant.rating} ({restaurant.user_ratings_total?.toLocaleString()})
                              </span>
                            )}
                            {restaurant.price_level && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Euro className="h-3.5 w-3.5" />
                                {getPriceLabel(restaurant.price_level)}
                              </span>
                            )}
                            {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Utensils className="h-3.5 w-3.5" />
                                {restaurant.cuisine_types.slice(0, 2).join(", ")}
                              </span>
                            )}
                          </div>

                          {/* Contact & Hours */}
                          <div className="flex flex-wrap gap-4 text-xs">
                            {restaurant.phone && (
                              <a 
                                href={`tel:${restaurant.phone}`}
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                {restaurant.phone}
                              </a>
                            )}
                            {restaurant.website && (
                              <a
                                href={restaurant.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Website
                              </a>
                            )}
                            {restaurant.is_open_now !== null && (
                              <span className={`flex items-center gap-1 ${restaurant.is_open_now ? 'text-green-600' : 'text-muted-foreground'}`}>
                                <Clock className="h-3.5 w-3.5" />
                                {restaurant.is_open_now ? 'Nu geopend' : 'Gesloten'}
                              </span>
                            )}
                          </div>

                          {/* Opening hours expandable */}
                          {restaurant.opening_hours && restaurant.opening_hours.length > 0 && (
                            <details className="mt-3">
                              <summary className="cursor-pointer text-xs text-primary hover:underline">
                                Bekijk openingstijden
                              </summary>
                              <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                                {restaurant.opening_hours.map((hours, i) => (
                                  <li key={i}>{hours}</li>
                                ))}
                              </ul>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
