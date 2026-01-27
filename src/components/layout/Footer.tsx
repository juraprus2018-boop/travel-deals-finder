import { Link } from "react-router-dom";
import { Plane, Mail, Phone } from "lucide-react";
import { categories } from "@/data/categories";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane className="h-5 w-5" />
              </div>
              <span className="font-heading text-xl font-bold">
                Go<span className="text-primary">Europa</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Jouw gids voor de mooiste bestemmingen in Europa. Vind inspiratie, 
              boek je reis en maak onvergetelijke herinneringen.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-heading font-semibold">Vakantie Types</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/${category.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category.icon} {category.namePlural}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Populaire Bestemmingen */}
          <div>
            <h3 className="mb-4 font-heading font-semibold">Populair</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/stedentrips/rome" className="text-sm text-muted-foreground hover:text-primary">
                  Stedentrip Rome
                </Link>
              </li>
              <li>
                <Link to="/stedentrips/parijs" className="text-sm text-muted-foreground hover:text-primary">
                  Stedentrip Parijs
                </Link>
              </li>
              <li>
                <Link to="/strandvakanties/mallorca" className="text-sm text-muted-foreground hover:text-primary">
                  Strandvakantie Mallorca
                </Link>
              </li>
              <li>
                <Link to="/strandvakanties/santorini" className="text-sm text-muted-foreground hover:text-primary">
                  Strandvakantie Santorini
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-heading font-semibold">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@goeuropa.nl"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  info@goeuropa.nl
                </a>
              </li>
              <li>
                <a
                  href="tel:+31201234567"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  020 - 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>© 2025 GoEuropa.nl - Alle rechten voorbehouden.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary">Privacybeleid</Link>
              <Link to="/voorwaarden" className="hover:text-primary">Voorwaarden</Link>
              <Link to="/cookies" className="hover:text-primary">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
