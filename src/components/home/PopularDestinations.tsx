import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPopularDestinations } from "@/data/destinations";
import { getCategoryById } from "@/data/categories";

const PopularDestinations = () => {
  const popularDestinations = getPopularDestinations(6);

  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="mb-2 font-heading text-3xl font-bold md:text-4xl">
              Populaire Bestemmingen
            </h2>
            <p className="text-muted-foreground">
              De favoriete bestemmingen van onze reizigers
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/stedentrips" className="flex items-center gap-2">
              Bekijk alles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularDestinations.map((destination) => {
            const category = getCategoryById(destination.category);
            
            return (
              <Link
                key={destination.id}
                to={`/${destination.category}/${destination.slug}`}
                className="group overflow-hidden rounded-2xl bg-card shadow-sm card-hover"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={destination.heroImage}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      {category?.icon} {category?.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{destination.country}</span>
                  </div>
                  
                  <h3 className="mb-2 font-heading text-xl font-semibold group-hover:text-primary">
                    {destination.name}
                  </h3>
                  
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {destination.shortDescription}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground">(2.4k reviews)</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
