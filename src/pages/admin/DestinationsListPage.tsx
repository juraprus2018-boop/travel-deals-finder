import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Destination = Tables<"destinations">;

const DestinationsListPage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDestinations = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Fout bij laden", { description: error.message });
    } else {
      setDestinations(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleTogglePublish = async (destination: Destination) => {
    const { error } = await supabase
      .from("destinations")
      .update({ is_published: !destination.is_published })
      .eq("id", destination.id);

    if (error) {
      toast.error("Fout bij updaten", { description: error.message });
    } else {
      toast.success(
        destination.is_published ? "Bestemming verborgen" : "Bestemming gepubliceerd"
      );
      fetchDestinations();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("destinations").delete().eq("id", id);

    if (error) {
      toast.error("Fout bij verwijderen", { description: error.message });
    } else {
      toast.success("Bestemming verwijderd");
      fetchDestinations();
    }
  };

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryLabels: Record<string, string> = {
    stedentrips: "Stedentrip",
    strandvakanties: "Strandvakantie",
    wintersport: "Wintersport",
    vakantieparken: "Vakantiepark",
    pretparken: "Pretpark",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Bestemmingen</h1>
          <p className="text-muted-foreground">
            Beheer alle bestemmingen op de website
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/destinations/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Nieuwe Bestemming
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Zoek bestemming..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>Geen bestemmingen gevonden</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/destinations/new">Voeg er een toe</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Land</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDestinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell className="font-medium">{destination.name}</TableCell>
                  <TableCell>{destination.country}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {categoryLabels[destination.category] || destination.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={destination.is_published ? "default" : "outline"}>
                      {destination.is_published ? "Gepubliceerd" : "Concept"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(destination)}
                        title={destination.is_published ? "Verbergen" : "Publiceren"}
                      >
                        {destination.is_published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link 
                          to={`/admin/destinations/${destination.id}/content`}
                          title="AI Content"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/destinations/${destination.id}`} title="Bewerken">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Verwijderen">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bestemming verwijderen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je "{destination.name}" wilt verwijderen? 
                              Dit kan niet ongedaan worden gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(destination.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Verwijderen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DestinationsListPage;
