import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Globe, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCountryContent, useUpsertCountryContent } from "@/hooks/useCountryContent";
import { useCountriesWithDestinations } from "@/hooks/useCountriesWithDestinations";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const CountryContentEditPage = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const navigate = useNavigate();
  
  const { data: existingContent, isLoading: contentLoading } = useCountryContent(countrySlug || "");
  const { data: countries = [] } = useCountriesWithDestinations();
  const upsertContent = useUpsertCountryContent();

  const countryInfo = countries.find((c) => c.slug === countrySlug);

  const [formData, setFormData] = useState({
    hero_image: "",
    meta_title: "",
    meta_description: "",
    intro_text: "",
    seo_content: "",
    highlights: [] as string[],
  });

  const [highlightsText, setHighlightsText] = useState("");

  // Load existing content
  useEffect(() => {
    if (existingContent) {
      setFormData({
        hero_image: existingContent.hero_image || "",
        meta_title: existingContent.meta_title || "",
        meta_description: existingContent.meta_description || "",
        intro_text: existingContent.intro_text || "",
        seo_content: existingContent.seo_content || "",
        highlights: existingContent.highlights || [],
      });
      setHighlightsText((existingContent.highlights || []).join("\n"));
    }
  }, [existingContent]);

  const handleSave = async () => {
    if (!countrySlug || !countryInfo) {
      toast.error("Land niet gevonden");
      return;
    }

    try {
      const highlights = highlightsText
        .split("\n")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      await upsertContent.mutateAsync({
        country_slug: countrySlug,
        country_name: countryInfo.country,
        hero_image: formData.hero_image || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        intro_text: formData.intro_text || null,
        seo_content: formData.seo_content || null,
        highlights,
      });

      toast.success("Content opgeslagen!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Fout bij opslaan");
    }
  };

  if (contentLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!countryInfo) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            Land niet gevonden of heeft nog geen bestemmingen.
          </p>
          <Link to="/admin/landen">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/landen">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{countryInfo.country}</h1>
              <p className="text-muted-foreground">
                {countryInfo.destination_count} bestemmingen
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/land/${countrySlug}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Bekijk pagina
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={upsertContent.isPending}>
              {upsertContent.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Opslaan
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column - Main content */}
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Hero Afbeelding</h2>
              <ImageUpload
                currentImageUrl={formData.hero_image}
                onImageUploaded={(url) => setFormData({ ...formData, hero_image: url })}
                destinationSlug={`country-${countrySlug}`}
              />
            </div>

            {/* SEO Settings */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">SEO Instellingen</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Titel</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder={`Vakantie ${countryInfo.country} - Beste bestemmingen`}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formData.meta_title.length}/60 karakters
                  </p>
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Beschrijving</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder={`Ontdek de mooiste bestemmingen in ${countryInfo.country}. Tips voor stedentrips, stranden en meer.`}
                    rows={3}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formData.meta_description.length}/160 karakters
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Content */}
          <div className="space-y-6">
            {/* Intro Text */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Introductie Tekst</h2>
              <Textarea
                value={formData.intro_text}
                onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
                placeholder={`${countryInfo.country} is een prachtig land met veel te ontdekken...`}
                rows={4}
              />
            </div>

            {/* Highlights */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Highlights</h2>
              <Textarea
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                placeholder="Voer highlights in, één per regel:
Prachtige stranden
Historische steden
Heerlijke keuken"
                rows={5}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Eén highlight per regel
              </p>
            </div>

            {/* SEO Content */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">SEO Content</h2>
              <Textarea
                value={formData.seo_content}
                onChange={(e) => setFormData({ ...formData, seo_content: e.target.value })}
                placeholder="Uitgebreide SEO tekst over dit land (ondersteunt Markdown)"
                rows={10}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Markdown wordt ondersteund voor opmaak
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CountryContentEditPage;
