import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LinePass",
    short_name: "LinePass",
    description: "A daily guest pass for participating venues.",
    start_url: "/pass/home",
    scope: "/",
    display: "standalone",
    background_color: "#0e263e",
    theme_color: "#0e263e"
  };
}
