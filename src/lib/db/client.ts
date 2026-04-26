import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __dc_pg_client: ReturnType<typeof postgres> | undefined;
}

const url = process.env.DATABASE_URL;

const client =
  globalThis.__dc_pg_client ??
  (url ? postgres(url, { max: 10, prepare: false }) : null);

if (process.env.NODE_ENV !== "production" && client) {
  globalThis.__dc_pg_client = client;
}

export const db = client ? drizzle(client, { schema }) : null;
export type DB = NonNullable<typeof db>;
export { schema };
