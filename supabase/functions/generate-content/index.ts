import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

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
              generationConfig: { temperature: 0.7 },
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, pageType } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    if (!destination || !pageType) {
      throw new Error("Missing destination or pageType");
    }

    let prompt = `Je bent een ervaren Nederlandse reisschrijver die SEO-geoptimaliseerde content schrijft voor een affiliate reissite. 
Je schrijft altijd in het Nederlands, op een inspirerende maar informatieve toon. 
Je content moet origineel, SEO-vriendelijk en praktisch bruikbaar zijn.

`;

    switch (pageType) {
      case "main":
        prompt += `Genereer content voor de hoofdpagina van ${destination.name} in ${destination.country}.

Geef JSON terug met (alleen JSON, geen andere tekst):
{
  "title": "Pakkende titel voor de pagina (max 60 tekens)",
  "metaDescription": "SEO meta description (max 155 tekens)",
  "introText": "Korte intro van 2-3 zinnen over de bestemming",
  "mainContent": "Uitgebreid artikel van 300-400 woorden over de bestemming",
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
}`;
        break;

      case "hotels":
        prompt += `Genereer content voor de hotels pagina van ${destination.name}.

Geef JSON terug met (alleen JSON, geen andere tekst):
{
  "title": "Hotels in ${destination.name} | Beste Overnachtingen",
  "metaDescription": "SEO meta description over hotels (max 155 tekens)",
  "introText": "Korte intro over overnachten in ${destination.name}",
  "mainContent": "Uitgebreid artikel van 250-350 woorden over accommodaties",
  "tips": ["Boektip 1", "Boektip 2", "Boektip 3"]
}`;
        break;

      case "bezienswaardigheden":
        prompt += `Genereer content voor de bezienswaardigheden pagina van ${destination.name}.

Geef JSON terug met (alleen JSON, geen andere tekst):
{
  "title": "Top Bezienswaardigheden ${destination.name} | Must-sees",
  "metaDescription": "SEO meta description over bezienswaardigheden (max 155 tekens)",
  "introText": "Korte intro over wat er te doen is in ${destination.name}",
  "mainContent": "Uitgebreid artikel van 400-500 woorden met Top 10 bezienswaardigheden",
  "tips": ["Bezoek tip 1", "Bezoek tip 2", "Bezoek tip 3", "Bezoek tip 4", "Bezoek tip 5"]
}`;
        break;

      case "vliegtickets":
        prompt += `Genereer content voor de vliegtickets pagina van ${destination.name}.
Dichtstbijzijnde luchthaven: ${destination.nearestAirport || "onbekend"}.

Geef JSON terug met (alleen JSON, geen andere tekst):
{
  "title": "Vliegtickets naar ${destination.name} | Goedkope Vluchten",
  "metaDescription": "SEO meta description over vluchten (max 155 tekens)",
  "introText": "Korte intro over vliegen naar ${destination.name}",
  "mainContent": "Uitgebreid artikel van 250-350 woorden over vluchten en tips",
  "tips": ["Vlucht tip 1", "Vlucht tip 2", "Vlucht tip 3"]
}`;
        break;

      case "restaurants":
        prompt += `Genereer content voor de restaurants pagina van ${destination.name} in ${destination.country}.

Geef JSON terug met (alleen JSON, geen andere tekst):
{
  "title": "Restaurants in ${destination.name} | Beste Eetgelegenheden",
  "metaDescription": "SEO meta description over restaurants en culinaire highlights (max 155 tekens)",
  "introText": "Korte intro over eten en drinken in ${destination.name}",
  "mainContent": "Uitgebreid artikel van 300-400 woorden over de lokale keuken, typische gerechten, beste wijken om te eten en culinaire tips",
  "tips": ["Restaurant tip 1", "Restaurant tip 2", "Restaurant tip 3", "Culinaire tip 4", "Lokale specialiteit tip 5"]
}`;
        break;

      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }

    const contentText = await callGoogleAI(GOOGLE_AI_API_KEY, prompt);

    let generatedContent;
    try {
      const cleanedText = contentText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      generatedContent = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", contentText);
      throw new Error("Invalid AI response format");
    }

    return new Response(JSON.stringify(generatedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate content error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
