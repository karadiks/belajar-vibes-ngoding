import { Elysia, t } from 'elysia';
import { db } from '../db';
import { users } from '../db/schema';

export const usersRoutes = new Elysia({ prefix: '/users' })
  .get('/', async () => {
    return await db.select().from(users);
  })
  .post('/', async ({ body }) => {
    const { name, email } = body;
    await db.insert(users).values({ name, email });
    return { success: true, message: 'User created' };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    })
  });
