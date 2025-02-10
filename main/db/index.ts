import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const sql = postgres("./database/");
export const db = drizzle(sql, { schema });
