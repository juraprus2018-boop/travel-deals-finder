import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { europeanCountries, getCitiesByCountry, getCountryCode } from "@/data/europeanDestinations";
import type { TablesInsert } from "@/integrations/supabase/types";

type CategoryType = "stedentrips" | "strandvakanties" | "wintersport" | "vakantieparken" | "pretparken";

const NewDestinationPage = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "">("");
  const [generatedPreview, setGeneratedPreview] = useState<any>(null);

  const cities = selectedCountry ? getCitiesByCountry(selectedCountry) : [];

  const categories = [
    { value: "stedentrips", label: "🏛️ Stedentrip", description: "Culturele steden" },
    { value: "strandvakanties", label: "🏖️ Strandvakantie", description: "Zon, zee en strand" },
    { value: "wintersport", label: "⛷️ Wintersport", description: "Skiën en snowboarden" },
    { value: "vakantieparken", label: "🏕️ Vakantiepark", description: "Ontspannen in de natuur" },
    { value: "pretparken", label: "🎢 Pretpark", description: "Attracties en entertainment" },
  ];

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity("");
    setGeneratedPreview(null);
  };

  const handleGenerate = async () => {
    if (!selectedCountry || !selectedCity || !selectedCategory) {
      toast.error("Selecteer een land, stad en categorie");
      return;
    }

    setIsGenerating(true);
    setGeneratedPreview(null);

    try {
      const countryCode = getCountryCode(selectedCountry);

      const response = await supabase.functions.invoke("generate-destination", {
        body: {
          cityName: selectedCity,
          countryName: selectedCountry,
          countryCode,
          category: selectedCategory,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const generated = response.data;
      setGeneratedPreview(generated);
      toast.success("Bestemming gegenereerd! Review de gegevens en sla op.");
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("Fout bij genereren", {
        description: error instanceof Error ? error.message : "Onbekende fout",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedPreview) return;

    setIsGenerating(true);

    try {
      const destination: TablesInsert<"destinations"> = {
        name: generatedPreview.name,
        slug: generatedPreview.slug,
        country: generatedPreview.country,
        country_code: generatedPreview.countryCode,
        category: selectedCategory as CategoryType,
        lat: parseFloat(generatedPreview.lat),
        lng: parseFloat(generatedPreview.lng),
        short_description: generatedPreview.shortDescription,
        highlights: generatedPreview.highlights,
        best_time_to_visit: generatedPreview.bestTimeToVisit,
        average_temperature: generatedPreview.averageTemperature,
        currency: generatedPreview.currency,
        language: generatedPreview.language,
        nearest_airport: generatedPreview.nearestAirport,
        is_published: false,
      };

      const { data, error } = await supabase
        .from("destinations")
        .insert(destination)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.error("Deze bestemming bestaat al", {
            description: "Kies een andere stad of bewerk de bestaande bestemming",
          });
        } else {
          throw error;
        }
        return;
      }

      toast.success("Bestemming opgeslagen!");
      navigate(`/admin/destinations/${data.id}/content`);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Fout bij opslaan", {
        description: error instanceof Error ? error.message : "Onbekende fout",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-heading text-3xl font-bold">Nieuwe Bestemming</h1>
          <p className="text-muted-foreground">
            Genereer automatisch een nieuwe bestemming met AI
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Selecteer Bestemming
            </CardTitle>
            <CardDescription>
              Kies een land en stad, en laat AI de rest genereren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Categorie *</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as CategoryType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer type vakantie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span>{cat.label}</span>
                        <span className="text-xs text-muted-foreground">
                          - {cat.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Land *</Label>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een land" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {europeanCountries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stad/Plaats *</Label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                disabled={!selectedCountry}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedCountry
                        ? "Selecteer een stad"
                        : "Selecteer eerst een land"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={
                !selectedCountry || !selectedCity || !selectedCategory || isGenerating
              }
              className="w-full gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Genereren...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Genereer met AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className={generatedPreview ? "" : "opacity-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              {generatedPreview
                ? "Review de gegenereerde gegevens"
                : "Genereer eerst een bestemming"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedPreview ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{generatedPreview.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {generatedPreview.country} ({generatedPreview.countryCode})
                  </p>
                </div>

                <p className="text-sm">{generatedPreview.shortDescription}</p>

                <div>
                  <p className="text-sm font-medium mb-2">Hoogtepunten</p>
                  <div className="flex flex-wrap gap-1">
                    {generatedPreview.highlights?.map((h: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {h}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Beste tijd:</span>
                    <p>{generatedPreview.bestTimeToVisit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Temperatuur:</span>
                    <p>{generatedPreview.averageTemperature}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taal:</span>
                    <p>{generatedPreview.language}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valuta:</span>
                    <p>{generatedPreview.currency}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Luchthaven:</span>
                  <p>{generatedPreview.nearestAirport}</p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Coördinaten: {generatedPreview.lat}, {generatedPreview.lng}
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isGenerating}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Opslaan & Content Genereren
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                Selecteer een land en stad om te beginnen
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewDestinationPage;
