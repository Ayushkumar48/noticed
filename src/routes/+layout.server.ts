export async function load({ locals }) {
  if (locals.session && locals.user) {
    return {
      user: locals.user,
    };
  }
}
