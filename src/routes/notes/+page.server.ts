import { db } from "$lib/server/db/index.js";
import { note } from "$lib/server/db/schema.js";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function load({ locals }) {
  if (!locals.session || !locals.user) {
    redirect(
      307,
      "/login?message=Please login to access your notes.&type=info",
    );
  }
  const allNotes = await db
    .select()
    .from(note)
    .where(eq(note.userId, locals.user.id));
  return { notes: allNotes };
}

export const actions = {
  delete: async ({ request, locals }) => {
    try {
      const data = await request.formData();
      const noteId = data.get("noteId");
      console.log("noteId", noteId);
      if (!noteId || typeof noteId !== "string") {
        return fail(400, { message: "Invalid note ID" });
      }
      await db.delete(note).where(eq(note.id, noteId));
      return { success: true };
    } catch (err) {
      return fail(404, { message: "Error while deleting note" });
    }
  },
};
