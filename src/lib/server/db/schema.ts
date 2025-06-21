import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const authProviderType = pgEnum("auth_provider_type", [
  "google",
  "github",
]);

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  authProviderId: text("auth_provider_id").notNull().unique(),
  authProviderType: authProviderType().default("google"),
  email: text("email").unique(),
  name: text("name").notNull(),
  picture: text("picture"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

// {
//   login: 'Ayushkumar48',
//   id: 94519836,
//   node_id: 'U_kgDOBaJCHA',
//   avatar_url: 'https://avatars.githubusercontent.com/u/94519836?v=4',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/Ayushkumar48',
//   html_url: 'https://github.com/Ayushkumar48',
//   followers_url: 'https://api.github.com/users/Ayushkumar48/followers',
//   following_url: 'https://api.github.com/users/Ayushkumar48/following{/other_user}',
//   gists_url: 'https://api.github.com/users/Ayushkumar48/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/Ayushkumar48/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/Ayushkumar48/subscriptions',
//   organizations_url: 'https://api.github.com/users/Ayushkumar48/orgs',
//   repos_url: 'https://api.github.com/users/Ayushkumar48/repos',
//   events_url: 'https://api.github.com/users/Ayushkumar48/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/Ayushkumar48/received_events',
//   type: 'User',
//   user_view_type: 'public',
//   site_admin: false,
//   name: 'Ayush Kumar',
//   company: null,
//   blog: 'https://ayushkumar48.vercel.app/',
//   location: 'India',
//   email: null,
//   hireable: null,
//   bio: 'Developer, Student, Learner, plays Badminton and online games',
//   twitter_username: null,
//   notification_email: null,
//   public_repos: 35,
//   public_gists: 0,
//   followers: 1,
//   following: 6,
//   created_at: '2021-11-17T07:36:42Z',
//   updated_at: '2025-06-11T10:02:09Z'
// }
