import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as auth from "./schemas/auth";
import * as system from "./schemas/system";
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, {
  schema: {
    ...auth,
    ...system,
  }
});
