import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./db/schema.ts",

    driver: "pglite",
    dbCredentials: {
        url: "./database/",
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

    entities: {
        roles: {
            provider: '',
            exclude: [],
            include: []
        }
    },

    breakpoints: true,
    strict: true,
    verbose: true,
});
