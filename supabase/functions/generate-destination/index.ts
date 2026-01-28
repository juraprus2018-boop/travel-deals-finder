import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Models to try in order (fallback chain)
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash", 
  "gemini-1.5-flash",
];

async function callGoogleAI(apiKey: string, prompt: string, retries = 3): Promise<string> {
  let lastError: Error | null = null;

  for (const model of MODELS) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`Trying model ${model}, attempt ${attempt + 1}/${retries}`);
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3 },
            }),
          }
        );

        if (response.status === 503 || response.status === 429) {
          const errorText = await response.text();
          console.log(`Model ${model} unavailable (${response.status}): ${errorText}`);
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Google AI error (${model}):`, response.status, errorText);
          lastError = new Error(`Google AI error: ${response.status}`);
          break;
        }

        const data = await response.json();
        const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (contentText) {
          console.log(`Success with model ${model}`);
          return contentText;
        }
        
        lastError = new Error("No content in response");
        break;
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        console.error(`Error with ${model}:`, lastError.message);
      }
    }
  }

  throw lastError || new Error("All models failed");
}

async function generateImage(apiKey: string, cityName: string, countryName: string, category: string): Promise<string | null> {
  try {
    console.log(`Generating image for ${cityName}, ${countryName}`);
    
    const categoryPrompts: Record<string, string> = {
      stedentrips: "beautiful cityscape, historic architecture, urban landscape",
      strandvakanties: "stunning beach, turquoise water, coastal paradise, sunny day",
      wintersport: "snowy mountains, ski resort, winter wonderland, alpine scenery",
      vakantieparken: "nature resort, forest, peaceful countryside, holiday park",
      pretparken: "theme park, amusement park, colorful attractions, fun atmosphere",
    };

    const categoryStyle = categoryPrompts[category] || "beautiful travel destination";
    
    const prompt = `Professional travel photography of ${cityName}, ${countryName}. ${categoryStyle}. High quality, vibrant colors, wide angle landscape shot, golden hour lighting. Ultra high resolution 16:9 aspect ratio travel hero image.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      console.error("Image generation failed:", response.status);
      return null;
    }

    const data = await response.json();
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (imageData && imageData.startsWith("data:image")) {
      console.log("Image generated successfully");
      return imageData;
    }
    
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}

async function uploadImageToStorage(supabase: any, imageData: string, slug: string): Promise<string | null> {
  try {
    // Extract base64 data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Determine file extension from data URL
    const mimeMatch = imageData.match(/^data:image\/(\w+);/);
    const extension = mimeMatch ? mimeMatch[1] : "png";
    
    const fileName = `destinations/${slug}-hero.${extension}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("destination-images")
      .upload(fileName, imageBuffer, {
        contentType: `image/${extension}`,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("destination-images")
      .getPublicUrl(fileName);

    console.log("Image uploaded:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cityName, countryName, countryCode, category } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    if (!cityName || !countryName || !category) {
      throw new Error("Missing required fields: cityName, countryName, or category");
    }

    const categoryLabels: Record<string, string> = {
      stedentrips: "stedentrip",
      strandvakanties: "strandvakantie",
      wintersport: "wintersport bestemming",
      vakantieparken: "vakantiepark regio",
      pretparken: "pretpark bestemming",
    };

    const prompt = `Je bent een ervaren Nederlandse reisexpert die gedetailleerde informatie genereert over Europese reisbestemmingen.
Je antwoorden zijn altijd in het Nederlands en bevatten accurate, bruikbare informatie.

Genereer volledige informatie voor ${cityName} in ${countryName} als ${categoryLabels[category] || "bestemming"}.

Geef JSON terug met EXACT deze structuur (alleen JSON, geen andere tekst):
{
  "name": "${cityName}",
  "country": "${countryName}",
  "countryCode": "${countryCode}",
  "slug": "url-friendly slug van de naam",
  "lat": latitude als nummer (bijv. 41.9028),
  "lng": longitude als nummer (bijv. 12.4964),
  "shortDescription": "Pakkende beschrijving van 2-3 zinnen over waarom je hier naartoe moet",
  "highlights": ["Hoogtepunt 1", "Hoogtepunt 2", "Hoogtepunt 3", "Hoogtepunt 4", "Hoogtepunt 5"],
  "bestTimeToVisit": "Beste periode om te bezoeken (bijv. April - Oktober)",
  "averageTemperature": "Gemiddelde temperatuur range (bijv. 15-28°C)",
  "currency": "Valuta met symbool (bijv. Euro (€))",
  "language": "Hoofdtaal die gesproken wordt",
  "nearestAirport": "Naam van dichtstbijzijnde luchthaven met IATA code (bijv. Rome Fiumicino (FCO))"
}

Zorg dat de coördinaten correct zijn voor ${cityName}, ${countryName}.
De slug moet lowercase zijn met streepjes in plaats van spaties.`;

    const contentText = await callGoogleAI(GOOGLE_AI_API_KEY, prompt);

    // Parse the JSON from the AI response
    let generatedData;
    try {
      const cleanedText = contentText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      generatedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", contentText);
      throw new Error("Invalid AI response format");
    }

    // Validate required fields
    const requiredFields = ["name", "country", "slug", "lat", "lng", "shortDescription", "highlights"];
    for (const field of requiredFields) {
      if (!generatedData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Generate image if we have the API key
    let heroImageUrl = null;
    if (LOVABLE_API_KEY && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Generating hero image...");
      const imageData = await generateImage(LOVABLE_API_KEY, cityName, countryName, category);
      
      if (imageData) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        heroImageUrl = await uploadImageToStorage(supabase, imageData, generatedData.slug);
      }
    } else {
      console.log("Skipping image generation - missing API keys");
    }

    // Add hero image to response
    generatedData.heroImage = heroImageUrl;

    return new Response(JSON.stringify(generatedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate destination error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
