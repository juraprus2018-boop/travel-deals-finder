import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchDestinations } from "@/data/destinations";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchDestinations>>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchDestinations(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectDestination = (categorySlug: string, destinationSlug: string) => {
    setShowResults(false);
    setSearchQuery("");
    navigate(`/${categorySlug}/${destinationSlug}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 hero-gradient opacity-80" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Ontdek de mooiste bestemmingen in{" "}
            <span className="text-travel-sand">Europa</span>
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Van bruisende steden tot zonovergoten stranden. Vind jouw perfecte vakantie 
            en boek met de beste deals.
          </p>

          {/* Search Box */}
          <div className="relative mx-auto max-w-xl">
            <div className="glass flex items-center gap-2 rounded-2xl p-2 shadow-travel-xl">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-background px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Waar wil je naartoe? (bijv. Rome, Mallorca...)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="rounded-xl px-6">
                Zoeken
              </Button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-card shadow-travel-xl">
                {searchResults.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => handleSelectDestination(dest.category, dest.slug)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{dest.name}</p>
                      <p className="text-sm text-muted-foreground">{dest.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white">
            <div className="text-center">
              <p className="font-heading text-3xl font-bold">100+</p>
              <p className="text-sm text-white/80">Bestemmingen</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-3xl font-bold">25+</p>
              <p className="text-sm text-white/80">Landen</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-3xl font-bold">50k+</p>
              <p className="text-sm text-white/80">Tevreden Reizigers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
