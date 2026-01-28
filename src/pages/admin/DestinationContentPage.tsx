import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Check, Loader2, RefreshCw, Eye, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import ContentEditor from "@/components/admin/ContentEditor";

type Destination = Tables<"destinations">;
type GeneratedContent = Tables<"generated_content">;
type PageType = "main" | "hotels" | "bezienswaardigheden" | "vliegtickets";

const pageTypes: { id: PageType; label: string; icon: string; description: string }[] = [
  { id: "main", label: "Hoofdpagina", icon: "📄", description: "Algemene informatie over de bestemming" },
  { id: "hotels", label: "Hotels", icon: "🏨", description: "Overnachtingen en accommodaties" },
  { id: "bezienswaardigheden", label: "Bezienswaardigheden", icon: "🎯", description: "Top attracties en activiteiten" },
  { id: "vliegtickets", label: "Vliegtickets", icon: "✈️", description: "Vluchten en luchtvaartinfo" },
];

const DestinationContentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingType, setGeneratingType] = useState<PageType | null>(null);
  const [editingType, setEditingType] = useState<PageType | null>(null);

  const fetchData = async () => {
    if (!id) return;

    setIsLoading(true);
    
    const [destResult, contentResult] = await Promise.all([
      supabase.from("destinations").select("*").eq("id", id).single(),
      supabase.from("generated_content").select("*").eq("destination_id", id),
    ]);

    if (destResult.error) {
      toast.error("Bestemming niet gevonden");
      navigate("/admin/destinations");
      return;
    }

    setDestination(destResult.data);
    setContent(contentResult.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const generateContent = async (pageType: PageType) => {
    if (!destination) return;

    setGeneratingType(pageType);

    try {
      const response = await supabase.functions.invoke("generate-content", {
        body: {
          destination: {
            name: destination.name,
            country: destination.country,
            category: destination.category,
            nearestAirport: destination.nearest_airport,
          },
          pageType,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const generated = response.data;

      // Check if content already exists
      const existingContent = content.find((c) => c.page_type === pageType);

      const contentData: TablesInsert<"generated_content"> = {
        destination_id: destination.id,
        page_type: pageType,
        title: generated.title,
        meta_description: generated.metaDescription,
        intro_text: generated.introText,
        main_content: generated.mainContent,
        tips: generated.tips || [],
      };

      let result;
      if (existingContent) {
        result = await supabase
          .from("generated_content")
          .update(contentData)
          .eq("id", existingContent.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("generated_content")
          .insert(contentData)
          .select()
          .single();
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success(`${pageType} content gegenereerd!`);
      fetchData();
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("Fout bij genereren", {
        description: error instanceof Error ? error.message : "Onbekende fout",
      });
    } finally {
      setGeneratingType(null);
    }
  };

  const generateAllContent = async () => {
    for (const pageType of pageTypes) {
      await generateContent(pageType.id);
    }
  };

  const getContentForType = (pageType: PageType) => {
    return content.find((c) => c.page_type === pageType);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!destination) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-bold">{destination.name}</h1>
          <p className="text-muted-foreground">
            AI Content Generator - {destination.country}
          </p>
        </div>
        <Button onClick={generateAllContent} disabled={generatingType !== null} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Genereer Alle Content
        </Button>
      </div>

      {/* Status Overview */}
      <div className="flex flex-wrap gap-2">
        {pageTypes.map((pt) => {
          const hasContent = !!getContentForType(pt.id);
          return (
            <Badge key={pt.id} variant={hasContent ? "default" : "outline"} className="gap-1">
              {pt.icon} {pt.label}
              {hasContent && <Check className="h-3 w-3" />}
            </Badge>
          );
        })}
      </div>

      {/* Content Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {pageTypes.map((pt) => {
          const pageContent = getContentForType(pt.id);
          const isGenerating = generatingType === pt.id;
          const isEditing = editingType === pt.id;

          return (
            <Card key={pt.id} className={isEditing ? "md:col-span-2" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span>{pt.icon}</span>
                    {pt.label}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {pageContent && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="mr-1 h-3 w-3" />
                        Gegenereerd
                      </Badge>
                    )}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingType(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {pt.description}
                  {pageContent && (
                    <> • Laatst bijgewerkt: {new Date(pageContent.updated_at).toLocaleDateString("nl-NL")}</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && pageContent ? (
                  <ContentEditor
                    content={pageContent}
                    onSaved={() => {
                      setEditingType(null);
                      fetchData();
                    }}
                  />
                ) : pageContent ? (
                  <>
                    <div>
                      <p className="text-sm font-medium">Titel</p>
                      <p className="text-sm text-muted-foreground">{pageContent.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Meta Description</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pageContent.meta_description}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Intro</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {pageContent.intro_text}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setEditingType(pt.id)}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Bewerken
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateContent(pt.id)}
                        disabled={isGenerating}
                        className="gap-1"
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                        Opnieuw genereren
                      </Button>
                      {destination.is_published && (
                        <Button variant="ghost" size="sm" asChild className="gap-1">
                          <Link 
                            to={`/${destination.category}/${destination.slug}${pt.id === 'main' ? '' : '/' + pt.id}`}
                            target="_blank"
                          >
                            <Eye className="h-3 w-3" />
                            Bekijken
                          </Link>
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Nog geen content gegenereerd
                    </p>
                    <Button
                      onClick={() => generateContent(pt.id)}
                      disabled={isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Genereren...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Genereer Content
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info about AI credits */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Tip:</strong> Het genereren van content vereist AI credits. 
            Als je een "402" fout ziet, voeg dan credits toe aan je Lovable workspace.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DestinationContentPage;
