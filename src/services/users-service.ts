import { db } from '../db';
import { users, sessions } from '../db/schema';
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

export const loginUser = async (data: any) => {
  const existingUsers = await db.select().from(users).where(eq(users.email, data.email));
  if (existingUsers.length === 0) {
    throw new Error('Email atau password salah');
  }

  const user = existingUsers[0];

  const isMatch = await Bun.password.verify(data.password, user.password);
  if (!isMatch) {
    throw new Error('Email atau password salah');
  }

  const token = crypto.randomUUID();

  await db.insert(sessions).values({
    token,
    user_id: user.id
  });

  return { data: token };
};
