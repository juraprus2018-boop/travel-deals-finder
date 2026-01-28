import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cityName, countryName, countryCode, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    const systemPrompt = `Je bent een ervaren Nederlandse reisexpert die gedetailleerde informatie genereert over Europese reisbestemmingen.
Je antwoorden zijn altijd in het Nederlands en bevatten accurate, bruikbare informatie.

BELANGRIJK: Antwoord ALLEEN met valid JSON, geen extra tekst of uitleg.`;

    const userPrompt = `Genereer volledige informatie voor ${cityName} in ${countryName} als ${categoryLabels[category] || "bestemming"}.

Geef JSON terug met EXACT deze structuur:
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit bereikt. Probeer het over een minuut opnieuw." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Krediet op. Voeg credits toe aan je Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content;

    if (!contentText) {
      throw new Error("No content received from AI");
    }

    // Parse the JSON from the AI response
    let generatedData;
    try {
      // Remove markdown code blocks if present
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
