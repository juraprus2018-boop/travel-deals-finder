import { Destination } from "./types";

export const destinations: Destination[] = [
  // Stedentrips
  {
    id: "rome",
    name: "Rome",
    slug: "rome",
    country: "Italië",
    countryCode: "IT",
    category: "stedentrips",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80",
    shortDescription: "De Eeuwige Stad vol geschiedenis, kunst en heerlijk eten. Van het Colosseum tot de Vaticaanse Musea.",
    highlights: ["Colosseum", "Vaticaan", "Trevi Fontein", "Pantheon", "Spaanse Trappen"],
    bestTimeToVisit: "April - Juni, September - Oktober",
    averageTemperature: "15-25°C",
    currency: "Euro (€)",
    language: "Italiaans",
    nearestAirport: "Rome Fiumicino (FCO)",
  },
  {
    id: "parijs",
    name: "Parijs",
    slug: "parijs",
    country: "Frankrijk",
    countryCode: "FR",
    category: "stedentrips",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
    shortDescription: "De Stad van de Liefde. Cultuur, mode, gastronomie en de iconische Eiffeltoren.",
    highlights: ["Eiffeltoren", "Louvre", "Champs-Élysées", "Notre-Dame", "Montmartre"],
    bestTimeToVisit: "April - Juni, September - November",
    averageTemperature: "10-20°C",
    currency: "Euro (€)",
    language: "Frans",
    nearestAirport: "Paris Charles de Gaulle (CDG)",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    slug: "barcelona",
    country: "Spanje",
    countryCode: "ES",
    category: "stedentrips",
    coordinates: { lat: 41.3851, lng: 2.1734 },
    heroImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&q=80",
    shortDescription: "Gaudí's architectuur, strand en Catalaanse cultuur in één bruisende stad.",
    highlights: ["Sagrada Familia", "Park Güell", "La Rambla", "Barceloneta Beach", "Gothic Quarter"],
    bestTimeToVisit: "Mei - Juni, September - Oktober",
    averageTemperature: "15-28°C",
    currency: "Euro (€)",
    language: "Spaans, Catalaans",
    nearestAirport: "Barcelona El Prat (BCN)",
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    slug: "amsterdam",
    country: "Nederland",
    countryCode: "NL",
    category: "stedentrips",
    coordinates: { lat: 52.3676, lng: 4.9041 },
    heroImage: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1920&q=80",
    shortDescription: "Grachten, musea en gezelligheid. De hoofdstad van Nederland heeft het allemaal.",
    highlights: ["Anne Frank Huis", "Van Gogh Museum", "Rijksmuseum", "Vondelpark", "Jordaan"],
    bestTimeToVisit: "April - Mei, September - Oktober",
    averageTemperature: "8-20°C",
    currency: "Euro (€)",
    language: "Nederlands",
    nearestAirport: "Amsterdam Schiphol (AMS)",
  },
  {
    id: "praag",
    name: "Praag",
    slug: "praag",
    country: "Tsjechië",
    countryCode: "CZ",
    category: "stedentrips",
    coordinates: { lat: 50.0755, lng: 14.4378 },
    heroImage: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1920&q=80",
    shortDescription: "De Gouden Stad met prachtige architectuur, goedkoop bier en een magische sfeer.",
    highlights: ["Karelsbrug", "Oude Stadsplein", "Praagse Burcht", "Astronomische Klok", "Petřín Heuvel"],
    bestTimeToVisit: "Mei - Juni, September - Oktober",
    averageTemperature: "5-22°C",
    currency: "Tsjechische Kroon (CZK)",
    language: "Tsjechisch",
    nearestAirport: "Václav Havel Airport Prague (PRG)",
  },

  // Strandvakanties
  {
    id: "mallorca",
    name: "Mallorca",
    slug: "mallorca",
    country: "Spanje",
    countryCode: "ES",
    category: "strandvakanties",
    coordinates: { lat: 39.6953, lng: 3.0176 },
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
    shortDescription: "Het populairste Spaanse eiland met prachtige stranden, bergen en gezellige dorpjes.",
    highlights: ["Palma de Mallorca", "Serra de Tramuntana", "Cala d'Or", "Valldemossa", "Drach Grotten"],
    bestTimeToVisit: "Mei - Oktober",
    averageTemperature: "20-30°C",
    currency: "Euro (€)",
    language: "Spaans, Catalaans",
    nearestAirport: "Palma de Mallorca (PMI)",
  },
  {
    id: "algarve",
    name: "Algarve",
    slug: "algarve",
    country: "Portugal",
    countryCode: "PT",
    category: "strandvakanties",
    coordinates: { lat: 37.0179, lng: -7.9304 },
    heroImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=80",
    shortDescription: "Spectaculaire rotskusten, verborgen baaien en meer dan 300 dagen zon per jaar.",
    highlights: ["Benagil Grot", "Lagos", "Albufeira", "Faro", "Cape Saint Vincent"],
    bestTimeToVisit: "Mei - Oktober",
    averageTemperature: "18-28°C",
    currency: "Euro (€)",
    language: "Portugees",
    nearestAirport: "Faro Airport (FAO)",
  },
  {
    id: "costa-brava",
    name: "Costa Brava",
    slug: "costa-brava",
    country: "Spanje",
    countryCode: "ES",
    category: "strandvakanties",
    coordinates: { lat: 41.8540, lng: 3.1207 },
    heroImage: "https://images.unsplash.com/photo-1562094802-de66a3dab2ac?w=1920&q=80",
    shortDescription: "Wilde kust met kristalhelder water, pittoreske vissersdorpjes en Dalí's erfgoed.",
    highlights: ["Tossa de Mar", "Lloret de Mar", "Cadaqués", "Dalí Museum Figueres", "Cap de Creus"],
    bestTimeToVisit: "Juni - September",
    averageTemperature: "20-28°C",
    currency: "Euro (€)",
    language: "Spaans, Catalaans",
    nearestAirport: "Girona-Costa Brava (GRO)",
  },
  {
    id: "santorini",
    name: "Santorini",
    slug: "santorini",
    country: "Griekenland",
    countryCode: "GR",
    category: "strandvakanties",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    heroImage: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&q=80",
    shortDescription: "Iconische witte huisjes, blauwe koepels en spectaculaire zonsondergangen boven de caldera.",
    highlights: ["Oia", "Fira", "Red Beach", "Akrotiri", "Wijnproeverijen"],
    bestTimeToVisit: "April - Oktober",
    averageTemperature: "18-30°C",
    currency: "Euro (€)",
    language: "Grieks",
    nearestAirport: "Santorini Airport (JTR)",
  },
  {
    id: "dubrovnik",
    name: "Dubrovnik",
    slug: "dubrovnik",
    country: "Kroatië",
    countryCode: "HR",
    category: "strandvakanties",
    coordinates: { lat: 42.6507, lng: 18.0944 },
    heroImage: "https://images.unsplash.com/photo-1555990538-1e6c89d57a85?w=1920&q=80",
    shortDescription: "De 'Parel van de Adriatische Zee' met middeleeuwse stadsmuren en kristalhelder water.",
    highlights: ["Stadsmuren", "Oude Stad", "Lokrum Eiland", "Srd Berg", "Game of Thrones Tour"],
    bestTimeToVisit: "Mei - Juni, September - Oktober",
    averageTemperature: "15-28°C",
    currency: "Euro (€)",
    language: "Kroatisch",
    nearestAirport: "Dubrovnik Airport (DBV)",
  },
];

export const getDestinationBySlug = (slug: string): Destination | undefined => {
  return destinations.find((dest) => dest.slug === slug);
};

export const getDestinationsByCategory = (category: string): Destination[] => {
  return destinations.filter((dest) => dest.category === category);
};

export const getPopularDestinations = (limit: number = 6): Destination[] => {
  return destinations.slice(0, limit);
};

export const searchDestinations = (query: string): Destination[] => {
  const lowerQuery = query.toLowerCase();
  return destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.country.toLowerCase().includes(lowerQuery) ||
      dest.shortDescription.toLowerCase().includes(lowerQuery)
  );
};
