import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartnerizeWidgetProps {
  destinationName: string;
  airportCode: string;
  country: string;
}

const PartnerizeWidget = ({ destinationName, airportCode, country }: PartnerizeWidgetProps) => {
  // Partnerize/KLM affiliate link structure
  // Using camref for tracking and destination parameters
  const partnerizeBaseUrl = "https://prf.hn/click/camref:1100lLGJ";
  
  // Build KLM search URL with destination
  const getKLMSearchUrl = () => {
    const klmParams = new URLSearchParams({
      destination: airportCode || destinationName,
    });
    return `${partnerizeBaseUrl}/destination:klm.nl/search?${klmParams.toString()}`;
  };

  // Direct link to KLM destination page
  const getKLMDestinationUrl = () => {
    return `${partnerizeBaseUrl}/destination:klm.nl`;
  };

  return (
    <div className="space-y-6">
      {/* KLM Primary CTA */}
      <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00A1E4] text-white font-bold text-lg">
            KLM
          </div>
          <div>
            <h3 className="font-heading font-semibold">Vlieg met KLM</h3>
            <p className="text-sm text-muted-foreground">
              Officiële partner voor vluchten naar {destinationName}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Boek je vlucht naar {destinationName} bij KLM Royal Dutch Airlines. 
          Profiteer van uitstekende service, ruime bagageruimte en handige 
          vluchttijden vanaf Schiphol.
        </p>

        <div className="space-y-3">
          <a
            href={getKLMSearchUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button size="lg" className="w-full gap-2 bg-[#00A1E4] hover:bg-[#0091d4]">
              ✈️ Zoek vluchten naar {airportCode || destinationName}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          
          <a
            href={getKLMDestinationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full gap-2">
              Bekijk alle KLM bestemmingen
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-xl border bg-card p-4">
        <h4 className="font-medium mb-3">Waarom KLM?</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-[#00A1E4]">✓</span>
            Directe vluchten vanaf Amsterdam Schiphol
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A1E4]">✓</span>
            Gratis maaltijd en drankjes aan boord
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A1E4]">✓</span>
            23 kg ruimbagage inbegrepen
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A1E4]">✓</span>
            Flying Blue miles sparen
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00A1E4]">✓</span>
            Flexibel omboeken mogelijk
          </li>
        </ul>
      </div>

      {/* Alternative Airlines */}
      <div className="rounded-xl border bg-secondary/30 p-4">
        <h4 className="font-medium mb-2">Ook populair naar {destinationName}</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Vergelijk prijzen van andere luchtvaartmaatschappijen:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">Transavia</span>
          <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">easyJet</span>
          <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">Ryanair</span>
          <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">Vueling</span>
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <p className="text-xs text-muted-foreground text-center">
        * GoEuropa ontvangt een kleine commissie bij boekingen via bovenstaande links. 
        Dit heeft geen invloed op de prijs die je betaalt.
      </p>
    </div>
  );
};

export default PartnerizeWidget;
