import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.session || !locals.user) {
    redirect(
      307,
      "/login?message=Please login to access your notes.&type=info",
    );
  }
}
