import coffeeImage from "@/assets/business-coffee.jpg";
import restaurantImage from "@/assets/business-restaurant.jpg";
import boutiqueImage from "@/assets/business-boutique.jpg";
import salonImage from "@/assets/business-salon.jpg";

/** Placeholder imagery when business_profiles has no image_url column yet. */
export function imageForCategory(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("coffee") || c.includes("tea")) return coffeeImage;
  if (c.includes("restaurant") || c.includes("food")) return restaurantImage;
  if (c.includes("fashion") || c.includes("retail") || c.includes("boutique")) return boutiqueImage;
  if (c.includes("beauty") || c.includes("salon") || c.includes("wellness")) return salonImage;
  return coffeeImage;
}
