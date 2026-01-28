import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Restaurant = Tables<"restaurants">;

export const useRestaurantsByDestination = (destinationId: string | undefined) => {
  return useQuery({
    queryKey: ["restaurants", destinationId],
    queryFn: async () => {
      if (!destinationId) return [];
      
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("destination_id", destinationId)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Restaurant[];
    },
    enabled: !!destinationId,
  });
};

export const useAdminRestaurantsByDestination = (destinationId: string | undefined) => {
  return useQuery({
    queryKey: ["restaurants", "admin", destinationId],
    queryFn: async () => {
      if (!destinationId) return [];
      
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("destination_id", destinationId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Restaurant[];
    },
    enabled: !!destinationId,
  });
};

export const useFetchRestaurantsFromGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      destinationId,
      destinationName,
      country,
      lat,
      lng,
    }: {
      destinationId: string;
      destinationName: string;
      country: string;
      lat: number;
      lng: number;
    }) => {
      const { data, error } = await supabase.functions.invoke("fetch-restaurants", {
        body: { destinationId, destinationName, country, lat, lng },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants", variables.destinationId] });
      queryClient.invalidateQueries({ queryKey: ["restaurants", "admin", variables.destinationId] });
    },
  });
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Restaurant>;
    }) => {
      const { data, error } = await supabase
        .from("restaurants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants", data.destination_id] });
      queryClient.invalidateQueries({ queryKey: ["restaurants", "admin", data.destination_id] });
    },
  });
};

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, destinationId }: { id: string; destinationId: string }) => {
      const { error } = await supabase.from("restaurants").delete().eq("id", id);
      if (error) throw error;
      return { id, destinationId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants", data.destinationId] });
      queryClient.invalidateQueries({ queryKey: ["restaurants", "admin", data.destinationId] });
    },
  });
};

export const useUpdateRestaurantOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      restaurantIds,
      destinationId,
    }: {
      restaurantIds: string[];
      destinationId: string;
    }) => {
      // Update sort_order for each restaurant
      const updates = restaurantIds.map((id, index) =>
        supabase
          .from("restaurants")
          .update({ sort_order: index })
          .eq("id", id)
      );

      await Promise.all(updates);
      return { destinationId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants", data.destinationId] });
      queryClient.invalidateQueries({ queryKey: ["restaurants", "admin", data.destinationId] });
    },
  });
};
