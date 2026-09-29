import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.lahoreestatehub.com";
  const staticRoutes = ["", "/properties", "/communities", "/agents", "/about", "/blog", "/contact"];
  return staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
