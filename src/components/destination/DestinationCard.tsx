import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Destination } from "@/data/types";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  return (
    <Link
      to={`/${destination.category}/${destination.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{destination.country}</span>
        </div>

        <h3 className="mb-2 font-heading text-xl font-semibold group-hover:text-primary">
          {destination.name}
        </h3>

        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
          {destination.shortDescription}
        </p>

        {/* Highlights */}
        <div className="mb-4 flex flex-wrap gap-1">
          {destination.highlights.slice(0, 3).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-sm font-medium text-primary">
          <span>Bekijk bestemming</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
