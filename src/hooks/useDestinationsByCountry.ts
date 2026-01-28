import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Destination = Tables<"destinations">;

// Helper to convert country name to slug
const toSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const useDestinationsByCountry = (countrySlug: string) => {
  return useQuery({
    queryKey: ["destinations", "country", countrySlug],
    queryFn: async () => {
      // First get all published destinations
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("is_published", true)
        .order("name");

      if (error) throw error;
      
      // Filter by slug match
      return (data as Destination[]).filter(
        (d) => toSlug(d.country) === countrySlug
      );
    },
    enabled: !!countrySlug,
  });
};
