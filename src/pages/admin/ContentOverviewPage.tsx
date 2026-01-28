import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Destination = Tables<"destinations">;
type GeneratedContent = Tables<"generated_content">;

interface DestinationContentStatus {
  destination: Destination;
  contentTypes: {
    main: boolean;
    hotels: boolean;
    bezienswaardigheden: boolean;
    vliegtickets: boolean;
  };
  totalGenerated: number;
}

const ContentOverviewPage = () => {
  const [destinations, setDestinations] = useState<DestinationContentStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContentStatus = async () => {
      try {
        const [destResult, contentResult] = await Promise.all([
          supabase.from("destinations").select("*").order("name"),
          supabase.from("generated_content").select("destination_id, page_type"),
        ]);

        const destinationsData = destResult.data || [];
        const contentData = contentResult.data || [];

        // Map content to destinations
        const statusList: DestinationContentStatus[] = destinationsData.map((dest) => {
          const destContent = contentData.filter((c) => c.destination_id === dest.id);
          const contentTypes = {
            main: destContent.some((c) => c.page_type === "main"),
            hotels: destContent.some((c) => c.page_type === "hotels"),
            bezienswaardigheden: destContent.some((c) => c.page_type === "bezienswaardigheden"),
            vliegtickets: destContent.some((c) => c.page_type === "vliegtickets"),
          };

          return {
            destination: dest,
            contentTypes,
            totalGenerated: Object.values(contentTypes).filter(Boolean).length,
          };
        });

        setDestinations(statusList);
      } catch (error) {
        console.error("Error fetching content status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentStatus();
  }, []);

  const totalWithAllContent = destinations.filter((d) => d.totalGenerated === 4).length;
  const totalWithSomeContent = destinations.filter((d) => d.totalGenerated > 0 && d.totalGenerated < 4).length;
  const totalWithoutContent = destinations.filter((d) => d.totalGenerated === 0).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Content Overzicht</h1>
          <p className="text-muted-foreground">
            Beheer AI-gegenereerde content voor alle bestemmingen
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Volledig gegenereerd
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-travel-forest" />
              <span className="text-2xl font-bold">{totalWithAllContent}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gedeeltelijk gegenereerd
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{totalWithSomeContent}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Geen content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalWithoutContent}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destination List */}
      <Card>
        <CardHeader>
          <CardTitle>Content Status per Bestemming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {destinations.map((item) => (
              <div
                key={item.destination.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
                    {item.destination.country_code ? (
                      <img
                        src={`https://flagcdn.com/24x18/${item.destination.country_code.toLowerCase()}.png`}
                        alt={item.destination.country}
                        className="rounded"
                      />
                    ) : (
                      "🌍"
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.destination.name}</p>
                    <p className="text-sm text-muted-foreground">{item.destination.country}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={item.contentTypes.main ? "default" : "outline"}
                    className={item.contentTypes.main ? "bg-travel-forest" : ""}
                  >
                    Hoofd
                  </Badge>
                  <Badge
                    variant={item.contentTypes.hotels ? "default" : "outline"}
                    className={item.contentTypes.hotels ? "bg-travel-forest" : ""}
                  >
                    Hotels
                  </Badge>
                  <Badge
                    variant={item.contentTypes.bezienswaardigheden ? "default" : "outline"}
                    className={item.contentTypes.bezienswaardigheden ? "bg-travel-forest" : ""}
                  >
                    Beziensw.
                  </Badge>
                  <Badge
                    variant={item.contentTypes.vliegtickets ? "default" : "outline"}
                    className={item.contentTypes.vliegtickets ? "bg-travel-forest" : ""}
                  >
                    Vluchten
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/admin/destinations/${item.destination.id}/content`}>
                      <Sparkles className="mr-1 h-4 w-4" />
                      {item.totalGenerated === 0 ? "Genereren" : "Bewerken"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {destinations.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                Geen bestemmingen gevonden. Voeg eerst een bestemming toe.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentOverviewPage;
