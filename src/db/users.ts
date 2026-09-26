import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(
  uid: string,
  name: string,
  email?: string,
  location?: string
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        name,
        email: email || null,
        location: location || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          name,
          email: email || null,
          location: location || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Database query failed in getUsers:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
