import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

            {/* Right Column - Map */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 overflow-hidden rounded-xl border bg-card">
                <div className="border-b bg-secondary/30 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">Kaart van {country.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Klik op een marker voor meer info
                    </span>
                  </div>
                </div>
                <MapContainer
                  center={[country.coordinates.lat, country.coordinates.lng]}
                  zoom={country.zoom}
                  style={{ height: "600px", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {destinations.map((destination) => (
                    <Marker
                      key={destination.id}
                      position={[Number(destination.lat), Number(destination.lng)]}
                      icon={customIcon}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          {destination.hero_image && (
                            <img
                              src={destination.hero_image}
                              alt={destination.name}
                              className="w-full h-24 object-cover rounded-t-lg mb-2"
                            />
                          )}
                          <h3 className="font-semibold text-base">{destination.name}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {destination.short_description}
                          </p>
                          <Link
                            to={`/${destination.category}/${destination.slug}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Bekijk bestemming
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CountryPage;
