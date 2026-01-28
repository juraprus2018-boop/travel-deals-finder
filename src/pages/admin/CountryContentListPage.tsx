import { Link } from "react-router-dom";
import { Globe, Plus, Edit, Trash2, Loader2, Image } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useAllCountryContent, useDeleteCountryContent } from "@/hooks/useCountryContent";
import { useCountriesWithDestinations } from "@/hooks/useCountriesWithDestinations";
import { toast } from "sonner";
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

const CountryContentListPage = () => {
  const { data: countryContent = [], isLoading: contentLoading } = useAllCountryContent();
  const { data: countriesWithDestinations = [], isLoading: countriesLoading } = useCountriesWithDestinations();
  const deleteContent = useDeleteCountryContent();

  const isLoading = contentLoading || countriesLoading;

  // Countries that have destinations but no content yet
  const countriesWithoutContent = countriesWithDestinations.filter(
    (c) => !countryContent.find((cc) => cc.country_slug === c.slug)
  );

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteContent.mutateAsync(id);
      toast.success(`Content voor ${name} verwijderd`);
    } catch (error) {
      toast.error("Fout bij verwijderen");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Landen Content</h1>
            <p className="text-muted-foreground">
              Beheer SEO content en afbeeldingen per land
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Countries without content */}
            {countriesWithoutContent.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
                  Landen zonder content ({countriesWithoutContent.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {countriesWithoutContent.map((country) => (
                    <div
                      key={country.slug}
                      className="flex items-center justify-between rounded-lg border border-dashed bg-secondary/20 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{country.country}</p>
                          <p className="text-sm text-muted-foreground">
                            {country.destination_count} bestemmingen
                          </p>
                        </div>
                      </div>
                      <Link to={`/admin/landen/${country.slug}`}>
                        <Button size="sm" variant="outline">
                          <Plus className="mr-1 h-4 w-4" />
                          Content
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Countries with content */}
            {countryContent.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Landen met content ({countryContent.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {countryContent.map((content) => (
                    <div
                      key={content.id}
                      className="group overflow-hidden rounded-lg border bg-card"
                    >
                      {/* Image preview */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                        {content.hero_image ? (
                          <img
                            src={content.hero_image}
                            alt={content.country_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Image className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Content info */}
                      <div className="p-4">
                        <h3 className="font-semibold">{content.country_name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {content.meta_description || "Geen meta beschrijving"}
                        </p>

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                          <Link to={`/admin/landen/${content.country_slug}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full">
                              <Edit className="mr-1 h-4 w-4" />
                              Bewerken
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Content verwijderen?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je de content voor {content.country_name} wilt verwijderen?
                                  Dit kan niet ongedaan worden gemaakt.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(content.id, content.country_name)}
                                >
                                  Verwijderen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {countryContent.length === 0 && countriesWithoutContent.length === 0 && (
              <div className="rounded-lg border border-dashed bg-secondary/20 p-12 text-center">
                <Globe className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Voeg eerst bestemmingen toe om landenpagina's te kunnen beheren.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CountryContentListPage;
