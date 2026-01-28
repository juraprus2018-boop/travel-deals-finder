import { useParams, Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getCategoryBySlug } from "@/data/categories";
import { useDestinationsByCategory } from "@/hooks/useDestinations";
import DestinationCard from "@/components/destination/DestinationCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = getCategoryBySlug(categorySlug || "");
  const { data: destinations = [], isLoading } = useDestinationsByCategory(categorySlug || "");

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Categorie niet gevonden</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">
            Terug naar home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.heroImage})` }}
        >
          <div className="absolute inset-0 bg-foreground/60" />
        </div>

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-white/80 hover:text-white">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{category.namePlural}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-2xl">
            <div className="mb-4 text-5xl">{category.icon}</div>
            <h1 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl">
              {category.namePlural}
            </h1>
            <p className="text-lg text-white/90">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-semibold">
              {isLoading ? "Laden..." : `${destinations.length} ${destinations.length === 1 ? "bestemming" : "bestemmingen"}`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-secondary/50 p-12 text-center">
              <p className="text-lg text-muted-foreground">
                Nog geen bestemmingen in deze categorie.
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
              >
                Bekijk andere categorieën
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
