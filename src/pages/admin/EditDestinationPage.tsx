import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";
import ImageUpload from "@/components/admin/ImageUpload";

type CategoryType = "stedentrips" | "strandvakanties" | "wintersport" | "vakantieparken" | "pretparken";
type Destination = Tables<"destinations">;

const EditDestinationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    country: "",
    countryCode: "",
    category: "" as CategoryType | "",
    lat: "",
    lng: "",
    heroImage: "",
    shortDescription: "",
    highlights: "",
    bestTimeToVisit: "",
    averageTemperature: "",
    currency: "",
    language: "",
    nearestAirport: "",
    isPublished: false,
  });

  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Bestemming niet gevonden");
        navigate("/admin/destinations");
        return;
      }

      setFormData({
        name: data.name,
        slug: data.slug,
        country: data.country,
        countryCode: data.country_code,
        category: data.category,
        lat: data.lat.toString(),
        lng: data.lng.toString(),
        heroImage: data.hero_image || "",
        shortDescription: data.short_description || "",
        highlights: data.highlights?.join(", ") || "",
        bestTimeToVisit: data.best_time_to_visit || "",
        averageTemperature: data.average_temperature || "",
        currency: data.currency || "",
        language: data.language || "",
        nearestAirport: data.nearest_airport || "",
        isPublished: data.is_published,
      });
      setIsLoading(false);
    };

    fetchDestination();
  }, [id, navigate]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.country || !formData.category || !formData.lat || !formData.lng) {
      toast.error("Vul alle verplichte velden in");
      return;
    }

    setIsSubmitting(true);

    const destination: TablesUpdate<"destinations"> = {
      name: formData.name,
      slug: formData.slug,
      country: formData.country,
      country_code: formData.countryCode || formData.country.substring(0, 2).toUpperCase(),
      category: formData.category as CategoryType,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      hero_image: formData.heroImage || null,
      short_description: formData.shortDescription || null,
      highlights: formData.highlights ? formData.highlights.split(",").map((h) => h.trim()) : [],
      best_time_to_visit: formData.bestTimeToVisit || null,
      average_temperature: formData.averageTemperature || null,
      currency: formData.currency || null,
      language: formData.language || null,
      nearest_airport: formData.nearestAirport || null,
      is_published: formData.isPublished,
    };

    const { error } = await supabase
      .from("destinations")
      .update(destination)
      .eq("id", id!);

    if (error) {
      toast.error("Fout bij opslaan", { description: error.message });
    } else {
      toast.success("Bestemming bijgewerkt!");
      navigate("/admin/destinations");
    }

    setIsSubmitting(false);
  };

  const categories = [
    { value: "stedentrips", label: "🏛️ Stedentrip" },
    { value: "strandvakanties", label: "🏖️ Strandvakantie" },
    { value: "wintersport", label: "⛷️ Wintersport" },
    { value: "vakantieparken", label: "🏕️ Vakantiepark" },
    { value: "pretparken", label: "🎢 Pretpark" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-heading text-3xl font-bold">Bestemming Bewerken</h1>
          <p className="text-muted-foreground">
            Pas {formData.name} aan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basisgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                placeholder="bijv. Rome"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                placeholder="rome"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Land *</Label>
                <Input
                  id="country"
                  placeholder="bijv. Italië"
                  value={formData.country}
                  onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryCode">Landcode</Label>
                <Input
                  id="countryCode"
                  placeholder="IT"
                  maxLength={2}
                  value={formData.countryCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, countryCode: e.target.value.toUpperCase() }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as CategoryType }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer categorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Breedtegraad *</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="41.9028"
                  value={formData.lat}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lat: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Lengtegraad *</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  placeholder="12.4964"
                  value={formData.lng}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lng: e.target.value }))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Extra Informatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Afbeelding</Label>
              <ImageUpload
                currentImageUrl={formData.heroImage}
                onImageUploaded={(url) => setFormData((prev) => ({ ...prev, heroImage: url }))}
                destinationSlug={formData.slug || "destination"}
              />
              <p className="text-xs text-muted-foreground">
                Of voer een URL in:
              </p>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.heroImage}
                onChange={(e) => setFormData((prev) => ({ ...prev, heroImage: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Korte Beschrijving</Label>
              <Textarea
                id="shortDescription"
                placeholder="Een korte beschrijving van de bestemming..."
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights">Hoogtepunten (komma gescheiden)</Label>
              <Input
                id="highlights"
                placeholder="Colosseum, Vaticaan, Trevi Fontein"
                value={formData.highlights}
                onChange={(e) => setFormData((prev) => ({ ...prev, highlights: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bestTimeToVisit">Beste Reistijd</Label>
                <Input
                  id="bestTimeToVisit"
                  placeholder="April - Oktober"
                  value={formData.bestTimeToVisit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bestTimeToVisit: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="averageTemperature">Gem. Temperatuur</Label>
                <Input
                  id="averageTemperature"
                  placeholder="15-25°C"
                  value={formData.averageTemperature}
                  onChange={(e) => setFormData((prev) => ({ ...prev, averageTemperature: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Valuta</Label>
                <Input
                  id="currency"
                  placeholder="Euro (€)"
                  value={formData.currency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Taal</Label>
                <Input
                  id="language"
                  placeholder="Italiaans"
                  value={formData.language}
                  onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nearestAirport">Dichtstbijzijnde Luchthaven</Label>
              <Input
                id="nearestAirport"
                placeholder="Rome Fiumicino (FCO)"
                value={formData.nearestAirport}
                onChange={(e) => setFormData((prev) => ({ ...prev, nearestAirport: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Publish & Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Publicatie & Acties</CardTitle>
            <CardDescription>
              Beheer de publicatiestatus en content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="publish">Publiceren</Label>
                <p className="text-sm text-muted-foreground">
                  Maak deze bestemming zichtbaar op de website
                </p>
              </div>
              <Switch
                id="publish"
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isPublished: checked }))
                }
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" className="gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opslaan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Wijzigingen Opslaan
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2"
                asChild
              >
                <Link to={`/admin/destinations/${id}/content`}>
                  <FileText className="h-4 w-4" />
                  Content Beheren
                </Link>
              </Button>

              {formData.isPublished && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="gap-2"
                  asChild
                >
                  <Link
                    to={`/${formData.category}/${formData.slug}`}
                    target="_blank"
                  >
                    <Eye className="h-4 w-4" />
                    Bekijken
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditDestinationPage;
