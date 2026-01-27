import { Category } from "./types";

export const categories: Category[] = [
  {
    id: "stedentrips",
    name: "Stedentrip",
    namePlural: "Stedentrips",
    description: "Ontdek de mooiste steden van Europa. Van historische monumenten tot bruisend nachtleven.",
    icon: "🏛️",
    slug: "stedentrips",
    heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=80",
  },
  {
    id: "strandvakanties",
    name: "Strandvakantie",
    namePlural: "Strandvakanties",
    description: "Zon, zee en strand. De mooiste kustbestemmingen voor een ontspannen vakantie.",
    icon: "🏖️",
    slug: "strandvakanties",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  },
  {
    id: "wintersport",
    name: "Wintersport",
    namePlural: "Wintersport",
    description: "Skiën, snowboarden en après-ski in de mooiste berggebieden van Europa.",
    icon: "⛷️",
    slug: "wintersport",
    heroImage: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1920&q=80",
  },
  {
    id: "vakantieparken",
    name: "Vakantiepark",
    namePlural: "Vakantieparken",
    description: "Gezellige vakantieparken met alle voorzieningen voor het hele gezin.",
    icon: "🏕️",
    slug: "vakantieparken",
    heroImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80",
  },
  {
    id: "pretparken",
    name: "Pretpark",
    namePlural: "Pretparken",
    description: "De leukste pretparken en attractieparken voor jong en oud.",
    icon: "🎢",
    slug: "pretparken",
    heroImage: "https://images.unsplash.com/photo-1536768139911-e290a59011e4?w=1920&q=80",
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((cat) => cat.slug === slug);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};
