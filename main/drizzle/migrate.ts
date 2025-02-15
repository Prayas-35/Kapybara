import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
// import "../drizzle/meta"

const migrationClient = postgres(process.env.DATABASE_URL as string, { max: 1 });

async function main() {
    await migrate(drizzle(migrationClient), {
        migrationsFolder: "./drizzle/migrations",
    })

    await migrationClient.end();
}

main();