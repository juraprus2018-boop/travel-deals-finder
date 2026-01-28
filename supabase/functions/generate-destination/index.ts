import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
          // Wait before retry (exponential backoff)
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Google AI error (${model}):`, response.status, errorText);
          lastError = new Error(`Google AI error: ${response.status}`);
          break; // Try next model
        }

        const data = await response.json();
        const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (contentText) {
          console.log(`Success with model ${model}`);
          return contentText;
        }
        
        lastError = new Error("No content in response");
        break; // Try next model
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        console.error(`Error with ${model}:`, lastError.message);
      }
    }
  }

  throw lastError || new Error("All models failed");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cityName, countryName, countryCode, category } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

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
