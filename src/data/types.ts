export type CategoryType = 
  | "stedentrips" 
  | "strandvakanties" 
  | "wintersport" 
  | "vakantieparken" 
  | "pretparken";

export interface Category {
  id: CategoryType;
  name: string;
  namePlural: string;
  description: string;
  icon: string;
  slug: string;
  heroImage: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryCode: string;
  category: CategoryType;
  coordinates: {
    lat: number;
    lng: number;
  };
  heroImage: string;
  shortDescription: string;
  highlights: string[];
  bestTimeToVisit: string;
  averageTemperature: string;
  currency: string;
  language: string;
  nearestAirport: string;
}

export interface DestinationContent {
  destinationId: string;
  pageType: "main" | "hotels" | "bezienswaardigheden" | "vliegtickets";
  title: string;
  metaDescription: string;
  introText: string;
  mainContent: string;
  tips: string[];
  generatedAt: string;
}

export interface SubPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const SUB_PAGES: SubPage[] = [
  {
    id: "hotels",
    slug: "hotels",
    title: "Hotels",
    description: "Vind de beste hotels en accommodaties",
    icon: "🏨",
  },
  {
    id: "bezienswaardigheden",
    slug: "bezienswaardigheden",
    title: "Bezienswaardigheden",
    description: "Top 10 dingen om te doen en zien",
    icon: "🎯",
  },
  {
    id: "vliegtickets",
    slug: "vliegtickets",
    title: "Vliegtickets",
    description: "Goedkope vluchten vinden",
    icon: "✈️",
  },
];
