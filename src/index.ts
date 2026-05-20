import { Elysia } from 'elysia';
import { usersRoutes } from './routes/users';

const app = new Elysia()
  .get('/', () => 'Hello from ElysiaJS!')
  .use(usersRoutes)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
