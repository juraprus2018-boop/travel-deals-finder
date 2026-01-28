import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Star,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  useAdminRestaurantsByDestination,
  useFetchRestaurantsFromGoogle,
  useUpdateRestaurant,
  useDeleteRestaurant,
  useUpdateRestaurantOrder,
} from "@/hooks/useRestaurants";
import type { Tables } from "@/integrations/supabase/types";

type Destination = Tables<"destinations">;

const RestaurantsManagePage = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoadingDestination, setIsLoadingDestination] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const { data: restaurants = [], isLoading: isLoadingRestaurants } =
    useAdminRestaurantsByDestination(id);
  const fetchFromGoogle = useFetchRestaurantsFromGoogle();
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurant = useDeleteRestaurant();
  const updateOrder = useUpdateRestaurantOrder();

  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Fout bij laden bestemming");
      } else {
        setDestination(data);
      }
      setIsLoadingDestination(false);
    };
    fetchDestination();
  }, [id]);

  const handleFetchFromGoogle = async () => {
    if (!destination) return;

    try {
      await fetchFromGoogle.mutateAsync({
        destinationId: destination.id,
        destinationName: destination.name,
        country: destination.country,
        lat: Number(destination.lat),
        lng: Number(destination.lng),
      });
      toast.success("Restaurants opgehaald van Google Places");
    } catch (error) {
      toast.error("Fout bij ophalen", {
        description: error instanceof Error ? error.message : "Onbekende fout",
      });
    }
  };

  const handleToggleVisibility = async (restaurantId: string, isVisible: boolean) => {
    try {
      await updateRestaurant.mutateAsync({
        id: restaurantId,
        updates: { is_visible: !isVisible },
      });
      toast.success(isVisible ? "Restaurant verborgen" : "Restaurant zichtbaar");
    } catch (error) {
      toast.error("Fout bij updaten");
    }
  };

  const handleDelete = async (restaurantId: string) => {
    if (!id) return;
    try {
      await deleteRestaurant.mutateAsync({ id: restaurantId, destinationId: id });
      toast.success("Restaurant verwijderd");
    } catch (error) {
      toast.error("Fout bij verwijderen");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...restaurants];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);

    // Update local state immediately for visual feedback
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null || !id) return;

    try {
      await updateOrder.mutateAsync({
        restaurantIds: restaurants.map((r) => r.id),
        destinationId: id,
      });
      toast.success("Volgorde opgeslagen");
    } catch (error) {
      toast.error("Fout bij opslaan volgorde");
    }
    setDraggedIndex(null);
  };

  const getPriceLabel = (level: number | null) => {
    if (!level) return "–";
    return "€".repeat(level);
  };

  if (isLoadingDestination) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Bestemming niet gevonden</p>
        <Button asChild variant="link">
          <Link to="/admin/destinations">Terug naar bestemmingen</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/admin/destinations" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Link>
          </Button>
          <h1 className="font-heading text-3xl font-bold">
            Restaurants in {destination.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {destination.country} • {restaurants.length} restaurants
          </p>
        </div>
        <Button
          onClick={handleFetchFromGoogle}
          disabled={fetchFromGoogle.isPending}
          className="gap-2"
        >
          {fetchFromGoogle.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {restaurants.length > 0 ? "Opnieuw ophalen" : "Ophalen van Google"}
        </Button>
      </div>

      {/* Info box */}
      <div className="rounded-lg border bg-secondary/30 p-4">
        <p className="text-sm text-muted-foreground">
          Sleep restaurants om de volgorde aan te passen. Verberg restaurants om ze
          niet te tonen op de website. De data wordt opgehaald via Google Places API.
        </p>
      </div>

      {/* Restaurants List */}
      <div className="rounded-lg border bg-card">
        {isLoadingRestaurants ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-4 text-muted-foreground">
            <p>Nog geen restaurants voor deze bestemming</p>
            <Button onClick={handleFetchFromGoogle} disabled={fetchFromGoogle.isPending}>
              {fetchFromGoogle.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Ophalen van Google Places
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-4 p-4 transition-colors ${
                  draggedIndex === index ? "bg-secondary/50" : "hover:bg-secondary/20"
                } ${!restaurant.is_visible ? "opacity-50" : ""}`}
              >
                {/* Drag handle */}
                <div className="cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Number */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                  {index + 1}
                </div>

                {/* Photo */}
                {restaurant.photo_url && (
                  <div className="hidden h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:block">
                    <img
                      src={restaurant.photo_url}
                      alt={restaurant.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{restaurant.name}</h3>
                    {!restaurant.is_visible && (
                      <Badge variant="outline" className="text-xs">
                        Verborgen
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {restaurant.address}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {restaurant.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {restaurant.rating} ({restaurant.user_ratings_total})
                      </span>
                    )}
                    {restaurant.price_level && (
                      <span>{getPriceLabel(restaurant.price_level)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {restaurant.google_maps_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={restaurant.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Bekijk op Google Maps"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleToggleVisibility(restaurant.id, restaurant.is_visible ?? true)
                    }
                    title={restaurant.is_visible ? "Verbergen" : "Tonen"}
                  >
                    {restaurant.is_visible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Verwijderen">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Restaurant verwijderen?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Weet je zeker dat je "{restaurant.name}" wilt verwijderen?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(restaurant.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Verwijderen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsManagePage;
