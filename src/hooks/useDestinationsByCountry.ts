import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Destination = Tables<"destinations">;

export const useDestinationsByCountry = (country: string) => {
  return useQuery({
    queryKey: ["destinations", "country", country],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("country", country)
        .eq("is_published", true)
        .order("name");

      if (error) throw error;
      return data as Destination[];
    },
    enabled: !!country,
  });
};
