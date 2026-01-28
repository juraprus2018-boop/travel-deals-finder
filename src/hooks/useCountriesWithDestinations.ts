import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CountryWithDestinations {
  country: string;
  country_code: string;
  destination_count: number;
  hero_image: string | null;
  slug: string;
}

// Helper to convert country name to slug
const toSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const useCountriesWithDestinations = () => {
  return useQuery({
    queryKey: ["countries-with-destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("country, country_code, hero_image")
        .eq("is_published", true)
        .order("country");

      if (error) throw error;

      // Group by country and count destinations
      const countryMap = new Map<string, CountryWithDestinations>();
      
      data.forEach((dest) => {
        const existing = countryMap.get(dest.country);
        if (existing) {
          existing.destination_count += 1;
          // Keep first hero image found
        } else {
          countryMap.set(dest.country, {
            country: dest.country,
            country_code: dest.country_code,
            destination_count: 1,
            hero_image: dest.hero_image,
            slug: toSlug(dest.country),
          });
        }
      });

      return Array.from(countryMap.values()).sort((a, b) => 
        a.country.localeCompare(b.country)
      );
    },
  });
};
