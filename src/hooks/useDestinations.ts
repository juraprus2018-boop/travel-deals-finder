import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Destination = Tables<"destinations">;

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("is_published", true)
        .order("name");

      if (error) throw error;
      return data as Destination[];
    },
  });
};

export const useDestinationsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["destinations", "category", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("category", category as "stedentrips" | "strandvakanties" | "wintersport" | "vakantieparken" | "pretparken")
        .eq("is_published", true)
        .order("name");

      if (error) throw error;
      return data as Destination[];
    },
    enabled: !!category,
  });
};

export const useDestinationBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["destinations", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      return data as Destination;
    },
    enabled: !!slug,
  });
};

export const usePopularDestinations = (limit: number = 6) => {
  return useQuery({
    queryKey: ["destinations", "popular", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Destination[];
    },
  });
};
