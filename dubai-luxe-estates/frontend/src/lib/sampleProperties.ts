import { Property, PaginatedResponse } from "@/types";

type ListingSeed = Pick<
  Property,
  "title" | "price" | "purpose" | "propertyType" | "bedrooms" | "bathrooms" | "area" | "community"
> & { image: string };

const listingSeeds: ListingSeed[] = [
  { title: "Contemporary Family Villa", price: 52000000, purpose: "Buy", propertyType: "Villa", bedrooms: 5, bathrooms: 5, area: 4200, community: "DHA Lahore", image: "/images/img1.jpg" },
  { title: "Lake City Garden Residence", price: 185000, purpose: "Rent", propertyType: "House", bedrooms: 4, bathrooms: 4, area: 3100, community: "Lake City", image: "/images/img2.jpg" },
  { title: "Bahria Town Modern House", price: 31500000, purpose: "Buy", propertyType: "House", bedrooms: 4, bathrooms: 4, area: 2800, community: "Bahria Town Lahore", image: "/images/img3.jpg" },
  { title: "Gulberg Skyline Apartment", price: 145000, purpose: "Rent", propertyType: "Apartment", bedrooms: 3, bathrooms: 3, area: 1850, community: "Gulberg", image: "/images/img4.jpg" },
  { title: "Johar Town Executive Home", price: 26500000, purpose: "Buy", propertyType: "House", bedrooms: 4, bathrooms: 3, area: 3000, community: "Johar Town", image: "/images/img5.jpg" },
  { title: "Model Town Residence", price: 125000, purpose: "Rent", propertyType: "Apartment", bedrooms: 2, bathrooms: 2, area: 1450, community: "Model Town", image: "/images/img6.jpg" },
  { title: "Lahore Cantt Corner Plot", price: 13800000, purpose: "Buy", propertyType: "Plot", bedrooms: 0, bathrooms: 0, area: 5000, community: "Lahore Cantt", image: "/images/img7.jpg" },
  { title: "Valencia Contemporary Villa", price: 210000, purpose: "Rent", propertyType: "Villa", bedrooms: 4, bathrooms: 4, area: 3400, community: "Valencia Town", image: "/images/img8.jpg" },
  { title: "Township Business Office", price: 9200000, purpose: "Buy", propertyType: "Office", bedrooms: 0, bathrooms: 2, area: 1600, community: "Township", image: "/images/img9.jpg" },
  { title: "Gulberg Boulevard Retail Space", price: 95000, purpose: "Rent", propertyType: "Shop", bedrooms: 0, bathrooms: 1, area: 900, community: "Gulberg", image: "/images/img10.jpg" },
  { title: "Bahria Town Premium Apartment", price: 12800000, purpose: "Buy", propertyType: "Apartment", bedrooms: 2, bathrooms: 2, area: 1700, community: "Bahria Town Lahore", image: "/images/img11.jpg" },
  { title: "DHA Lahore Commercial Unit", price: 110000, purpose: "Rent", propertyType: "Commercial", bedrooms: 0, bathrooms: 2, area: 2200, community: "DHA Lahore", image: "/images/img12.jpg" },
];

export const sampleProperties: Property[] = listingSeeds.map((listing, index) => {
  const slug = listing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const imageNumber = (index % listingSeeds.length) + 1;

  return {
    ...listing,
    _id: `0000000000000000000000${String(index + 1).padStart(2, "0")}`,
    slug,
    description: `A thoughtfully presented ${listing.propertyType.toLowerCase()} in ${listing.community}, Lahore. Enjoy a convenient location close to schools, shopping, and the city's main routes.`,
    currency: "PKR",
    location: `${listing.community}, Lahore, Pakistan`,
    amenities: ["Covered Parking", "24/7 Security", "Nearby Schools", "Shopping Nearby"],
    images: [listing.image, `/images/img${imageNumber + 12}.jpg`],
    featured: index < 6,
    status: "Available",
  };
});

export function getSampleProperties(
  params: Record<string, string | undefined> = {}
): PaginatedResponse<Property> {
  let properties = [...sampleProperties];
  const includes = (value: string, filter?: string) => !filter || value.toLowerCase().includes(filter.toLowerCase());

  properties = properties.filter((property) => {
    const searchMatches = includes(
      `${property.title} ${property.description} ${property.community} ${property.location}`,
      params.search
    );
    const locationMatches = includes(`${property.community} ${property.location}`, params.location);
    const price = property.price;
    const area = property.area;

    return searchMatches && locationMatches &&
      includes(property.purpose, params.purpose) &&
      includes(property.propertyType, params.propertyType) &&
      includes(property.community, params.community) &&
      (!params.bedrooms || property.bedrooms >= Number(params.bedrooms)) &&
      (!params.minPrice || price >= Number(params.minPrice)) &&
      (!params.maxPrice || price <= Number(params.maxPrice)) &&
      (!params.minArea || area >= Number(params.minArea)) &&
      (!params.maxArea || area <= Number(params.maxArea));
  });

  if (params.sort === "price_asc") properties.sort((a, b) => a.price - b.price);
  if (params.sort === "price_desc") properties.sort((a, b) => b.price - a.price);
  if (params.sort === "area_desc") properties.sort((a, b) => b.area - a.area);

  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 9, 1), 24);
  const total = properties.length;

  return {
    success: true,
    count: Math.min(limit, Math.max(total - (page - 1) * limit, 0)),
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    data: properties.slice((page - 1) * limit, page * limit),
  };
}