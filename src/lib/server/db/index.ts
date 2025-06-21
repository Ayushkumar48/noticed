import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { Google, GitHub } from "arctic";
import {
  DATABASE_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "$env/static/private";

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const dbClient = postgres(DATABASE_URL);

export const db = drizzle(dbClient, { schema });

export const googleAuth = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5173/login/google/callback",
);
export const githubAuth = new GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  "http://localhost:5173/login/github/callback",
);
