import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

const CategorySection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
            Welke vakantie past bij jou?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Kies je type vakantie en ontdek de mooiste bestemmingen. Of je nu houdt van 
            cultuur, zon of avontuur - wij hebben de perfecte plek voor jou.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div 
                className="aspect-[4/3] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.heroImage})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="mb-2 text-4xl">{category.icon}</div>
                <h3 className="mb-2 font-heading text-2xl font-bold text-white">
                  {category.namePlural}
                </h3>
                <p className="mb-4 text-sm text-white/80 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <span>Bekijk bestemmingen</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
