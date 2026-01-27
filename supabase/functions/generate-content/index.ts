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
    const { destination, pageType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!destination || !pageType) {
      throw new Error("Missing destination or pageType");
    }

    const systemPrompt = `Je bent een ervaren Nederlandse reisschrijver die SEO-geoptimaliseerde content schrijft voor een affiliate reissite. 
Je schrijft altijd in het Nederlands, op een inspirerende maar informatieve toon. 
Je content moet:
- Origineel en uniek zijn
- SEO-vriendelijk met relevante zoekwoorden
- Praktisch bruikbaar voor reizigers
- Betrouwbaar en accuraat

Antwoord ALTIJD in valid JSON formaat.`;

    let userPrompt = "";

    switch (pageType) {
      case "main":
        userPrompt = `Genereer content voor de hoofdpagina van ${destination.name} in ${destination.country}.

Geef JSON terug met:
{
  "title": "Pakkende titel voor de pagina (max 60 tekens)",
  "metaDescription": "SEO meta description (max 155 tekens)",
  "introText": "Korte intro van 2-3 zinnen over de bestemming",
  "mainContent": "Uitgebreid artikel van 300-400 woorden over de bestemming, inclusief cultuur, bezienswaardigheden en tips",
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
}

Belangrijk: ${destination.name} is een ${destination.category === 'stedentrips' ? 'stad' : destination.category === 'strandvakanties' ? 'strand bestemming' : 'bestemming'}.`;
        break;

      case "hotels":
        userPrompt = `Genereer content voor de hotels pagina van ${destination.name} in ${destination.country}.

Geef JSON terug met:
{
  "title": "Hotels in ${destination.name} | Beste Overnachtingen (max 60 tekens)",
  "metaDescription": "SEO meta description over hotels (max 155 tekens)",
  "introText": "Korte intro over overnachten in ${destination.name}",
  "mainContent": "Uitgebreid artikel van 250-350 woorden over de beste wijken om te overnachten, soorten accommodaties, en tips voor het boeken",
  "tips": ["Boektip 1", "Boektip 2", "Boektip 3"]
}`;
        break;

      case "bezienswaardigheden":
        userPrompt = `Genereer content voor de bezienswaardigheden pagina van ${destination.name} in ${destination.country}.

Geef JSON terug met:
{
  "title": "Top Bezienswaardigheden ${destination.name} | Must-sees (max 60 tekens)",
  "metaDescription": "SEO meta description over bezienswaardigheden (max 155 tekens)",
  "introText": "Korte intro over wat er te doen is in ${destination.name}",
  "mainContent": "Uitgebreid artikel van 400-500 woorden met een Top 10 van bezienswaardigheden. Beschrijf elke bezienswaardigheid kort met praktische info.",
  "tips": ["Bezoek tip 1", "Bezoek tip 2", "Bezoek tip 3", "Bezoek tip 4", "Bezoek tip 5"]
}`;
        break;

      case "vliegtickets":
        userPrompt = `Genereer content voor de vliegtickets pagina van ${destination.name} in ${destination.country}.
De dichtstbijzijnde luchthaven is: ${destination.nearestAirport || "onbekend"}.

Geef JSON terug met:
{
  "title": "Vliegtickets naar ${destination.name} | Goedkope Vluchten (max 60 tekens)",
  "metaDescription": "SEO meta description over vluchten (max 155 tekens)",
  "introText": "Korte intro over vliegen naar ${destination.name}",
  "mainContent": "Uitgebreid artikel van 250-350 woorden over de luchthaven(s), luchtvaartmaatschappijen die er vliegen, beste tijd om te boeken, en tips voor goedkope tickets",
  "tips": ["Vlucht tip 1", "Vlucht tip 2", "Vlucht tip 3"]
}`;
        break;

      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }

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
        temperature: 0.7,
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
    let generatedContent;
    try {
      // Remove markdown code blocks if present
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
