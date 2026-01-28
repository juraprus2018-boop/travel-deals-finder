export interface Country {
  name: string;
  slug: string;
  code: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export const COUNTRIES: Country[] = [
  { name: "Albanië", slug: "albanie", code: "AL", coordinates: { lat: 41.15, lng: 20.17 }, zoom: 7 },
  { name: "België", slug: "belgie", code: "BE", coordinates: { lat: 50.50, lng: 4.47 }, zoom: 8 },
  { name: "Denemarken", slug: "denemarken", code: "DK", coordinates: { lat: 56.26, lng: 9.50 }, zoom: 7 },
  { name: "Duitsland", slug: "duitsland", code: "DE", coordinates: { lat: 51.16, lng: 10.45 }, zoom: 6 },
  { name: "Frankrijk", slug: "frankrijk", code: "FR", coordinates: { lat: 46.23, lng: 2.21 }, zoom: 6 },
  { name: "Griekenland", slug: "griekenland", code: "GR", coordinates: { lat: 39.07, lng: 21.82 }, zoom: 6 },
  { name: "Hongarije", slug: "hongarije", code: "HU", coordinates: { lat: 47.16, lng: 19.50 }, zoom: 7 },
  { name: "Ierland", slug: "ierland", code: "IE", coordinates: { lat: 53.14, lng: -8.00 }, zoom: 7 },
  { name: "Italië", slug: "italie", code: "IT", coordinates: { lat: 41.87, lng: 12.57 }, zoom: 6 },
  { name: "Kroatië", slug: "kroatie", code: "HR", coordinates: { lat: 45.10, lng: 15.20 }, zoom: 7 },
  { name: "Nederland", slug: "nederland", code: "NL", coordinates: { lat: 52.13, lng: 5.29 }, zoom: 8 },
  { name: "Oostenrijk", slug: "oostenrijk", code: "AT", coordinates: { lat: 47.52, lng: 14.55 }, zoom: 7 },
  { name: "Polen", slug: "polen", code: "PL", coordinates: { lat: 51.92, lng: 19.15 }, zoom: 6 },
  { name: "Portugal", slug: "portugal", code: "PT", coordinates: { lat: 39.40, lng: -8.22 }, zoom: 7 },
  { name: "Schotland", slug: "schotland", code: "GB", coordinates: { lat: 56.49, lng: -4.20 }, zoom: 7 },
  { name: "Spanje", slug: "spanje", code: "ES", coordinates: { lat: 40.46, lng: -3.75 }, zoom: 6 },
  { name: "Tsjechië", slug: "tsjechie", code: "CZ", coordinates: { lat: 49.82, lng: 15.47 }, zoom: 7 },
  { name: "Verenigd Koninkrijk", slug: "verenigd-koninkrijk", code: "GB", coordinates: { lat: 55.38, lng: -3.44 }, zoom: 6 },
  { name: "Zweden", slug: "zweden", code: "SE", coordinates: { lat: 60.13, lng: 18.64 }, zoom: 5 },
  { name: "Zwitserland", slug: "zwitserland", code: "CH", coordinates: { lat: 46.82, lng: 8.23 }, zoom: 8 },
];

export const getCountryBySlug = (slug: string): Country | undefined => {
  return COUNTRIES.find((c) => c.slug === slug);
};

export const getCountryByName = (name: string): Country | undefined => {
  return COUNTRIES.find((c) => c.name === name);
};

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find((c) => c.code === code);
};
