import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Public, indexable pages only. Add new public routes here as the full site launches.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
