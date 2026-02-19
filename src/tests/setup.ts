/**
 * vitest setup — runs before each test file.
 * Mocks .jpg/.png/.svg imports so the hook's STATIC_BUSINESSES
 * can be imported in a Node environment without errors.
 */
import { vi } from "vitest";

// Stub any import ending in image/media extension as an empty string
vi.mock("@/assets/business-coffee.jpg", () => ({ default: "coffee.jpg" }));
vi.mock("@/assets/business-restaurant.jpg", () => ({ default: "restaurant.jpg" }));
vi.mock("@/assets/business-boutique.jpg", () => ({ default: "boutique.jpg" }));
vi.mock("@/assets/business-salon.jpg", () => ({ default: "salon.jpg" }));
