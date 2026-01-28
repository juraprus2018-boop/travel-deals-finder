import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";
import { getCategoryById } from "@/data/categories";

type Destination = Tables<"destinations">;

interface CountryMapProps {
  destinations: Destination[];
  countryName: string;
  initialCenter: [number, number];
  initialZoom: number;
}

const CountryMap = ({ destinations, countryName, initialCenter, initialZoom }: CountryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: initialCenter,
      zoom: initialZoom,
      scrollZoom: false, // Disable scroll zoom so page scrolls normally
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      // Cleanup markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || destinations.length === 0) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create bounds to fit all markers
    const bounds = new maplibregl.LngLatBounds();

    // Add markers for each destination
    destinations.forEach((destination) => {
      const lat = Number(destination.lat);
      const lng = Number(destination.lng);
      
      if (isNaN(lat) || isNaN(lng)) return;

      bounds.extend([lng, lat]);

      // Create custom marker element
      const markerEl = document.createElement("div");
      markerEl.className = "destination-marker";
      markerEl.innerHTML = `
        <div class="marker-pin">
          <div class="marker-image" style="background-image: url('${destination.hero_image || "/placeholder.svg"}')"></div>
        </div>
      `;
      markerEl.style.cursor = "pointer";

      // Add click handler
      markerEl.addEventListener("click", () => {
        setSelectedDestination(destination);
      });

      // Create and add marker
      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit map to show all markers with padding
    if (destinations.length > 1) {
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 8,
      });
    } else if (destinations.length === 1) {
      const dest = destinations[0];
      map.current.flyTo({
        center: [Number(dest.lng), Number(dest.lat)],
        zoom: 10,
      });
    }
  }, [destinations]);

  const category = selectedDestination ? getCategoryById(selectedDestination.category) : null;

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full rounded-lg" />

      {/* Custom Marker Styles */}
      <style>{`
        .destination-marker {
          width: 48px;
          height: 56px;
        }
        .marker-pin {
          width: 48px;
          height: 48px;
          border-radius: 50% 50% 50% 0;
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%);
          transform: rotate(-45deg);
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 3px solid white;
          transition: transform 0.2s ease;
        }
        .marker-pin:hover {
          transform: rotate(-45deg) scale(1.1);
        }
        .marker-image {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          position: absolute;
          top: 3px;
          left: 3px;
          transform: rotate(45deg);
        }
      `}</style>

      {/* Selected Destination Popup */}
      {selectedDestination && (
        <div className="absolute bottom-4 left-4 right-4 z-10 md:left-auto md:right-4 md:w-80">
          <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedDestination(null)}
              className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image */}
            {selectedDestination.hero_image && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={selectedDestination.hero_image}
                  alt={selectedDestination.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                    {category?.icon} {category?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="font-heading text-lg font-semibold">
                {selectedDestination.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {selectedDestination.short_description}
              </p>
              
              <Link to={`/${selectedDestination.category}/${selectedDestination.slug}`}>
                <Button className="mt-3 w-full gap-2">
                  Bekijk {selectedDestination.name}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute left-3 top-3 rounded-lg bg-card/90 px-3 py-2 text-xs backdrop-blur-sm shadow-sm border">
        <span className="font-medium">{destinations.length} bestemmingen</span> in {countryName}
      </div>
    </div>
  );
};

export default CountryMap;
