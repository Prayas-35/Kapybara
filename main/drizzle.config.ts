import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./db/schema.ts",

    dbCredentials: {
        url: "postgresql://postgres:safe@localhost:5432/tasker?connect_timeout=10&sslmode=disable",
    },

    extensionsFilters: ["postgis"],
    schemaFilter: "public",
    tablesFilter: "*",

    introspect: {
        casing: "camel",
    },

    migrations: {
        prefix: "timestamp",
        table: "__drizzle_migrations__",
        schema: "public",
    },

    breakpoints: true,
    strict: true,
    verbose: true,
});
