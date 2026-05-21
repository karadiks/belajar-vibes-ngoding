import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const registerUser = async (data: any) => {
  // Check if email already exists
  const existingUser = await db.select().from(users).where(eq(users.email, data.email));
  if (existingUser.length > 0) {
    throw new Error('Email sudah terdaftar');
  }

  // Hash password using Bun's built-in hashing
  const hashedPassword = await Bun.password.hash(data.password);

  // Insert to database
  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return { data: 'OK' };
};
