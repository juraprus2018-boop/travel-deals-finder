import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, FileText, Plus, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalDestinations: number;
  publishedDestinations: number;
  totalContent: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalDestinations: 0,
    publishedDestinations: 0,
    totalContent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [destResult, contentResult] = await Promise.all([
          supabase.from("destinations").select("id, is_published"),
          supabase.from("generated_content").select("id"),
        ]);

        const destinations = destResult.data || [];
        const content = contentResult.data || [];

        setStats({
          totalDestinations: destinations.length,
          publishedDestinations: destinations.filter((d) => d.is_published).length,
          totalContent: content.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Totaal Bestemmingen",
      value: stats.totalDestinations,
      icon: MapPin,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Gepubliceerd",
      value: stats.publishedDestinations,
      icon: Eye,
      color: "text-travel-forest",
      bgColor: "bg-travel-forest/10",
    },
    {
      title: "AI Content Pagina's",
      value: stats.totalContent,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welkom bij het ReizenEuropa Admin Dashboard
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/destinations/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Nieuwe Bestemming
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <p className="text-3xl font-bold">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Bestemmingen Beheren
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Voeg nieuwe bestemmingen toe, bewerk bestaande, of genereer AI content.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/destinations">Bekijk alle</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/admin/destinations/new">Toevoegen</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              AI Content Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Genereer automatisch SEO-geoptimaliseerde content voor je bestemmingen.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/content">Bekijk content</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {stats.totalDestinations === 0 && !isLoading && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>🚀 Aan de slag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Je hebt nog geen bestemmingen toegevoegd. Begin met het toevoegen van 
              je eerste bestemming om de site te vullen met content.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Voeg een nieuwe bestemming toe (bijv. Rome, Parijs)</li>
              <li>Genereer AI content voor de verschillende pagina's</li>
              <li>Publiceer de bestemming om hem zichtbaar te maken</li>
            </ol>
            <Button asChild>
              <Link to="/admin/destinations/new">
                <Plus className="mr-2 h-4 w-4" />
                Eerste bestemming toevoegen
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
