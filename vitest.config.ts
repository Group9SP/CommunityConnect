/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Separate vitest config — keeps vite.config.ts clean and avoids the plugin
 * type conflict between vitest's bundled vite and the project's vite version.
 */
export default defineConfig({
    test: {
        environment: "node",
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        // Stub all image/asset imports so Node doesn't choke on them
        moduleNameMapper: {
            "\\.(jpg|jpeg|png|svg|gif|webp)$": path.resolve(
                __dirname,
                "./src/tests/__mocks__/fileMock.ts"
            ),
        },
        include: ["src/tests/**/*.test.ts"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
