import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  url?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    weekday_text?: string[];
    open_now?: boolean;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  types?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error("GOOGLE_PLACES_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { destinationId, destinationName, country, lat, lng } = await req.json();

    if (!destinationId || !destinationName || !lat || !lng) {
      throw new Error("Missing required fields: destinationId, destinationName, lat, lng");
    }

    console.log(`Fetching restaurants for ${destinationName}, ${country} at ${lat}, ${lng}`);

    // Step 1: Search for restaurants nearby
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=restaurant&keyword=restaurant&language=nl&key=${GOOGLE_PLACES_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", searchData);
      throw new Error(`Google Places API error: ${searchData.status}`);
    }

    const places = searchData.results?.slice(0, 10) || [];
    console.log(`Found ${places.length} restaurants`);

    const restaurants = [];

    // Step 2: Get detailed info for each place
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      
      // Get place details
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=place_id,name,formatted_address,formatted_phone_number,website,url,rating,user_ratings_total,price_level,opening_hours,photos,types&language=nl&key=${GOOGLE_PLACES_API_KEY}`;
      
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
      
      if (detailsData.status !== "OK") {
        console.warn(`Could not get details for ${place.name}: ${detailsData.status}`);
        continue;
      }

      const details: PlaceResult = detailsData.result;
      
      // Get photo URL if available
      let photoUrl = null;
      if (details.photos && details.photos.length > 0) {
        const photoRef = details.photos[0].photo_reference;
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`;
      }

      // Extract cuisine types from place types
      const cuisineTypes = (details.types || [])
        .filter(t => !["restaurant", "food", "point_of_interest", "establishment"].includes(t))
        .map(t => t.replace(/_/g, " "));

      restaurants.push({
        destination_id: destinationId,
        google_place_id: details.place_id,
        name: details.name,
        address: details.formatted_address,
        phone: details.formatted_phone_number,
        website: details.website,
        google_maps_url: details.url,
        photo_url: photoUrl,
        rating: details.rating,
        user_ratings_total: details.user_ratings_total,
        price_level: details.price_level,
        opening_hours: details.opening_hours?.weekday_text || [],
        is_open_now: details.opening_hours?.open_now,
        cuisine_types: cuisineTypes,
        sort_order: i,
        is_visible: true,
      });
    }

    // Step 3: Insert or update restaurants in database
    if (restaurants.length > 0) {
      // Delete existing restaurants for this destination first
      await supabase
        .from("restaurants")
        .delete()
        .eq("destination_id", destinationId);

      // Insert new restaurants
      const { error: insertError } = await supabase
        .from("restaurants")
        .insert(restaurants);

      if (insertError) {
        console.error("Error inserting restaurants:", insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: restaurants.length,
        restaurants,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetch-restaurants:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
