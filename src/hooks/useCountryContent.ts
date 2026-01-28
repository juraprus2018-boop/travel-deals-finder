import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CountryContent {
  id: string;
  country_slug: string;
  country_name: string;
  hero_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  intro_text: string | null;
  seo_content: string | null;
  highlights: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useCountryContent = (countrySlug: string) => {
  return useQuery({
    queryKey: ["country-content", countrySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("country_content")
        .select("*")
        .eq("country_slug", countrySlug)
        .maybeSingle();

      if (error) throw error;
      return data as CountryContent | null;
    },
    enabled: !!countrySlug,
  });
};

export const useAllCountryContent = () => {
  return useQuery({
    queryKey: ["all-country-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("country_content")
        .select("*")
        .order("country_name");

      if (error) throw error;
      return data as CountryContent[];
    },
  });
};

export const useUpsertCountryContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: Partial<CountryContent> & { country_slug: string; country_name: string }) => {
      const { data, error } = await supabase
        .from("country_content")
        .upsert(content, { onConflict: "country_slug" })
        .select()
        .single();

      if (error) throw error;
      return data as CountryContent;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["country-content", data.country_slug] });
      queryClient.invalidateQueries({ queryKey: ["all-country-content"] });
    },
  });
};

export const useDeleteCountryContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("country_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-country-content"] });
    },
  });
};
